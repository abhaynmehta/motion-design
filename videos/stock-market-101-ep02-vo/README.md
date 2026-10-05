# Stock Market 101 · EP 02 · Sensex & Nifty: Hinglish voiceover edition

A 47.8 s 9:16 Reel in the "two characters explain it" format, with original characters. **Bhai** explains the Sensex and
Nifty to his little sister **Chutki** in Hinglish ("Arre bhai, ye dekh!"). Subtitles are full sentences, with each word lit as
it's spoken. Every visual lands on its spoken word, and the avatars' mouths follow the voice.

It covers the same story as the text edition, at a calmer pace:
- the family-group panic, then Bhai's "Ruk!" (record scratch)
- "Sensex hota kya hai?" → "…pata nahi." → a Ravi Varma meme
- a 30-second cricket explainer
- 800 points is just 1%: a Munch vs Ravi Varma meme
- 1979: 100 → 72,382 (🚀 stonks) → Done. → "Sharma Uncle left the group 🚪"

| File | What |
|---|---|
| `renders/9x16.mp4` | Final: 1080x1920, 30 fps, motion blur, CRF 16. Voice + guide music (ducked) + SFX at −14 LUFS |
| `renders/9x16_vo-sfx.mp4` | **Voice + SFX, no music.** Post this and add your Instagram song at a low level under the voice |
| `renders/covers/cover_ep02_vo.png` | Cover with Bhai and Chutki |
| `docs/script.md` | The full dialogue: Hinglish, Devanagari TTS text, English gloss, timings |
| `docs/review_log.md` | Critique rounds and determinism fixes |
| `vo_script.json` | The dialogue (edit it here, then rerun the VO pipeline) |

## Rebuild
```
bash scripts/fetch_sources.sh                                   # guide track + music bed with the record stop
<venv>/bin/python scripts/vo_kokoro.py                          # Kokoro TTS (pip install kokoro soundfile faster-whisper, torch CPU)
python3 scripts/vo_place.py                                     # VO on the beat grid → audio/vo.wav, film/vo_env.js
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --sheet && node scripts/render.mjs --fps 30
```
Facts as of 5 Oct 2026: Sensex 72,382.47, Nifty 22,555.75; Sensex base 1978–79 = 100. For education only; not investment advice.
