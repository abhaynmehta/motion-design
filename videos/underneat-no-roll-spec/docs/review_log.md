# Review log

Every check is made from the rendered MP4 (`python3 scripts/review.py <round>`), the per-beat sheet and the playbook
gate's pixel checks. Stranger test first. Ship only when every score is ≥ 8.

## Stranger test
| Question | Answer after one watch |
|---|---|
| What is it? | Underneat's High Waist Tummy Tucker Shorts (in her hands at 5 s, on her throughout, named on the end card with ₹1,999). |
| What does it do? | A tiny loop clips the shorts to your bra, so they don't roll down. |
| Why care? | Walk, spin, bend in a fitted dress and nothing moves: "roll down? aaj nahi." |
One message, one category (shapewear), one device (the waistband band), and the band hides the film's own captions.

## Round 1 — stills, then the first draft
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | the joke is the brand's own; the drop is the product feature |
| Hook | 8 | belly + rolling waistband + "shapewear?" in frame 0 |
| Readability | 7 | the second band line clipped at the band's bottom; the white loop icon floated over her body mid-frame; the end card's price showed before it rose |
| Motion / pacing | 8 | 1.55 changes/s; the roll-offs read as gravity |
| Brand accuracy | 8 | the brand's film, coral, a vector logo traced from its end card |
| Music / sync | 7 | 4/8 within 45 ms |
Fixes: band 250 px with new baselines and a smaller sag; the loops moved to the margins beside the film (the band is
clipped at both ends); each end-card line masked separately; four cues nudged.

## Round 2 — final
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | |
| Hook | 8 | |
| Readability | 9 | type scale 52 / 84 / 120 / 160 (L17 PASS); all type inside the safe area (L15) |
| Motion / pacing | 8 | 1.49 changes/s before the CTA (L13 WARN, ≥ 1.2), longest hold 1.25 s |
| Brand accuracy | 9 | clips at 1.39× (L16 PASS) |
| Music / sync | 9 | 7/8 within 45 ms, mean 25 ms |
Determinism: the first verify failed at 18.06 s — the ₹ glyph lives in the latin-ext font file, which loaded lazily on
first use; the film now preloads it (and the skill's engine now loads every face with a sample that spans its subsets).
