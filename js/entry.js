const SESSION_KEY = 'entry-shown';

function readFlag() {
  try { return sessionStorage.getItem(SESSION_KEY); } catch { return null; }
}
function writeFlag() {
  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode */ }
}

export function initEntry() {
  const overlay = document.querySelector('[data-entry]');
  if (!overlay) return;

  if (readFlag()) {
    overlay.remove();
    document.body.classList.remove('locked');
    return;
  }

  document.body.classList.add('locked');

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.add('entry--out');
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('locked');
      writeFlag();
      document.dispatchEvent(new CustomEvent('entry:dismissed'));
    }, 320);
  };

  overlay.addEventListener('click', dismiss);
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismiss(); }
  });
  overlay.tabIndex = 0;
  overlay.focus();
}
