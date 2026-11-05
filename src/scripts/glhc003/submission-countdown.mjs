/** Recompute against a fixed instant, so suspended tabs never lose time. */
export function openingText(targetMs, nowMs = Date.now()) {
  const seconds = Math.max(0, Math.ceil((targetMs - nowMs) / 1000));
  if (seconds === 0) return 'Idea Submissions are OPEN.';
  const hours = Math.floor(seconds / 3600);
  const minutes = String(Math.floor(seconds / 60) % 60).padStart(2, '0');
  const remainder = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${remainder} until submissions open at 5:30 pm ET.`;
}

export function initSubmissionCountdown() {
  const element = document.getElementById('submission-opening');
  if (!element) return;
  const targetMs = Date.parse(element.dataset.opensAt);
  if (!Number.isFinite(targetMs)) return; // Retain the readable static schedule.
  let timer;
  const update = () => {
    clearTimeout(timer);
    const now = Date.now();
    element.textContent = openingText(targetMs, now);
    if (now < targetMs) timer = setTimeout(update, 1000 - (now % 1000));
  };
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pageshow', update);
  window.addEventListener('pagehide', () => clearTimeout(timer));
  update();
}
