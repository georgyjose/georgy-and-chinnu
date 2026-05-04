import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';
import { initEntry } from './entry.js';
import { initCarousel } from './carousel.js';
import { initMaps } from './maps.js';

function boot() {
  initEntry();
  initThemeToggle();
  initCountdown();
  initCarousel();
  initMaps();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
