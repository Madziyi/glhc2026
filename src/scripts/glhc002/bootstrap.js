const root = document.documentElement;
const toggle = document.querySelector('#reduce-motion');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let scenePromise;
let sceneModule;
const navigationStart = performance.timeOrigin;
let fallbackTimer;

function loadScene() {
  if (!scenePromise) {
    fallbackTimer = setTimeout(() => {
      if (!document.documentElement.classList.contains('scene-ready') && !document.querySelector('#stage').classList.contains('webgl-failed')) {
        document.documentElement.classList.add('scene-timeout');
        document.querySelector('#scene-loading').hidden = false;
        document.querySelector('#loading-label').textContent = 'The 3D view is taking longer. Keep reading while it loads.';
      }
    }, Math.max(0, navigationStart + 10_000 - Date.now()));
    const started = performance.now();
    scenePromise = import('./scene.js').then(module => {
      sceneModule = module;
      document.documentElement.dataset.sceneModuleMs = (performance.now() - started).toFixed(1);
      module.onSceneReady?.(() => {
        clearTimeout(fallbackTimer);
        document.documentElement.classList.add('scene-ready');
        document.documentElement.classList.remove('scene-timeout');
      });
      return module;
    }).catch(error => {
      clearTimeout(fallbackTimer);
      document.documentElement.classList.add('scene-timeout');
      document.querySelector('#scene-loading').hidden = false;
      document.querySelector('#loading-label').textContent = 'The 3D view could not start. The full story remains readable.';
      document.querySelector('#scene-retry').hidden = false;
      console.error('[GLHC scene import]', error);
    });
  }
  return scenePromise;
}

toggle.checked = motionPreference.matches;
root.classList.toggle('static-motion', toggle.checked);
if (!toggle.checked) requestAnimationFrame(() => loadScene());
document.querySelector('#scene-retry').addEventListener('click', () => {
  if (sceneModule?.retryScene) return sceneModule.retryScene();
  root.classList.remove('static-motion', 'scene-timeout');
  scenePromise = undefined;
  loadScene();
});

toggle.addEventListener('change', () => {
  root.classList.toggle('static-motion', toggle.checked);
  if (!toggle.checked) loadScene();
});

motionPreference.addEventListener('change', event => {
  if (document.activeElement !== toggle) {
    toggle.checked = event.matches;
    root.classList.toggle('static-motion', event.matches);
    toggle.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
