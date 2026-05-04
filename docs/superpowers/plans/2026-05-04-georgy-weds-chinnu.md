# Georgy & Chinnu Wedding Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page mobile-first wedding invitation site for Georgy & Chinnu with theme toggle (Christian Traditional default + Minions playful), countdown, photo carousel, maps deeplink, WhatsApp share, music toggle, contact, and 11 easter eggs — deployable to GitHub Pages with custom domain `georgyandchinnu.com`.

**Architecture:** Plain HTML + CSS + vanilla JS, no framework, no bundler. JS files load as ES modules (`<script type="module">`). Single source of truth (`js/config.js`) holds names/date/URL/contact. Themes are CSS-variable-driven with a `data-theme` attribute on `<html>` toggled via a button + persisted in `localStorage` + applied in an inline head script before stylesheet load to prevent flash-of-wrong-theme.

**Tech Stack:** HTML5, CSS3 (custom properties, IntersectionObserver-driven animations), vanilla JS (ES modules), Google Fonts (Cormorant Garamond + Inter for classic; Fredoka for minions). Local dev via `python3 -m http.server`. Deployment: push to `main`, GitHub Pages serves repo root.

**Repo location:** `/Users/georgyjose/Projects/georgy-weds-chinnu`
**Spec:** `docs/superpowers/specs/2026-05-04-georgy-weds-chinnu-design.md`

**Conventions for every commit in this plan:**
- Single-line message ≤ 72 chars
- No mention of AI/Claude in messages
- One `git add <specific files>` then `git commit -m "..."` per task

**Local verification convention:** Each task that produces UI work ends with running `python3 -m http.server 8000` from the repo root and opening `http://localhost:8000/` in a browser (use device-emulation devtools for mobile view). Kill the server with Ctrl+C between tasks if needed.

---

## Task 1: Repo scaffolding & project root files

**Files:**
- Create: `.nojekyll`
- Create: `CNAME`
- Create: `README.md`
- Create: `.gitignore`
- Create: `manifest.json`
- Create: `assets/icons/favicon.svg`

- [ ] **Step 1: Create `.nojekyll`** (empty file, prevents GitHub Pages from running Jekyll)

```bash
touch .nojekyll
```

- [ ] **Step 2: Create `CNAME`** with the custom domain

File: `CNAME`
```
georgyandchinnu.com
```

- [ ] **Step 3: Create `README.md`**

File: `README.md`
```markdown
# Georgy & Chinnu Wedding Site

Single-page mobile-first wedding invitation served at https://georgyandchinnu.com.

## Local development

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deployment

Push to `main` branch. GitHub Pages serves the repo root automatically.

## Editing content

All site content lives in `js/config.js`:
- Names, wedding date, venue, contact phone, share URL
- Hidden message text
- Photo captions

Replace asset files in place to update visuals:
- `assets/photos/hero.svg` — main hero photo (placeholder; replace with the same filename, or swap to `.webp`/`.jpg` and update the two `<img>`/preload references in `index.html`)
- `assets/photos/01.svg` ... `06.svg` — feature + 5 carousel photos (same swap rules)
- `assets/audio/song.mp3` — music toggle song (replace in place; same filename, no code change needed)
```

- [ ] **Step 4: Create `.gitignore`**

File: `.gitignore`
```
.DS_Store
.vscode/
.idea/
*.swp
node_modules/
```

- [ ] **Step 5: Create `manifest.json`**

File: `manifest.json`
```json
{
  "name": "Georgy & Chinnu's Wedding",
  "short_name": "G & C",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FBF7F0",
  "theme_color": "#C9A96E",
  "icons": [
    { "src": "assets/icons/favicon.svg", "sizes": "any", "type": "image/svg+xml" }
  ]
}
```

- [ ] **Step 6: Create `assets/icons/favicon.svg`**

```bash
mkdir -p assets/icons assets/photos assets/audio css js
```

File: `assets/icons/favicon.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="30" fill="#FBF7F0"/>
  <path d="M32 48 L18 28 Q18 18 28 18 Q32 18 32 24 Q32 18 36 18 Q46 18 46 28 Z" fill="#C9A96E"/>
</svg>
```

- [ ] **Step 7: Verify the structure exists**

```bash
ls -la && ls assets/
```
Expected: see `.nojekyll`, `CNAME`, `README.md`, `.gitignore`, `manifest.json`, and the `assets/`, `css/`, `js/` directories.

- [ ] **Step 8: Commit**

```bash
git add .nojekyll CNAME README.md .gitignore manifest.json assets/icons/favicon.svg
git commit -m "chore: scaffold repo with manifest, cname, favicon"
```

---

## Task 2: Base HTML shell + base.css

**Files:**
- Create: `index.html`
- Create: `css/base.css`

- [ ] **Step 1: Create `index.html` with semantic shell, font preloads, theme early-paint placeholder**

File: `index.html`
```html
<!doctype html>
<html lang="en" data-theme="classic">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#C9A96E">
  <title>Georgy & Chinnu's Wedding</title>
  <meta name="description" content="Join us for the wedding of Georgy & Chinnu — Dec 1, 2025">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
  <link rel="apple-touch-icon" href="assets/icons/favicon.svg">

  <!-- Theme early-paint script (filled in Task 3) -->
  <script>
    (function () {
      var t = localStorage.getItem('theme');
      if (t === 'minions' || t === 'classic') {
        document.documentElement.setAttribute('data-theme', t);
      }
    })();
  </script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Fredoka:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/theme-classic.css">
  <link rel="stylesheet" href="css/theme-minions.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>
  <main id="app">
    <!-- Sections will be added in subsequent tasks -->
    <section class="placeholder">
      <h1>Site under construction</h1>
    </section>
  </main>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `css/base.css` with reset, custom properties, typography**

File: `css/base.css`
```css
/* ---------- Reset ---------- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body { min-height: 100dvh; line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, svg, video { display: block; max-width: 100%; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
a { color: inherit; text-decoration: none; }

/* ---------- Custom properties (defaults; themes override) ---------- */
:root {
  --bg: #FBF7F0;
  --fg: #2A2A2A;
  --accent: #C9A96E;
  --accent-2: #7A8B7A;
  --muted: rgba(42, 42, 42, 0.6);
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --max-width: 720px;
  --pad: clamp(1rem, 4vw, 2rem);
}

/* ---------- Layout primitives ---------- */
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  transition: background var(--transition), color var(--transition);
}

#app { display: flex; flex-direction: column; }

section {
  padding: clamp(3rem, 10vw, 6rem) var(--pad);
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 500;
  line-height: 1.15;
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 100ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Create empty placeholder CSS files** (filled in Task 3)

```bash
touch css/theme-classic.css css/theme-minions.css css/animations.css
```

- [ ] **Step 4: Create empty `js/main.js` placeholder** (filled in later tasks)

File: `js/main.js`
```js
// Boot sequence — populated in later tasks
console.log('Wedding site loaded');
```

- [ ] **Step 5: Run local server and verify it loads without errors**

```bash
python3 -m http.server 8000
```
Open `http://localhost:8000/` in a browser. Open DevTools console.
Expected: see "Site under construction" headline, console log "Wedding site loaded", no 404s in Network tab (placeholder CSS files return 200 even though empty).

- [ ] **Step 6: Commit**

```bash
git add index.html css/ js/main.js
git commit -m "feat: add html shell, base css, font preloads"
```

---

## Task 3: Theme system (config + theme.js + theme CSS + toggle button)

**Files:**
- Create: `js/config.js`
- Create: `js/theme.js`
- Modify: `css/theme-classic.css`
- Modify: `css/theme-minions.css`
- Modify: `index.html` (add theme toggle button + script tag)
- Modify: `js/main.js`

- [ ] **Step 1: Create `js/config.js`** (single source of truth)

File: `js/config.js`
```js
export const CONFIG = {
  names: { groom: 'Georgy', bride: 'Chinnu' },
  date: '2025-12-01T10:00:00+05:30',
  venue: {
    name: 'TBD church name',
    mapsUrl: 'https://maps.app.goo.gl/c1CVMrJhTMwCTkde9',
  },
  contact: { name: 'Anna', phone: '+918078135442' },
  shareUrl: 'https://georgyandchinnu.com',
  shareMessage: (url) =>
    `Georgy & Chinnu's Wedding 💍\n\nDec 1, 2025\n\nJoin us ❤️\n\n${url}`,
  hiddenMessage: 'From the day we met, it was always you ❤️',
  photoCaptions: [
    'Where it all began',
    'Our first trip',
    'That day ❤️',
    'Sundays',
    'Coffee mornings',
    'Forever begins here',
  ],
};
```

- [ ] **Step 2: Create `js/theme.js`** (toggle handler)

File: `js/theme.js`
```js
const STORAGE_KEY = 'theme';
const VALID = ['classic', 'minions'];

