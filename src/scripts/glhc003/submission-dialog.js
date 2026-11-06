// Native dialog enhancement; the same instructions remain reachable without JS.
const dialog = document.getElementById('submission-dialog');
const triggers = [...document.querySelectorAll('[data-submission-trigger]')];
if (dialog && triggers.length && typeof dialog.showModal === 'function') {
  let opener = null;
  document.documentElement.classList.add('has-submission-dialog');
  for (const trigger of triggers) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      opener = trigger;
      if (!dialog.open) dialog.showModal();
      dialog.querySelector('[data-submission-close]')?.focus();
    });
  }
  dialog.querySelector('[data-submission-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href]')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });
}
