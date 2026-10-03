# SULT — "Season your water." (spec reel)

A 20-second 9:16 reel for SULT™ electrolytes, made in code with the Motion Reel Kit. 119.87 BPM measured, 40 beats.
Built to pitch to the brand: their logo, packaging, bottles and product-card UI, their own lines, and a positioning
story drawn from competitor research (docs/research.md).

| File | What |
|---|---|
| `renders/9x16.mp4` | final (1080×1920, 60 fps, motion blur, H.264 + AAC, -14 LUFS) |
| `docs/research.md` | brand + competitor research with sources (Liquid I.V., LMNT, Humantra, Heights, Dioralyte, PF&H) |
| `docs/shotlist.md` · `docs/style_guide.md` · `docs/review_log.md` | approved plan, measured look, 3 scored critique rounds |
| `timeline.json` | copy, beat marks and every SFX cue |
| `film/film.js` | the film; the sachet and glass are vector rebuilds (the sachet from the product photo) |

## The story, in their voice
Not a sports drink. Not a sugar rush. Not a salt lick. → **Just right.** → **Season your water.** → All 6 electrolytes ·
0 sugar · 500mg sodium: the middle ground → three flavours → Sold out in hours · 150 Boots stores · 0 investors, 1 community → SULT.

## Before sending to SULT
- "0 investors" and "150 Boots stores" come from press interviews (2025): confirm they're still current.
- The type is Archivo (a close match for the site's grotesk); swap in their font file in `film/index.html` if they share it.

## Change and re-render (from this folder)
```
npm i && npx playwright install chromium        # once
python3 scripts/music.py && python3 scripts/beats.py audio/music.wav --stem audio/drums.wav
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --draft                  # 30 fps check
node scripts/render.mjs                          # final
```
