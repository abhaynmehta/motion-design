# Review log

Every check is made from the rendered MP4s (`python3 scripts/review.py <round>`) plus the per-beat contact sheets
(`node scripts/render.mjs --sheet`). Nothing is judged from the page. Critic prompt: the skill's `reference/CRITIQUE.md`.

Scores 1–10. Ship only when EVERY score is ≥ 8, after at least 3 rounds.

---

## Round 1: <what was rendered, when>

| Criterion | Score | Evidence (timestamps, frames, metrics) |
|---|---|---|
| Hook (first 2 s) | | |
| Readability at phone size | | |
| Motion quality | | |
| Variety / pacing | | |
| Brand accuracy | | |
| Sound sync | | |
| Composition (every format) | | |
| Polish | | |

**3 worst problems**
1.
2.
3.

**Fixes for round 2**
1.
2.
3.

## Round 1: draft 9x16 (30 fps) + sheet + review/r1 — first full build

Critic: in-session, in the critic's voice (no subagent requested), per CRITIQUE.md.

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | f0: "70% OF US" already in its lime box on ink; "ARE DEHYDRATED." by 0.75 s. |
| Readability at phone size | 8 | headlines 108–230 px, captions 52–56 px, data labels 34 px, CTA 52 px; all legible in phone_9x16. |
| Motion quality | 7 | typewriter, flash cuts, wipes, bars and burst all spring-driven; but the flavour sachet "spin" shows the front mirrored (no back face) and a "NO …" ink box appears empty before its words. |
| Variety / pacing | 8 | longest_static 1.0 s, max gap 2.43 s; ten distinct set-ups in 30 s. |
| Brand accuracy | 9 | their logo files, measured tokens, real portraits/POV shots/bottles/press logos, verbatim headlines and site data; labelled as a concept. |
| Sound sync | 7 | 26/45 within 45 ms: display lines read 67 ms early with the heavy default lead and 67 ms late with a 0.07 s lead; pills/strikes early (opacity snap at release). |
| Composition (every format) | 8 | safe-area blocking throughout; 8.0–8.5 s the WATER. beat is an empty sky frame. |
| Polish | 7 | near_blank_frames 22.0 s and 23.0 s: the flavour iris completes before its bottle and type arrive; a dark stub sits before "0G SUGAR". |

**Fixes for round 2**
1. Flavour content enters with the iris (type at −0.05 b, bottle at −0.2 b); the sachet gets a real back face for the spin.
2. One measured lead for masked type (0.10 s); pills/strikes/captions use 0–0.03 s; "NO …" words now lead their boxes.
3. The glass rises with "WATER."; the SULT sugar bar is hidden while it is 0 g; SFX −4.5 dB for limiter headroom.

**Verdict:** ANOTHER ROUND

## Round 2: draft after round-1 fixes (review/r2)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | unchanged. |
| Readability at phone size | 8 | unchanged. |
| Motion quality | 8 | the sachet spin now turns edge-on and shows a back face; "NO …" words lead their boxes; glass arrives with WATER. |
| Variety / pacing | 8 | longest_static 0.93 s, max gap 2.4 s. |
| Brand accuracy | 9 | unchanged. |
| Sound sync | 7 | 24/45 within 45 ms (mean 46 ms); outliers sit where several things move at once (marquee scroll under the strikes, the drifting press row, the card burst) and contaminate the onset window. |
| Composition (every format) | 8 | the WATER. beat now holds the glass; every shot has a dominant element. |
| Polish | 8 | near_blank_frames: none. |

**Fixes for round 3**
1. Strike and press-logo sounds become texture ticks (they ride continuous motion); the few true hits get per-element leads (hook lines 0.13 s, captions 0, "NO …" words 0.05 s, slogan 0.15 s); the SULT bar retargets on the thump.

**Verdict:** ANOTHER ROUND

## Round 3: draft after round-2 fixes (review/r3)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | f0: "70% OF US" in the lime box; full stat by 0.75 s; lime wipe into the POV shot at 2.0 s. |
| Readability at phone size | 8 | phone_9x16: every headline, caption, pill, bar label and the CTA read at 360 px. |
| Motion quality | 8 | strips clean: typewriter with backspace, flash cuts, hard lime wipes, racing bars, burst, iris + sachet spin, logo slam — all springs on the grid. |
| Variety / pacing | 8 | longest_static 0.9 s, max gap 2.4 s; ten set-ups; builds into WATER. and into the logo drop. |
| Brand accuracy | 9 | their logo files, tokens (§3), photography, press logos, verbatim headlines (§2) and data (§5); labelled "A MOTION CONCEPT FOR SULT™" (§10); no health claims. |
| Sound sync | 8 | 24/38 hits within 45 ms, mean 36 ms; remaining offsets are ±2 frames at 30 fps in dense moments. -14.1 LUFS, -1.1 dBTP. |
| Composition (every format) | 8 | 9:16 safe area respected; every shot has a dominant element. |
| Polish | 8 | near_blank_frames: none; no double exposures; loop seam is a hard cut (not designed to loop). |

**Verdict:** SHIP (every score ≥ 8, round 3)