export function currentTheme() {
  const t = localStorage.getItem(STORAGE_KEY);
  return VALID.includes(t) ? t : 'classic';
}

export function setTheme(theme) {
  if (!VALID.includes(theme)) return;
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function toggleTheme() {
  const next = currentTheme() === 'classic' ? 'minions' : 'classic';
  setTheme(next);
  return next;
}

export function initThemeToggle() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    toggleTheme();
    if (navigator.vibrate) navigator.vibrate(10);
  });
}
```

- [ ] **Step 3: Fill `css/theme-classic.css`**

File: `css/theme-classic.css`
```css
html[data-theme="classic"] {
  --bg: #FBF7F0;
  --fg: #2A2A2A;
  --accent: #C9A96E;
  --accent-2: #7A8B7A;
  --muted: rgba(42, 42, 42, 0.6);
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --particle-color: rgba(201, 169, 110, 0.5);
  --confetti-glyph: '❤';
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 4: Fill `css/theme-minions.css`**

File: `css/theme-minions.css`
```css
html[data-theme="minions"] {
  --bg: #FFD93D;
  --fg: #1A1A1A;
  --accent: #3A6EA5;
  --accent-2: #FFFFFF;
  --muted: rgba(26, 26, 26, 0.7);
  --font-display: 'Fredoka', system-ui, sans-serif;
  --font-body: 'Fredoka', system-ui, sans-serif;
  --particle-color: rgba(58, 110, 165, 0.4);
  --confetti-glyph: '🍌';
  --easing: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

- [ ] **Step 5: Add theme toggle button to `index.html`** (replace the placeholder section block)

In `index.html`, replace the `<main>` block with:
```html
<main id="app">
  <section class="placeholder">
    <h1>Site under construction</h1>
  </section>

  <button class="floating-btn floating-btn--right" data-theme-toggle aria-label="Toggle theme">
    <span aria-hidden="true">🍌</span>
  </button>
</main>
```

- [ ] **Step 6: Add floating button styles to `css/base.css`** (append at end of file)

```css
/* ---------- Floating buttons ---------- */
.floating-btn {
  position: fixed;
  bottom: clamp(1rem, 4vw, 1.5rem);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  font-size: 1.25rem;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 50;
  transition: transform 200ms var(--easing), background var(--transition);
}
.floating-btn--right { right: clamp(1rem, 4vw, 1.5rem); }
.floating-btn--left { left: clamp(1rem, 4vw, 1.5rem); }
.floating-btn:active { transform: scale(0.92); }
```

- [ ] **Step 7: Wire `js/main.js`** to init theme toggle

File: `js/main.js` (replace contents)
```js
import { initThemeToggle } from './theme.js';

function boot() {
  initThemeToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

- [ ] **Step 8: Verify in browser**

Run `python3 -m http.server 8000` and open `http://localhost:8000/`.
- Tap the 🍌 button bottom-right → background flips to bright yellow, font changes to Fredoka
- Refresh page → minion theme persists (no flash of ivory)
- Tap again → flips back to ivory/classic
- Check Application → Local Storage → `theme` key updates correctly

- [ ] **Step 9: Commit**

```bash
git add js/config.js js/theme.js css/theme-classic.css css/theme-minions.css index.html css/base.css js/main.js
git commit -m "feat: add theme system with classic and minions toggle"
```

---

## Task 4: Hero section (names, date, hero photo, gradient overlay)

**Files:**
- Create: `assets/photos/hero.svg` (placeholder)
- Modify: `index.html`
- Modify: `css/base.css`

- [ ] **Step 1: Create placeholder hero photo as SVG gradient**

File: `assets/photos/hero.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8DCC4"/>
      <stop offset="50%" stop-color="#C9A96E"/>
      <stop offset="100%" stop-color="#7A8B7A"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1200" fill="url(#g)"/>
  <text x="400" y="600" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="serif" font-size="48">[ hero photo ]</text>
</svg>
```

- [ ] **Step 2: Add hero section to `index.html`** (replace the placeholder section)

In `index.html`, replace the placeholder `<section class="placeholder">` with:
```html
<section class="hero" data-hero>
  <div class="hero__bg" aria-hidden="true">
    <img src="assets/photos/hero.svg" alt="" fetchpriority="high">
    <div class="hero__overlay"></div>
  </div>
  <div class="hero__content">
    <p class="hero__pre">Together with our families</p>
    <h1 class="hero__names" data-names>
      <span>Georgy</span>
      <span class="hero__amp">&amp;</span>
      <span>Chinnu</span>
    </h1>
    <p class="hero__date">Dec 1, 2025</p>
    <div class="hero__countdown" data-countdown>
      <!-- Filled in Task 5 -->
    </div>
  </div>
</section>
```

- [ ] **Step 3: Preload hero in `<head>`** of `index.html`

Add directly above the `<link rel="manifest">` line:
```html
<link rel="preload" as="image" href="assets/photos/hero.svg" fetchpriority="high">
```

- [ ] **Step 4: Add hero styles to `css/base.css`** (append at end)

```css
/* ---------- Hero ---------- */
.hero {
  position: relative;
  min-height: 100dvh;
  max-width: none;
  padding: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
}
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}
.hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.55) 100%
  );
}
.hero__content {
  text-align: center;
  color: #fff;
  padding: var(--pad);
  max-width: var(--max-width);
}
.hero__pre {
  font-family: var(--font-body);
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 1.5rem;
}
.hero__names {
  font-size: clamp(3rem, 14vw, 6rem);
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.hero__amp {
  font-style: italic;
  color: var(--accent);
  font-size: 0.7em;
}
.hero__date {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  margin-top: 1rem;
  opacity: 0.92;
  letter-spacing: 0.05em;
}
.hero__countdown {
  margin-top: 2rem;
}
```

- [ ] **Step 5: Verify in browser**

Reload `http://localhost:8000/`. Toggle DevTools mobile view (iPhone 12 Pro).
Expected:
- Full-viewport hero with gradient placeholder photo
- "Together with our families" small caps line, then "Georgy & Chinnu" in serif, then "Dec 1, 2025"
- White text legible against gradient overlay
- Theme toggle still works (text colors stay white, accent ampersand color updates)

- [ ] **Step 6: Commit**

```bash
git add assets/photos/hero.svg index.html css/base.css
git commit -m "feat: add hero section with names date and placeholder photo"
```

---

## Task 5: Countdown module (flip-style)

**Files:**
- Create: `js/countdown.js`
- Modify: `js/main.js`
- Modify: `css/base.css`
- Modify: `css/animations.css`

- [ ] **Step 1: Create `js/countdown.js`** with pure logic + DOM render

File: `js/countdown.js`
```js
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
```

- [ ] **Step 2: Add countdown styles to `css/base.css`** (append)

```css
/* ---------- Countdown ---------- */
.hero__countdown {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.5rem, 2vw, 1rem);
  max-width: 28rem;
  margin-inline: auto;
}
.cd__unit {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  padding: 0.75rem 0.25rem;
  text-align: center;
}
.cd__num {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 6vw, 2.25rem);
  font-weight: 600;
  line-height: 1;
  color: #fff;
  display: inline-block;
  transform-origin: 50% 100%;
}
.cd__label {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.7;
  color: #fff;
  margin-top: 0.5rem;
}
.cd__zero {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 5vw, 2rem);
  color: #fff;
  text-align: center;
}
```

- [ ] **Step 3: Add flip animation to `css/animations.css`**

File: `css/animations.css`
```css
@keyframes flip-in {
  0% { transform: rotateX(-90deg); opacity: 0; }
  100% { transform: rotateX(0); opacity: 1; }
}
.cd__num.flip {
  animation: flip-in 350ms var(--easing);
}
```

- [ ] **Step 4: Wire countdown in `js/main.js`**

File: `js/main.js` (replace contents)
```js
import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';

function boot() {
  initThemeToggle();
  initCountdown();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

- [ ] **Step 5: Quick logic test in browser console**

Open browser DevTools console at `http://localhost:8000/` and run:
```js
const m = await import('./js/countdown.js');
console.log(m.diff(0, 86400000)); // expect days:1, hours:0, minutes:0, seconds:0, done:false
console.log(m.diff(100, 100));    // expect days:0, hours:0, minutes:0, seconds:0, done:true
```

- [ ] **Step 6: Verify in browser**

Reload page. Expected:
- Four boxes: Days / Hours / Min / Sec, ticking every second
- Each second tick triggers the flip animation
- Theme toggle still works

- [ ] **Step 7: Commit**

```bash
git add js/countdown.js css/base.css css/animations.css js/main.js
git commit -m "feat: add live flip-style countdown to wedding date"
```

---

## Task 6: Entry overlay

**Files:**
- Create: `js/entry.js`
- Modify: `index.html`
- Modify: `css/base.css`
- Modify: `css/animations.css`
- Modify: `js/main.js`

- [ ] **Step 1: Create `js/entry.js`**

File: `js/entry.js`
```js
const SESSION_KEY = 'entry-shown';

export function initEntry() {
  const overlay = document.querySelector('[data-entry]');
  if (!overlay) return;

  if (sessionStorage.getItem(SESSION_KEY)) {
    overlay.remove();
    document.body.classList.remove('locked');
    return;
  }

  document.body.classList.add('locked');

  const dismiss = () => {
    overlay.classList.add('entry--out');
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('locked');
      sessionStorage.setItem(SESSION_KEY, '1');
      document.dispatchEvent(new CustomEvent('entry:dismissed'));
    }, 320);
  };

  overlay.addEventListener('click', dismiss, { once: true });
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismiss(); }
  });
  overlay.tabIndex = 0;
  overlay.focus();
}
```

- [ ] **Step 2: Add entry overlay markup to `index.html`** (place as the first child of `<body>`, before `<main id="app">`)

```html
<div class="entry" data-entry role="dialog" aria-label="Welcome">
  <div class="entry__particles" aria-hidden="true"></div>
  <div class="entry__card">
    <p class="entry__pre">You're invited 💌</p>
    <p class="entry__cta">Tap to enter</p>
  </div>
</div>
```

- [ ] **Step 3: Add entry styles to `css/base.css`** (append)

```css
/* ---------- Entry overlay ---------- */
body.locked { overflow: hidden; }
.entry {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--bg);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: opacity 320ms var(--easing);
}
.entry__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 20% 30%, var(--particle-color) 0, transparent 2px),
              radial-gradient(circle at 80% 60%, var(--particle-color) 0, transparent 2px),
              radial-gradient(circle at 50% 80%, var(--particle-color) 0, transparent 1px),
              radial-gradient(circle at 30% 70%, var(--particle-color) 0, transparent 1px);
  animation: drift 12s ease-in-out infinite;
  opacity: 0.7;
}
.entry__card {
  text-align: center;
  padding: 2rem;
  animation: card-in 600ms var(--easing) 100ms both;
}
.entry__pre {
  font-family: var(--font-display);
  font-size: clamp(2rem, 8vw, 3rem);
  color: var(--fg);
  margin-bottom: 1.5rem;
}
.entry__cta {
  font-family: var(--font-body);
  font-size: 0.95rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  display: inline-block;
  animation: pulse 2.4s ease-in-out infinite;
}
.entry--out { opacity: 0; pointer-events: none; }
```

- [ ] **Step 4: Add keyframes to `css/animations.css`** (append)

```css
@keyframes drift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.04); }
}
```

- [ ] **Step 5: Wire in `js/main.js`**

File: `js/main.js` (replace contents)
```js
import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';
import { initEntry } from './entry.js';

function boot() {
  initEntry();
  initThemeToggle();
  initCountdown();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

- [ ] **Step 6: Verify in browser**

Reload page (clear `sessionStorage` first via DevTools → Application → Storage → Clear site data, OR use a fresh incognito window).
Expected:
- Overlay shown immediately, page underneath not scrollable
- Tap → overlay fades out (320ms), hero appears
- Refresh page → overlay does NOT show again (sessionStorage flag set)
- Open new incognito window → overlay shows again

- [ ] **Step 7: Commit**

```bash
git add js/entry.js index.html css/base.css css/animations.css js/main.js
git commit -m "feat: add entry overlay with particle background"
```

---

## Task 7: Photos / carousel section

**Files:**
- Create: `assets/photos/01.svg` ... `06.svg` (six placeholders)
- Create: `js/carousel.js`
- Modify: `index.html`
- Modify: `css/base.css`

- [ ] **Step 1: Create six placeholder photo SVGs**

Run this script to create all six in one go:
```bash
for i in 1 2 3 4 5 6; do
  hue=$((i * 60))
  cat > assets/photos/0${i}.svg <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue}, 35%, 78%)"/>
      <stop offset="100%" stop-color="hsl(${hue}, 35%, 55%)"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#g${i})"/>
  <text x="300" y="400" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="serif" font-size="48">Photo ${i}</text>
