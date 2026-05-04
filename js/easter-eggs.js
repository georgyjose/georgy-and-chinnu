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

// #5 — Konami tap pattern (TL → TR → BL → BR → center within 5s)
registerEgg(() => {
  const PATTERN = ['tl', 'tr', 'bl', 'br', 'c'];
  const RESET_MS = 5000;
  let history = [];
  let timer = null;

  function zoneOf(x, y) {
    const w = window.innerWidth, h = window.innerHeight;
    const horiz = x < w * 0.34 ? 'l' : x > w * 0.66 ? 'r' : 'c';
    const vert = y < h * 0.34 ? 't' : y > h * 0.66 ? 'b' : 'c';
    if (horiz === 'c' && vert === 'c') return 'c';
    if (vert === 'c' || horiz === 'c') return null;
    return vert + horiz;
  }

  document.addEventListener('pointerdown', (e) => {
    const z = zoneOf(e.clientX, e.clientY);
    if (!z) return;
    if (z !== PATTERN[history.length]) {
      history = z === PATTERN[0] ? [z] : [];
    } else {
      history.push(z);
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { history = []; }, RESET_MS);
    if (history.length === PATTERN.length) {
      rainConfetti({ count: 100 });
      if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
      history = [];
    }
  });
});

// #6 — Tap names 3× within 1s (Minions only) → BELLO speech bubble
registerEgg(() => {
  const names = document.querySelector('[data-names]');
  if (!names) return;
  let taps = [];

  names.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') !== 'minions') return;
    const now = Date.now();
    taps = taps.filter(t => now - t < 1000);
    taps.push(now);
    if (taps.length >= 3) {
      taps = [];
      const bubble = document.createElement('div');
      bubble.className = 'speech-bubble';
      bubble.textContent = 'BELLO! 👋';
      names.appendChild(bubble);
      requestAnimationFrame(() => bubble.classList.add('is-visible'));
      setTimeout(() => {
        bubble.classList.remove('is-visible');
        setTimeout(() => bubble.remove(), 300);
      }, 1800);
    }
  });
});

// #7 — Triple-tap hero within 1s (Minions only) → po-ta-to toast
registerEgg(() => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  let taps = [];

  hero.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') !== 'minions') return;
    const now = Date.now();
    taps = taps.filter(t => now - t < 1000);
    taps.push(now);
    if (taps.length >= 3) {
      taps = [];
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = 'po-ta-to 🥔';
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('is-visible'));
      setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }
  });
});

// #8 — Long-press theme toggle (Minions only) → banana fireworks
registerEgg(() => {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  let timer = null;

  const start = () => {
    timer = setTimeout(() => {
      if (document.documentElement.getAttribute('data-theme') !== 'minions') return;
      const rect = btn.getBoundingClientRect();
      fireworksAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    }, 2000);
  };
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };

  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', cancel);
  btn.addEventListener('pointerleave', cancel);
  btn.addEventListener('pointercancel', cancel);
});

// Re-export helpers so per-egg modules can import from one place
export { burstAt, rainConfetti, fireworksAt, CONFIG, hasUserToggled };
