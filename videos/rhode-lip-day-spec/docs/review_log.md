# Review log — rhode · "never skip lip day." (spec)

Scores 1–10: hook in first 2 s · readability at phone size · motion quality · variety · brand accuracy · sound sync.

## Round 0 (picking footage)
- Half-second strips of all 14 shade films: the newer films (squeeze, jump, push) carry a burned-in "peptide lip shape /
  shade: …" caption in the bottom 10 %, and two segments (squeeze 8.5–13 s, push 9–16 s) show a different product
  (Peptide Lip Tint). Every shot is a 940-wide window crop centred on the lips, which keeps the captions out; the tint
  segments are not used.
- The site's Rektorat Heavy and Swiss are licensed to rhode: Russo One (near-identical width and squared counters, checked
  side by side) and Inter instead; the licensed files were deleted.

## Round 1 (stills, then the sheet)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 7 | 8 | 9 | 8 | — |

Evidence: t0 "never skip legday." (the space before "day." collapsed in its own div); the window (1000 tall) left the
bottom 310 px empty; at full stretch "stretch" and the flex push reached the frame edge; the end pencil was small and
its tip later crossed the subtitle.

Fixes:
1. Non-breaking space; window 940 × 1060 (frames re-extracted), coach cues lowered with it.
2. Stretch spread 0.1 → 0.07, flex push 0.13 → 0.11 (left side 0.6×).
3. Pencil 0.72 → 0.82 and moved to (720, 1090); price, logo and sign-off re-spaced; descriptors 30 → 34 px.

## Round 2 (kinetic-word peaks, end card)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 8 | 9 | 9 | 8 |

Evidence: stills at each word's peak (lunge leaning, stretch spread, squeeze pressed, flex's "e" pumped twice, twist both
ways, lift mid-rise, jump mid-hop, press squashed, push dominoes, spin mid-flip) all read; the end card clears the
subtitle. SFX written (68 cues: tick roll into "lip", beeps + plate thumps on 3-2-1, whistle + boom on the drop, one
sound per kinetic action, rising speed-round beeps, plips for the class, chime, sign-off whistle) and mixed to −14 LUFS.

## Round 3 (sheet, phone sheet, determinism) — SHIP
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 9 | 9 | 9 | 8 |

Evidence: the dense determinism check failed 4/36 (max diff 8–40) at t 7.0, 10.8, 11.5, 13.0 s — all mid kinetic move:
DOM letters under changing skew/scale rasterised differently depending on the frame painted before. The kinetic words
moved to a canvas (same transform order about each letter's 50 % / 85 % point); then 36/36 identical.

## Final (review/rfinal)
27.0 s, 1080×1920 @ 30 fps, H.264 yuv420p CRF 16 with adaptive motion blur; −14.1 LUFS, peak −1.5 dBFS.
Max gap 3.7 s (the end card), no near-blank frames. Sync: 32/50 cues within 45 ms; the rest are whooshes (they build into
the window push by design) and the class plips (texture).
