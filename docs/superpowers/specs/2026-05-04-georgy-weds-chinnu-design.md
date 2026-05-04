# Georgy & Chinnu Wedding Site — Design

**Date:** 2026-05-04
**Owner:** Georgy Jose
**Status:** Approved for implementation

## Goal

A single-page mobile-first wedding invitation website for Georgy & Chinnu, hosted on GitHub Pages. Polished, premium feel with playful Minions easter eggs. Visitors should be able to:

- See wedding date, time, and venue at a glance
- Get directions to the church in one tap (universal Google Maps link)
- View photos and a live countdown to the wedding
- Share to WhatsApp with a prefilled message
- Reach the family contact (Anna, sister) via tap-to-call
- Toggle between an elegant Christian-traditional theme and a playful Minions theme — choice persists across visits

## Non-goals

- RSVP / form submission (no backend)
- Multi-page routing
- CMS / dynamic content (everything ships in the bundle)
- Build step or framework (kept intentionally vanilla)

## Tech & deployment

- **Stack:** Plain HTML + CSS + vanilla JavaScript. No framework, no bundler, no build step.
- **Repo location:** `/Users/georgyjose/Projects/georgy-weds-chinnu`
- **Hosting:** GitHub Pages, default repo URL `https://georgyjose007.github.io/georgy-weds-chinnu/`. Custom domain to be wired later — share URL lives in one config constant.
- **Deploy flow:** push to `main`; GitHub Pages serves `index.html` from repo root. Include `.nojekyll` so Pages doesn't strip underscored files.
- **Mobile-first** with responsive breakpoints up to desktop.

## File structure

```
georgy-weds-chinnu/
├── index.html
├── .nojekyll
├── manifest.json              # PWA basics (homescreen icon, theme color)
├── README.md
├── css/
│   ├── base.css               # CSS reset, custom properties, typography, layout primitives
│   ├── theme-classic.css      # Christian Traditional palette + decorations (default)
│   ├── theme-minions.css      # Minions palette + decorations
│   └── animations.css         # Keyframes, transitions, scroll fade-ins
├── js/
│   ├── config.js              # Single source of truth: names, date, URLs, contact
│   ├── theme.js               # Toggle handler + localStorage + early-paint helper
│   ├── countdown.js           # Flip-style countdown + "Today is the day" state
│   ├── entry.js               # Entry overlay show/hide
│   ├── carousel.js            # Swipeable photo carousel (touch + keyboard)
│   ├── maps.js                # Maps deeplink (mostly an <a>, JS just adds analytics-free haptic)
│   ├── share.js               # WhatsApp share intent
│   ├── music.js               # Play/pause toggle + pulse-when-playing state
│   ├── easter-eggs.js         # All 11 easter eggs registered here
│   └── main.js                # Boot sequence, IntersectionObserver, init order
└── assets/
    ├── photos/
    │   ├── hero.webp          # Placeholder until real photo provided
    │   ├── hero.jpg           # JPG fallback
    │   ├── 01.webp ... 06.webp
    │   └── README.md          # Notes on photo dimensions / replacement
    ├── audio/
    │   └── song.mp3           # Placeholder song
    └── icons/
        ├── favicon.svg
        ├── apple-touch-icon.png
        └── church.svg         # For the easter-egg trigger in event details
```

JS files are loaded as ES modules (`<script type="module">`) so they import each other cleanly without needing a bundler. Modern browsers (last 2 versions of Chrome/Safari/Firefox) all support this.

## Configuration (single source of truth)

`js/config.js` exports a single `CONFIG` object that everything else imports from:

