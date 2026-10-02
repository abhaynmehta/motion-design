# County Group — "The art of the address"

A 24-second brand film (80 BPM, 32 beats) made entirely in code with the Motion Reel Kit (`/motion-reel`).
16:9 for the office screen, 9:16 for social. Real County Group renders, the site's own fonts and colours,
an original synthesized score (felt piano, strings, harp, a clock tick for "since 2005"), -14 LUFS.

| File | What |
|---|---|
| `renders/16x9.mp4`, `renders/9x16.mp4` | final films (60 fps, motion blur, H.264 + AAC) |
| `docs/shotlist.md` · `docs/style_guide.md` · `docs/review_log.md` | the approved plan, the look, and 4 scored critique rounds |
| `timeline.json` | single source of truth: copy, projects, beat marks, SFX |
| `film/film.js` | the film (pure function of time, springs on the beat grid) |
| `scripts/music.py` | the project's luxury score (replaces the kit's groove engine) |
| `scripts/sfx.mjs` | kit SFX + four luxury sounds: silk, chime, boom, shimmer |

## Change things
- **Words** (headline, "Two decades of addresses.", "County Life.", URL): `timeline.json` → `copy`.
- **Which projects get a hero shot**: `timeline.json` → `heroes` (any `id` from `projects`).
- **Sharper pictures**: the renders here are ~380 px crops upscaled 3×. Drop higher-resolution images into
  `assets/site/renders/` with the same file names (orange.jpg, olive.jpg, … clove.jpg) and re-render.
- **Real logo**: put it in `assets/brand/` and set `"logo": "assets/brand/logo.png"` in `timeline.json` → `brand`.
- **Naming a Gurugram project** (Center Court / Cocoa County): add its HARERA number to `copy.rera` first; it prints as small type.

## Re-render (from this folder)
```
npm i && npx playwright install chromium        # once
python3 scripts/music.py && python3 scripts/beats.py audio/music.wav --stem audio/drums.wav
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --draft --all            # quick 30 fps check → renders/draft_*.mp4
node scripts/render.mjs --all                    # finals → renders/16x9.mp4, renders/9x16.mp4
```
Preview with sound in a browser: `npx serve .` then open `film/index.html?play` (add `&fmt=9x16` for vertical).

Cost: nothing beyond a Claude subscription. Everything (picture, music, SFX, mix) is generated locally; no paid APIs.
