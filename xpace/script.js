/* Progressive enhancement: content and preview links also work without JS. */
(() => {
  const root = document.documentElement;
  // Match the first subtitle line to the actual title glyph width at every viewport.
  const heroTitle = document.querySelector('#hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  function fitHeroSubtitle() {
    const titleRange = document.createRange();
    titleRange.selectNodeContents(heroTitle);
    const titleWidth = titleRange.getBoundingClientRect().width;
    const lineWidth = heroSubtitle.firstElementChild.getBoundingClientRect().width;
    if (!titleWidth || !lineWidth) return;
    const fontSize = parseFloat(getComputedStyle(heroSubtitle).fontSize);
    heroSubtitle.style.setProperty('--hero-subtitle-size', `${fontSize * titleWidth / lineWidth}px`);
  }
  fitHeroSubtitle();
  if ('ResizeObserver' in window) new ResizeObserver(fitHeroSubtitle).observe(heroTitle);
  else window.addEventListener('resize', fitHeroSubtitle);
  document.fonts?.ready.then(fitHeroSubtitle);
  const themeButton = document.querySelector('.theme-toggle');
  function syncThemeButton() {
    const dark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  }
  syncThemeButton();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('xpace-theme', root.dataset.theme); } catch (_) { /* Optional persistence. */ }
    syncThemeButton();
  });

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');
  function closeMenu() {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', `${open ? 'Close' : 'Open'} navigation`);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', closeMenu);

  const chapterLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const chapters = chapterLinks.map((link) => document.querySelector(link.hash));
  let chapterFrame;
  function updateChapter() {
    let current = 0;
    chapters.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 150) current = index;
    });
    // The shorter final section may reach the page bottom before the top anchor.
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
      current = chapterLinks.length - 1;
    }
    chapterLinks.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    chapterFrame = null;
  }
  function scheduleChapterUpdate() {
    if (!chapterFrame) chapterFrame = requestAnimationFrame(updateChapter);
  }
  window.addEventListener('scroll', scheduleChapterUpdate, { passive: true });
  window.addEventListener('resize', scheduleChapterUpdate);
  updateChapter();

  // All dialogs share the report window's entrance, exit, and focus behavior.
  function animateDialog(dialog, closeButton, onClose) {
    let opener;
    let frame;
    let closeTimer;
    let closing = false;

    function finishClose() {
      if (!closing) return;
      clearTimeout(closeTimer);
      dialog.close();
    }

    function close() {
      if (!dialog.open || closing) return;
      closing = true;
      cancelAnimationFrame(frame);
      const alreadyHidden = getComputedStyle(dialog).opacity === '0';
      dialog.classList.remove('is-visible');
      if (alreadyHidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finishClose();
      } else {
        // Keep the dialog and its backdrop in the top layer until the fade finishes.
        closeTimer = setTimeout(finishClose, 350);
      }
    }

    function open(trigger) {
      opener = trigger;
      clearTimeout(closeTimer);
      cancelAnimationFrame(frame);
      closing = false;
      if (!dialog.open) {
        dialog.classList.remove('is-visible');
        dialog.showModal();
        // Establish both transparent starting styles before the next paint.
        void dialog.offsetHeight;
        getComputedStyle(dialog, '::backdrop').opacity;
      }
      frame = requestAnimationFrame(() => dialog.classList.add('is-visible'));
    }

    dialog.querySelector(closeButton).addEventListener('click', close);
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      close();
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      close();
    });
    dialog.addEventListener('click', (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) close();
    });
    dialog.addEventListener('transitionend', (event) => {
      // Ignore backdrop events and any queued end event from an interrupted entrance.
      if (event.target === dialog && !event.pseudoElement && event.propertyName === 'opacity' && Number(getComputedStyle(dialog).opacity) === 0) finishClose();
    });
    dialog.addEventListener('close', () => {
      // A queued close event must not clean up a dialog that was just reopened.
      if (dialog.open) return;
      clearTimeout(closeTimer);
      cancelAnimationFrame(frame);
      closing = false;
      dialog.classList.remove('is-visible');
      onClose?.();
      opener?.focus({ preventScroll: true });
    });
    return { open, close };
  }

  const reportDialog = document.querySelector('.report-dialog');
  if (typeof reportDialog.showModal === 'function') {
    const report = animateDialog(reportDialog, '.report-close');
    document.querySelectorAll('[data-report-dialog]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        report.open(link);
      });
    });
  }

  const dialog = document.querySelector('.preview-dialog');
  if (typeof dialog.showModal === 'function') {
    const image = dialog.querySelector('.dialog-image');
    const preview = animateDialog(dialog, '.dialog-close');
    document.querySelectorAll('[data-preview]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const title = link.dataset.title || 'Report figure';
        const thumbnail = link.querySelector('img');
        // Reserve the new figure's proportions before its full image is painted.
        const imageWidth = Number(thumbnail.getAttribute('width')) || thumbnail.naturalWidth;
        const imageHeight = Number(thumbnail.getAttribute('height')) || thumbnail.naturalHeight;
        image.width = imageWidth;
        image.height = imageHeight;
        image.style.aspectRatio = `${imageWidth} / ${imageHeight}`;
        image.src = link.href;
        image.alt = thumbnail.alt;
        dialog.querySelector('#preview-title').textContent = title;
        dialog.querySelector('.dialog-caption').textContent = link.dataset.caption || '';
        dialog.querySelector('.dialog-original').href = link.href;
        preview.open(link);
      });
    });
  }

  const chartDialog = document.querySelector('.chart-dialog');
  if (typeof chartDialog.showModal === 'function') {
    const expandedCharts = chartDialog.querySelector('.expanded-charts');
    const chartPreview = animateDialog(chartDialog, '.chart-close', () => expandedCharts.replaceChildren());
    document.querySelectorAll('[data-chart-preview]').forEach((button) => {
      button.hidden = false;
      button.addEventListener('click', () => {
        const figure = document.getElementById(button.dataset.chartPreview);
        const card = figure.querySelector('.chart-card').cloneNode(true);
        card.querySelector('.chart-heading').remove();
        card.classList.remove('has-highlight');
        card.querySelectorAll('.is-active').forEach((item) => item.classList.remove('is-active'));
        // Keep SVG titles and descriptions unique while the original chart is visible behind the modal.
        const ids = new Map();
        card.querySelectorAll('[id]').forEach((item) => {
          ids.set(item.id, `expanded-${item.id}`);
          item.id = ids.get(item.id);
        });
        card.querySelectorAll('[aria-labelledby], [aria-describedby]').forEach((item) => {
          ['aria-labelledby', 'aria-describedby'].forEach((attribute) => {
            if (!item.hasAttribute(attribute)) return;
            item.setAttribute(attribute, item.getAttribute(attribute).split(/\s+/).map((id) => ids.get(id) || id).join(' '));
          });
        });
        chartDialog.querySelector('#chart-title').textContent = figure.querySelector('.chart-heading h4').textContent;
        chartDialog.querySelector('#chart-caption').textContent = figure.querySelector('figcaption').textContent;
        expandedCharts.replaceChildren(card);
        chartPreview.open(button);
      });
    });
  }

  const demoVideos = [...document.querySelectorAll('.demo-media video')];
  const videoDialog = document.querySelector('.video-dialog');
  const expandedVideo = videoDialog.querySelector('.expanded-video');
  const playQuietly = (video) => video.play()?.catch(() => {});

  // Demo previews always loop silently, independent of scroll position or dialogs.
  function playPreviews() {
    demoVideos.forEach((video) => {
      video.muted = true;
      playQuietly(video);
    });
  }
  playPreviews();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) expandedVideo.pause();
    else playPreviews();
  });

  if (typeof videoDialog.showModal === 'function') {
    const videoPreview = animateDialog(videoDialog, '.video-close', () => {
      // Keep the last video frame in place throughout the exit animation.
      expandedVideo.pause();
      expandedVideo.removeAttribute('src');
      expandedVideo.load();
    });
    document.querySelectorAll('[data-video-preview]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        videoDialog.querySelector('#video-title').textContent = link.dataset.title;
        videoDialog.querySelector('#video-prompt').textContent = `“${link.dataset.prompt}”`;
        videoDialog.querySelector('.video-error').hidden = true;
        videoDialog.querySelector('.video-direct-link').href = link.href;
        expandedVideo.poster = link.querySelector('video').poster;
        expandedVideo.src = link.href;
        expandedVideo.muted = true;
        videoPreview.open(link);
        // Start the full demonstration at the beginning; native controls enable audio.
        playQuietly(expandedVideo);
      });
    });
    expandedVideo.addEventListener('error', () => {
      if (videoDialog.open) videoDialog.querySelector('.video-error').hidden = false;
    });
  }

  const citationCopy = document.querySelector('.citation-copy');
  const citation = document.querySelector('#citation-bibtex');
  const citationStatus = document.querySelector('.citation-status');
  let citationResetTimer;

  function copyWithSelection(text) {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
    document.body.appendChild(field);
    try {
      field.focus({ preventScroll: true });
      field.select();
      return document.execCommand('copy');
    } catch (_) {
      return false;
    } finally {
      field.remove();
    }
  }

  citationCopy.addEventListener('click', async () => {
    clearTimeout(citationResetTimer);
    citationCopy.disabled = true;
    citationCopy.classList.remove('is-copied');
    citationStatus.textContent = '';
    const text = citation.textContent.trim();
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (_) { /* Local files and restricted browsers can use the selection fallback. */ }
    if (!copied) copied = copyWithSelection(text);
    citationCopy.disabled = false;
    citationCopy.focus({ preventScroll: true });
    citationCopy.textContent = copied ? 'Copied' : 'Copy';
    citationCopy.classList.toggle('is-copied', copied);
    if (copied) {
      citationStatus.textContent = 'BibTeX copied.';
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citation);
      selection.removeAllRanges();
      selection.addRange(range);
      citation.focus({ preventScroll: true });
      citationStatus.textContent = 'Copy the selected BibTeX with your browser’s Copy command.';
    }
    citationResetTimer = setTimeout(() => {
      citationCopy.textContent = 'Copy';
      citationCopy.classList.remove('is-copied');
      citationStatus.textContent = '';
    }, 2000);
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
