'use strict';

// Article navigation and theme controls, inspired by the Si₀ reading experience.
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const nav = document.querySelector('.chapter-nav');
  const menu = document.querySelector('.chapter-menu');
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.site-header');
  const links = [...menu.querySelectorAll('a')];
  const sections = links.map(link => document.querySelector(link.hash));
  const currentLabel = menu.querySelector('.contents-current');
  const desktop = window.matchMedia('(min-width: 761px)');

  function updateThemeButton() {
    const dark = root.dataset.theme === 'dark';
    // Separate image elements let CSS hide the light bitmap immediately,
    // even while the dark SVG is still loading or navigation code is delayed.
    document.querySelectorAll('.paper-figure a').forEach(link => {
      const image = link.querySelector('[data-theme-figure="dark"]');
      if (!image) return;
      if (!link.dataset.lightHref) link.dataset.lightHref = link.getAttribute('href');
      link.href = dark ? image.getAttribute('src') : link.dataset.lightHref;
      if (!link.dataset.lightLabel) link.dataset.lightLabel = link.getAttribute('aria-label') || '';
      link.setAttribute('aria-label', dark
        ? link.dataset.lightLabel.replace(/PDF|image|figure/g, 'dark figure')
        : link.dataset.lightLabel);
    });
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue('--bg').trim();
  }

  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    try { localStorage.setItem('stereovlm-theme', theme); } catch (_) {}
    updateThemeButton();
  });
  updateThemeButton();

  function updateNavigation() {
    const visible = hero.getBoundingClientRect().bottom <= header.offsetHeight + 40;
    nav.classList.toggle('is-visible', visible);
    if (!visible && !desktop.matches) menu.open = false;
    // Hidden fixed navigation must not leave focusable links behind the cover.
    if (visible) nav.removeAttribute('inert');
    else nav.setAttribute('inert', '');
    let current = null;
    const threshold = header.offsetHeight + nav.offsetHeight + 80;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= threshold) current = links[index];
    });
    if (visible && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      current = links[links.length - 1];
    }
    links.forEach(link => {
      if (link === current && visible) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    currentLabel.textContent = current && visible ? current.textContent : 'Contents';
  }

  function updateMenuMode() {
    menu.open = desktop.matches;
    updateNavigation();
  }

  let navigationPending = false;
  window.addEventListener('scroll', () => {
    if (navigationPending) return;
    navigationPending = true;
    requestAnimationFrame(() => { updateNavigation(); navigationPending = false; });
  }, { passive: true });
  window.addEventListener('resize', updateNavigation, { passive: true });
  desktop.addEventListener('change', updateMenuMode);
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (!desktop.matches) menu.open = false;
  }));
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !desktop.matches) menu.open = false;
  });
  updateMenuMode();
})();

// Copy the displayed citation so metadata has one editable source.
(() => {
  const button = document.getElementById('copy-citation');
  const code = document.getElementById('citation-code');
  const status = document.getElementById('citation-status');
  if (!button || !code || !status) return;
  let reset;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    let copied = false;
    try {
      await navigator.clipboard.writeText(code.textContent.trim() + '\n');
      copied = true;
    } catch (_) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      try { copied = document.execCommand('copy'); } catch (_) {}
      if (copied) selection.removeAllRanges();
    }
    status.textContent = copied ? 'Citation copied.' : 'Select the citation above and copy it.';
    button.textContent = copied ? 'Copied ✓' : 'Copy ⧉';
    reset = setTimeout(() => { button.textContent = 'Copy ⧉'; status.textContent = ''; }, 2500);
  });
})();
