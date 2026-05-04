export function initMaps() {
  const link = document.querySelector('[data-maps-link]');
  if (!link) return;
  link.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(10);
  });
}
