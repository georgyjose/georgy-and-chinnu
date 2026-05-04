import { CONFIG } from './config.js';

export function diff(now, target) {
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds, done: ms === 0 };
}

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
];

function pad(n) { return String(n).padStart(2, '0'); }

export function initCountdown() {
  const root = document.querySelector('[data-countdown]');
  if (!root) return;

  const target = new Date(CONFIG.date).getTime();

  root.innerHTML = UNITS.map(u => `
    <div class="cd__unit">
      <div class="cd__num" data-cd="${u.key}">--</div>
      <div class="cd__label">${u.label}</div>
    </div>
  `).join('');

  const els = Object.fromEntries(
    UNITS.map(u => [u.key, root.querySelector(`[data-cd="${u.key}"]`)])
  );

  let lastDone = false;

  function tick() {
    const d = diff(Date.now(), target);

    if (d.done && !lastDone) {
      root.innerHTML = `<div class="cd__zero">Today is the day 🎉</div>`;
      lastDone = true;
      document.dispatchEvent(new CustomEvent('countdown:zero'));
      return;
    }

    UNITS.forEach(u => {
      const el = els[u.key];
      const next = pad(d[u.key]);
      if (el.textContent !== next) {
        el.classList.remove('flip');
        void el.offsetWidth; // restart animation
        el.classList.add('flip');
        el.textContent = next;
      }
    });
  }

  tick();
  setInterval(tick, 1000);
}
