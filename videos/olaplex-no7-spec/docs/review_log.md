# Review log

Every check is made from the rendered MP4 (`python3 scripts/review.py <round>`, the per-beat sheet, the playbook gate's
pixel checks). Critic order (playbook): the stranger test first, then craft. Ship only when every score is ≥ 8.

## Stranger test (asked of every round)
| Question | Answer a stranger gives after one watch |
|---|---|
| What is it? | OLAPLEX Nº.7 Bonding Oil (bottle at 4.4 s and 21.3 s, name on screen twice, $32). |
| What does it do? | Tames frizz, adds shine: 125 % more shine*, 72-hour frizz control, 77 % less breakage, each on an unretouched after. |
| Why should I care? | Humidity wins every day; three drops and your hair wins instead. |
One message (SMP "Three drops and humidity loses."), one category (hair, every shot), one device (the match).

## Round 1 — first final render (before the gate's pixel checks were tightened)
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 8 | stranger test passes; script.json beats map 1:1 to the cut |
| Hook (first 2 s) | 5 | one held BEFORE for 2.4 s with a slow push: the frame barely moves (diff 2–3 per ¼ s) |
| Readability (phone) | 6 | "3 drops." white over her white shirt; "your hair wins." over the blonde's white top |
| Motion / pacing | 5 | **gate FAIL L13: 1.07 picture changes/s**; each replay holds its after ~2 s |
| Brand accuracy | 8 | real films, packshot, wordmark; claims sourced and footnoted |
| Sound sync | 8 | 8/10 hits within 45 ms |
Fixes: the hook becomes three BEFOREs, one per beat, humidity scoring on each (3 – 0) — a comeback story to 3 – 4;
after each point the after springs from its panel to the whole screen; a second cut in the "drops" beat (she works it
through her hair, in-point moved off the red kit box); "until 3 drops." on a broadcast lower-third plate.

## Round 2 — draft + final
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | the 3 – 0 → 3 – 4 comeback makes the claim a result you watch happen |
| Hook | 8 | three frizzy befores in 2.7 s, the score ticking on the beat |
| Readability | 7 | "your hair wins." over the white top still weak → on the plate too ("wins." in amber) |
| Motion / pacing | 8 | 1.46 changes/s before the CTA (WARN, ≥ 1.2), longest hold 1.0 s (was 2.4 s) |
| Brand accuracy | 8 | |
| Sound sync | 8 | 8/10, mean 33 ms |

## Round 3 — safe area (new gate rule L15) + final
The Reels/TikTok UI covers the top 14 % and the bottom 20 %: the scoreboard's labels, the end-card logo, the footnote and
"your hair wins." sat in those bands. Re-flowed: board at y 280, replay panel 480–1240 (films top-aligned so BEFORE /
AFTER stay visible), footnote above the stats, both plates and the end card inside y 269–1536.
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | stranger test above |
| Hook | 8 | |
| Readability | 9 | every line inside the safe area (gate L15 PASS), white or amber on dark plates |
| Motion / pacing | 8 | gate pixel checks on the final (see below) |
| Brand accuracy | 8 | |
| Sound sync | 8 | review/rfinal metrics |

### Final render (gate output)
`preflight: clean (1 warning)` — L13 1.41 picture changes/s before the CTA (WARN: ≥ 1.2 passes, 1.5 is the target; the
replays are macro hair, so the wipe and the takeover are the only big changes per replay), longest still hold 1.0 s,
0 % pale canvas, every line inside the safe area. review.py final: −14.1 LUFS, sync 8/10 hits within 45 ms (mean 33 ms),
longest static stretch 1.6 s (the end card). Shared render `renders/9x16.mp4` is SFX only (−13.7 LUFS); the song cut
is `renders/9x16_song.mp4` (gitignored).
