# SULT — "SEASON YOUR ___" (a motion concept for SULT™)

30-second 9:16 pitch reel built from ../../brand/SULT_BRAND_BRIEF.md (concept A + the pitch-reel structure in §8),
with SULT's own logo files, photography, press logos, verbatim headlines and site data. Made with the Motion Reel Kit.

| File | What |
|---|---|
| `renders/9x16.mp4` | final (1080×1920, 60 fps, motion blur, H.264 + AAC, -14 LUFS) |
| `docs/shotlist.md` · `docs/style_guide.md` · `docs/review_log.md` | plan, tokens, 3 scored critique rounds (SHIP) |
| `timeline.json` | every beat mark and the 105 SFX cues |
| `film/film.js` | the film (typewriter engine, vector sachet with back face, glass bloom, marquee, racing bars, burst, iris drops) |

## Running order
70% OF US ARE DEHYDRATED. → POV: YOU TAKE SULT / WHEN DO I SULT? → SEASON YOUR MORNING. / WORKOUT. / 3PM SLUMP. /
HANGOVER. (flash cuts to their fruit-bite portraits) → WATER. (tear, pour, bloom: 1,900MG · 6 ELECTROLYTES · 0G SUGAR) →
~~GMO~~ ~~ADDED SUGAR~~ … NO SUGAR, NO CAFFEINE, NO BULLSH*T. → WE'RE BUILT DIFFERENT. (racing bars from their table, £1 per
serving) → ALL 6 (ingredients burst out of the sachet) → three flavour drops → 1,000,000+ SULT SACHETS · 4.9★ · review ·
as seen in → SULT · season your water. · drinksult.com · A MOTION CONCEPT FOR SULT™

## Pitch rules kept (brief §10)
Labelled as a concept on the end card; claims limited to the site's formula and data; no health effects from reviews.

## Re-render (from this folder)
```
bash ../../brand/fetch_assets.sh   # from the repo root, if brand/assets is missing (the film itself only needs ./assets)
npm i && npx playwright install chromium
python3 scripts/music.py && python3 scripts/beats.py audio/music.wav --stem audio/drums.wav
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --draft && node scripts/render.mjs
```