```js
export const CONFIG = {
  names: { groom: 'Georgy', bride: 'Chinnu' },
  date: '2025-12-01T10:00:00+05:30',     // ISO with India TZ; adjust time when known
  venue: {
    name: 'TBD church name',
    mapsUrl: 'https://maps.app.goo.gl/c1CVMrJhTMwCTkde9',
  },
  contact: { name: 'Anna', phone: '+918078135442' },
  shareUrl: 'https://georgyjose007.github.io/georgy-weds-chinnu/',
  shareMessage: (url) =>
    `Georgy & Chinnu's Wedding 💍\n\nDec 1, 2025\n\nJoin us ❤️\n\n${url}`,
  hiddenMessage: 'From the day we met, it was always you ❤️',
  photoCaptions: [
    'Our first trip',
    'That day ❤️',
    // ... fill in later
  ],
};
```

Swap domain, change wedding time, update message — all in this one file.

## Page sections (top → bottom)

1. **Entry overlay** — Full-screen, ivory/yellow card depending on theme. "You're invited 💌" + "Tap to enter" pill. Soft particles drift in background. Tap anywhere → fades out (300ms) and reveals page. Body scroll locked until tapped. Skipped on subsequent visits in the same session (sessionStorage flag) so refreshing doesn't re-gate.

2. **Hero** — Full viewport height. Hero photo as background with gradient overlay (theme-colored, dark at bottom for text legibility). Names "Georgy & Chinnu" in display font, then "Dec 1, 2025", then the flip-style countdown.

3. **Our Story / Photos** — One feature photo full-width, then a horizontally swipeable carousel of 3-6 photos with tiny captions. Swipe gestures on touch, arrow keys on desktop, dot indicators below.

4. **Event Details** — Date, time, venue name, large "Get Directions 🚗" button that links to the Google Maps universal URL. A small church icon sits next to the venue name (it's the trigger for easter egg #9).

5. **Contact** — A card with "Need help finding us?" — Anna's name + phone, tap-to-call (`tel:+918078135442`).

6. **Share** — "Share on WhatsApp" button → opens `https://wa.me/?text=<encoded message>`. Falls back to native Web Share API on supported browsers if available.

7. **Footer** — "Made with ❤️" line, theme-tinted.

**Floating UI** (always visible, fixed position, z-index above sections):
- 🎶 music toggle — bottom-left
- 🍌 theme toggle — bottom-right

## Themes

### Default: Christian Traditional (`theme-classic`)
- **Palette:** ivory `#FBF7F0`, gold `#C9A96E`, soft sage `#7A8B7A`, charcoal `#2A2A2A`
- **Fonts:** `Cormorant Garamond` (display, names + countdown) + `Inter` (body) — Google Fonts with `font-display: swap`
- **Background motif:** faint gold dust particles drifting upward
- **Confetti style:** gold + ivory hearts
- **Tone:** elegant, church-appropriate

### Toggle: Minions (`theme-minions`)
- **Palette:** minion yellow `#FFD93D`, denim blue `#3A6EA5`, white `#FFFFFF`, soft black outlines
- **Fonts:** `Fredoka` (display + body)
- **Background motif:** floating bananas + tiny goggles
- **Confetti style:** banana confetti
- **Tone:** playful, bouncy timing curves on all interactions

### Switching mechanics
- Theme stored in `localStorage['theme']` (values: `'classic'` | `'minions'`)
- Inline `<script>` in `<head>` reads localStorage and sets `data-theme` attribute on `<html>` *before* CSS loads → no flash of wrong theme on first paint
- Toggle button in bottom-right flips the value and applies a 300ms cross-fade between palettes

CSS is structured so that `data-theme="classic"` and `data-theme="minions"` selectors govern colors via custom properties; layout and structure are theme-agnostic in `base.css`.

## Easter eggs (11 total)

All registered in `easter-eggs.js`, theme-aware so visuals adapt to active palette.

| # | Trigger | Effect | Active in |
|---|---------|--------|-----------|
| 1 | Tap names | Heart burst at tap point (gold hearts / banana hearts) | both themes |
| 2 | Long-press hero photo (500ms) | Reveals hidden message: *"From the day we met, it was always you ❤️"* in a tooltip | both themes |
| 3 | Scroll reaches footer | Confetti rain (gold hearts / bananas), once per page load | both themes |
| 4 | Countdown reaches 0 | Countdown digits replaced with "Today is the day 🎉" + auto-confetti | both themes |
| 5 | Konami tap pattern: top-left → top-right → bottom-left → bottom-right → center, within 5s | Petal rain (classic) / banana rain (minions) | both themes |
| 6 | Tap names 3× within 1s | Speech bubble pops above names: "BELLO! 👋" | minions only |
| 7 | Triple-tap anywhere on hero within 1s | Toast: "po-ta-to 🥔" for 2s | minions only |
| 8 | Long-press 🍌 toggle (2s) | Mini banana fireworks burst from button | minions only |
| 9 | Triple-tap church icon in Event Details | Dove SVG flies left-to-right across screen (3s) | classic only |
| 10 | Scroll past 50% of page | Music button pulses once — but only if user hasn't toggled music yet | both themes |
| 11 | Idle for 30s (no scroll/tap) | Tiny floating heart drifts up from bottom edge | both themes |

