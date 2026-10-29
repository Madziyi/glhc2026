/**
 * Progressive, accessible info-session chooser.
 * Without JavaScript (or native dialog support), CTA anchors navigate to
 * the visible fallback choice section instead.
 */
const dialog = document.getElementById('info-session-dialog');
const triggers = [...document.querySelectorAll('[data-info-session-trigger]')];

if (dialog && typeof dialog.showModal === 'function' && triggers.length) {
  document.documentElement.classList.add('has-info-session-dialog');

  const closeButton = dialog.querySelector('[data-info-session-close]');
  let opener = null;

  for (const trigger of triggers) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      opener = trigger;
      if (!dialog.open) dialog.showModal();
      closeButton?.focus();
    });
  }

  closeButton?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });
}
