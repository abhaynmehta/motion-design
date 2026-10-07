# rhode · Peptide Lip Shape — "never skip lip day." (spec reel)

A 27-second 9:16 reel for rhode's Peptide Lip Shape, cut from the brand's own public shade films and campaign portraits,
set to Mixkit's "Swish Swed". **Unsolicited spec work for outreach — not affiliated with or endorsed by rhode.** Footage,
photos and logo belong to rhode; the footage and photos are not committed here.

**The idea:** the joke is already in the product — every shade is named after a workout move. So the reel is a lip
workout class: *never skip leg day* rolls to *lip day*, a 3-2-1 drops in like weight plates, and the class starts on
the music's drop. Six featured moves, each word **acting out its own name** (lunge leans in, stretch stretches,
squeeze squeezes, flex flexes its "e", twist twists, lift lifts), with the shade's descriptor, a coach cue and its film;
a speed round of the other eight; the whole class (14 shades on 14 faces); peptide lip shape, $24. *Same time tomorrow?*

**Techniques new to this series:** per-letter kinetic type (one spring per change through `track()`), drawn on canvas
for determinism; a workout HUD with a 14-set progress bar, a rolling move counter and a workout clock; synthesised
interval-timer beeps and a coach's pea whistle.

**Renders:** `renders/9x16.mp4` (music + SFX, −14 LUFS) · `renders/9x16_sfx-only.mp4` (SFX only, for adding a song in-app:
put a drop on 4.02 s, the first move).

## Rebuild
```sh
sh scripts/fetch_sources.sh      # shade films, product photos, Mixkit track → frames, pencil crops, music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final; --sheet / --draft / --verify for review
```
Docs: `brief.md`, `docs/style_guide.md`, `docs/shotlist.md`, `docs/review_log.md`.