Each egg is a small registered handler — adding/removing one is one file change.

## Maps deeplink

The Google Maps short link `https://maps.app.goo.gl/c1CVMrJhTMwCTkde9` is a universal link — Google handles platform routing automatically:
- Android with Maps app → opens app
- iOS with Maps/Google Maps app → opens via universal link
- Desktop browser → opens maps.google.com

Single `<a href="..." target="_blank" rel="noopener">` tag. No JS sniffing needed. The `maps.js` module just adds an optional haptic tick on tap (`navigator.vibrate(10)` — no-op on iOS, works on Android).

## Music

- Floating bottom-left button, music-note icon
- `<audio src="assets/audio/song.mp3" preload="none" loop>` — no autoplay, no buffering until user opts in
- Tap → play; icon swaps + subtle pulse animation while playing
- Tap again → pause; icon reverts
- Default `volume = 0.4`
- Placeholder song until real one provided; swap by replacing `assets/audio/song.mp3`

## WhatsApp share

- Button opens `https://wa.me/?text=<encodeURIComponent(message)>`
- Message comes from `CONFIG.shareMessage(CONFIG.shareUrl)`:
  ```
  Georgy & Chinnu's Wedding 💍

  Dec 1, 2025

  Join us ❤️

  https://georgyjose007.github.io/georgy-weds-chinnu/
  ```
- If `navigator.share` exists, prefer the native share sheet (gives Telegram/SMS/etc. too) — falls back to WhatsApp deeplink otherwise

## Premium polish

- **Smooth scroll:** `html { scroll-behavior: smooth }` + JS for programmatic scrolls
- **Section fade-ins:** `IntersectionObserver` adds `.visible` class as each section enters viewport; CSS handles the fade + slight upward translate
- **Button ripple:** small JS helper adds an expanding circle on tap origin
- **Haptics:** `navigator.vibrate(10)` on key taps (toggles, share, directions). No-op on iOS Safari, works on Android Chrome.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` dampens particles, disables drifting elements, shortens transitions to 100ms
- **Accessibility:** semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`), `aria-label` on icon-only buttons, focus rings preserved, contrast ratios verified for both themes

## Performance targets

- **Total page weight:** < 500 KB on first load (excluding photos)
- **JS bundle:** < 30 KB (uncompressed, no minification needed at this size)
- **CSS:** < 20 KB total across the four files
- **Photos:** WebP with JPG fallback via `<picture>`; all `loading="lazy"` except hero
- **Hero image:** preloaded via `<link rel="preload" as="image" href="...hero.webp">` in `<head>`
- **Fonts:** Google Fonts with `font-display: swap` so text shows immediately in fallback while custom font loads

## PWA-lite

- `manifest.json` with name, theme color, 192×192 + 512×512 icons
- Apple touch icon link in `<head>` so iOS homescreen save looks polished
- No service worker (intentional — keeps things simple, no offline requirement)

## Boot sequence

`main.js` orchestrates init in this order:
1. Theme already applied (inline head script ran)
2. Wire entry overlay handler
3. Initialize countdown (starts ticking immediately, even behind overlay)
4. Initialize carousel
5. Wire music + theme + maps + share buttons
6. Register easter eggs
7. Set up IntersectionObserver for scroll fade-ins
8. Set up idle timer (egg #11)

Each module exports an `init()` that's idempotent and safe to call once.

## Out of scope (won't build)

- Service worker / offline support
- Analytics or tracking
- Real-time RSVP
- Custom domain configuration (deferred — change `CONFIG.shareUrl` when ready)
- Real photos / song (placeholders ship; user swaps files later)
- Internationalization

## Acceptance criteria

- Loads in < 2s on 4G mobile
- Both themes visually distinct, switch is smooth, choice persists across reloads with no flash
- All 11 easter eggs trigger as described
- "Get Directions" opens Maps app on Android & iOS, browser on desktop
- "Share on WhatsApp" produces the exact message format specified
- Tap-to-call opens phone dialer with Anna's number
- Countdown ticks down to Dec 1, 2025 and switches to "Today is the day 🎉" at zero
- Site is keyboard-navigable and respects `prefers-reduced-motion`
