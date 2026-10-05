# Stock Market 101: series plan (daily Reels)

Goal: views and follows from people who have never invested. Every episode explains ONE idea with ONE everyday Indian
object, in words a child can follow, in about 30 seconds.

## The format (repeat it every day, so viewers know what they're getting)
| Piece | What it does | In EP 01 |
|---|---|---|
| **Pattern-interrupt hook (0–2 s)** | Shows the scary version, then flips it | Candle chaos + "STOCK MARKET looks scary?" → "It's just a CHAI SHOP." |
| **The 30-second timer** | Promises it's short and keeps people to the end (completion rate is what the feed rewards) | Live countdown, honest: 30.0 s from the hook to "Done." |
| **One desi object** | Makes the idea concrete and shareable | Raju's chai stall, ₹10 a cup, cut into 100 pieces |
| **One word of jargon, max** | Named only after it's understood | "Each piece is a SHARE." |
| **Recap cards** | The two lines people screenshot and save | Share = a piece of a company. Stock market = where you buy shares. |
| **Cliffhanger CTA** | Sets up tomorrow | "Next · EP 02 Sensex & Nifty. FOLLOW FOR PART 2" |

## Covers (thumbnails)
`film/cover.html?ep=N` renders a cover in the same type and colours as the film (`node scripts/covers.mjs`).
- Everything important sits inside the centre 3:4 (1080x1440), the crop Instagram shows on the profile grid.
- The same skeleton every day: series tag, level pill + level bar, a big outlined episode number, one icon, "What is a", the big
  question in green, "explained with a <object>", and the 00:30 timer bar.
- The grid reads as a collection (`renders/covers/grid_preview.jpg`), and each cover alone still asks a question.
- The level changes the pill and bar (Beginner 1/3 → Intermediate 2/3 → Advanced 3/3); the colours stay the same.

## Proposed Beginner run (the cover template already has these)
| EP | Question | Explained with |
|---|---|---|
| 01 | What is a share? | a chai shop ✅ built |
| 02 | What are Sensex & Nifty? | cricket (a team score for the market) |
| 03 | What is a Demat account? | a locker |
| 04 | Why do prices move? | mangoes in season |
| 05 | What is an IPO? | Raju's shop goes public |
| 06 | What is a dividend? | Raju shares his chai profits |
| 07 | What is a bull run? | a cricket crowd |
| 08 | What is a mutual fund? | a thali |
| 09 | What is a SIP? | a gullak |
Intermediate (EP 10+) can follow: market cap, P/E, candlesticks, sectors, results season. Advanced (EP 20+): F&O basics,
options, hedging, risk management.

## Posting checklist
- **Same time daily** (evening IST, 7–9 pm, is a common slot for Indian finance pages; check your own Insights after a week).
- **Caption:** a one-line hook + keywords people search for ("share market for beginners", "what is a share", "stock market India")
  + a comment prompt: *"Comment CHAI if this finally made sense ☕"*, or *"What should EP 03 explain?"*.
- **Pin a comment:** "EP 02 tomorrow: Sensex & Nifty explained with cricket 🏏".
- **Hashtags (3–5):** #StockMarket101 #ShareMarket #StockMarketIndia #NSE #FinanceForBeginners.
- **Trial Reels:** Instagram can show a Reel to non-followers first. Use it to A/B a hook (e.g. English vs Hinglish).
- **Disclaimer:** every episode ends with "For education only. Not investment advice." (SEBI is strict on finance influencers:
  no tips, no buy/sell calls, no specific stocks).

## Inputs I need from you
1. **Page name / handle.** The film and covers say "Stock Market 101" for now; I'll put your handle on the HUD and covers.
2. **Language.** English on screen (current) or Hinglish. Hinglish usually lands harder in India; we could test both.
3. **Voice.** No voiceover yet. A voice note in your own voice (Hindi or English) builds trust fast, and I can cut to it.
4. **Song.** If you prefer a song other than Jhol, name it and I'll re-time the cut to its tempo.
