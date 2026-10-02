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

## Round 1: drafts 16x9 + 9x16 (30 fps), sheets, review/r1 — first full build on the kit engine

Critic: run in-session in the critic's voice (no subagent requested), per CRITIQUE.md.

| Criterion | Score | Evidence (timestamps, frames, metrics) |
|---|---|---|
| Hook (first 2 s) | 8 | f0 already shows the eyebrow and "The art" (pre-released heavy spring); "The art of the address." complete at 1.12 s. Calm rather than punchy, but right for the brief. |
| Readability at phone size | 6 | phone_16x9: headline, names, "County Life." read; URL (30 px), "GROUP", locations (28 px) and "NOW IN GURUGRAM" are ~5 px at 360 px wide. CTA illegible → cap 6. |
| Motion quality | 7 | Weighted springs, clean wipes with a gold leading edge, good collapse into the grid. But at 2.5 s the empty dark hero frame (and its shadow) pops in under the curtain before the image rises, and at b20.5 "County Life." rises across the arch while the arch is still travelling right. |
| Variety / pacing | 7 | Cuts every 1.5 s through the gallery; harp-timed grid. max_gap_between_visual_events 4.03 s from 19.97 s and longest_static 3.73 s from 20.23 s — the end card stops moving. |
| Brand accuracy | 8 | Real renders (graded into the palette), the site's Playfair Display + Montserrat, cream/brown/gold with gold as the only accent, verified locations. Typographic lockup stands in for the logo (no logo file supplied). |
| Sound sync | 7 | 7/16 hits within 45 ms (mean 50 ms). Silk whooshes read -67 ms (picture 2 frames early: spHit lead too long for a wipe); sweep -100 ms. Chimes, thump within ±33 ms. -14.1 LUFS / -1.4 dBTP on target. |
| Composition (every format) | 7 | 16:9 balanced (frame left, type right; arch right, type left). 9:16 re-blocked (taller crops), but the gallery frame runs into the right 12 % UI zone; 16:9 end card's right half is near-empty (watermark too faint to carry it). |
| Polish | 6 | near_blank_frames: 2.50 s (4 frames, cream: headline lifted out before the curtain arrives), 15.00 s (1 frame, luma 14: tile 12 renders near-black because `.tile` overrides `.bgWarm`), 19.53 s (10 frames, cream: iris done before the lockup starts). |

**3 worst problems**
1. Blank / near-black frames at 2.50 s, 15.00 s, 19.53 s (handoffs: headline exits early; tile-12 background wrong; lockup starts after the iris).
2. CTA and secondary lines illegible at 360 px (URL 30 px, GROUP, locations, NOW IN GURUGRAM).
3. End card static for 3.7 s; wipes read 67 ms early.

**Fixes for round 2**
1. Headline and eyebrow stay until the curtain covers them (curtain moves to b3.25, no lift-out); the hero frame is clipped with the first image's rise so no empty box shows; tile 12 gets the warm gradient inline; iris uses the heavy spring and the lockup starts with it (mark b26, word b26.25, group b26.75, url b27.5, sweep b29.5). Verify: near_blank_frames empty.
2. URL 46 px (16:9) / 44 px (9:16); GROUP 46/40 px; NOW IN GURUGRAM 40 px; locations 34/36 px; names' COUNTY 30 px; Nº 24 px. Verify on phone_*.jpg.
3. End card: watermark arch draws continuously through the hold and the push grows to 1.06; wipe lead cut to 0.04 s, sweep lead removed. Also: "County Life." moves to b21 and "Now in Gurugram" to b22 so type never crosses the moving arch; 9:16 gallery frame narrowed to 860 px (clear of the right UI zone).

**Verdict:** ANOTHER ROUND

## Round 2: drafts after round-1 fixes (review/r2)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | unchanged; f0 reads. |
| Readability at phone size | 8 | URL 46 px, GROUP 46 px, locations 34/36 px, NOW IN GURUGRAM 40 px all legible in phone_9x16; URL ~9 px tall in phone_16x9 (legible). |
| Motion quality | 7 | type no longer crosses the arch; frame no longer shows as an empty box. Curtain still fast. |
| Variety / pacing | 7 | longest_static 3.9 s from 20.07 s, max gap 4.23 s from 19.77 s: the end card push and slow watermark draw are below the motion threshold on flat cream. |
| Brand accuracy | 8 | unchanged. |
| Sound sync | 8 | 11/16 within 45 ms, mean 25 ms; wipes now 0 ms. Remaining misses: collapse -67, tile-12 chime -67, sweep -67; riser/boom -67 build in by design. |
| Composition (every format) | 8 | 9:16 frame now clear of the right UI zone; lockup centred in the safe area. |
| Polish | 7 | near_blank_frames: only 19.567 s (3 frames, cream) — iris still lands before the lockup has size. |

