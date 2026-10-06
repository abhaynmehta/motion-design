# Kylie Cosmetics · Mood Stones — "one of each, obviously." (spec reel)

A 30-second 9:16 reel for Kylie Cosmetics' Mood Stones eau de parfum, cut from the brand's own public product films and
Kylie's get-ready clips, set to Mixkit's "Smooth Jazz". **Unsolicited spec work for outreach — not affiliated with or
endorsed by Kylie Cosmetics.** Footage, logo and fonts belong to Kylie Cosmetics and are not committed here.

**The idea:** you're not the same girl at 8 am as you are at 11 pm, so why wear the same scent? A clock rolls through the
day (8:00 am → 3:00 pm → 11:00 pm), one Mood Stone per mood, and every shot lives in a stone-shaped window that opens to
the full frame. It ends on "three moods. one of each, *obviously.*"

**Renders:** `renders/9x16.mp4` (music + SFX, −14 LUFS) · `renders/9x16_sfx-only.mp4` (SFX only, for adding a song in-app:
start the song so a downbeat lands at 1.8 s, the "11 pm" line).

## Rebuild
```sh
sh scripts/fetch_sources.sh      # brand films (source/manifest.json), the site's webfonts, the Mixkit track → frames + music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final; --sheet / --draft / --verify for review (render_dense.mjs: 36-probe verify)
```
Docs: `brief.md`, `docs/style_guide.md`, `docs/shotlist.md`, `docs/review_log.md`.
