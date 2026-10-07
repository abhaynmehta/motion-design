# Sol de Janeiro · Cheirosa perfume mists — "departures." (spec reel)

A 28-second 9:16 reel for Sol de Janeiro's Cheirosa perfume mists, built from the brand's own packshots, home film and
product-page copy, set to Mixkit's "Latin Lovers". **Unsolicited spec work for outreach — not affiliated with or endorsed
by Sol de Janeiro.** Photos, footage and logo belong to Sol de Janeiro; they are not committed here.

**The idea:** the brand already wrote it — every Cheirosa number is a year in Rio (59 is 1959 and bossa nova, 62 is 1962
and the Girl from Ipanema, 76 is the disco era …). So the perfume is a time machine and the reel is an airport
departures board. A split-flap year flips back from 2026 to 1962; the board lists all ten flights; four board in time
order — each bottle lands on its own colour like a plane, with a window seat onto Rio (the brand's film), its year's
story and its notes — six more fly by, one a beat; *pick your year.*

**Techniques new to this series:** a canvas split-flap engine (each cell steps through its character ring; the top half
falls, the bottom half lands, the moving flap darkens), a departures board cascade, colour-field wipes from each bottle's
flight path, footage in a plane-window mask, and a synthesised airport PA chime.

**Renders:** `renders/9x16.mp4` (music + SFX, −14 LUFS) · `renders/9x16_sfx-only.mp4` (SFX only, for adding a song in-app).

## Rebuild
```sh
sh scripts/fetch_sources.sh      # films, packshots, Mixkit track → window frames, bottle cut-outs, music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final; --sheet / --draft / --verify for review
```
Docs: `brief.md`, `docs/style_guide.md`, `docs/shotlist.md`, `docs/review_log.md`.
