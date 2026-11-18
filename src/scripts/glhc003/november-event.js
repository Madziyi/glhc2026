/** In-person November 26 info session; link fallback works without JavaScript. */
const dialog = document.getElementById('november-event-dialog');
const triggers = [...document.querySelectorAll('[data-event-trigger]')];
if (dialog && triggers.length && typeof dialog.showModal === 'function') {
  document.documentElement.classList.add('has-event-dialog');
  let opener = null;
  const closeButton = dialog.querySelector('[data-event-close]');
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
