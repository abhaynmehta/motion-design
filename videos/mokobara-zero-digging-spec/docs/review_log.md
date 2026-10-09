# Review log

Every check is made from the rendered MP4 (`python3 scripts/review.py <round>`), the per-beat sheet and the playbook
gate's pixel checks. Stranger test first. Ship only when every score is ≥ 8.

## Stranger test
| Question | Answer after one watch |
|---|---|
| What is it? | Mokobara's Transit Z backpack (on screen from 1 s; named at 2.5 s; logo, name and ₹6,299 on the end card). |
| What does it do? | Every essential has its own pocket — charger, cards, keys, phone — so you find each one at once ("0 SEC"). |
| Why care? | No more digging through a black bag with the laptop at 2 %: "time spent digging: 0 seconds." |
Did any shot contradict its line? No: each word sits on the shot of that item going into or out of its own pocket.

## Before round 1 — the key
The films are shot on a white studio sweep. Full-bleed would be pale canvas (L04) and a 1.8× upscale (L16), so every
shot is keyed off the sweep onto the yellow (`scripts/prep_key.py`). Contact sheets caught: the bag's grey side panels
eaten by a loose key (tightened to border-connected white + an 18 px grow), white pockets of sweep enclosed by arms and
straps (a per-shot `holes` box), the white phone eaten (MediaPipe magic-touch keypoint, tracked over frames 0–5 and
limited to a box), and the films' burned-in labels (cropped away by rows).

## Round 1 — first draft
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 8 | 2 % → rip → each item 0 SEC → 0 seconds |
| Hook | 6 | a small white line and a small beam on black: murky for the first second |
| Readability | 7 | heroes at 136 px left half the top of each page empty |
| Motion / pacing | 8 | the rip reads as a zip; a full-length seam line popped in before each zip |
| Variety | 8 | |
| Brand accuracy | 8 | Mokobara's own films, yellow and line |
| Music / sync | 8 | the rip on the 808's entry |
Fixes: heroes 136 → 168 (type scale 52 / 84 / 168 / 520, "seconds." as the 0's unit at 84); the zip tape drawn only on
the open edges plus a short closed run ahead of the slider; a warm glow inside the beam; the payoff shortened to 3 s
(it held 2.6 s with nothing new).

## Round 2
| Criterion | Score | Evidence |
|---|---|---|
| Hook | 7 | readable, but still "a line on black" |
| Readability | 8 | |
| Story | 7 | "chaabi." showed an open hand: the keys left the palm in the first frames |
Fixes: a cold open — a giant yellow **2%** (520 px, the same size as the payoff's 0) on frame 0, the beam hunting in
the lower half; the keys shot reversed so the hand closes on the keys and holds them under the tag.

## Round 3 — final
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | the 2 % and the 0 rhyme; Mokobara's own line lands as the payoff |
| Hook | 8 | a giant 2 % in the dark + "charger kahan hai?" on frame 0–1 s |
| Readability (phone) | 9 | one hero word per page at 168 px, labels 52 px, all inside y 269–1536 and clear of the right 140 px |
| Motion | 8 | springs only; one transition family (the zip), alternating vertical / horizontal |
| Variety | 8 | dark → yellow, six compartments, payoff stat, end card |
| Brand accuracy | 8 | the brand's films, yellow, logo and line (fonts are OFL substitutes) |
| Music | 8 | Big Dawgs: the quiet open is the dark, the 808 is the rip, the next big hit is the 0 |
| Sound sync | 8 | zips centred on their beats; a stopwatch click on each 0 SEC |
Gate: preflight clean; render --verify 12/12 probes identical.
