# Review log

Every check is made from the rendered MP4s (`python3 scripts/review.py <round>`) plus the per-beat contact sheets
(`node scripts/render.mjs --sheet`). Nothing is judged from the page. Critic prompt: the skill's `reference/CRITIQUE.md`.

Scores 1–10. Ship only when EVERY score is ≥ 8, after at least 3 rounds.

---

## Round 1: <what was rendered, when>

| Criterion | Score | Evidence (timestamps, frames, metrics) |
|---|---|---|
| Hook (first 2 s) | | |
| Readability at phone size | | |
| Motion quality | | |
| Variety / pacing | | |
| Brand accuracy | | |
| Sound sync | | |
| Composition (every format) | | |
| Polish | | |

**3 worst problems**
1.
2.
3.

**Fixes for round 2**
1.
2.
3.

## Round 1: draft 9x16 (30 fps) + sheet + review/r1 — first full build

Critic: run in-session in the critic's voice (no subagent requested), per CRITIQUE.md.

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | f0: "Not a / sports drink." already risen on lime; three lines struck on beats 1/2/3; brand colour from frame 0. |
| Readability at phone size | 8 | headlines 156–270 px, pills 40 px names, caption 36 px, CTA 52 px in an ink pill; all legible in phone_9x16. |
| Motion quality | 7 | 3.5 s: the pouring sachet swings across "Just right." (type crossed by a moving object); 7.5 s: the six pills scatter at different speeds on exit and overlap the rising "0". Logo slam, whips, card rise, tear all clean. |
| Variety / pacing | 9 | longest_static 0.47 s, max gap 1.77 s; a new shot or element every half-bar. |
| Brand accuracy | 8 | real logo file, measured lime/teal/ink/paper, real bottles + box + site product card; sachet rebuilt in vector from the product photo (noted in code); Archivo stands in for the site's grotesk. |
| Sound sync | 7 | 21/28 within 45 ms (mean 30 ms). Picture early by 2 frames on 'your water.', the tear, the community line; bottles late +133 ms (no lead). Ticks are texture. -14.0 LUFS / -1.3 dBTP. |
| Composition (every format) | 8 | hook block centred in the safe area; facts and scale re-blocked to fill the frame; flavour shots balanced (type top-left, sachet + bottle). |
| Polish | 7 | near_blank_frames: 1.90 s (2 frames, lime: hook lines gone before "Just right." lands), 4.03 s (1 frame: water fills the frame at the push-through), 14.87 s (1 frame, ink: "Sold out" gone before the counter). |

**3 worst problems**
1. Handoff blanks at 1.90 s, 4.03 s, 14.87 s.
2. Sachet crosses the headline during the pour; pills scatter on exit.
3. Hits reading 2 frames early (display-line lead too long for big type) and the bottles reading late.

**Fixes for round 2**
1. Hook lines leave at b3.7 while "Just right." rises at b3.9/b4.0; the push-through stops at 6.5× and the glass enters at 3.4× (rim visible); "Sold out" leaves at b29.62 as the counter rises. Verify near_blank_frames empty.
2. Pour mirrored to the right of frame (−152°, mouth still over the glass); pills leave together, pushed up past camera.
3. `rise()` accepts a lead; display lines with a sound use 0.07 s; tear lead 0.02 s; bottles use spHit.

**Verdict:** ANOTHER ROUND

## Round 2: draft after round-1 fixes (review/r2)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | unchanged; strikes now retract with their lines (no floating bars). |
| Readability at phone size | 8 | unchanged. |
| Motion quality | 8 | pour mirrored right (never crosses type); pills leave as one block; counter rises through a mask (no opacity ghost). |
| Variety / pacing | 9 | longest_static 0.40 s, max gap 1.83 s. |
| Brand accuracy | 8 | unchanged. |
| Sound sync | 7 | 20/28 within 45 ms (mean 32 ms); dense moments (pills every half beat, fan) read ±67 ms. |
| Composition (every format) | 8 | unchanged. |
| Polish | 7 | near_blank_frames: 4.03 s (1 frame: the glass still fills the frame at 3.4×), 14.83 s and 15.93 s (4 ink frames each: the masked counter and the community line arrive after the outgoing lines are gone). |

**3 worst problems**
1. 4-frame ink gaps at the two proof swaps.
2. 1 near-uniform frame at the cut into the glass.
3. Sync noise in dense moments (accepted: the onsets are on the grid; neighbouring motion contaminates the measurement window).

**Fixes for round 3**
1. Proof becomes one vertical push: three blocks a frame-height apart, each new line shoves the last one up past camera (spHit at b30 and b32).
2. Glass enters at 2.3× so the rim and the teal ground read from the cut frame.

**Verdict:** ANOTHER ROUND

## Round 3: draft after round-2 fixes (review/r3)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 9 | f0 reads; three struck lines on beats 1–3 and "Just right." by 2.0 s; lime from frame 0. |
| Readability at phone size | 8 | phone_9x16: every headline, pill, label, caption and the CTA read at 360 px; smallest must-read lines are 36–40 px. |
| Motion quality | 8 | strips: masked rises with no slivers; tear, pour, push-through, whips, fan and logo slam all spring-driven; no opacity transitions. |
| Variety / pacing | 9 | longest_static 0.47 s, max gap 1.87 s; new element every half bar; builds into the stop-time and drop on the logo. |
| Brand accuracy | 8 | real logo file, measured palette (lime #D7FC00 / teal / ink / paper), real bottles, box and SULT's product-card UI; facts from the pack and press. Font approximated with Archivo (site font not supplied). |
| Sound sync | 8 | 21/28 within 45 ms (mean 31 ms); the remainder are whooshes building into their landings and measurement windows overlapping half-beat pops. -14.1 LUFS, -1.3 dBTP. |
| Composition (every format) | 8 | 9:16 blocked for the safe area throughout; every shot has a dominant element; nothing empty for more than a beat. |
| Polish | 8 | near_blank_frames: none; no double exposures at swaps; loop seam 30 (lime → lime, logo → hook). |

**Verdict:** SHIP (every score ≥ 8, round 3)