</svg>
EOF
done
ls assets/photos/
```
Expected: `01.svg` through `06.svg` exist.

- [ ] **Step 2: Add photos section to `index.html`** (insert after the `</section>` closing the hero, before the floating button)

```html
<section class="story" data-section>
  <h2 class="story__title">Our Story</h2>

  <figure class="story__feature">
    <img src="assets/photos/01.svg" alt="" loading="lazy">
  </figure>

  <div class="carousel" data-carousel>
    <div class="carousel__track" data-carousel-track>
      <div class="carousel__slide"><img src="assets/photos/02.svg" alt="" loading="lazy"><figcaption></figcaption></div>
      <div class="carousel__slide"><img src="assets/photos/03.svg" alt="" loading="lazy"><figcaption></figcaption></div>
      <div class="carousel__slide"><img src="assets/photos/04.svg" alt="" loading="lazy"><figcaption></figcaption></div>
      <div class="carousel__slide"><img src="assets/photos/05.svg" alt="" loading="lazy"><figcaption></figcaption></div>
      <div class="carousel__slide"><img src="assets/photos/06.svg" alt="" loading="lazy"><figcaption></figcaption></div>
    </div>
    <div class="carousel__dots" data-carousel-dots></div>
  </div>
</section>
```

- [ ] **Step 3: Create `js/carousel.js`**

File: `js/carousel.js`
```js
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
```

- [ ] **Step 4: Add story + carousel styles to `css/base.css`** (append)

```css
/* ---------- Story / Photos ---------- */
.story__title {
  text-align: center;
  font-size: clamp(2rem, 6vw, 2.75rem);
  margin-bottom: 2rem;
  color: var(--fg);
}
.story__feature {
  margin-bottom: 2rem;
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: var(--accent-2);
}
.story__feature img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel { position: relative; }
.carousel__track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: 0.75rem;
  scroll-behavior: smooth;
}
.carousel__track::-webkit-scrollbar { display: none; }
.carousel__slide {
  flex: 0 0 100%;
  scroll-snap-align: center;
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: var(--accent-2);
  position: relative;
}
.carousel__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carousel__slide figcaption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  color: #fff;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.1rem;
}
.carousel__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.carousel__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--muted);
  opacity: 0.4;
  padding: 0;
  transition: opacity var(--transition), background var(--transition);
}
.carousel__dot.is-active {
  opacity: 1;
  background: var(--accent);
  transform: scale(1.3);
}
```

- [ ] **Step 5: Wire in `js/main.js`** (add import + call)

```js
import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';
import { initEntry } from './entry.js';
import { initCarousel } from './carousel.js';

