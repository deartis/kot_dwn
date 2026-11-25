#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = process.env.GITHUB_REPOSITORY || 'deartis/kot_dwn';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.TOKEN_GITHUB || '';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.resolve(__dirname, '../docs/index.html');

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInlineMarkdownHtml(text) {
  const tokenRegex = /\*\*(.+?)\*\*|`([^`]+)`|\*([^*]+)\*/g;
  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      result += `<strong>${escapeHtml(match[1])}</strong>`;
    } else if (match[2] !== undefined) {
      result += `<code>${escapeHtml(match[2])}</code>`;
    } else if (match[3] !== undefined) {
      result += `<em>${escapeHtml(match[3])}</em>`;
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    result += escapeHtml(text.slice(lastIndex));
  }

  return result;
}

function formatMegabytes(bytes) {
  if (!bytes || Number.isNaN(bytes)) return null;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1).replace('.', ',')} MB`;
}

function parseTagLabel(tag) {
  if (!tag) return { full: 'Última versão', short: 'Beta' };
  const clean = tag.replace(/^v/i, '');
  const buildMatch = clean.match(/^(\d+\.\d+\.\d+)-build(\d+)$/i);
  if (buildMatch) {
    return {
      full: `v${buildMatch[1]} (Build ${buildMatch[2]})`,
      short: `v${buildMatch[1]}`,
    };
  }
  return { full: `v${clean}`, short: `v${clean}` };
}

function extractReleaseItems(body) {
  if (typeof body !== 'string' || !body.trim()) return [];
  const rawLines = body.split('\n').map((line) => line.trim());
  const metadataLine = /^\*\*(Arquivo|Tamanho|SHA-256|Checksum):?\*\*/i;
  const bullets = [];
  let inIntegritySection = false;

  for (const line of rawLines) {
    const headingMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      inIntegritySection = /^integridade/i.test(headingMatch[1].trim());
      continue;
    }
    if (inIntegritySection) continue;
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const clean = line.replace(/^[-*]\s+/, '').trim();
      if (clean && !metadataLine.test(clean)) {
        bullets.push(clean);
      }
    }
  }

  if (bullets.length > 0) {
    return bullets.slice(0, 6);
  }

  const sections = [];
  let currentTitle = null;
  let currentParagraphs = [];
  let skipSection = false;

  const flushSection = () => {
    if (!skipSection && currentParagraphs.length > 0) {
      const text = currentParagraphs.join(' ').trim();
      if (text) {
        sections.push(currentTitle ? `**${currentTitle}:** ${text}` : text);
      }
    }
    currentParagraphs = [];
  };

  for (const line of rawLines) {
    const headingMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      flushSection();
      const heading = headingMatch[1].trim().replace(/:$/, '');
      skipSection = /^integridade/i.test(heading);
      currentTitle = /^novidades\b/i.test(heading) ? null : heading;
      continue;
    }
    if (!line || metadataLine.test(line)) continue;
    currentParagraphs.push(line);
  }
  flushSection();

  return sections.slice(0, 6);
}

async function fetchLatestRelease() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kot-dwn-pages-sync',
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch(API_URL, { headers });
  if (!response.ok) {
    throw new Error(`Falha ao consultar ${API_URL}: HTTP ${response.status}`);
  }
  return response.json();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findUploadedApk(release) {
  const assets = Array.isArray(release?.assets) ? release.assets : [];
  return assets.find(
    (asset) =>
      typeof asset.name === 'string' &&
      asset.name.toLowerCase().endsWith('.apk') &&
      asset.browser_download_url &&
      (!asset.state || asset.state === 'uploaded')
  );
}

async function main() {
  let release = await fetchLatestRelease();
  let apkAsset = findUploadedApk(release);

  // Se a release acabou de ser criada via API e o upload do APK (~120 MB) ainda está em andamento, aguarda até 2,5 min
  for (let attempt = 1; !apkAsset && attempt <= 10; attempt += 1) {
    console.log(
      `Asset .apk ainda não disponível em ${release.tag_name} (tentativa ${attempt}/10). Aguardando 15s...`
    );
    await sleep(15_000);
    release = await fetchLatestRelease();
    apkAsset = findUploadedApk(release);
  }

  if (!apkAsset || !apkAsset.browser_download_url) {
    console.log('Nenhum asset .apk encontrado na release latest; mantendo HTML atual.');
    return;
  }

  const { full, short } = parseTagLabel(release.tag_name);
  const sizeText = formatMegabytes(apkAsset.size);
  const downloadUrl = apkAsset.browser_download_url;

  const digestMatch =
    typeof apkAsset.digest === 'string'
      ? apkAsset.digest.match(/^sha256:([a-f0-9]{64})$/i)
      : null;
  const bodyShaMatch =
    typeof release.body === 'string'
      ? release.body.match(/\b([a-f0-9]{64})\b/i)
      : null;
  const shaHex = (digestMatch?.[1] || bodyShaMatch?.[1] || '').toLowerCase();

  const items = extractReleaseItems(release.body);

  const originalHtml = await fs.readFile(INDEX_PATH, 'utf8');
  let html = originalHtml;

  html = html.replace(
    /((?:class="[^"]*\bjs-download-link\b[^"]*"\s*)href=")[^"]+(")/g,
    `$1${escapeHtml(downloadUrl)}$2`
  );

  const metaLabel = sizeText
    ? `${escapeHtml(full)} &bull; ${escapeHtml(sizeText)} &bull; APK`
    : `${escapeHtml(full)} &bull; APK`;
  html = html.replace(
    /(<span class="[^"]*\bjs-version-meta\b[^"]*">)[\s\S]*?(<\/span>)/g,
    `$1${metaLabel}$2`
  );

  if (sizeText) {
    html = html.replace(
      /(<span class="[^"]*\bjs-apk-size\b[^"]*">)[\s\S]*?(<\/span>)/g,
      `$1~${escapeHtml(sizeText)}$2`
    );
  }

  html = html.replace(
    /(<h3[^>]*\bclass="[^"]*\bjs-release-title\b[^"]*"[^>]*">)[\s\S]*?(<\/h3>)/g,
    `$1${escapeHtml(full)}$2`
  );

  if (items.length > 0) {
    const listHtml = [
      '',
      '            <ul>',
      ...items.map((item) => `              <li>${renderInlineMarkdownHtml(item)}</li>`),
      '            </ul>',
      '          ',
    ].join('\n');
    html = html.replace(
      /(<div class="[^"]*\bjs-release-notes\b[^"]*">)[\s\S]*?(<\/div>)/,
      `$1${listHtml}$2`
    );
  }

  if (shaHex) {
    html = html.replace(
      /(<code class="[^"]*\bjs-sha256\b[^"]*">)[\s\S]*?(<\/code>)/g,
      `$1${escapeHtml(shaHex)}$2`
    );
  }

  if (release.html_url) {
    html = html.replace(
      /((?:class="[^"]*\bjs-release-page\b[^"]*"\s*)href=")[^"]+(")/g,
      `$1${escapeHtml(release.html_url)}$2`
    );
  }

  html = html.replace(
    /(<span class="[^"]*\bjs-version-short\b[^"]*">)[\s\S]*?(<\/span>)/g,
    `$1${escapeHtml(short)} &bull; Android$2`
  );

  if (html === originalHtml) {
    console.log(`docs/index.html já está sincronizado com ${release.tag_name}.`);
    return;
  }

  await fs.writeFile(INDEX_PATH, html, 'utf8');
  console.log(`docs/index.html atualizado para ${release.tag_name} (${full}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
