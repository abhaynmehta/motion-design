# Style guide: Stock Market 101 (series)

A combination of the house's earlier films: BMW's live counter and condensed numerals (the 30 s timer), Kay Beauty's
porcelain label cards (the paper panel and recap cards), and the chart grammar from the dataviz skill.

## Palette
| Token | Hex | Use |
|---|---|---|
| `--ink` | #0B0D10 | background (with a 120 px chart grid at 4.5 % white) |
| `--paper` | #F2EEE6 | the "real world" panel, recap cards |
| `--white` | #F7F7F5 | type on ink |
| `--grey` | #8B9099 | labels |
| `--up` | #16E07A | **the one accent**: key words, the timer, price up (on paper it darkens to #0B8F4F for contrast) |
| `--down` | #F2524A | semantic only: price down, sellers |
Up/down is a polarity pair: CVD-safe separation (deutan ΔE 11.1). It never relies on colour alone: up candles are filled
and down candles hollow, buyers are filled dots and sellers rings, ▲/▼ shapes, and the words "up"/"down".

## Type
- Display: **Archivo** variable, pushed to its extremes. Ultra-condensed black caps for the claims (180–380 px), expanded
  hairline for the lead-ins ("This is", "He wants a"), expanded black for "Done.". Outline condensed for words that are about to fill.
- UI: **JetBrains Mono** for every number (timer, prices, tickers, labels).
- ₹: a one-glyph Noto Sans subset mapped by unicode-range (neither face has ₹). ▲/▼ are drawn as vectors.
- Smallest text that must be read: 34 px (card labels). The disclaimer and level labels are 26–28 px, as is the HUD tag.

## Motion
Springs only. Snappy for words and pops; default for panels, cards and the collapse; heavy for the price count. Words rise
through masks and lift out. One idea per screen, 1.6–2.4 s each. Cuts are hard and on the beat; there are no crossfades.

## Writing
Words a child knows. One jargon word per episode, named after it's understood. Indian anchors (chai, ₹, mandi, NSE/BSE),
fictional companies only, no tips, a disclaimer on the end card.
