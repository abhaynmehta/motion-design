# Review log

Every check is made from the rendered MP4 (`python3 scripts/review.py <round>`), the per-beat sheet and the playbook
gate's pixel checks. Stranger test first. Ship only when every score is ≥ 8.

## Stranger test
| Question | Answer after one watch |
|---|---|
| What is it? | Minimalist SPF 50 sunscreen (the tube at 0 s, 15 s and 18 s; the name and ₹359 at the end). |
| What does it do? | Protects at SPF 56.6 / PA++++ measured in an independent lab; leaves no white cast; feels like a moisturiser. |
| Why care? | Every tube says 50 — this one is proven: "50 likha. 56.6 nikla." |
One message, one category (sunscreen, every shot), one device (the lab readout), one ground (Minimalist orange).

## Round 1 — first draft
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | the stranger test passes; the Hinglish lines read as one argument |
| Hook | 8 | the tube + "SPF 50 likha hai." in frame 0; "par hai kya?" at 1.6 s |
| Readability | 7 | the readout panel covered her mouth; "independent lab · in-vivo · ISO 24444" ran off the edge; the readout settled on "56.5" |
| Motion / pacing | 6 | 1.28 picture changes/s: one continuous take under the readout for 4 s, a still tube for the payoff |
| Brand accuracy | 8 | the real tube, wordmark, orange; claims from the product page's lab report |
| Music / sync | 6 | 5/10 within 45 ms |
Fixes: her cut-out raised and the panel slimmed; ISO moved into the panel label; the readout locks on 56.6; a tighter
angle on the beat in each long take; on the song's dead stop the frame and the readout freeze (the silence becomes the
"…?"); the tube punches in on "56.6 nikla.".

## Round 2 — draft
| Criterion | Score | Evidence |
|---|---|---|
| Story / recall | 9 | |
| Hook | 8 | |
| Readability | 9 | type scale 48 / 72 / 108 / 162 / 300 (gate L17 PASS), every line inside the safe area |
| Motion / pacing | 8 | 1.44 → final ≥ 1.5 changes/s, longest hold 1.0 s; the freeze-and-slam reads as the test |
| Brand accuracy | 9 | |
| Music / sync | 8 | hits on the song's beats; the readout freezes exactly on the stop |
Clip quality: every shot ≤ 1.38× its 608 px source; the punch-ins take three shots to 1.51× (gate L16 WARN, kept: they
are short second angles).

## Final
`preflight: clean (1 warning: L16 punch-ins 1.51×)`; deterministic 12/12 (after preloading the ₹ font subset, which a
sibling reel's verify caught); −14.0 LUFS. Sync 5/10 within 45 ms, all within ±100 ms — the measured offsets move with
the cue position for spring-driven type (moving four cues by 60–100 ms flipped their sign), so the hits stay on the
song's beats. Shared render: SFX only; the song cut is `renders/9x16_song.mp4` (gitignored).
