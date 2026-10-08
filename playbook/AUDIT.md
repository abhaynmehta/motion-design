# Audit — every brand reel so far (October 2026)

Why this exists: the reels passed my own checks (determinism, sync, loudness, "scores ≥ 8") and still didn't land with
real viewers. A friend watching the Kylie reel said it "wasn't flowing — one minute it's contour, the next it's liner;
I couldn't tell what the story was". Others said: too much white, music all sounds the same, type and script could be
better. This file re-watches all seven reels as a viewer and as a copywriter, with numbers where numbers exist.

Measurements: `python3 playbook/tools/audit_render.py <render>` (4 fps): **canvas** = share of frames that are mostly
flat pale graphic background (white/cream/blush paper, not footage); **pale run** = longest stretch of mostly-pale
frames; **changes/s** = how often the picture visibly changes.

| Reel | Product(s) | canvas frames | longest pale run | changes/s | my old score | honest score |
|---|---|---|---|---|---|---|
| Kay Beauty "3 new drops" | 3 different products | 52 % | 5.0 s | 2.3 | 8 | **5** |
| Kylie "one of each, obviously." | Mood Stones EDP (3 scents) | 38 % | 7.8 s | 1.6 | 8 | **4** |
| Rare Beauty "just a little." | blush **and** a body mist | 42 % | 4.5 s | 1.1 | 8 | **5** |
| Typsy "the dessert menu" | 3 mists, one idea | 14 % | 1.5 s | 2.5 | 8 | **7** |
| Summer Fridays "nobody owns just one." | lip balm (15 flavours) | 54 % | 9.5 s | 1.4 | 8 | **6** |
| rhode "never skip lip day." | lip shaper (14 shades) | 100 % | 7.0 s | 1.1 | 8 | **6** |
| Sol de Janeiro "departures." | perfume mists (10) | 0 % | 0 s | 0.8 | 8 | **6** |

The honest scores ask one question the old ones never asked: **after one watch, can a stranger say what the product is,
what it does for them, and why they should care?**

---

## 1 · Kay Beauty — "3 new drops"
**What it says:** three launches (Hydra Base Water Crème, Hydra Cloud Cushion Foundation, Hydra Luscious Gloss Stain),
pick yours.
**Works:** gorgeous brand footage (the foundation drip, cream textures), stats on screen (100 hr hydration, +138 %).
**Problems**
- **A catalogue, not an ad.** Three unrelated products, three sets of claims, no single idea. A viewer remembers
  "Katrina, peach, some launches", not one reason to buy anything.
- **Cream canvas everywhere:** 52 % of frames are flat cream with small elements; the last 4.5 s are an almost empty
  cream card with a small logo.
- **Type:** thin light serif at small sizes; product names live in small white cards; stats flash.
- **Music:** synthesised score, polite and anonymous.

## 2 · Kylie Cosmetics — "one of each, obviously."  (the one that confused a viewer)
**What it says:** you're not the same girl at 8 am and 11 pm, so wear a different Mood Stones scent for each.
**Works:** the line itself is a real insight; the clock device is clear.
**Problems**
- **The footage contradicts the words.** It's a *fragrance* ad, but the hook is a tight crop of Kylie's eye (reads as an
  eyeliner tutorial), "3:00 pm" shows her **pressing blush onto her cheek**, 11 pm shows a red-dress selfie. The viewer's
  eyes say "makeup — contour, liner, blush", the words say "scent". That is exactly "one minute contour, one minute liner".
- **The product is never clearly a perfume.** Mood Stones bottles look like pebbles; nobody sprays anything; "eau de
  parfum" appears once, in tiny caps on the end card.
- **Notes imagery with no anchor:** lime → black-and-white rocks → hands → rose → coffee → jelly: pretty, random.
- **Pale canvas** in the hook (3.5 s) and the end card (3 s); thin, low-contrast lilac type; tiny notes in caps.
- **Music:** Mixkit "Smooth Jazz", 67 bpm — sleepy for a hook.

## 3 · Rare Beauty — "just a little."
**What it says:** a gentle reminder… one dot of blush is enough… and on heavy days, find comfort (a body mist).
**Works:** "one dot. …okay, two. a little goes a long way" is the best product demo in the set: line and footage match.
**Problems**
- **Two products, two messages** (blush, then a body & hair mist). The second half's product is barely visible — she
  sits in a circle with her eyes closed; "Find Comfort" is a 26 px caps label.
