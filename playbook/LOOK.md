# Look — colour, layout and type that hold a phone screen

## Colour and backgrounds (Lesson L04)
- **Default order:** (1) the footage itself, full-bleed; (2) a dark ground (near-black tinted with the brand colour, e.g.
  #14100F, #1B1320, #0E1A17); (3) a saturated brand colour field; (4) pale, only when the brand world IS pale — and then
  filled edge to edge with product or footage, never empty.
- **Gate:** after render, ≤ 20 % of frames may be mostly flat pale canvas, and no pale stretch may last > 2 s.
- Use the bottle/product colour as the field when it's strong (Sol de Janeiro worked); avoid five reels in a row with
  the same ground (registry checks it).
- Contrast: white or the accent on dark; ink on saturated. Never mid-grey type on beige.

## Layout
- Footage leads, but at the resolution it has (L16): brand sites serve vertical films at 606–864 px wide, so a
  full-bleed 9:16 frame is a 1.8× upscale and looks soft. Full-bleed only when the source is ≥ 1000 px wide (or for a
  beat of motion where softness reads as speed); otherwise frame it: a window ~850–1080 px wide on the ground, a
  person cut-out at ≤ 1.4×, a tight crop that keeps the source pixels. Windows/cards are fine as the reel's world.
- One focal point per frame. If a frame has a title, a tag, notes and a label, it has four focal points: cut three.
- Safe zones (Reels/TikTok): keep text out of the top 220 px, the bottom 380 px and the right 140 px.

## Type (Lesson L05)
| Role | Size at 1080 × 1920 | Weight | Words |
|---|---|---|---|
| Hook / SMP line | 120–180 px | 700–900 | ≤ 6 |
| Beat line | 84–120 px | 600–800 | ≤ 7 |
| Support (notes, shade) | 44–56 px | 500–600 | ≤ 6 |
| Legal / source | 26–32 px | 400–500 | listed in `script.small_ok` |

- Two families max: one display with character (condensed, wide, a sharp serif in heavy weight), one clean UI face.
- Headlines are heavy. Thin display weights read as "luxury" on a poster and as "nothing" on a phone in motion.
- Kinetic type is allowed to be big: a word can fill the width. Let the key word be 2–3× the size of the rest.
- One text layer at a time; supers change on the beat, not mid-beat.

## Motion grammar that keeps flow (Lessons L03, L13)
- One world, one transition family (e.g. everything wipes in the bottle's colour, or everything pushes up).
- Match cuts on shape or motion (a pour into a spray; a circular jar into a circular sun) beat random variety.
- Something changes every ~1.5 s inside the same world (a new shot, a word, a zoom) — not a new device.

## Clip quality (Lesson L16)
- Upscale = output pixels per source pixel. ≤ 1.4× is crisp, 1.4–1.6× is slightly soft (WARN), > 1.6× is soft on a phone (FAIL). The gate
  computes it per shot from shots.json and the source files; a shot drawn bigger at runtime declares `display: <factor>`.
- Take the highest rendition the site serves (Shopify: the HD-1080p mp4; homepage films are often 1920 wide).
- Never blend frames on near-real-time shots (ghosting): blend only below 0.6× speed; otherwise nearest frame.
- Don't crop into a face past the source's sharpness; don't stack a scale-push on an already upscaled shot.
- In/out points sit inside the film's own edits (ffmpeg scdet), never one frame of the next shot.

## Typography that looks designed (Lesson L17)
- A scale, not a pile of sizes: pick 3–4 sizes per reel from a ratio (e.g. 1.5×: 56 / 84 / 126 / 190) and reuse them.
  The gate warns above 5 distinct sizes, fails above 8, and when the biggest readable line is < 2.5× the smallest (no hierarchy).
- One hero line per beat at 140–220 px, set tight: leading 0.88–0.95, tracking −0.03 to −0.05 em; support lines at
  ≤ half its size; small caps / labels tracked +0.06–0.12 em.
- Two weights per face at most (e.g. 600 + 900). Emphasis by size or colour on ONE word, not by adding a third style.
- Break lines by sense, not by width ("until / 3 drops.", never "until 3 / drops."); no orphan word on a line.
- Type over footage sits on a ground, a plate or a calm part of the frame — a text-shadow is a last resort, never the
  plan (Olaplex's white-on-white-shirt lines were fixed with plates).
- Numbers are heroes: tabular figures for counters, the unit smaller and raised (56.6 with SPF set at a third).
- Hindi/Hinglish: keep Latin-script Hinglish unless the brand writes in Devanagari; if Devanagari, use a face that has
  it (Mukta, Tiro Devanagari, Noto Sans Devanagari) — never let the browser fall back.
