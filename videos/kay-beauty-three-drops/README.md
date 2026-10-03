# Kay Beauty — "3 new drops" (Instagram reel)

A 32-second 9:16 reel for **Kay Beauty by Katrina Kaif**, cut from the brand's three launch reels (Hydra Base Water Crème,
Hydra Cloud Cushion Foundation, Hydra Luscious Gloss Stain) plus the brand's own campaign photos of Katrina. Every frame is
rendered by the motion-reel engine as a pure function of time: the footage is painted from pre-extracted frames inside `seek(t)`.

**Renders:** `renders/9x16.mp4` (original score + SFX, −14 LUFS) · `renders/9x16_sfx-only.mp4` (SFX only, for adding Instagram
music in the app). 1080x1920, 30 fps, H.264 yuv420p.

## The idea
1. **Hook (0–2 s):** the foundation drip with "3 new *drops.*" already on frame 0, then flash cuts through the doe-foot and the crème, and Katrina by 2 s.
2. **Open loop:** "Pick yours." with three strips; strip 01 opens to full frame.
3. **01 Prep · 02 Base · 03 Colour:** each launch gets a porcelain label card, its texture macros, and one or two of the brand's own claims (100-hr hydration\*, +138%\*, Ceramides + CICA, 6 new shades, full coverage in one dab, 18 ways to find your match, glossy lips + lasting colour, 8 shades, gloss now / stain later).
4. **Katrina:** "Katrina Kaif wears *Honey.*" (the brand's campaign trio), then a music stop on a freeze frame, and the drop lands on her portrait with the logo.
5. **Ask + loop:** "Which one *first?* Comment 1, 2 or 3" (comments drive reach), the end card, then a drip strip opens straight back into frame 0, so the reel loops seamlessly.

Details: `docs/shotlist.md`, `docs/style_guide.md`, `docs/research.md` (facts, references, music), `docs/review_log.md`.

## Music for Instagram
- The main render carries an **original score** made in code, owned outright and safe on a brand account, in ads and off-platform.
- Brand and business accounts on Instagram only get the **Meta Sound Collection**; trending songs aren't licensed for branded posts. To use in-app music, post `9x16_sfx-only.mp4` and pick a Meta Sound Collection track at **118–122 bpm**, started on a downbeat. Every cut sits on the 120 bpm bar grid.

## Rebuild
```sh
sh scripts/fetch_sources.sh        # reels (Drive), brand fonts, logo, product data + photos  (not committed)
sh scripts/prep_frames.sh          # denoise + upscale every source frame to 1080x1920
python3 scripts/prep_photos.py     # 9:16 crops of the brand photos (committed in assets/photo/cut)
python3 scripts/prep_logo.py       # clean 8x logo matte from the site's 141 px PNG (committed in assets/brand)
python3 scripts/music.py && node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs            # final; --sheet / --draft / --verify for review
```
`beats.json` holds the score's exact grid (every hit is written at k × 0.5 s). The beat tracker misreads the half-time intro.
