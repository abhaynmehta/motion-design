# Review log: EP 02 (text edition)

## Round 0: per-beat sheets
- Text overflowed: "Let's fix that" (210 px), "cricket. 🏏" (300 px), "player scores." and "your Sharma Uncle 😉" → resized or split over two lines.
- The bait read too small on frame 0 → the first bubble went to 132 px in 3 lines, and the chat scrolls as messages arrive (fixed header, clipped list).
- Emoji wrapped or showed as boxes (Mummy's 😱😱😱, Papa's 🤔, the 🚪) → nowrap, wider bubbles, and Emoji added to every inline font stack (Noto Color Emoji subset, bundled).
- The BSE/NSE chips overlapped the titles → moved right of the words.
- Recap cards left white slivers as they wiped → the cards and their words now leave upward together.
- The punchline "Sharma Uncle left the group" was too small → 40 px in a 96 px pill.

## Round 1: draft (30 fps, no blur)
No near-blank frames; max gap 1.97 s; −14.0 LUFS; sync 22/39 within 45 ms. Key hits: frame 0 0 ms, scratch 0, family boom −33,
meme boom +33, DONE −33; "Let's fix that" −133, scoreboard −100.
| Hook | Readability | Motion | Variety | Series | Sync | Composition | Polish |
|---|---|---|---|---|---|---|---|
| 9 | 8 | 7 | 9 | 8 | 7 | 8 | 7 |
**3 worst problems:**
1. The reveal card's white border vanished as the painting pushed in.
2. Empty frames: cricket → Sensex, and meme → history.
3. "Let's fix that" and the scoreboard missed their cues.

**Fixes:**
1. The painting is clipped inside its frame.
2. Swaps overlap.
3. The chat flies off on b7 with the groove; the cue times were moved to the visuals.

## Round 2: draft after the fixes
| Hook | Readability | Motion | Variety | Series | Sync | Composition | Polish |
|---|---|---|---|---|---|---|---|
| 9 | 8 | 8 | 9 | 8 | 8 | 8 | 8 |
Then a copy pass so the sentences connect: "Think of it like / CRICKET.", "Sensex is a team of 30 of India's biggest
companies.", "Every day, each company / GOES UP OR DOWN.", "Add up the whole team → / ONE SCORE.", "In 1979, SENSEX WAS 100.
Today, it's 72,000+." (Sheet re-checked: every line fits.)

## Round 3: final (30 fps, adaptive motion blur, CRF 16)
−14.0 LUFS; longest static 1.1 s; max gap 2.03 s; no near-blank frames; sync 24/39 within 45 ms (the misses are tick/pop
bursts and the 2-frame lead on rising words). Every score ≥ 8 → **SHIP**.