**3 worst problems**
1. End card reads static for 3.9 s (variety).
2. 3 cream frames at 19.57 s.
3. Grid collapse and tile-12 chime read 67 ms early.

**Fixes for round 3**
1. A procession of all 11 renders rises along the base of the end card on b28.25 and scrolls left steadily; a gilded sheen crosses COUNTY on b29.5 with the rule sweep. Verify longest_static < 2 s, max gap < 4 s.
2. Lockup starts with the iris (word b26, group b26.5, url b27.25). Verify near_blank_frames empty.
3. Collapse lead 0.04 s; tile-12 lead 0.03 s.

**Verdict:** ANOTHER ROUND

## Round 3: drafts after round-2 fixes (review/r3)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | f0: eyebrow + "The art" mid-rise; full line by 1.12 s with the chime. |
| Readability at phone size | 8 | phone_9x16: names, two-line addresses, "County Life.", NOW IN GURUGRAM, COUNTY GROUP and the URL all read at 360 px. |
| Motion quality | 7 | strip_fast2 (2.60–2.97 s): the curtain closes in ~2 frames (reads as a pop, not a wipe) and leaves ~9 frames of empty brown before Orange rises. Dive strip (14.47 s) clean: continuous acceleration, no jumps. |
| Variety / pacing | 8 | longest_static 1.73 s, max gap 3.3 s; ribbon keeps the end card alive. |
| Brand accuracy | 8 | real renders and faces, one accent, verified addresses; typographic lockup until a logo file is supplied. |
| Sound sync | 8 | 12/16 within 45 ms (mean 23 ms). The four at -67 ms are build-in sounds (curtain silk, riser, boom on the push-through, shimmer swell) plus the tile-12 chime, whose onset window also catches tile 10's rise. |
| Composition (every format) | 8 | 16:9 balanced throughout; 9:16 re-blocked; end card base now carried by the ribbon. |
| Polish | 7 | near_blank_frames empty, loop_seam_jump 13.2 (cream → cream). But the 2.67–2.93 s empty brown frames are a handoff gap (failure mode 12). |

**3 worst problems**
1. Curtain pops shut in ~2 frames at 2.6 s.
2. ~0.3 s of empty brown between the curtain and the first render.
3. (minor) loop seam 13.2 — same cream ground, different type.

**Fixes for round 4**
1–2. Curtain on a slow critically damped spring ({response 0.85, damping 1}), released at b3.0 so its leading edge reaches the bottom exactly as Orange rises at b4. Verify in strip/contact at 2.4–3.1 s: no pop, no empty frame.
3. Accept: a cut between two cream cards reads as a page turn; the music rings out to silence at the seam.

**Verdict:** ANOTHER ROUND

## Round 4: drafts after round-3 fixes (review/r4) + curtain stills (review/stills/16x9/curtain*.jpg)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | f0 reads (eyebrow + "The art"); promise complete by 1.12 s on the chime; cream editorial opener. |
| Readability at phone size | 8 | phone_9x16 / phone_16x9: every must-read line legible at 360 px; URL is the clearest line after the wordmark. |
| Motion quality | 8 | Curtain is now a 13-frame descent on a slow spring (r4 frames 66–79) and, after the final tweak, the first render rises under its last sliver (stills 2.75 / 2.83 / 2.90 s): no pop, no empty frame. Wipes, collapse, card rises, match-cut dive and arch settle all spring-driven; no opacity-only transitions. |
| Variety / pacing | 8 | longest_static 1.73 s; max gap 3.3 s; cuts every 1.5 s in the gallery; the end card keeps moving (ribbon, sheen, watermark draw). |
| Brand accuracy | 8 | Real renders, Playfair Display + Montserrat, cream/brown + one gold accent, verified addresses. Logo is typographic until a file is supplied (`timeline.json` brand.logo). |
| Sound sync | 8 | 12/16 within 45 ms, mean 23 ms; the -67 ms entries are build-in sounds by design. -14.1 LUFS, -1.4 dBTP. |
| Composition (every format) | 8 | Both formats re-blocked; nothing in the 9:16 UI zones; no dead third of the frame for more than a beat. |
| Polish | 8 | near_blank_frames: none. No double exposures at swaps (outgoing type gone before incoming lands). Loop seam 13.2 (cream → cream, music rings out to silence). |

**Knowingly left:** the renders are ~380 px wide sources upscaled 3× (deblocked); they read as soft-focus at full screen. Higher-resolution renders dropped into `assets/site/renders/` (same names) fix it with no code changes.

**Verdict:** SHIP (every score ≥ 8, round 4)
