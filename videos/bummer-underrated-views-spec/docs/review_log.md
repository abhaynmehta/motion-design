# Review log

Checks are made from the rendered MP4 (`python3 scripts/review.py <round>`), the per-beat sheet and the playbook gate's
pixel checks. Stranger test first. Ship only when every score is ≥ 8.

## Stranger test
| Question | Answer after one watch |
|---|---|
| What is it? | Bummer's Modal Stretch Trunks — four shown by name (Aurora, Cold Rush, Foliage, Sunspill), priced ₹599 on the end card. |
| What does it do? | Modal-soft trunks whose printed waistband is a little scenic view. |
| Why care? | A different view hiding under your jeans every day — one only you get to see. |
Did any shot contradict its line? No: every "view" is the real scenic waistband of the named trunk.

## Round 1 — first draft
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 8 | desk-with-no-view → the view's on your waistband → four views → a view only you get |
| Hook | 7 | "desk pe view nahi?" on an empty grey viewfinder reads, but is quiet |
| Readability | 7 | packshots crisp (≤0.7×); names clear; a label overlap during swaps |
| Motion | 8 | postcards slide on springs, viewfinder ticks; sync 6/6 within 45 ms |
| Variety | 7 | **bug: only two views showed — a beats-vs-seconds cutoff hid Foliage/Sunspill (empty 7–10.5 s)** |
| Brand accuracy | 8 | Bummer's own packshots, the real scenic waistbands, the wordmark |
Fixes: the postcard phase ran to `b < 12.2` (read as seconds); it is beats — changed to `b < 20` so all four views show.

## Round 2
| Criterion | Score | Evidence |
|---|---|---|
| Variety | 9 | all four views now play, one per bar; the 2×2 wall lands on the big kick |
| Readability | 8 | names swapped cleanly except a brief two-label overlap at one transition; payoff line grazed the grid labels |
Fixes: labels gated to the settled card (`ta`); payoff grid tightened and its headline moved clear; the wall now clears
before the end card rises.

## Round 3 — final
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | the reframe lands; "scenic waistband · modal-soft" carries the recall words |
| Hook | 8 | empty viewfinder + "desk pe view nahi?" sets up the reveal |
| Readability (phone) | 9 | one view per card, big name, crisp packshots, all type in the safe area |
| Motion | 8 | springs only; one family (postcards into a wall); clean handoffs |
| Variety | 9 | four distinct scenic views + the wall + the end card |
| Brand accuracy | 8 | the brand's packshots, scenic waistbands, wordmark (fonts are OFL) |
| Music | 8 | Aap Jaisa Koi: each view on a kick, the wall on the song's biggest kick |
| Sound sync | 9 | 5–6/6 within 45 ms |
Gate: preflight clean (L02 warns only — stills, no shots.json); render --verify 12/12 probes identical.
