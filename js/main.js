import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';

function boot() {
  initThemeToggle();
  initCountdown();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
