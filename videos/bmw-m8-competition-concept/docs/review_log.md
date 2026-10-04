# Review log

Checks are made from rendered MP4s (`python3 scripts/review.py <round>`) and per-beat sheets (`node scripts/render.mjs --sheet`).
Critic prompt: the skill's `reference/CRITIQUE.md`. Ship only when every score is ≥ 8, after at least 3 rounds.

## Round 0: per-beat sheets, both formats
- 16:9: "For the long way home." sat on the car in the architecture shot → moved to the clouds; the house shot breathes.
- The pickup's red "M." crowded the bottom edge → block moved up. End lockup too small for a 16:9 frame → roundel 150 px, name 84 px.
- 9:16: the 2018 film is letterboxed (91 px bars) → cropped to the active picture per shot (shots.json 5th value).
- 9:16: white numbers on bright plates ("038" on the light wheel, "625" on the white wall road) → soft bottom-left scrim under
  the counter and spec lines only. "M8 GTE" on the white helmet → the statement starts one beat later, on the race car.
- The camouflaged prototype opened on an empty road → starts 8 frames later.

## Round 1: draft_16x9 + draft_9x16 (30 fps, no blur)
`--verify` 12/12 identical in both formats.
| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 9 | M8 grille + live 0–100 counter from frame 0; the rev builds; the drop lands at 100 km/h · 3.2 s |
| Readability at phone size | 8 | numbers 300+ px on a scrim; labels 28–30 px caps |
| Motion quality | 7 | strip_fast2 (21.4 s): the badge flash ran past its own source cut into a wheel-arch shot |
| Variety / pacing | 9 | max gap 2.33 s (end card); cuts on beats, half and quarter beats |
| Brand accuracy | 9 | BMW's own footage, typeface, figures and tagline; M tricolour as the device |
| Sound sync | 7 | 14/17 within 45 ms; the two pass whooshes trail the cars by 100–130 ms |
| Composition | 8 | both formats clear; 9:16 crops follow each shot's focus |
| Polish | 7 | 2 black frames at 31.93 s (the pickup shot ended a quarter-beat before the lockup) |

**3 worst problems:** (1) the black gap before the lockup; (2) flash shots crossing source cuts (badge; gravel shot's 2-frame sub-cut);
(3) late pass whooshes. **Fixes:** the gear shot runs under the stripe wipe to the lockup; badge trimmed to 45.26 s, gravel starts at 29.40 s;
whooshes moved to b6.55 and b30.4.

## Round 2: draft_16x9 + draft_9x16 after the fixes
No near-blank frames; longest static 0.13 s; max gap 2.33 s (the lockup); −14.1 LUFS; sync 15/17 within 45 ms (misses: two climax
flash cuts, where the punch-in reads as the onset), plus count-up ticks (a rolling number has no single onset).
| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 9 | unchanged |
| Readability at phone size | 8 | scrims hold "038" and "625" on bright plates |
| Motion quality | 8 | strip_fast2 (22.1 s): the M-stripe wipe crosses the breakdown cut cleanly; no flash crosses a source cut |
| Variety / pacing | 9 | — |
| Brand accuracy | 9 | — |
| Sound sync | 8 | pass whooshes now on the passes |
| Composition | 8 | — |
| Polish | 8 | no black frames; letterbox gone |

All ≥ 8 → finals (25 fps, adaptive motion blur, CRF 16) as round 3.

## Round 3: final render, 9:16 only (the client asked for portrait), 25 fps, adaptive motion blur, CRF 16
First final: at 25 fps the 3.202 s drop fell just after frame 80, so the hero shot arrived a frame late, and the timer's rounding
read "3.2 s" one frame early. **Fix:** cuts snap to the nearest frame at or before their beat; the counter floors its readout, so
100 km/h · 3.2 s first appears on the drop frame, with the boom. Re-rendered.

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 9 | grille + live counter from frame 0; rev; 099 · 3.1 s → **100 · 3.2 s** on the drop frame |
| Readability at phone size | 8 | phone sheet: every number and line legible on its scrim; lockup readable |
| Motion quality | 8 | real frames, blur on graphics; count-ups blur like an odometer mid-roll |
| Variety / pacing | 9 | max gap 2.36 s (the lockup) |
| Brand accuracy | 9 | — |
| Sound sync | 8 | drop on its frame; off-grid only the quarter-beat flashes (3.75 frames each) and the wipe that leads the lockup by design |
| Composition | 8 | — |
| Polish | 8 | no near-blank frames; `--verify` 12/12; −14.1 LUFS |

**SHIP.** `renders/9x16.mp4` (1080x1920, 25 fps, 34.4 s, track + SFX, CRF 16 master) and `renders/9x16_sfx-only.mp4`
(SFX only at their mix level, −19.2 LUFS, CRF 22) for adding music in the Instagram app.
