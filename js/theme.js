const STORAGE_KEY = 'theme';
const VALID = ['classic', 'minions'];

export function currentTheme() {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return VALID.includes(t) ? t : 'classic';
  } catch {
    return 'classic';
  }
}

export function setTheme(theme) {
  if (!VALID.includes(theme)) return;
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* private mode */ }
  document.documentElement.setAttribute('data-theme', theme);
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function toggleTheme() {
  const next = currentTheme() === 'classic' ? 'minions' : 'classic';
  setTheme(next);
  return next;
}

export function initThemeToggle() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    toggleTheme();
    if (navigator.vibrate) navigator.vibrate(10);
  });
}
