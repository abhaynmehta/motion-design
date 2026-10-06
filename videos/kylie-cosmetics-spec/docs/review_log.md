# Review log — Kylie Cosmetics · Mood Stones (spec)

Scores 1–10 on the house criteria: hook in first 2 s · readability at phone size · motion quality · variety · brand accuracy · sound sync.

## Round 0 (layout, sheets only)
- Type far too small on the phone sheet (hook 104 px, notes 27 px, end labels 26 px); window sat high with 500 px of empty card under it.
- Fix: hook 128 px, clock 210 px, names 100 px, notes 34 px, mood lines 132 px, end labels 38 px; window moved to y 690 and grown to 860 px.

## Round 1 (draft render, review/r1)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 7 | 8 | 6 | 8 | 8 | 7 |

Evidence: r1/strip_fast2 shows the returning clock ("3:00 pm") rising over the still-open full frame at 19.1 s, before the fold
reveals the card. metrics: "window opens" whoosh +133 ms late. Frame 0 is a calm card: the stone barely moves.

Fixes:
1. Clock, names and notes moved under the window in z-order: the fold now reveals them (stills t12.2, t19.3).
2. Opening whooshes moved 0.12 beat later to sit on the visible start of the open spring.
3. Frame 0: the stone grows from 86 % (was 90 %) so the first frame already moves with the first line.

## Round 2 (draft render, review/r2)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 7 | 8 | 7 | 8 | 8 | 7 |

Evidence: r2/loop_seam B f0 — frame 0 has the first line but NO window (the measured beat 0 is at 0.02 s, so the first cut
started a frame late). r2/strip_fast f797→f798: the window outline snaps from the Velvet Brew stone to the Blush Wood stone
at 26.6 s with no cut to hide it. Open whooshes now read early (−133 ms) after round 1's nudge.

Fixes:
1. The first cut starts at beat −1 (footage time still anchored on beat 0): the stone and Kylie's eyes are there on frame 0.
2. The stone outline is one track over five keys (hook, 8 am, 3 pm, 11 pm, end), so the end shrink morphs into the Blush
   Wood stone instead of snapping (stills t26.60 / t26.65).
3. Open whooshes pulled back 0.07 beat (now +0.05 beat from the open).

## Round 3 (draft render, review/r3) — SHIP
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 8 | 9 | 9 | 8 |

Evidence: frame 0 now has the stone with Kylie's eyes and the first line already rising (r3/contact 0.0 s); every act reads
as clock → name → notes → open → mood words → fold (contact 5.5–27 s); sync: every non-tick cue within 0–133 ms of its
visual (opens 0–33 ms, folds 67 ms, the end sunrise 100 ms). Determinism: `render_dense.mjs --verify` 36/36 identical.
Known and accepted: the 11 pm fold onto Kylie lands 133 ms after its silk (a soft swish, no transient); the clock roll is a
blur by design (16 hours in 0.5 s, with ticks).

## Polish after round 3 (stills t1.0 / t1.45 / t1.75)
Exporting the cover frame showed the first sentence ("you're not / the same girl / at 8 am") fully readable for only
~0.5 s before it lifted out. "the same girl" now enters at b0.2 and "at 8 am" at b0.75 (was 0.3 / 1.0), the sentence
leaves at b1.97 (was 1.85) and "as you are / at 11 pm." follows at b2.15 / b2.55: the whole sentence holds ~0.9 s.
Re-verified (36/36) and re-rendered.