function boot() {
  initEntry();
  initThemeToggle();
  initCountdown();
  initCarousel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

- [ ] **Step 6: Verify in browser**

Reload (clear sessionStorage). Dismiss entry overlay, scroll down.
Expected:
- "Our Story" heading
- Featured photo placeholder
- Five swipeable slides with captions ("Our first trip", "That day ❤️", "Sundays", "Coffee mornings", "Forever begins here")
- Dots below — active dot is gold (classic) / blue (minions)
- Swipe touch / arrow keys / dot clicks all work

- [ ] **Step 7: Commit**

```bash
git add assets/photos/ js/carousel.js index.html css/base.css js/main.js
git commit -m "feat: add story section with photo carousel"
```

---

## Task 8: Event Details section + maps button

**Files:**
- Create: `js/maps.js`
- Create: `assets/icons/church.svg`
- Modify: `index.html`
- Modify: `css/base.css`

- [ ] **Step 1: Create church icon**

File: `assets/icons/church.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 2 L13 4 L13 6 L15 6 L15 8 L13 8 L13 10 L18 13 L18 22 L14 22 L14 17 L10 17 L10 22 L6 22 L6 13 L11 10 L11 8 L9 8 L9 6 L11 6 L11 4 Z"/>
</svg>
```

- [ ] **Step 2: Create `js/maps.js`**

File: `js/maps.js`
```js
export function initMaps() {
  const link = document.querySelector('[data-maps-link]');
  if (!link) return;
  link.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(10);
  });
}
```

- [ ] **Step 3: Add Event Details section to `index.html`** (insert after the story section)

```html
<section class="event" data-section>
  <h2 class="event__title">When &amp; Where</h2>
  <div class="event__row">
    <p class="event__label">Date</p>
    <p class="event__value">Monday, December 1, 2025</p>
  </div>
  <div class="event__row">
    <p class="event__label">Time</p>
    <p class="event__value">10:00 AM IST</p>
  </div>
  <div class="event__row">
    <p class="event__label">Venue</p>
    <p class="event__value">
      <span class="event__church-icon" data-church-icon aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2 L13 4 L13 6 L15 6 L15 8 L13 8 L13 10 L18 13 L18 22 L14 22 L14 17 L10 17 L10 22 L6 22 L6 13 L11 10 L11 8 L9 8 L9 6 L11 6 L11 4 Z"/>
        </svg>
      </span>
      <span data-venue-name>TBD church name</span>
    </p>
  </div>
  <a class="btn btn--primary"
     href="https://maps.app.goo.gl/c1CVMrJhTMwCTkde9"
     target="_blank" rel="noopener"
     data-maps-link>
    Get Directions 🚗
  </a>
</section>
```

- [ ] **Step 4: Add event styles to `css/base.css`** (append)

```css
/* ---------- Event details ---------- */
.event__title {
  text-align: center;
  font-size: clamp(2rem, 6vw, 2.75rem);
  margin-bottom: 2rem;
  color: var(--fg);
}
.event__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 1rem 0;
  border-bottom: 1px solid var(--accent);
  border-bottom-color: color-mix(in srgb, var(--accent) 30%, transparent);
}
.event__label {
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
}
.event__value {
  font-family: var(--font-display);
  font-size: 1.15rem;
  text-align: right;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--fg);
}
.event__church-icon {
  color: var(--accent);
  display: inline-grid;
  place-items: center;
  cursor: pointer;
}

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.95rem 1.75rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: transform 200ms var(--easing), box-shadow var(--transition), background var(--transition);
  margin-top: 2rem;
  width: 100%;
  max-width: 22rem;
  margin-inline: auto;
}
.btn--primary {
  background: var(--accent);
  color: var(--bg);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 35%, transparent);
}
.btn--primary:active { transform: scale(0.97); }
.event { display: flex; flex-direction: column; }
```

- [ ] **Step 5: Wire in `js/main.js`** (add import + call)

```js
import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';
import { initEntry } from './entry.js';
import { initCarousel } from './carousel.js';
import { initMaps } from './maps.js';

function boot() {
  initEntry();
  initThemeToggle();
  initCountdown();
  initCarousel();
  initMaps();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

- [ ] **Step 6: Verify in browser**

Reload, scroll past photos.
Expected:
- "When & Where" heading, three rows (Date, Time, Venue with church icon)
- Large "Get Directions 🚗" button — tap opens `https://maps.app.goo.gl/c1CVMrJhTMwCTkde9` in new tab
- On mobile (real device or emulated), the link opens Google Maps app via Google's universal-link routing

- [ ] **Step 7: Commit**

```bash
git add assets/icons/church.svg js/maps.js index.html css/base.css js/main.js
git commit -m "feat: add event details section with maps deeplink"
```

---

## Task 9: Contact section (tap-to-call)

**Files:**
- Modify: `index.html`
- Modify: `css/base.css`

- [ ] **Step 1: Add contact section to `index.html`** (insert after event section)

```html
<section class="contact" data-section>
  <h2 class="contact__title">Need help finding us?</h2>
  <p class="contact__sub">Reach out to my sister</p>
  <a class="contact__card" href="tel:+918078135442" aria-label="Call Anna">
    <span class="contact__name">Anna</span>
    <span class="contact__phone">+91 80781 35442</span>
    <span class="contact__cta">Tap to call 📞</span>
  </a>
</section>
```

- [ ] **Step 2: Add contact styles to `css/base.css`** (append)

```css
/* ---------- Contact ---------- */
.contact { text-align: center; }
.contact__title {
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  margin-bottom: 0.5rem;
  color: var(--fg);
}
.contact__sub {
  color: var(--muted);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.contact__card {
  display: block;
  padding: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--accent) 6%, transparent);
  transition: transform 200ms var(--easing), background var(--transition);
}
.contact__card:active { transform: scale(0.98); }
.contact__name {
  display: block;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--fg);
  margin-bottom: 0.25rem;
}
.contact__phone {
  display: block;
  font-size: 1.1rem;
  color: var(--accent);
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}
.contact__cta {
  display: inline-block;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
}
```

- [ ] **Step 3: Verify in browser**

Reload, scroll to bottom area.
Expected:
- "Need help finding us?" heading + "Reach out to my sister" subtitle
- Card showing "Anna / +91 80781 35442 / Tap to call 📞"
- On mobile real device: tapping opens phone dialer prefilled with the number
- On desktop: tapping prompts default tel-handler (FaceTime/Skype/etc.) — that's expected

- [ ] **Step 4: Commit**

```bash
git add index.html css/base.css
git commit -m "feat: add contact section with tap-to-call"
```

---

## Task 10: Share section + WhatsApp share

**Files:**
- Create: `js/share.js`
- Modify: `index.html`
- Modify: `css/base.css`
- Modify: `js/main.js`

- [ ] **Step 1: Create `js/share.js`**

File: `js/share.js`
```js
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
```

- [ ] **Step 2: Add share section to `index.html`** (insert after contact)

```html
<section class="share" data-section>
  <h2 class="share__title">Share the joy</h2>
  <p class="share__sub">Pass it along to family &amp; friends</p>
  <button class="btn btn--primary" data-share>
    Share on WhatsApp
  </button>
</section>
```

- [ ] **Step 3: Add share styles to `css/base.css`** (append)

```css
/* ---------- Share ---------- */
.share { text-align: center; }
.share__title {
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  margin-bottom: 0.5rem;
  color: var(--fg);
}
.share__sub {
  color: var(--muted);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
```

- [ ] **Step 4: Wire in `js/main.js`**

```js
import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';
import { initEntry } from './entry.js';
import { initCarousel } from './carousel.js';
import { initMaps } from './maps.js';
import { initShare } from './share.js';

function boot() {
  initEntry();
  initThemeToggle();
  initCountdown();
  initCarousel();
  initMaps();
  initShare();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

- [ ] **Step 5: Verify message format in console**

Open `http://localhost:8000/`, in DevTools console:
```js
const m = await import('./js/share.js');
console.log(m.buildMessage());
console.log(m.whatsappUrl(m.buildMessage()));
```
Expected message text:
```
Georgy & Chinnu's Wedding 💍

Dec 1, 2025

Join us ❤️

https://georgyandchinnu.com
```
Expected URL: starts with `https://wa.me/?text=Georgy%20%26%20Chinnu%E2%80%99s...`

- [ ] **Step 6: Verify in browser**

Reload, scroll to share section, tap "Share on WhatsApp".
Expected:
- Desktop: opens `https://wa.me/?text=...` (WhatsApp Web prompts to send)
- Mobile w/ navigator.share: native share sheet appears
- Mobile w/o navigator.share: opens WhatsApp app with prefilled message

- [ ] **Step 7: Commit**

```bash
git add js/share.js index.html css/base.css js/main.js
git commit -m "feat: add whatsapp share with native fallback"
```

---

## Task 11: Music toggle + footer + boot wiring

**Files:**
- Create: `js/music.js`
- Create: `assets/audio/song.mp3` (silent placeholder)
- Modify: `index.html`
- Modify: `css/base.css`
- Modify: `js/main.js`

- [ ] **Step 1: Generate a 1-second silent MP3 placeholder**

Requires `ffmpeg`. If not installed: `brew install ffmpeg` (macOS) before continuing.
```bash
ffmpeg -y -f lavfi -i anullsrc=r=22050:cl=mono -t 1 -q:a 9 -acodec libmp3lame assets/audio/song.mp3
ls -la assets/audio/song.mp3
```
Expected: file exists, ~1-3 KB. (Real song will be swapped in later — same filename, no code change needed.)

- [ ] **Step 2: Create `js/music.js`**

File: `js/music.js`
```js
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
      audio.play().catch(() => { /* placeholder or autoplay block — visual state still flips */ });
    } else {
      audio.pause();
    }
    if (navigator.vibrate) navigator.vibrate(10);
  });
}
```

- [ ] **Step 3: Add music button + footer + audio element to `index.html`** (insert after the share section, before the floating theme button)

Replace the `<button class="floating-btn floating-btn--right" ...>` block and the closing `</main>` tags with:
```html
  <footer class="footer">
    <p>Made with ❤️</p>
  </footer>

  <audio data-music-audio src="assets/audio/song.mp3" preload="none"></audio>

  <button class="floating-btn floating-btn--left" data-music-toggle aria-label="Toggle music" aria-pressed="false">
    <span class="music-icon" aria-hidden="true">🎶</span>
  </button>

  <button class="floating-btn floating-btn--right" data-theme-toggle aria-label="Toggle theme">
    <span aria-hidden="true">🍌</span>
  </button>
</main>
```

- [ ] **Step 4: Add footer + music styles to `css/base.css`** (append)

```css
/* ---------- Footer ---------- */
.footer {
  text-align: center;
  padding: 2.5rem var(--pad);
  font-size: 0.85rem;
  color: var(--muted);
}

/* ---------- Music button playing state ---------- */
.floating-btn[data-music-toggle].is-playing {
  animation: pulse 1.6s ease-in-out infinite;
}
.floating-btn[data-music-toggle].is-playing .music-icon {
  display: inline-block;
  animation: spin-slow 6s linear infinite;
}
```

- [ ] **Step 5: Add `spin-slow` keyframes to `css/animations.css`** (append)

```css
@keyframes spin-slow {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
```

- [ ] **Step 6: Wire in `js/main.js`** (add import + call)

```js
import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';
import { initEntry } from './entry.js';
import { initCarousel } from './carousel.js';
import { initMaps } from './maps.js';
import { initShare } from './share.js';
import { initMusic } from './music.js';

function boot() {
  initEntry();
  initThemeToggle();
  initCountdown();
  initCarousel();
  initMaps();
  initShare();
  initMusic();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

- [ ] **Step 7: Verify in browser**

Reload page, dismiss entry, scroll all the way down.
Expected:
- "Made with ❤️" footer line
- Music 🎶 button bottom-left, theme 🍌 button bottom-right (both fixed, visible while scrolling)
- Tap music → button pulses + icon spins (silent audio, but no errors in console)
- Tap again → pulse stops
- Tap theme toggle → palette switches; both buttons re-tint to new accent color

- [ ] **Step 8: Commit**

```bash
git add js/music.js assets/audio/song.mp3 index.html css/base.css css/animations.css js/main.js
git commit -m "feat: add music toggle and footer with floating buttons"
```

---

## Task 12: Section fade-ins + button ripple + reduced-motion polish

**Files:**
- Modify: `js/main.js`
- Modify: `css/animations.css`
- Modify: `css/base.css`

- [ ] **Step 1: Add IntersectionObserver-based fade-in helper to `js/main.js`**

Replace `js/main.js` with:
```js
import { initThemeToggle } from './theme.js';
import { initCountdown } from './countdown.js';
import { initEntry } from './entry.js';
import { initCarousel } from './carousel.js';
import { initMaps } from './maps.js';
import { initShare } from './share.js';
import { initMusic } from './music.js';

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
```

- [ ] **Step 2: Add fade-in + ripple styles to `css/animations.css`** (append)

```css
/* ---------- Section fade-ins ---------- */
[data-section] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms var(--easing), transform 600ms var(--easing);
}
[data-section].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- Button ripple ---------- */
.btn, .floating-btn, .contact__card { position: relative; overflow: hidden; }
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0);
  animation: ripple 600ms ease-out;
  pointer-events: none;
}
@keyframes ripple {
  to { transform: scale(2.5); opacity: 0; }
}
```

- [ ] **Step 3: Verify in browser**

Reload, dismiss entry, slowly scroll down.
Expected:
- Each section fades + slides up into view as you scroll past 15% of it
- Tapping any button shows a brief expanding ripple from tap origin
- Enable "Emulate prefers-reduced-motion" in DevTools rendering panel → animations damp to ~100ms, no perpetual drift

- [ ] **Step 4: Commit**

```bash
git add js/main.js css/animations.css
git commit -m "feat: add section fade-ins and button ripples"
```

---

## Task 13: Easter-egg infrastructure (particle utility + module skeleton)

**Files:**
- Create: `js/particles.js`
- Create: `js/easter-eggs.js`
- Modify: `js/main.js`
- Modify: `css/animations.css`

- [ ] **Step 1: Create `js/particles.js`** — reusable particle/confetti engine

File: `js/particles.js`
```js
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
```

- [ ] **Step 2: Add particle styles to `css/animations.css`** (append)

```css
/* ---------- Particles / confetti ---------- */
#particles-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 200;
  overflow: hidden;
}
.particle {
  position: absolute;
  display: inline-block;
  will-change: transform, opacity;
  animation: particle var(--life, 1000ms) cubic-bezier(0.2, 0.7, 0.4, 1) forwards;
  user-select: none;
}
@keyframes particle {
  0%   { transform: translate(0, 0) rotate(0); opacity: 1; }
  100% { transform: translate(var(--vx, 0), var(--vy, 0)) rotate(var(--rotate, 360deg)); opacity: 0; }
}
```

- [ ] **Step 3: Create `js/easter-eggs.js`** with skeleton

File: `js/easter-eggs.js`
```js
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

