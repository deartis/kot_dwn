(() => {
  const REPO = 'deartis/kot_dwn';
  const LATEST_RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;

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

  function appendInlineMarkdown(parent, text) {
    const tokenRegex = /\*\*(.+?)\*\*|`([^`]+)`|\*([^*]+)\*/g;
    let lastIndex = 0;
    let match;
    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parent.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      if (match[1] !== undefined) {
        const strong = document.createElement('strong');
        strong.textContent = match[1];
        parent.appendChild(strong);
      } else if (match[2] !== undefined) {
        const code = document.createElement('code');
        code.textContent = match[2];
        parent.appendChild(code);
      } else if (match[3] !== undefined) {
        const em = document.createElement('em');
        em.textContent = match[3];
        parent.appendChild(em);
      }
      lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parent.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
  }

  function extractReleaseItems(body) {
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

  function renderReleaseNotes(container, body) {
    if (!container || typeof body !== 'string' || !body.trim()) return;
    const items = extractReleaseItems(body);
    if (items.length === 0) return;

    const ul = document.createElement('ul');
    for (const item of items) {
      const li = document.createElement('li');
      appendInlineMarkdown(li, item);
      ul.appendChild(li);
    }

    container.replaceChildren(ul);
  }

  async function syncLatestRelease() {
    try {
      const response = await fetch(LATEST_RELEASE_API, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) return;

      const release = await response.json();
      const assets = Array.isArray(release.assets) ? release.assets : [];
      const apkAsset = assets.find((asset) =>
        typeof asset.name === 'string' && asset.name.toLowerCase().endsWith('.apk')
      );

      if (!apkAsset || !apkAsset.browser_download_url) return;

      const { full, short } = parseTagLabel(release.tag_name);
      const sizeText = formatMegabytes(apkAsset.size);

      document.querySelectorAll('.js-download-link').forEach((link) => {
        link.href = apkAsset.browser_download_url;
      });

      document.querySelectorAll('.js-version-meta').forEach((el) => {
        el.textContent = sizeText
          ? `${full} • ${sizeText} • APK`
          : `${full} • APK`;
      });

      if (sizeText) {
        document.querySelectorAll('.js-apk-size').forEach((el) => {
          el.textContent = `~${sizeText}`;
        });
      }

      document.querySelectorAll('.js-version-short').forEach((el) => {
        el.textContent = `${short} • Android`;
      });

      const titleEl = document.querySelector('.js-release-title');
      if (titleEl) {
        titleEl.textContent = full;
      }

      const pageLink = document.querySelector('.js-release-page');
      if (pageLink && release.html_url) {
        pageLink.href = release.html_url;
      }

      renderReleaseNotes(document.querySelector('.js-release-notes'), release.body);

      const digestMatch = typeof apkAsset.digest === 'string'
        ? apkAsset.digest.match(/^sha256:([a-f0-9]{64})$/i)
        : null;
      const bodyShaMatch = typeof release.body === 'string'
        ? release.body.match(/\b([a-f0-9]{64})\b/i)
        : null;
      const shaHex = digestMatch?.[1] || bodyShaMatch?.[1];
      const shaEl = document.querySelector('.js-sha256');
      if (shaEl && shaHex) {
        shaEl.textContent = shaHex.toLowerCase();
      }
    } catch {
      // Fallback estático do HTML permanece ativo em caso de offline ou rate limit
    }
  }

  function setupCopySha() {
    const copyBtn = document.querySelector('.js-copy-sha');
    const shaEl = document.querySelector('.js-sha256');
    if (!copyBtn || !shaEl) return;

    copyBtn.addEventListener('click', async () => {
      const text = shaEl.textContent?.trim();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => {
          copyBtn.textContent = original;
        }, 2000);
      } catch {
        // Ignora se clipboard não estiver disponível
      }
    });
  }

  function setupMobileStickyBar() {
    const bar = document.getElementById('mobile-sticky-bar');
    const heroCta = document.getElementById('download');
    if (!bar || !heroCta || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        bar.hidden = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(heroCta);
  }

  setupCopySha();
  setupMobileStickyBar();
  syncLatestRelease();
})();
