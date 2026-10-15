/* Keep each history entry's scroll position, including the moving tile selected before navigation. */
(() => {
  'use strict';
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  let leaving = false;
  let pointerPosition = null;
  const position = () => ({ x: window.scrollX, y: window.scrollY });
  const save = (point = position()) => {
    try { history.replaceState({ ...(history.state || {}), queroScroll: point }, ''); } catch { /* Native navigation remains usable. */ }
  };
  const pageLink = target => {
    const link = target?.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return null;
    try {
      const url = new URL(link.href, location.href);
      return url.origin === location.origin && url.pathname !== location.pathname ? link : null;
    } catch { return null; }
  };
  document.addEventListener('pointerdown', event => {
    pointerPosition = null;
    if (event.button === 0 && pageLink(event.target)) {
      pointerPosition = position();
      save(pointerPosition);
    }
  }, true);
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !pageLink(event.target)) return;
    save(pointerPosition || position());
    pointerPosition = null;
    leaving = true;
  }, true);
  window.addEventListener('pagehide', () => { if (!leaving) save(); });
  let restoring = false;
  const restore = () => {
    const point = history.state?.queroScroll;
    if (restoring || !point || !Number.isFinite(point.y) || !Number.isFinite(point.x)) return;
    restoring = true;
    const move = () => window.scrollTo({ left:point.x, top:point.y, behavior:'instant' });
    Promise.resolve(document.fonts?.ready).then(() => {
      requestAnimationFrame(() => {
        move();
        requestAnimationFrame(() => { move(); restoring = false; });
      });
    });
  };
  window.addEventListener('pageshow', event => {
    leaving = false;
    pointerPosition = null;
    if (event.persisted || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') restore();
  });
  document.querySelectorAll('[data-back]').forEach(link => link.addEventListener('click', event => {
    let sameOrigin = false;
    try { sameOrigin = new URL(document.referrer).origin === location.origin; } catch { /* Direct entry: use the fallback link. */ }
    if (!sameOrigin || history.length < 2) return;
    event.preventDefault();
    history.back();
  }));
})();
