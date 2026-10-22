// Deliberate section navigation without changing native wheel/touch scrolling.
export const SECTION_SCROLL_MS = 3200;

export function initSectionScroll() {
  const root = document.documentElement;
  let frame = 0;
  const cancel = () => { cancelAnimationFrame(frame); frame = 0; };
  const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('pointerdown', cancel, { passive: true });
  window.addEventListener('keydown', event => { if (scrollKeys.has(event.key)) cancel(); });
  window.addEventListener('popstate', cancel);
  window.addEventListener('resize', cancel);
  document.querySelector('#reduce-motion')?.addEventListener('change', cancel);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', cancel);

  for (const link of document.querySelectorAll('.hero-actions a, .invitation .scroll-cue')) {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      // Preserve normal immediate anchors for all static/reduced-motion paths.
      if (root.classList.contains('static-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      cancel();
      const from = scrollY;
      const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const to = Math.max(0, Math.min(target.getBoundingClientRect().top + from - padding, root.scrollHeight - innerHeight));
      const started = performance.now();
      const step = now => {
        const progress = Math.min(1, (now - started) / SECTION_SCROLL_MS);
        const eased = progress * progress * (3 - 2 * progress);
        scrollTo({ top: from + (to - from) * eased, behavior: 'instant' });
        if (progress < 1) frame = requestAnimationFrame(step);
        else {
          frame = 0;
          if (location.hash !== link.hash) history.pushState(null, '', link.hash);
          target.focus({ preventScroll: true });
        }
      };
      frame = requestAnimationFrame(step);
    });
  }
}
