# Review log

Checks are made from rendered MP4s (`python3 scripts/review.py <round>`) and per-beat sheets (`node scripts/render.mjs --sheet`).
Critic prompt: the skill's `reference/CRITIQUE.md`. Ship only when every score is ≥ 8, after at least 3 rounds.

## Brief change before the build
The first cut (a tense 130 BPM track, "What is a stock?") was re-planned after the client asked for:
- copy simple enough "for a two-year-old";
- Indian framing;
- a daily-series thumbnail system;
- mellow Instagram music.

What changed:
- **Script:** a company → Raju's chai stall; "stock exchange" → "the stock market, a mandi for shares"; one jargon word (SHARE).
- **Music:** cut to a 76 BPM lo-fi grid. The guide is Mixkit "Sweet September". The beat tracker read its swing as 101 BPM; 21 snares fit
  76.000 BPM with 0 ms residual, so beats.json was written from that fit. Jhol (76 BPM) locks to the same grid.
- **Timer:** honest. 30.0 s from the hook's collapse (b2) to "Done." (b40).

## Round 0: per-beat sheets
- "MARKET" (330 px) and the outline "MARKET." (300 px) ran off the right edge → 290 / 270 px.
- "looks scary?" in hairline vanished on the chart → expanded weight 500, 104 px.
- The tile that flies into your card was an empty white slice → the green kettle piece.
- Recap cards were small for phone → 128 px type, 360 px cards.
- The exchange shot was crowded → chips, "A mandi for shares." and the ticker each get their own row.
- Phone sheet: the HUD tag, BUYERS/SELLERS, card label and disclaimer were too small → 26–36 px.

## Round 1: draft_9x16.mp4 (30 fps, no blur)
−14.0 LUFS; longest static 1.8 s (end card); max gap 1.93 s; 9 near-blank frames at 32.1 s.
| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | frame 0: STOCK MARKET on a frantic chart; b1 "looks scary?"; b2–b3 "It's just a CHAI SHOP." |
| Readability at phone size | 8 | claims 180–380 px; phone sheet legible |
| Motion quality | 7 | the hook type left 0.24 s before the drop, so the collapse landed on an empty frame |
| Variety / pacing | 9 | 18 screens in 34.7 s: chart, paper illustration, tiles, card, typewriter, ticker, live chart, cards, timer |
| Brand / series accuracy | 8 | one display family + mono, one accent, timer as the series signature |
| Sound sync | 7 | drop −100 ms, STOCK MARKET +100 ms, next episode +133 ms |
| Composition | 8 | safe_9x16: claims clear of the bottom and right UI; the hook's MARKET touches the right zone in the top half (no UI there) |
| Polish | 7 | blank frames between "Done." and EP 02; empty cards and an empty frame at the recap exit |

**3 worst problems:** (1) the drop: the hook type leaves before the boom; (2) blank frames (Done → EP 02, recap → finale);
(3) STOCK MARKET lands after its boom. **Fixes:** the hook type exits on b2 with the collapse; STOCK lands on b25.25; the
next-episode label overlaps the "Done." exit; card 1 rises as the market leaves; the cards hide with their words; the big
timer rises while the HUD timer leaves. Also: "Now a piece of the shop is" → "Now this piece is"; the HUD turns ink as the
paper passes under it; the stall builds as the panel settles.

## Round 2: draft after the fixes
`--verify` 12/12 identical. Sync, key hits: drop 0 ms · CHAI SHOP −33 · STOCK MARKET +33 · DONE 0 · EP 02 +33. The
remaining misses are pop/tick bursts (texture with no single onset) and the engine's 2-frame lead that makes rising words read on the beat.
| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 9 | the collapse, the exit and the boom are one event on b2 |
| Readability at phone size | 8 | — |
| Motion quality | 8 | one continuous chain: chart → line → timer; stall → tiles → card; HUD timer → big timer |
| Variety / pacing | 9 | — |
| Brand / series accuracy | 8 | — |
| Sound sync | 8 | key hits within 33 ms; the music drop-out sits under "price down" |
| Composition | 8 | — |
| Polish | 8 | only 4 near-blank frames left (Done → EP 02) → fixed by overlapping the EP 02 label; stills at 29.7 / 29.9 / 32.2 s confirmed |

All ≥ 8 → final as round 3.

## Round 3: final render (30 fps, adaptive motion blur, CRF 16)
−14.0 LUFS, −1.5 dBFS peak; longest static 0.77 s; max gap 1.9 s; `--verify` 12/12 identical. Key hits: drop 0 ms ·
CHAI SHOP −33 · STOCK MARKET +33 · DONE 0 · EP 02 +33. One 3-frame low-luma swap at 32.23 s ("Done." lifts out as
"SENSEX &" rises; the "NEXT · EP 02" label is on screen): this is the gap the rise rule requires between outgoing and incoming words, not dead time.
| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 9 | STOCK MARKET + chaos on frame 0 → "looks scary?" b1 → collapse + boom b2 → CHAI SHOP b3 |
| Readability at phone size | 8 | phone_9x16: every claim and number legible at 360 px |
| Motion quality | 8 | blur on rises, tiles and counters; no double edges |
| Variety / pacing | 9 | something new every ≤ 1.9 s |
| Brand / series accuracy | 8 | the timer, type and colours match the cover system |
| Sound sync | 8 | key hits within 33 ms; the drop-out lands under "price down" |
| Composition | 8 | safe zones clear |
| Polish | 8 | no dead frames; the timer is honest (30.0 s) |

**SHIP.**
- `renders/9x16.mp4`: 1080x1920, 30 fps, 34.7 s, guide music + SFX, CRF 16.
- `renders/9x16_sfx-only.mp4`: SFX at their mix level, −23.8 LUFS, CRF 22, for adding the Instagram song.
- `renders/covers/`: the EP01 cover, EP02–09 drafts and `grid_preview.jpg`.

## Determinism follow-up (during EP 02)
A denser 36-probe `--verify` (the stock check probes 12 times) found 5 frames that painted differently depending on the frame
seeked before. All were sub-pixel to small differences (max 88 levels on a few pixels), but they break the render contract.
Fixed in the source:
- **The tile dimming** used group opacity on 99 tiles → a paper veil whose colour alpha follows the dim spring.
- **The landed tile** kept a residual near-zero rotation → it snaps exactly when landed (and its animated blur shadow became a crisp outline).
- **Pops** (₹ coins, buyer/seller dots, the dream-shop outline) started from ~0 scale → start at 30 % (`POP`); the level bars never draw below 3 %.
- **Partial re-raster** → the base layer gets a new invisible style for every t, so each seek re-rasterises the whole frame;
  canvases are CPU-backed (`willReadFrequently`).

36/36 identical after the fixes; `renders/9x16.mp4` and the SFX-only copy were re-rendered from the fixed source.
