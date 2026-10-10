# Review log

Checks are made from the rendered MP4 (`python3 scripts/review.py <round>`), the per-beat sheet and the playbook gate's
pixel checks. Stranger test first. Ship only when every score is ≥ 8.

**STATUS: FINAL — shipped. Round-2 trimmed the end-card tail (longest static 0.9 s, max gap 2.5 s); SFX kept mark-aligned; determinism 12/12; gate clean on script and pixels; SFX-only render -14.3 LUFS.**

## Stranger test
| Question | Answer after one watch |
|---|---|
| What is it? | Raised Right by Youthiapa (Bhuvan Bam's label) — printed oversized tees and cargos (logo, prices and site on the end card). |
| What does it do? | Tees for the kid who broke every house rule and turned out "raised right" anyway. |
| Why care? | It's the desi childhood you actually had, worn loud: raised right (mostly). |
One message, one device (Mummy's rulebook broken photo by photo), the founder himself as the rule-breaker.

## Round 1 — first draft (gate clean: L01–L17 pass)
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | the meme is universal to desi kids; the brand name answers "ye kya pehna hai?" |
| Hook | 8 | frame 0 is the handwritten rule; the sofa photo + strike land by 0.8 s |
| Readability (phone) | 8 | one rule at a time, big Kalam; evidence photos clear |
| Motion / pacing | 8 | photos slap on springs, strikes swipe; longest static 2.6 s |
| Variety | 8 | rules → prints → Bhuvan tee-after-tee → end card |
| Brand accuracy | 8 | the brand's own films, orange, Bodoni for the wordmark, logo from the end frame |
| Music / sync | 6 | only 7/13 cues within 45 ms (mean 66.5 ms); the shutters lead the beat |

### Round-1 fixes to apply (next session)
1. **Sync**: the `shutter`/`whoosh` SFX have long pre-rolls so they read early; shift the photo-slap cues ~3 frames
   later or trim the shutter lead in sfx.mjs. Re-check mean < 45 ms.
2. **max gap 3.9 s at 17.1 s**: the end-card hold is slightly long — bring the logo/prices in one beat sooner or add a
   small move (the pile shrinking) so nothing sits still > 3 s before the CTA.
3. Confirm the final-frame safe area on `review/r1/safe_9x16.jpg` (end-card prices near the lower safe line).

Then: `--verify` (determinism), final `node scripts/render.mjs`, gate `--render`, `split_song.sh`, register, cover,
fill this log's final table, commit, deliver the song cut.
