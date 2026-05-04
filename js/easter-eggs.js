import { burstAt, rainConfetti, fireworksAt } from './particles.js';
import { CONFIG } from './config.js';
import { hasUserToggled } from './music.js';

// Individual eggs are added in Tasks 14-24.

const eggs = [];

export function registerEgg(fn) { eggs.push(fn); }

export function initEasterEggs() {
  eggs.forEach(fn => {
    try { fn(); } catch (e) { console.warn('Easter egg error', e); }
  });
}

// #1 — Tap names → heart burst
registerEgg(() => {
  const names = document.querySelector('[data-names]');
  if (!names) return;
  names.addEventListener('click', (e) => {
    burstAt(e.clientX, e.clientY, 14);
    if (navigator.vibrate) navigator.vibrate(8);
  });
});

// Re-export helpers so per-egg modules can import from one place
export { burstAt, rainConfetti, fireworksAt, CONFIG, hasUserToggled };
