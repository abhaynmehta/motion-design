# Review log — Typsy · "the dessert menu" (spec)

Scores 1–10: hook in first 2 s · readability at phone size · motion quality · variety · brand accuracy · sound sync.

## Round 0 (sheets)
- Wrong moments picked from the strips: "co_tongue" was a lip-balm close-up, the strawberry laugh was motion-blurred and
  the coconut smile sat off-centre. Re-cut from fine strips: a peach bite, the bottle baking in the oven, the bottle in the
  strawberry basket, the smile at fx 0.6, and the clean Chocolate Fondant bottle hero (48.1–50.7 s).
- Menu rows 56/32 px and the logo (a 1080-wide PNG with 30 % empty margin) read small on the phone sheet: rows 62/36 px,
  thumbnails 170 px, logo cropped to its ink and set 760 px wide. Notes lines shortened so none runs off the frame.
- The pink "wear it." marker outstayed its words: it now leaves just before them.

## Round 1 (draft render, review/r1)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 7 | 8 | 9 | 8 | 8 |

Evidence: metrics max gap 4.4 s at 21.4 s (the bill: one line every 0.75 beat reads as slow next to the dessert montages);
the menu's small labels (TONIGHT'S, SPRITZ BODY & HAIR MISTS, ₹799 EACH) at 30–34 px are hard to read on phone_9x16;
the end card held 2.9 s after the logo (rule: ≤ 2 s). Sync: every cue −100…+133 ms.

Fixes:
1. The bill prints a line every 0.6 beat, the punchline lands 0.9 beat earlier, and the whole end comes in 1 beat sooner
   (film 28.3 → 27.7 s; logo to last frame 2.2 s).
2. Menu labels 34–38 px.

## Round 2 (draft render, review/r2)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 8 | 9 | 8 | 8 |

Evidence: r2/phone_9x16 — menu labels now read at phone size; the bill reads in 3.8 s (was 4.4); the end card holds 2.2 s.
Remaining: the music bed was cut for the old 28.3 s length, so the new end (27.65 s) loses the 1.2 s fade.

Fixes:
1. Re-cut the guide track for 27.65 s (fade on the last 1.2 s), re-mixed to −14 LUFS.

## Round 3 (draft render, review/r3) — SHIP
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 8 | 9 | 9 | 8 |

Evidence: r3/contact — chocolate pour + "you can't / eat this…" on frame 0, the lift on "…but you can wear it."; the menu
reads; each dish opens, plays six cuts with its smell line and notes, folds back with a tick; the bill prints; the logo
and three bottles. Music re-cut for 27.65 s with its fade; −14.0 LUFS. Sync: every cue −100…+133 ms. Determinism 36/36.
Last fix (stills t2.9 / t3.3): the cover frame showed "…but you can" running into the right-hand Reels rail; hook type
150 → 134 px and the pink marker resized to match.

Final render (review/rfinal): −14.0 LUFS, true peak −1.5 dBTP. Known and kept: 5 frames (0.17 s) of plain pink at 25.27 s
between the receipt flying off and the logo rising — a breath before the sign-off.