// Re-export helpers so per-egg modules can import from one place
export { burstAt, rainConfetti, fireworksAt, CONFIG, hasUserToggled };
```

- [ ] **Step 4: Wire in `js/main.js`** (replace contents — keeps prior fade-in + ripple bodies, adds easter eggs init)

File: `js/main.js`
```js
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
```

- [ ] **Step 5: Verify in console**

Open `http://localhost:8000/`, in DevTools console:
```js
const p = await import('./js/particles.js');
p.burstAt(window.innerWidth / 2, window.innerHeight / 2, 16);
p.rainConfetti();
```
Expected: hearts (classic) or bananas (minions) burst from center / rain from top of screen and fade out.

- [ ] **Step 6: Commit**

```bash
git add js/particles.js js/easter-eggs.js css/animations.css js/main.js
git commit -m "feat: add particle engine and easter egg registry"
```

---

## Task 14: Easter egg #1 — tap names → heart burst

**Files:**
- Modify: `js/easter-eggs.js`

- [ ] **Step 1: Append the egg registration to `js/easter-eggs.js`** (add at end of file, before the export-helpers line)

```js
// #1 — Tap names → heart burst
registerEgg(() => {
  const names = document.querySelector('[data-names]');
  if (!names) return;
  names.addEventListener('click', (e) => {
    burstAt(e.clientX, e.clientY, 14);
    if (navigator.vibrate) navigator.vibrate(8);
  });
});
```

