# Stock Market 101 · EP 01 · "What is a share?"

A 34.7 s 9:16 Reel, the first in a daily Beginner → Intermediate → Advanced series. It explains shares with Raju's
chai stall, in words a child can follow, against a live 30-second countdown.

| File | What |
|---|---|
| `renders/9x16.mp4` | Final: 1080x1920, 30 fps, motion blur, CRF 16, guide music + SFX at −14 LUFS |
| `renders/9x16_sfx-only.mp4` | Same picture, SFX only: upload this and add the song in Instagram |
| `renders/covers/cover_ep01.png` | The Reel cover (1080x1920, grid-safe 3:4 centre) |
| `renders/covers/cover_ep02–09.png`, `grid_preview.jpg` | The series cover system and how the profile grid will look |
| `docs/music.md` | Mellow Instagram songs that fit (Jhol locks to the 76 BPM grid), and how to add them |
| `docs/series_plan.md` | Format, covers, episode plan, posting checklist, inputs needed |
| `docs/shotlist.md`, `docs/style_guide.md`, `docs/review_log.md` | Script, look, critique rounds |

## Rebuild
```
bash scripts/fetch_sources.sh           # guide track → audio/music.wav (not committed)
node scripts/sync.mjs                   # timeline + beats → film/data.js, cues.json
node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --sheet         # one frame per beat → review/sheets/
node scripts/render.mjs --fps 30        # final → renders/9x16.mp4
node scripts/covers.mjs                 # covers → renders/covers/
```
Fonts (Archivo, JetBrains Mono, a Noto Sans ₹ subset) are OFL and committed in `assets/fonts/`.
Companies on screen (Raju Chai, PixelTech…) are fictional. For education only; not investment advice.
