# Review log — Rare Beauty · "just a little" (spec)

Scores 1–10: hook in first 2 s · readability at phone size · motion quality · variety · brand accuracy · sound sync.

## Round 0 (sheets)
- Hook circle showed Selena's forehead: a 9:16 shot keeps its full-frame scale inside a circle. Fix: shots that never open
  (the hook) fill their circle instead (`fit: 'circle'`).
- "…okay, two." landed before the second dot. Measured the source: dot 1 at 1.06 s, dot 2 at 1.81–1.90 s. The clip now runs
  at 0.72× so dot 2 lands on b6.42 with the line.
- End card sat high; moved to the optical centre; added the brand's "by Selena Gomez" line from its own end card.

## Round 1 (draft render, review/r1)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 7 | 8 | 9 | 8 |

Evidence: r1/contact 4.0 s — "just a little" has already left when its full stop lands (b4.6), so the joke's set-up reads for
0.86 s and the dot appears on an empty card. Sync: all cues −100…+133 ms.

Fixes:
1. "just a little" holds from b3.6 until the opening full stop has grown over it (b5.12); the stop lands at b4.45.
2. Byline 28 → 32 px (unreadable on the phone sheet).

## Round 2 (draft render, review/r2)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 7 | 8 | 9 | 8 |

Evidence: stills t4.25–4.5: the berry full stop vanished ~0.15 s before the opening circle appeared (the open used a leading
spring, the stop's hide did not). r2/strip_fast f243→f244 (8.13 s): a jump inside the blend clip — the source changes angle
at 9.6 s (too soft for the scene detector) — and "a long way." had only 0.9 s on screen before leaving.

Fixes:
1. The opening circle grows from the full stop with no lead, and the stop hides only when it does: one continuous dot.
2. The blend clip now plays 7.52–9.35 s (ends before the angle change); "a little goes / a long way." holds to b9.55.

## Round 3 (draft render, review/r3) — SHIP
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 8 | 9 | 9 | 8 |

Evidence: r3/contact 3.0–4.5 s: "just a little" sets, its berry full stop lands (4.0 s) and grows into the frame without a
gap; 5.0–6.0 s: "one dot." then "…okay, two." as the second dot lands; the blend runs clean to the glow (6.5–9.0 s); six
faces dab into the swatch grid (9.5–12 s); the mauve wash, the breathing circle (13–20 s); Selena; the frame closes into
the full stop of "one dot at a time." (23.5 s). Sync: every cue −100…+133 ms. Determinism: 36/36 identical.
Known and accepted: the closing fold lands 133 ms after its silk (a soft swish with no transient).