- [ ] **Step 2: Verify in browser**

Reload, dismiss entry, tap on "Georgy & Chinnu" names.
Expected: hearts burst outward from tap point, fade after ~1s.
Toggle to minions theme → tap again → bananas burst instead.

- [ ] **Step 3: Commit**

```bash
git add js/easter-eggs.js
git commit -m "feat: easter egg 1 - tap names triggers heart burst"
```

---

## Task 15: Easter egg #2 — long-press hero → hidden message

**Files:**
- Modify: `js/easter-eggs.js`
- Modify: `css/base.css`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
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
```

- [ ] **Step 2: Add toast styles to `css/base.css`** (append)

```css
/* ---------- Hidden message tooltip ---------- */
.hidden-msg {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.1rem;
  padding: 0.85rem 1.25rem;
  border-radius: 0.75rem;
  max-width: 80%;
  text-align: center;
  opacity: 0;
  transition: opacity 300ms, transform 300ms;
  z-index: 10;
}
.hidden-msg.is-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
```

- [ ] **Step 3: Verify in browser**

Reload, dismiss entry. On the hero, press and hold (mouse: click and hold; mobile emulation: long-tap) for 500ms.
Expected: dark tooltip appears at bottom of hero with text *"From the day we met, it was always you ❤️"*. Fades after 3s.

- [ ] **Step 4: Commit**

```bash
git add js/easter-eggs.js css/base.css
git commit -m "feat: easter egg 2 - long press hero reveals message"
```

---

## Task 16: Easter egg #3 — confetti at footer scroll

**Files:**
- Modify: `js/easter-eggs.js`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
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
```

- [ ] **Step 2: Verify in browser**

Reload, dismiss entry, scroll all the way down to the footer.
Expected: confetti (hearts in classic, bananas in minions) rains from top of screen as the footer enters view. Fires only once per page load.

- [ ] **Step 3: Commit**

```bash
git add js/easter-eggs.js
git commit -m "feat: easter egg 3 - confetti rain on footer reach"
```

---

## Task 17: Easter egg #4 — countdown reaches zero state

**Files:**
- Modify: `js/easter-eggs.js`

(Note: the countdown module already dispatches `countdown:zero` and renders the "Today is the day" string. This task adds the auto-confetti hook.)

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
// #4 — Countdown hits 0 → auto-confetti
registerEgg(() => {
  document.addEventListener('countdown:zero', () => {
    rainConfetti({ count: 80 });
    setTimeout(() => rainConfetti({ count: 80 }), 800);
  });
});
```

- [ ] **Step 2: Verify in browser**

Open DevTools console at `http://localhost:8000/` (with entry dismissed) and dispatch the event manually:
```js
document.dispatchEvent(new CustomEvent('countdown:zero'));
```
Expected: two waves of confetti rain from top.

Also temporarily test the full path by editing `CONFIG.date` in `js/config.js` to a date 5 seconds from now, reload, watch countdown reach zero → "Today is the day 🎉" appears + confetti fires. **Revert the date back to `'2025-12-01T10:00:00+05:30'` after testing.**

- [ ] **Step 3: Commit**

```bash
git add js/easter-eggs.js
git commit -m "feat: easter egg 4 - confetti when countdown hits zero"
```

---

## Task 18: Easter egg #5 — Konami tap pattern → particle rain

**Files:**
- Modify: `js/easter-eggs.js`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
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
```

- [ ] **Step 2: Verify in browser**

Reload, dismiss entry. Tap in this order, each tap within 5s of the last:
1. Top-left corner
2. Top-right corner
3. Bottom-left corner
4. Bottom-right corner
5. Center of screen

Expected: heavy particle rain triggered after the fifth tap. (Easier to test in mobile DevTools view.)

- [ ] **Step 3: Commit**

```bash
git add js/easter-eggs.js
git commit -m "feat: easter egg 5 - konami tap pattern triggers rain"
```

---

## Task 19: Easter egg #6 — tap names 3× (Minions only) → BELLO bubble

**Files:**
- Modify: `js/easter-eggs.js`
- Modify: `css/base.css`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
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
```

- [ ] **Step 2: Add speech bubble styles to `css/base.css`** (append)

```css
/* ---------- Speech bubble ---------- */
.hero__names { position: relative; }
.speech-bubble {
  position: absolute;
  top: -3rem;
  left: 50%;
  transform: translate(-50%, 8px) scale(0.9);
  background: #fff;
  color: #1a1a1a;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 200ms, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #fff;
  border-bottom: 0;
}
.speech-bubble.is-visible {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}
```

- [ ] **Step 3: Verify in browser**

Reload, toggle to minions theme (🍌 button). Tap names rapidly 3 times.
Expected: white speech bubble pops up above the names: "BELLO! 👋", visible ~1.8s.
Switch back to classic and try again — bubble should NOT appear (egg is Minions-only).

- [ ] **Step 4: Commit**

