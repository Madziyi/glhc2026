/**
 * GLHC-001 scroll controller: dependency-free first pass so the opening never blocks on WebGL.
 * GSAP/Three enhancement is deliberately postponed until the reference assets are approved.
 * All scene changes are scroll-driven and reversible. No scroll hijacking.
 */
(() => {
  'use strict';
  const config = window.GLHC_CONFIG || {};
  const register = document.getElementById('luma-registration');
  const note = document.getElementById('registration-note');
  const lumaUrl = typeof config.lumaUrl === 'string' ? config.lumaUrl.trim() : '';
  // No placeholder destination or invented event slug. Only known lu.ma/luma.com HTTPS URLs.
  if (register && /^https:\/\/(?:[a-z0-9-]+\.)*(?:lu\.ma|luma\.com)\//i.test(lumaUrl)) {
    register.href = lumaUrl;
    register.target = '_blank';
    register.rel = 'noopener noreferrer';
    register.removeAttribute('aria-disabled');
    register.querySelector('span').textContent = 'Register on Luma';
    if (note) note.textContent = 'Registration opens in a new tab on Luma.';
  } else if (register) {
    register.addEventListener('click', (event) => event.preventDefault());
  }

  const journey = document.getElementById('journey');
  const world = document.querySelector('.world');
  const introCue = document.getElementById('dive-cue');
  const counter = document.getElementById('scene-number');
  const progressBar = document.querySelector('.journey__progress');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const map = (p, start, end) => clamp((p - start) / (end - start));
  let queued = false;
  let activeScene = -1;

  const getSceneIndex = (p) => p < .18 ? 0 : p < .34 ? 1 : p < .52 ? 2 : p < .77 ? 3 : 4;
  function render() {
    queued = false;
    if (!journey || !world || reduced.matches) return;
    const rect = journey.getBoundingClientRect();
    const travel = Math.max(journey.offsetHeight - window.innerHeight, 1);
    const p = clamp(-rect.top / travel);
    const crossing = map(p, .28, .54);
    // Split the single world at a moving waterline, instead of switching scenes abruptly.
    const waterline = 107 - crossing * 123;
    const gliderAppearance = map(p, .49, .64) * (1 - map(p, .91, 1));
    const gliderX = -130 + map(p, .49, 1) * 260;
    const gliderY = 150 - map(p, .49, 1) * 230;
    const gliderScale = 1.1 - map(p, .60, 1) * .61;
    world.style.setProperty('--waterline', `${waterline.toFixed(2)}%`);
    world.style.setProperty('--waterline-opacity', `${(map(p, .28, .34) * (1 - map(p, .53, .61))).toFixed(3)}`);
    world.style.setProperty('--glider-x', `${gliderX.toFixed(1)}px`);
    world.style.setProperty('--glider-y', `${gliderY.toFixed(1)}px`);
    world.style.setProperty('--glider-scale', gliderScale.toFixed(3));
    world.style.setProperty('--glider-angle', `${(-7 + map(p, .6, .95) * 15).toFixed(2)}deg`);
    world.style.setProperty('--glider-opacity', gliderAppearance.toFixed(3));
    world.style.setProperty('--surface-zoom', (1 + map(p, .05, .37) * .13).toFixed(3));
    world.style.setProperty('--buoy-shift', `${(map(p, .08, .35) * -18).toFixed(1)}px`);
    world.style.setProperty('--sun-opacity', (1 - map(p, .23, .62)).toFixed(3));
    world.style.setProperty('--dive-opacity', map(p, .64, .95).toFixed(3));
    if (progressBar) progressBar.style.setProperty('--scroll-progress', p.toFixed(4));
    const nextScene = getSceneIndex(p);
    if (nextScene !== activeScene) {
      activeScene = nextScene;
      scenes.forEach((el, i) => el.classList.toggle('is-visible', i === nextScene));
      if (counter) counter.textContent = String(nextScene + 1).padStart(2, '0');
    }
    if (introCue) introCue.style.opacity = `${1 - map(p, .01, .18)}`;
  }
  function queueRender() {
    if (!queued) { queued = true; requestAnimationFrame(render); }
  }
  introCue?.addEventListener('click', () => {
    const top = journey.getBoundingClientRect().top + window.scrollY + Math.max(journey.offsetHeight - window.innerHeight,1) * .22;
    window.scrollTo({ top, behavior: reduced.matches ? 'instant' : 'smooth' });
  });
  window.addEventListener('scroll', queueRender, { passive: true });
  window.addEventListener('resize', queueRender, { passive: true });
  reduced.addEventListener?.('change', queueRender);
  queueRender();
})();
