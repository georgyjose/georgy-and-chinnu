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

// #2 — Long-press hero → hidden message
registerEgg(() => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  let timer = null;
  let toast = null;

  const start = (e) => {
    timer = setTimeout(() => {
      toast = document.createElement('div');
      toast.className = 'hidden-msg';
      toast.textContent = CONFIG.hiddenMessage;
      hero.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('is-visible'));
      if (navigator.vibrate) navigator.vibrate(20);
      setTimeout(() => {
        if (!toast) return;
        toast.classList.remove('is-visible');
        setTimeout(() => toast && toast.remove(), 400);
      }, 3000);
    }, 500);
  };
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };

  hero.addEventListener('pointerdown', start);
  hero.addEventListener('pointerup', cancel);
  hero.addEventListener('pointerleave', cancel);
  hero.addEventListener('pointercancel', cancel);
});

// #3 — Scroll to footer → confetti rain (once per page load)
registerEgg(() => {
  const footer = document.querySelector('.footer');
  if (!footer) return;
  let fired = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !fired) {
        fired = true;
        rainConfetti({ count: 60 });
      }
    });
  }, { threshold: 0.5 });
  io.observe(footer);
});

// #4 — Countdown hits 0 → auto-confetti
registerEgg(() => {
  document.addEventListener('countdown:zero', () => {
    rainConfetti({ count: 80 });
    setTimeout(() => rainConfetti({ count: 80 }), 800);
  });
});

// Re-export helpers so per-egg modules can import from one place
export { burstAt, rainConfetti, fireworksAt, CONFIG, hasUserToggled };