```bash
git add js/easter-eggs.js css/base.css
git commit -m "feat: easter egg 6 - bello speech bubble in minions mode"
```

---

## Task 20: Easter egg #7 — triple-tap hero (Minions) → po-ta-to toast

**Files:**
- Modify: `js/easter-eggs.js`
- Modify: `css/base.css`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
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
```

- [ ] **Step 2: Add toast styles to `css/base.css`** (append)

```css
/* ---------- Toast ---------- */
.toast {
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translate(-50%, 10px);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  opacity: 0;
  transition: opacity 250ms, transform 250ms;
  z-index: 150;
  pointer-events: none;
}
.toast.is-visible {
  opacity: 1;
  transform: translate(-50%, 0);
}
```

- [ ] **Step 3: Verify in browser**

Reload, switch to minions theme. Triple-tap on the hero (anywhere outside the names that already react to single taps — easiest: triple-tap the date or pre-text).
Expected: dark toast pill appears above the music button: "po-ta-to 🥔", visible ~2s.

- [ ] **Step 4: Commit**

```bash
git add js/easter-eggs.js css/base.css
git commit -m "feat: easter egg 7 - po-ta-to toast in minions mode"
```

---

## Task 21: Easter egg #8 — long-press 🍌 toggle (Minions) → banana fireworks

**Files:**
- Modify: `js/easter-eggs.js`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
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
```

- [ ] **Step 2: Verify in browser**

Reload, toggle to minions theme. Press and hold the 🍌 toggle for 2 seconds (don't release early).
Expected: ring of bananas explodes outward from the button.
In classic mode → long-press does nothing (theme-gated).

⚠️ Note: a normal short tap on the toggle still flips theme as before. If accidental flip-then-fireworks happens, that's fine — the egg only fires in minions mode anyway.

- [ ] **Step 3: Commit**

```bash
git add js/easter-eggs.js
git commit -m "feat: easter egg 8 - banana fireworks on long press"
```

---

## Task 22: Easter egg #9 — triple-tap church icon (Classic) → dove flies

**Files:**
- Modify: `js/easter-eggs.js`
- Modify: `css/animations.css`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
// #9 — Triple-tap church icon (Classic only) → dove flies across
registerEgg(() => {
  const icon = document.querySelector('[data-church-icon]');
  if (!icon) return;
  let taps = [];

  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    if (document.documentElement.getAttribute('data-theme') !== 'classic') return;
    const now = Date.now();
    taps = taps.filter(t => now - t < 1000);
    taps.push(now);
    if (taps.length >= 3) {
      taps = [];
      const dove = document.createElement('div');
      dove.className = 'dove';
      dove.innerHTML = `
        <svg viewBox="0 0 64 64" width="64" height="64" fill="#fff" stroke="rgba(0,0,0,0.2)" stroke-width="1">
          <path d="M8 36 Q20 18 36 26 L48 16 L46 28 L56 32 L44 36 L36 50 Q22 52 14 44 Z"/>
          <circle cx="40" cy="24" r="2" fill="#000"/>
        </svg>
      `;
      document.body.appendChild(dove);
      setTimeout(() => dove.remove(), 3500);
    }
  });
});
```

- [ ] **Step 2: Add dove styles to `css/animations.css`** (append)

```css
/* ---------- Dove ---------- */
.dove {
  position: fixed;
  top: 30%;
  left: -80px;
  z-index: 180;
  pointer-events: none;
  animation: fly 3.2s linear forwards;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}
@keyframes fly {
  0%   { transform: translate(0, 0) rotate(-4deg); opacity: 0; }
  10%  { opacity: 1; }
  50%  { transform: translate(50vw, -40px) rotate(2deg); }
  90%  { opacity: 1; }
  100% { transform: translate(110vw, -10px) rotate(-2deg); opacity: 0; }
}
```

- [ ] **Step 3: Verify in browser**

Reload (classic theme). Scroll to Event Details. Triple-tap the church icon next to the venue name.
Expected: a small dove SVG flies left-to-right across the upper third of the screen, about 3 seconds.
In minions mode → no dove (theme-gated).

- [ ] **Step 4: Commit**

```bash
git add js/easter-eggs.js css/animations.css
git commit -m "feat: easter egg 9 - dove flies on triple tap church"
```

---

## Task 23: Easter egg #10 — music button pulses past 50% scroll

**Files:**
- Modify: `js/easter-eggs.js`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
// #10 — Past 50% scroll → music button pulses once (only if untouched)
registerEgg(() => {
  const btn = document.querySelector('[data-music-toggle]');
  if (!btn) return;
  let pulsed = false;

  function onScroll() {
    if (pulsed || hasUserToggled()) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = window.scrollY / max;
    if (pct >= 0.5) {
      pulsed = true;
      btn.classList.add('hint-pulse');
      setTimeout(() => btn.classList.remove('hint-pulse'), 1600);
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
});
```

- [ ] **Step 2: Add hint-pulse style to `css/animations.css`** (append)

```css
.floating-btn.hint-pulse {
  animation: hint-pulse 1.6s ease-in-out 1;
}
@keyframes hint-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15); }
  50% { transform: scale(1.18); box-shadow: 0 8px 24px var(--accent); }
}
```

- [ ] **Step 3: Verify in browser**

Reload (clear sessionStorage). Dismiss entry. **Don't** tap the music button. Slowly scroll past 50% of the page.
Expected: music 🎶 button pulses once (~1.6s) when crossing 50%.
Reload again, this time tap the music button BEFORE scrolling, then scroll past 50% → button does NOT pulse (the user already discovered it).

- [ ] **Step 4: Commit**

```bash
git add js/easter-eggs.js css/animations.css
git commit -m "feat: easter egg 10 - music hint pulse past midpoint"
```

---

## Task 24: Easter egg #11 — idle 30s → tiny floating heart

**Files:**
- Modify: `js/easter-eggs.js`
- Modify: `css/animations.css`

- [ ] **Step 1: Append the egg to `js/easter-eggs.js`**

```js
// #11 — Idle 30s → tiny floating heart drifts up
registerEgg(() => {
  let timer;
  function reset() {
    clearTimeout(timer);
    timer = setTimeout(spawn, 30000);
  }
  function spawn() {
    const heart = document.createElement('span');
    heart.className = 'idle-heart';
    heart.textContent = document.documentElement.getAttribute('data-theme') === 'minions' ? '🍌' : '❤';
    heart.style.left = `${10 + Math.random() * 80}%`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
    reset();
  }
  ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(ev => {
    window.addEventListener(ev, reset, { passive: true });
  });
  reset();
});
```

- [ ] **Step 2: Add idle-heart styles to `css/animations.css`** (append)

```css
.idle-heart {
  position: fixed;
  bottom: -2rem;
  font-size: 1.5rem;
  pointer-events: none;
  z-index: 180;
  opacity: 0;
  animation: float-up 6s ease-out forwards;
  color: var(--accent);
}
@keyframes float-up {
  0%   { transform: translateY(0); opacity: 0; }
  15%  { opacity: 0.85; }
  100% { transform: translateY(-110vh); opacity: 0; }
}
```

- [ ] **Step 3: Verify in browser**

Reload, dismiss entry. Don't touch anything for 30 seconds (use a timer if you need).
Expected: small heart (or banana in Minions) drifts up from the bottom of the screen, fading as it rises.
Repeats every 30s of idle time.
Touching anything resets the timer.

To speed up testing, temporarily change `30000` to `3000` in the egg, verify, then revert.

- [ ] **Step 4: Commit**

```bash
git add js/easter-eggs.js css/animations.css
git commit -m "feat: easter egg 11 - idle floating heart"
```

---

## Task 25: Performance, accessibility, final polish

