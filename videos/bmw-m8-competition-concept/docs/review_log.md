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
