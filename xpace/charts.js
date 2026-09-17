/* Delegated interactions also work for charts copied into the large preview. */
(() => {
  const tooltip = document.querySelector('.chart-tooltip');
  if (!tooltip) return;
  if (!tooltip.id) tooltip.id = 'chart-tooltip';
  const tooltipTitle = document.createElement('strong');
  const tooltipValue = document.createElement('span');
  tooltip.replaceChildren(tooltipTitle, tooltipValue);
  let tooltipSource = null;
  let previousDescription = null;

  function updateHighlight(card, active = null) {
    const singlePoint = active?.closest('.chart-line-plot');
    card.classList.toggle('has-highlight', Boolean(active));
    card.querySelectorAll('.chart-series, .chart-legend-item').forEach((item) => {
      const emphasized = active && (singlePoint ? item === active : item.dataset.series === active.dataset.series);
      item.classList.toggle('is-active', Boolean(emphasized));
    });
  }

  function chartItem(target) {
    return target instanceof Element ? target.closest('.chart-series, .chart-legend-item') : null;
  }

  function hideTooltip() {
    tooltip.hidden = true;
    if (tooltipSource) {
      if (previousDescription === null) tooltipSource.removeAttribute('aria-describedby');
      else tooltipSource.setAttribute('aria-describedby', previousDescription);
    }
    tooltipSource = null;
    previousDescription = null;
  }

  function positionTooltip(source, event) {
    const bounds = source.getBoundingClientRect();
    const host = source.closest('dialog');
    const hostBounds = host?.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const minX = Math.max(12, hostBounds ? hostBounds.left + 12 : 12);
    const minY = Math.max(12, hostBounds ? hostBounds.top + 12 : 12);
    const maxX = Math.min(viewportWidth - 12, hostBounds ? hostBounds.right - 12 : viewportWidth - 12);
    const maxY = Math.min(window.innerHeight - 12, hostBounds ? hostBounds.bottom - 12 : window.innerHeight - 12);
    tooltip.style.maxWidth = `${Math.max(100, Math.min(280, maxX - minX))}px`;
    const pointX = event?.clientX ?? bounds.left + bounds.width / 2;
    const pointY = event?.clientY ?? bounds.top;
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    const left = Math.max(minX, Math.min(pointX + 14, maxX - width));
    let top = pointY + 16;
    if (top + height > maxY) top = pointY - height - 12;
    top = Math.max(minY, Math.min(top, maxY - height));
    // A transformed dialog is its own containing block during the transition.
    tooltip.style.left = `${host ? left - hostBounds.left - host.clientLeft + host.scrollLeft : left}px`;
    tooltip.style.top = `${host ? top - hostBounds.top - host.clientTop + host.scrollTop : top}px`;
  }

  function showTooltip(source, event) {
    if (!source.classList.contains('chart-series')) return;
    if (source !== tooltipSource) {
      hideTooltip();
      tooltipSource = source;
      previousDescription = source.getAttribute('aria-describedby');
      source.setAttribute('aria-describedby', [previousDescription, tooltip.id].filter(Boolean).join(' '));
      tooltipTitle.textContent = source.dataset.label || '';
      tooltipValue.textContent = source.dataset.value || '';
    }
    // Native dialogs occupy the top layer, above any tooltip attached to body.
    const host = source.closest('dialog') || document.body;
    if (tooltip.parentElement !== host) host.append(tooltip);
    tooltip.hidden = false;
    positionTooltip(source, event);
  }

  document.querySelectorAll('.chart-card').forEach((card) => updateHighlight(card));

  document.addEventListener('pointerover', (event) => {
    if (event.pointerType === 'touch') return;
    const item = chartItem(event.target);
    if (!item || item.contains(event.relatedTarget)) return;
    const card = item.closest('.chart-card');
    if (!card) return;
    updateHighlight(card, item);
    showTooltip(item, event);
  });

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const item = chartItem(event.target);
    const card = item?.closest('.chart-card');
    if (!card) return;
    if (item === tooltipSource) positionTooltip(item, event);
    else {
      updateHighlight(card, item);
      showTooltip(item, event);
    }
  });

  document.addEventListener('pointerout', (event) => {
    if (event.pointerType === 'touch') return;
    const item = chartItem(event.target);
    if (!item || item.contains(event.relatedTarget)) return;
    const card = item.closest('.chart-card');
    if (!card) return;
    updateHighlight(card);
    if (tooltipSource === item) hideTooltip();
  });

  function clearCharts() {
    hideTooltip();
    document.querySelectorAll('.chart-card.has-highlight').forEach((card) => updateHighlight(card));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') clearCharts();
  });
  document.addEventListener('scroll', clearCharts, { capture: true, passive: true });
  window.addEventListener('resize', clearCharts, { passive: true });
  document.addEventListener('close', (event) => {
    if (event.target.contains(tooltip)) {
      hideTooltip();
      document.body.append(tooltip);
    }
  }, true);
})();