**Files:**
- Modify: `index.html`
- Modify: `css/base.css`

- [ ] **Step 1: Confirm hero preload + image hints in `index.html`**

Verify `<head>` already has (from Task 4):
```html
<link rel="preload" as="image" href="assets/photos/hero.svg" fetchpriority="high">
```

Confirm hero `<img>` has `fetchpriority="high"` (it does, from Task 4 step 2).

- [ ] **Step 2: Add `aria-label`s, lang, and skip link** to `index.html`

In `<body>` directly after `<body>`:
```html
<a class="skip-link" href="#app">Skip to content</a>
```

- [ ] **Step 3: Add skip-link styles + focus states to `css/base.css`** (append)

```css
/* ---------- Accessibility ---------- */
.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  background: var(--accent);
  color: var(--bg);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  z-index: 1000;
  transition: top 200ms;
}
.skip-link:focus { top: 1rem; outline: 2px solid var(--fg); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
```

- [ ] **Step 4: Run a Lighthouse audit (optional but recommended)**

In Chrome DevTools, open Lighthouse panel, run a Mobile audit on `http://localhost:8000/`.
Targets:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 90

Note any warnings; fix obvious ones (missing labels, contrast issues).

- [ ] **Step 5: Verify reduced motion respect**

In DevTools Rendering panel, set "Emulate CSS prefers-reduced-motion" to `reduce`. Reload.
Expected: no perpetual pulse on entry button, no drifting particles in entry overlay, all transitions clamp to ~100ms. Easter eggs still trigger but feel subdued.

- [ ] **Step 6: Verify keyboard navigation**

Reload, dismiss entry. Press Tab repeatedly.
Expected: focus moves through skip link → carousel → "Get Directions" → contact card → "Share on WhatsApp" → music button → theme toggle. Every focused element has a visible outline ring.

- [ ] **Step 7: Commit**

```bash
git add index.html css/base.css
git commit -m "feat: add skip link focus rings and a11y polish"
```

---

## Task 26: Final smoke test, GitHub repo, deploy

**Files:**
- (no code changes — verification + deploy only)

- [ ] **Step 1: Run the full smoke checklist locally**

Restart server: `python3 -m http.server 8000`. Use Chrome DevTools mobile emulation (iPhone 12 Pro). Clear `sessionStorage` first.

- [ ] Entry overlay shows; tap dismisses; refresh keeps it dismissed in same tab
- [ ] Hero photo placeholder fills viewport; names + date + countdown legible
- [ ] Countdown ticks every second
- [ ] Carousel: swipe works; dot indicators sync; arrow keys navigate on desktop
- [ ] Get Directions opens Maps app on mobile / new tab on desktop
- [ ] Tap-to-call card prompts dialer on mobile
- [ ] Share on WhatsApp shows native share sheet (mobile) or opens wa.me (desktop) — message format exactly matches spec
- [ ] Music toggle plays/pauses (silent placeholder); button pulses while playing
- [ ] Theme toggle switches to Minions; reload preserves; toggle back to Classic; reload preserves
- [ ] Egg #1: tap names → hearts/bananas burst
- [ ] Egg #2: long-press hero → hidden message tooltip
- [ ] Egg #3: scroll to footer → confetti rain (once)
- [ ] Egg #4: `document.dispatchEvent(new CustomEvent('countdown:zero'))` from console → confetti rain
- [ ] Egg #5: Konami pattern (TL→TR→BL→BR→C within 5s) → particle rain
- [ ] Egg #6 (Minions only): tap names 3× → "BELLO! 👋" bubble
- [ ] Egg #7 (Minions only): triple-tap hero → "po-ta-to 🥔" toast
- [ ] Egg #8 (Minions only): long-press 🍌 toggle 2s → banana fireworks
- [ ] Egg #9 (Classic only): triple-tap church icon → dove flies
- [ ] Egg #10: scroll past 50% without tapping music → music button pulses once
- [ ] Egg #11: idle 30s → floating heart drifts up
- [ ] All sections fade in on scroll
- [ ] Buttons show ripple on tap
- [ ] No console errors

- [ ] **Step 2: Confirm bundle size targets are met**

```bash
du -sh css/ js/
ls -lh assets/photos/ assets/icons/ assets/audio/
```
Expected:
- All CSS < 20 KB combined
- All JS < 30 KB combined
- Each photo placeholder is small (< 1 KB SVG)
- Audio placeholder is small (a few KB)

- [ ] **Step 3: Check git history is clean**

```bash
git status
git log --oneline
```
Expected: clean working tree, all 25 prior commits visible, no uncommitted changes.

- [ ] **Step 4: Create the GitHub repo and push** (user-driven — these commands need their account/auth)

```bash
gh repo create georgyjose007/georgy-weds-chinnu --public --source=. --remote=origin --push
```

If `gh` is not installed, do this manually:
```bash
git remote add origin https://github.com/georgyjose007/georgy-weds-chinnu.git
git branch -M main
git push -u origin main
```

- [ ] **Step 5: Enable GitHub Pages**

In the repo's Settings → Pages:
- Source: **Deploy from a branch**
- Branch: **main** / **/ (root)**
- Custom domain: `georgyandchinnu.com` (the `CNAME` file already commits this)
- Wait for the green check, then visit `https://georgyandchinnu.com` (DNS must point at GitHub Pages — `185.199.108.153` etc., or a CNAME to `georgyjose007.github.io`).

- [ ] **Step 6: Production smoke test**

Visit `https://georgyandchinnu.com` on a real phone.
Re-run the checklist from Step 1.
Confirm WhatsApp share opens the WhatsApp app (not the browser fallback) on a real phone.

- [ ] **Step 7: Final commit if any production-only fixes were needed**

If anything was tweaked: commit and push. Otherwise nothing to do.

---

## Self-review checklist (engineer should run before declaring done)

- [ ] Every spec section has at least one corresponding task in this plan (verified at write time — see mapping below)
- [ ] No "TODO", "TBD", "fill later", "similar to above" left in the implementation
- [ ] All 11 easter eggs work as described in the spec
- [ ] Theme toggle persists across reload with no flash of wrong theme
- [ ] WhatsApp message format exactly matches spec, including the trailing URL
- [ ] Reduced motion is respected
- [ ] Keyboard navigation works
- [ ] No console errors on production URL

### Spec → Plan mapping

| Spec section | Implemented in |
|---|---|
| Tech & deployment | Task 1 (scaffolding), Task 26 (push + GH Pages) |
| File structure | Tasks 1, 2, 3, 5, 6, 7, 8, 10, 11, 13 |
| Configuration | Task 3 |
| Page sections — Entry | Task 6 |
| Page sections — Hero | Task 4 |
| Page sections — Story/Photos | Task 7 |
| Page sections — Event Details | Task 8 |
| Page sections — Contact | Task 9 |
| Page sections — Share | Task 10 |
| Page sections — Footer | Task 11 |
| Floating UI (music + theme) | Tasks 3, 11 |
| Themes (classic + minions, persistence, no flash) | Task 3 |
| Easter eggs 1-11 | Tasks 14-24 (one each) |
| Maps deeplink | Task 8 |
| Music | Task 11 |
| WhatsApp share | Task 10 |
| Premium polish (smooth scroll, fade-ins, ripple, haptics, reduced motion, a11y) | Tasks 12, 25 |
| Performance targets | Task 25 (verify), enforced by Tasks 1-11 (no bundler, lazy images, font swap) |
| PWA-lite (manifest, apple-touch) | Task 1, Task 2 |
| Boot sequence | Task 11 (final main.js) + Task 13 (easter eggs init) |
| Acceptance criteria | Task 26 (smoke test checklist) |
