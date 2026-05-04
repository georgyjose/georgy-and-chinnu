import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';
import { initEntry } from './entry.js';
import { initCarousel } from './carousel.js';
import { initMaps } from './maps.js';
import { initShare } from './share.js';
import { initMusic } from './music.js';
import { initEasterEggs } from './easter-eggs.js';

function initFadeIns() {
  const sections = document.querySelectorAll('[data-section]');
  if (!('IntersectionObserver' in window)) {
    sections.forEach(s => s.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  sections.forEach(s => io.observe(s));
}

function initRipples() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn, .floating-btn, .contact__card');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

function boot() {
  initEntry();
  initThemeToggle();
  initCountdown();
  initCarousel();
  initMaps();
  initShare();
  initMusic();
  initFadeIns();
  initRipples();
  initEasterEggs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
