# Rare Beauty · "just a little." (spec reel)

A 26-second 9:16 reel for Rare Beauty's Soft Pinch Liquid Blush and Find Comfort mist, cut from the brand's own public
product films, set to Mixkit's "Thinking About You". **Unsolicited spec work for outreach — not affiliated with or endorsed
by Rare Beauty.** Footage, logo and fonts belong to Rare Beauty and are not committed here (the wordmark SVG is extracted
from the site's icon sprite for the end card).

**The idea:** a gentle reminder that you don't have to do it all today, just a little: one dot of blush (…okay, two), a
little goes a long way, and on the heavy days, find comfort and breathe. Every picture lives in a dot: the full stop of
"just a little." opens into the frame and the last frame closes into the full stop of "one dot at a time."

**Renders:** `renders/9x16.mp4` (music + SFX, −14 LUFS) · `renders/9x16_sfx-only.mp4` (SFX only, for adding a song in-app).

## Rebuild
```sh
sh scripts/fetch_sources.sh      # brand films, the site's webfonts, the Mixkit track → frames + music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final; --sheet / --draft / --verify for review
```
Docs: `brief.md`, `docs/style_guide.md`, `docs/shotlist.md`, `docs/review_log.md`.
