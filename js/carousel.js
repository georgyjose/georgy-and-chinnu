import { CONFIG } from './config.js';

export function initCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const track = root.querySelector('[data-carousel-track]');
  const dotsRoot = root.querySelector('[data-carousel-dots]');
  const slides = Array.from(track.children);

  // Captions: skip the feature image (#1), captions[1..] map to carousel slides
  slides.forEach((slide, i) => {
    const cap = slide.querySelector('figcaption');
    const text = CONFIG.photoCaptions[i + 1];
    if (text && cap) cap.textContent = text;
  });

  // Build dots
  dotsRoot.innerHTML = slides.map((_, i) =>
    `<button class="carousel__dot" data-dot="${i}" aria-label="Go to slide ${i + 1}"></button>`
  ).join('');
  const dots = Array.from(dotsRoot.children);

  let active = 0;

  function render() {
    track.scrollTo({ left: slides[active].offsetLeft, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
  }

  function go(i) {
    active = Math.max(0, Math.min(slides.length - 1, i));
    render();
  }

  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

  // Keyboard nav
  root.tabIndex = 0;
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(active + 1);
    if (e.key === 'ArrowLeft') go(active - 1);
  });

  // Sync active dot when user scroll-snaps manually
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      if (idx !== active) {
        active = idx;
        dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
      }
    }, 80);
  });

  render();
}
