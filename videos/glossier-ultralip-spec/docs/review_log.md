# Review log

Every check is made from the rendered MP4 (`python3 scripts/review.py <round>`, the per-beat sheet, the playbook gate's
pixel checks). Critic order (playbook): the stranger test first, then craft. Ship only when every score is ≥ 8.

## Stranger test (asked of every round)
| Question | Answer a stranger gives after one watch |
|---|---|
| What is it? | Glossier Ultralip, a lipstick (the tube in frame 0, the label's front, the tag: Ultralip $22). |
| What does it do? | Moisture of a balm, sheen of a gloss, colour of a tint — in one; 9 shades. |
| Why should I care? | It's as comfortable as sweatpants: wear it daily, live in it. |
One message (the brand's line), one category (lips, every shot), one device (the care label), one ground (berry knit).

## Round 1 — first draft
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | stranger test passes; the label carries the whole argument in clothing language |
| Hook (first 2 s) | 8 | product + swipe in frame 0; "lipstick, but make it sweatpants." lands by 1.7 s with the label drop |
| Readability (phone) | 6 | label type too small at 680 px wide; "9 shades." clipped; the montage's product still was the wrong image (a portrait) |
| Motion / pacing | 8 | 3.07 changes/s, no holds; label drop/swing/flip read as physical |
| Brand accuracy | 8 | real wordmark (site sprite), tube cut-out, the page's own line and claims; Figtree for Apercu |
| Sound sync | 6 | 5/9 hits within 45 ms: flip swishes 100 ms early, row pop during the flip, a whoosh described a lift that no longer exists |
Fixes: label 860 → 820 px wide and 600+ tall with 70–160 px lines; the shades photo (Cachet carousel 06); the payoff shot
moved to her laugh; SFX retimed; the first row lands after the flip settles (beat 14.5).

## Round 2 — safe area (new gate rule L15)
The review's safe-zone overlay showed the label's logo and headers under the Reels top bar and the hook's last line, the
SMP sign-off and glossier.com in the caption band. Re-laid out: the label hangs from a stitched neckline seam at y 150
(content from y 250), the film window starts at y 810, hook lines at 960–1432, the end card rebuilt inside y 269–1536
(product name and price moved onto the hang tag).
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | |
| Hook | 8 | |
| Readability | 9 | every DOM line inside the safe area (gate L15), label type 70–160 px |
| Motion / pacing | 7 | 3.01 changes/s; but frame blending ghosts the near-1× shots (double "Glossier." in the swipe) |
| Brand accuracy | 9 | |
| Sound sync | 7 | 7/10: one flip swish 67 ms early, the thump measured against the film's slide, chime 67 ms late |
Fixes: blend frames only below 0.6× (only "sheen" is that slow); swish at 13.72, thump back on the landing beat with a
whoosh for the slide, chime at 46.16.

## Round 3 — final
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | stranger test above |
| Hook | 8 | |
| Readability | 9 | |
| Motion / pacing | 8 | crisp nearest-frame playback; label physics; gate pixel checks on the final (see below) |
| Brand accuracy | 9 | |
| Sound sync | 8 | review/rfinal metrics |

### Final render (gate output)
`preflight: clean (0 warnings)` — 3.01 picture changes/s before the CTA, longest still hold 0 s, 0 % pale canvas, every
line inside the safe area. review.py final: sync 7/10 within 45 ms — the hard hits (row pops, the tube's thump) land
within 33–67 ms; the three misses are soft swishes/chime whose measured offset moves ±100 ms between renders with the
same picture (the flip has two motion peaks), so they are left on the beat. Shared render `renders/9x16.mp4` is SFX
only; the song cut is `renders/9x16_song.mp4` (gitignored).
