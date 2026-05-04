const ROOT_ID = 'particles-root';

function root() {
  let r = document.getElementById(ROOT_ID);
  if (!r) {
    r = document.createElement('div');
    r.id = ROOT_ID;
    r.setAttribute('aria-hidden', 'true');
    document.body.appendChild(r);
  }
  return r;
}

function glyphFor(theme) {
  return theme === 'minions' ? '🍌' : '❤';
}

function spawn({ glyph, x, y, vx, vy, life, size, rotate }) {
  const el = document.createElement('span');
  el.className = 'particle';
  el.textContent = glyph;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = `${size}px`;
  el.style.setProperty('--vx', `${vx}px`);
  el.style.setProperty('--vy', `${vy}px`);
  el.style.setProperty('--rotate', `${rotate}deg`);
  el.style.setProperty('--life', `${life}ms`);
  root().appendChild(el);
  setTimeout(() => el.remove(), life);
}

function currentGlyph() {
  return glyphFor(document.documentElement.getAttribute('data-theme'));
}

export function burstAt(clientX, clientY, count = 12) {
  const glyph = currentGlyph();
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 60 + Math.random() * 80;
    spawn({
      glyph,
      x: clientX,
      y: clientY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 40,
      life: 900 + Math.random() * 400,
      size: 18 + Math.random() * 14,
      rotate: Math.random() * 360,
    });
  }
}

export function rainConfetti({ count = 60, fromTop = true } = {}) {
  const glyph = currentGlyph();
  const w = window.innerWidth;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      spawn({
        glyph,
        x: Math.random() * w,
        y: fromTop ? -20 : window.innerHeight + 20,
        vx: (Math.random() - 0.5) * 80,
        vy: fromTop ? (window.innerHeight + 80) : -(window.innerHeight + 80),
        life: 1800 + Math.random() * 1000,
        size: 18 + Math.random() * 16,
        rotate: Math.random() * 720 - 360,
      });
    }, Math.random() * 600);
  }
}

export function fireworksAt(clientX, clientY) {
  const glyph = currentGlyph();
  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i) / 18;
    spawn({
      glyph,
      x: clientX,
      y: clientY,
      vx: Math.cos(angle) * 120,
      vy: Math.sin(angle) * 120,
      life: 800,
      size: 18,
      rotate: 0,
    });
  }
}
