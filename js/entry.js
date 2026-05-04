const SESSION_KEY = 'entry-shown';

export function initEntry() {
  const overlay = document.querySelector('[data-entry]');
  if (!overlay) return;

  if (sessionStorage.getItem(SESSION_KEY)) {
    overlay.remove();
    document.body.classList.remove('locked');
    return;
  }

  document.body.classList.add('locked');

  const dismiss = () => {
    overlay.classList.add('entry--out');
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('locked');
      sessionStorage.setItem(SESSION_KEY, '1');
      document.dispatchEvent(new CustomEvent('entry:dismissed'));
    }, 320);
  };

  overlay.addEventListener('click', dismiss, { once: true });
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismiss(); }
  });
  overlay.tabIndex = 0;
  overlay.focus();
}
