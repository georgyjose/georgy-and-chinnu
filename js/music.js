let userToggled = false;

export function hasUserToggled() { return userToggled; }

export function initMusic() {
  const btn = document.querySelector('[data-music-toggle]');
  const audio = document.querySelector('[data-music-audio]');
  if (!btn || !audio) return;

  audio.volume = 0.4;
  audio.loop = true;

  // Start downloading the song after all images have loaded so it's ready
  // to play instantly when the user taps the music button.
  if (document.readyState === 'complete') {
    audio.preload = 'auto';
    audio.load();
  } else {
    window.addEventListener('load', () => {
      audio.preload = 'auto';
      audio.load();
    }, { once: true });
  }

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
