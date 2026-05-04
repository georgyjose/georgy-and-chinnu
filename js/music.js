let userToggled = false;

export function hasUserToggled() { return userToggled; }

export function initMusic() {
  const btn = document.querySelector('[data-music-toggle]');
  const audio = document.querySelector('[data-music-audio]');
  if (!btn || !audio) return;

  audio.volume = 0.4;
  audio.loop = true;

  btn.addEventListener('click', () => {
    userToggled = true;
    const playing = btn.classList.toggle('is-playing');
    btn.setAttribute('aria-pressed', String(playing));
    if (playing) {
      audio.play().catch((err) => console.warn('[music] play failed:', err));
    } else {
      audio.pause();
    }
    if (navigator.vibrate) navigator.vibrate(10);
  });
}
