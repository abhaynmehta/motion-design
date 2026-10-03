# Review log

Every check is made from the rendered MP4s (`python3 scripts/review.py <round>`) plus the per-beat contact sheets
(`node scripts/render.mjs --sheet`). Critic prompt: the skill's `reference/CRITIQUE.md`. Ship only when every score is ≥ 8, after at least 3 rounds.

---

## Round 0: per-beat sheets while building (no audio)
Two sheet passes before the first draft.
- Doe-foot flash: "3 new drops." sat on the applicator. Pinning the frame did not clear it, because the applicator fills the frame centre. **Fix:** a graphic split, with porcelain sliding in under the type and the doe-foot in a tall window right of x 650.
- Product names on busy footage (ch3 title over the red bottle, gloss lockup over the bottle pattern) and the accumulating sentence over the red wand and pattern were unreadable. **Fix:** porcelain label cards for every product name (one consistent device), and a split layout for the ch3 sentence.
- "The barrier + hydration essential" crossed the hero jar's lid. **Fix:** the hero shot breathes, with no type.
- Labels at 30 px rose were too faint. **Fix:** 36–42 px, ink on footage.

## Round 1: draft_9x16.mp4 (30 fps, no blur), first score + SFX
| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | drip + "3 new" on frame 0, "drops." on b1, three products and Katrina by 2.0 s |
| Readability at phone size | 7 | 360 px phone sheet: claims fine; URL, byline and chips faint |
| Motion quality | 7 | strip_fast2 (14.5 s): rotating compacts double-exposed, from blending 25 fps frames at 1x |
| Variety / pacing | 9 | full bleed, window split, strips, cards, split curtain, shade flip, photos; max gap 2.0 s |
| Brand accuracy | 9 | the brand's footage, fonts, logo, photos, copy and disclaimers |
| Sound sync | 8 | 22/25 hits within 45 ms (misses are count-up ticks, a rolling number has no single onset) |
| Composition | 8 | safe_9x16: type clear of the UI zones |
| Polish | 7 | beat tracker misread the half-time intro (beat 0 at 0.357 s), so the grid was taken from the score |

**3 worst problems:** (1) ghosting on fast footage; (2) faint small labels; (3) a dark mix (presence 22 dB under the bass, dull on phone speakers).
**Fixes:** nearest real frame at ~1x, blend only in slow motion (motion-compensated interpolation was tested and warps the rotating compacts); labels 36–42 px; bass harmonics for small speakers, keys and percussion up, a presence shelf (presence −22 → −16 dB re total).

## Round 2: draft, determinism check
`--verify`: 12/12 probes identical. No near-blank frames; longest static 1.37 s (the end card); loudness −14.2 LUFS.
| Criterion | Score | Evidence |
|---|---|---|
| Hook | 8 | unchanged |
| Readability | 7 | the 2 fps contact shows each product card fully legible for only ~0.2 s (two beats, minus rise and exit); "+138%" ~0.3 s; "One dab." ~0.2 s |
| Motion quality | 8 | no ghosting; zoom-throughs and strip opening clean |
| Variety / pacing | 9 | — |
| Brand accuracy | 9 | — |
| Sound sync | 8 | 21/25 within 45 ms |
| Composition | 8 | disclaimer collided with the ch1 label card |
| Polish | 8 | — |

**3 worst problems:** (1) product names too brief to read; (2) +138% too brief; (3) disclaimer collision / cards wider than their text.
**Fixes:** chapter 1 retimed (second macro dropped, the swirl gets 1.5 s); label cards hold across two shots like a lower-third, with default-preset text; "One dab." and "18 ways…" lead in earlier; disclaimer moved under the claim label; cards fitted to their text.

## Round 3: final render (30 fps, adaptive motion blur, CRF 16)
See the final numbers below (filled in from review/r3/metrics.json and `--verify`).