- **Slow, text-only hook** on cream for 4.5 s before the product appears.
- **Cream canvas** 42 % of frames; end card 2.5 s of near-empty cream.
- **Music:** generic soft piano-pop.

## 4 · Typsy — "the dessert menu"  (the one viewers liked)
**What it says:** you can't eat this… but you can wear it.
**Why it works:** ONE line carries the whole film; every shot shows either a dessert or the mist being worn, so picture
and words never disagree; the device (a menu, a bill) **is** the message; dark, warm footage for most of the runtime.
**Problems:** the white menu card interrupts the footage five times; menu text and the receipt are small; the receipt
holds 3.5 s of small type; the end-card bottles are thumbnails.

## 5 · Summer Fridays — "nobody owns just one."
**What it says:** the lip-balm meme — "I only need 1" → you'll own fifteen.
**Works:** the meme hook is instantly understood; product cut-outs and texture reveals are on-message.
**Problems**
- **Eight sections, eight devices** in 31 s (meme, shelf, flavour cards, lifestyle, #1 claim with depth type, sticker,
  dots, end). Each was "something new every 2–4 s"; together they break the flow. The #1-brand claim is a non-sequitur
  inside a collector joke.
- **Beige canvas 54 % of frames**, including a 9.5 s stretch (the shelf) where small tubes pop on beige.
- Ticker names and chips are small; the shelf is low-energy for 6 s.
- **Music:** Mixkit pop, cheerful and generic.

## 6 · rhode — "never skip lip day."
**What it says:** every shade is named after a workout move, so: a lip workout.
**Works:** the pun is the product's own; kinetic words that act out their names are the most original craft in the set.
**Problems**
- **The pun wins, the product loses.** The reel never says what a lip shaper *does* (contour, define, overline) until
  a grey caption on the end card. Coach cues ("lift. feel the burn.") are jokes, not benefits.
- **An off-white panel in every frame** (canvas 100 %); the footage sits in a window covering ~55 % of the frame.
- HUD text (30 px caps) is unreadable on a phone; the speed round flashes eight names in four seconds.
- **Music:** Mixkit house — fine energy, anonymous.

## 7 · Sol de Janeiro — "departures."
**What it says:** every Cheirosa number is a year in Rio; pick your year.
**Works:** bold colour fields (no white), a clean device (split-flap board), copy taken from the brand.
**Problems**
- **No people, no spray, no skin.** Mostly graphics; the brand's footage is a 380 × 500 sticker. It's a clever
  infographic, not a desire-making ad: it never makes you want to *smell like* 1962.
- The board (ten rows of 46 px type) and the six-years-in-six-beats run are unreadable at phone size.
- Changes per second 0.8: long holds on the same layout.
- **Music:** Mixkit bossa nova — fitting, but stock.

## Also made (not brand ads)
- **BMW M8 concept:** dark, footage-led (canvas 0 %, 2.7 changes/s) — the look the beauty reels should have had.
- **Stock Market 101 EP01:** a 15 s pale stretch and 0.6 changes/s — explainer pacing, too slow for a feed.

---

## Root causes (what to stop doing)
1. **More than one message per reel.** Kay (3 products), Rare (2), Kylie (3 scents + makeup shots), Summer Fridays
   (collector joke + #1 claim + flavour tour). Typsy is the only one with a single sentence holding everything.
2. **Footage picked because it was beautiful or available, not because it shows what the line says.**
3. **Device first, message second.** The clock, dot, shelf, HUD and board were designed before the script; the
   script was then fitted around the device.
4. **Pale canvases as the default background** and small elements centred on them → frames look empty.
5. **Small, thin, many-layered type:** title + tag + notes + label on one frame, labels at 22–36 px.
6. **Stock library music** chosen after the edit, cut to a grid instead of cutting the edit to a song.
7. **"Something new every 2–4 s" read as "a new device every 2–4 s"** → fragmentation, no flow.
8. **Lenient self-review:** the score sheet checked craft (sync, determinism, loudness, safe zones) and never story
   comprehension. Every reel scored itself 8.

Each cause became a rule in `LESSONS.md`, and every rule that can be checked by a machine is enforced by
`playbook/tools/preflight.mjs` before a final render is allowed.
