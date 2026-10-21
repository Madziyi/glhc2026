const root = document.documentElement;
const toggle = document.querySelector('#reduce-motion');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const loading = document.querySelector('#scene-loading');
const loadingLabel = document.querySelector('#loading-label');
const retry = document.querySelector('#scene-retry');
let sceneModule, scenePromise, timer;
let timedOut = false;

function fallback(message) {
  timedOut = true;
  root.classList.add('static-motion', 'scene-timeout');
  root.classList.remove('scene-ready');
  toggle.checked = true;
  toggle.dispatchEvent(new Event('change'));
  loading.hidden = false;
  loadingLabel.textContent = message;
  retry.hidden = false;
}

function armDeadline() {
  clearTimeout(timer);
  timedOut = false;
  root.classList.remove('scene-timeout');
  loading.hidden = false;
  loadingLabel.textContent = 'Preparing the lake…';
  retry.hidden = true;
  timer = setTimeout(() => fallback('Explore the full story in the static view. The 3D lake is taking longer to load.'), 10_000);
}

function loadScene() {
  if (scenePromise) {
    if (!root.classList.contains('scene-ready')) armDeadline();
    return scenePromise;
  }
  armDeadline();
  const started = performance.now();
  scenePromise = import('../glhc002/scene.js').then(module => {
    sceneModule = module;
    root.dataset.sceneModuleMs = (performance.now() - started).toFixed(1);
    module.onSceneReady(() => {
      clearTimeout(timer);
      if (timedOut || toggle.checked) return;
      root.classList.add('scene-ready');
      root.classList.remove('scene-timeout');
      loading.hidden = true;
    });
    module.onSceneFallback(() => {
      clearTimeout(timer);
      root.classList.remove('scene-ready', 'scene-timeout');
      // The renderer already presents the accurate failure notice and retry.
      // Do not let a stale deadline replace that notice ten seconds later.
    });
    if (timedOut) module.pauseScene?.();
    return module;
  }).catch(error => {
    clearTimeout(timer);
    fallback('The 3D lake is unavailable. The complete story and registration are ready below.');
    scenePromise = undefined;
    console.error('[GLHC story]', error);
  });
  return scenePromise;
}

toggle.checked = preference.matches;
root.classList.toggle('static-motion', toggle.checked);
toggle.addEventListener('change', () => {
  root.classList.toggle('static-motion', toggle.checked);
  if (toggle.checked) {
    clearTimeout(timer);
    if (!timedOut) loading.hidden = true;
  } else loadScene();
});
preference.addEventListener('change', event => {
  toggle.checked = event.matches;
  toggle.dispatchEvent(new Event('change'));
});
retry.addEventListener('click', () => {
  clearTimeout(timer);
  timedOut = false;
  toggle.checked = false;
  toggle.disabled = false;
  root.classList.remove('static-motion', 'scene-timeout', 'scene-ready');
  if (sceneModule) { armDeadline(); sceneModule.retryScene(); }
  else loadScene();
});

// The organizer's public configuration is also read at build time for no-JS links.
const configured = window.GLHC_CONFIG?.lumaUrl;
if (configured && new URL(configured).protocol === 'https:') {
  for (const link of document.querySelectorAll('[data-register]')) {
    link.href = configured;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
}
if (!toggle.checked) requestAnimationFrame(loadScene);
