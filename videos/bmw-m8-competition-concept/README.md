# BMW M8 Competition — "3.2" (concept film)

A 34-second concept film for BMW M, cut from BMW Group PressClub footage of the M8 Competition, to Mixkit's "Greed" (100 bpm).
9:16, built for Instagram Reels.

**The idea:** the first 3.2 seconds ARE the 0–100 km/h run. A live counter rides the build (speed and elapsed time, in real time)
and the song's bass drop lands exactly when it reads **100 km/h · 3.2 s**. Then the numbers (625 hp, 750 Nm, 305 km/h, M xDrive),
the race twin (M8 GTE), a grand-tourer breakdown ("A grand tourer. For the long way home."), the pickup ("Until you press **M.**")
and the BMW M lockup on the second drop: *M. The most powerful letter in the world.*

**Renders:** `renders/9x16.mp4` (track + SFX) · `renders/9x16_sfx-only.mp4` (SFX only, for adding music in-app).

## Music
The cut follows the track's measured grid: build bar → drop at 3.2 s → 8 bars → breakdown → pickup → second drop at 32.0 s.
To post with another song, either lay it on the SFX-only version (start it so its drop hits at 3.2 s), or send the song file:
every mark is in beats, so `python3 scripts/beats.py` on the new track re-times the whole film to it.

## Rebuild
```sh
sh scripts/fetch_sources.sh      # PressClub films, BMW Group TN Pro, the Mixkit track (not committed)
python3 scripts/prep_frames.py   # frames for every shot in shots.json → film/shots.js
python3 scripts/beats.py audio/music.wav && node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs          # final; --sheet / --draft / --verify for review
```
Docs: `docs/research.md` (facts + sources), `docs/shotlist.md`, `docs/style_guide.md`, `docs/review_log.md`.
Footage © BMW Group (PressClub media material); this is an unofficial concept, labelled as such on the end card.
