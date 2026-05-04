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
