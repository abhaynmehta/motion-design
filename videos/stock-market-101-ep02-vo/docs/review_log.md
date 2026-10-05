# Review log: EP 02 voiceover edition

Why it exists: the client's layman tester found EP 01 fast and its on-screen sentences "broken". They asked for a funny Hindi
voiceover in the two-characters-explain-it style. This edition answers both: a Hinglish dialogue carries the explanation in
full sentences, the subtitles mirror it, and the cut is paced by the voice.

## Voice pipeline
- **Kokoro-82M** (Apache-2.0, open download): Hindi voices `hm_omega` (Bhai) and `hf_alpha` (Chutki). The candidates had to have
  a clear licence. Indic Parler-TTS is gated; MMS-TTS and XTTS are non-commercial; cloud TTS would bill the user's accounts.
- **ASR check:** every line was transcribed back with faster-whisper (small, Hindi). Re-worded where garbled: "sab bech daalo",
  "relax", "stonks". The full mix was transcribed too: the dialogue reads through the music and SFX. "Ruk!" was masked by the
  scratch, so the scratch and the music stop moved half a beat earlier.
- **Timing:** each line starts on a beat or half-beat; visuals sit on spoken words (whisper word timestamps); the 30 s
  countdown runs from "Soch…" to Done. (exactly 30.0 s). Speech totals 36.5 s; the film is 47.8 s.

## Round 0: sheets
- Subtitles at 40 px in a 560 px column were unreadable on a phone. Now 56 px bold across 830 px, with long lines split into
  sentence pages (≤ 2 lines) timed by characters, the current word lit. The avatars became corner stickers.
- The 30 jerseys had no label until "Sensex" was said → "TOP 30" lands on "tees". The small company-count labels were dropped.
- Empty frames before 🏏 and in the gag pause → overlapping swaps; the dialogue card hides whenever nobody speaks for > 1.6 beats.
- The callback chat gets a "typing…" bubble before Chutki's forward.

## Round 1: draft
No near-blank frames; −14.0 LUFS; longest static 2.77 s (the history line drawing its flat early years); max gap 3.07 s.
| Hook | Readability | Motion | Variety | Series | Sync | Composition | Polish |
|---|---|---|---|---|---|---|---|
| 9 | 8 | 7 | 9 | 8 | 7 | 8 | 7 |

**3 worst problems:**
1. "Ruk!" masked by the scratch.
2. The history section reads static for its first 2.8 s.
3. The dialogue card sits empty in the gag pause, and the painting's credit hits the avatars.

**Fixes:**
1. The scratch and music stop moved to b6.
2. A year counter rides the line head.
3. The card auto-hides in gaps; the painting moved up.

## Round 2: draft
Longest static 2.0 s (the hook: a slow push-in was added); no near-blank frames; −14.0 LUFS.
| Hook | Readability | Motion | Variety | Series | Sync | Composition | Polish |
|---|---|---|---|---|---|---|---|
| 9 | 8 | 8 | 9 | 8 | 8 | 8 | 8 |

## Determinism (render --verify, then a denser 36-probe check)
The 12-probe check failed once (13.4 s); a 36-probe check written for this pass found more. These are frames that painted
differently depending on the frame seeked before:
- **The dialogue card's rounded border:** its anti-aliased arc re-rasterised inexactly → square-cornered card (a lower-third with a heavy top rule).
- **The chart canvas:** it kept `lineCap = 'round'` from the previous frame → the line cap is set every frame.
- **Tiny-scale pops:** sub-pixel specks at the start of pops → pops start at 30 % scale (`POP(k)`), hidden before.
- **Partial re-raster** next to changed elements → the base layer gets a new invisible style for every t, so each seek
  re-rasterises the whole frame. Canvases are CPU-backed (`willReadFrequently`).

The same fixes went into the EP 02 text edition and EP 01 (with their own extras: EP 01's tile dimming moved from group
opacity to a veil, and its landed tile snaps exactly). All three now pass 36/36 and were re-rendered.

## Round 3: final (30 fps, adaptive motion blur, CRF 16)
47.8 s; −14.0 LUFS, −1.5 dBFS; longest static 1.1 s (the end card); max gap 3.07 s (the Nifty team while Bhai starts the
"roz…" line); no near-blank frames; 36-probe determinism 36/36. Sync: key hits on their words (scratch 0 ms, family boom
0 ms, Done 0 ms). Misses are tick/pop bursts and the spring lead on rising words.
| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 9 | "🚨 SENSEX CRASHED 800 POINTS" on frame 0 + Chutki: "Bhai, ye dekh!" |
| Readability at phone size | 8 | 56 px bold subtitles in ≤ 2-line pages, the current word lit; claims 200+ px |
| Motion quality | 8 | the avatars talk with the voice; pops from 30 %; motion blur on swaps |
| Variety / pacing | 9 | chat → meme → cricket → teams → scoreboard → memes → chart → chat, calmer than EP 01 |
| Series accuracy | 9 | same type, colours and timer; Bhai and Chutki become recurring characters (on the cover too) |
| Sound sync | 8 | lines on the beat grid; visuals on spoken words; the music stops on the scratch, back on "Chal…" |
| Composition | 8 | the dialogue card sits above the bottom UI zone; visuals in the band above it |
| Polish | 8 | VO intelligible in the full mix (ASR); deterministic |

**SHIP.**
- `renders/9x16.mp4`: voice + ducked guide music + SFX.
- `renders/9x16_vo-sfx.mp4`: voice + SFX at −14.7 LUFS, no music, for adding an Instagram song at a low level.
