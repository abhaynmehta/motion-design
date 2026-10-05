# Stock Market 101 · EP 02 · "What are Sensex & Nifty?" (text edition)

A 34.3 s 9:16 Reel. A bait-and-switch hook (the family group panics: "🚨 SENSEX CRASHED 800 POINTS 🚨 SELL EVERYTHING NOW!!!",
Papa asks "Beta… what is Sensex?", record scratch, "The whole family right now:" on a Ravi Varma painting), then a 25-second
countdown explains it with cricket:
- Sensex is a team of 30 of India's biggest companies (BSE); Nifty is a bigger team of 50 (NSE).
- Every day each company goes up or down; add up the whole team and you get one score.
- "Down 800" is only about 1% → meme: Munch's Scream vs Ravi Varma's Lady in the Moonlight.
- In 1979 the Sensex was 100; today it's 72,000+ (📈 stonks).
- Recap → Done. → callback: "Sharma Uncle left the group 🚪" → "Forward this to your Sharma Uncle 😉".

| File | What |
|---|---|
| `renders/9x16.mp4` | Final: 1080x1920, 30 fps, motion blur, CRF 16, guide music + SFX at −14 LUFS |
| `renders/9x16_sfx-only.mp4` | SFX only (record scratch, pings, booms): upload this and add the song in Instagram |
| `renders/covers/cover_ep02.png` | Reel cover (series template, 00:25 chip) |
| `docs/music.md` | Songs that sit on the 98 BPM grid and how to add them |
| `docs/shotlist.md`, `docs/review_log.md` | Script, beats, critique rounds |
| `assets/art/CREDITS.md` | Public-domain paintings used as memes |

Facts as of 5 Oct 2026: Sensex 72,382.47, Nifty 22,555.75 (ETV Bharat closing report). Sensex base 1978–79 = 100 (BSE);
Nifty 50 base 3 Nov 1995 = 1,000 (NSE). The history line is a sketch through well-known milestone closes, labelled as such.

## Rebuild
```
bash scripts/fetch_sources.sh && node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --sheet && node scripts/render.mjs --fps 30 && node scripts/covers.mjs --eps 2-2
```
