const root = document.documentElement;
const toggle = document.querySelector('#reduce-motion');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let scenePromise;

function loadScene() {
  if (!scenePromise) scenePromise = import('./scene.js');
  return scenePromise;
}

toggle.checked = motionPreference.matches;
root.classList.toggle('static-motion', toggle.checked);
if (!toggle.checked) loadScene();

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
