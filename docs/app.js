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

  function renderReleaseNotes(container, body) {
    if (!container || !body) return;
    const lines = body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- ') || line.startsWith('* '))
      .slice(0, 6);

    if (lines.length === 0) return;

    const ul = document.createElement('ul');
    for (const rawLine of lines) {
      const li = document.createElement('li');
      const text = rawLine.replace(/^[-*]\s+/, '');
      const boldMatch = text.match(/^\*\*(.+?)\*\*\s*(.*)$/);
      if (boldMatch) {
        const strong = document.createElement('strong');
        strong.textContent = boldMatch[1];
        li.appendChild(strong);
        if (boldMatch[2]) {
          li.appendChild(document.createTextNode(` ${boldMatch[2]}`));
        }
      } else {
        li.textContent = text;
      }
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

      const shaMatch = typeof release.body === 'string'
        ? release.body.match(/[a-f0-9]{64}/i)
        : null;
      const shaEl = document.querySelector('.js-sha256');
      if (shaEl && shaMatch) {
        shaEl.textContent = shaMatch[0].toLowerCase();
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
