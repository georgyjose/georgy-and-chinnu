import { CONFIG } from './config.js';

export function buildMessage() {
  return CONFIG.shareMessage(CONFIG.shareUrl);
}

export function whatsappUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function initShare() {
  const btn = document.querySelector('[data-share]');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const message = buildMessage();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Georgy & Chinnu's Wedding",
          text: message,
          url: CONFIG.shareUrl,
        });
        if (navigator.vibrate) navigator.vibrate(10);
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }

    window.open(whatsappUrl(message), '_blank', 'noopener');
    if (navigator.vibrate) navigator.vibrate(10);
  });
}
