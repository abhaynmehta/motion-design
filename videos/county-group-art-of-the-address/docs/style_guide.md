# Style guide: County Group — "The art of the address"

Source material: `assets/site/renders/*.jpg` (11 real renders from countygroup.in, deblocked + upscaled 3× with ffmpeg nlmeans/lanczos),
brand fonts and colours from the site. No reference film: the grammar is editorial luxury (hotel / jewellery films).

## 1. Palette
| Token | Hex | Source |
|---|---|---|
| `--cream` | #F1ECE1 | site canvas — opening + end card (the loop bookends) |
| `--brown` | #3A291C | site ink / dark sections — the gallery |
| `--deep` | #1C130D | brown at depth (vignette, frames) |
| `--accent` | #C29E63 | site gold — the ONE accent (rules, key word, arch) |
| `--accent-ink` | #A6834A | the same gold, darkened for legibility on cream |
Renders are graded toward the palette (saturation .74, sepia .22, contrast 1.07) so blue skies sit inside the brown world.

## 2. Type
- Display: Playfair Display — italic for statements and project names, roman caps for the lockup. Sentence case, full stops.
- UI: Montserrat 500, tracked caps (.3–.6 em) for eyebrows, labels, locations.
- Left-aligned at x ≥ 140 px (1080p). Must-read lines ≥ 28 px; display 120–170 px.
- Gold only on the key word ("address.", "Gurugram") and on rules.

## 3. Rhythm
80 BPM, 4/4, bar = 3 s. Cuts on beats 0 / 2 of each bar during the gallery (every 1.5 s), something new every ≤ 3 s.
Slow, weighted motion: heavy springs on type, default on frames/camera. Nothing bounces.

## 4. Transitions
Curtain (brown panel closes over cream from the hairline) · horizontal wipe with a gold leading edge · collapse into a grid tile ·
push-through (dive into tile 12) · arch iris (cream arch opens to the end card). Never crossfades, spins, glitches, light leaks.

## 5. Camera
Every held image drifts (scale 1.075 → 1.015 + lateral slide). Grid breathes; Gurugram slow push 1.00 → 1.045; end card push 1.00 → 1.03.

## 6. Texture
Fine monochrome film grain (seeded, per frame) and a soft vignette. Depth from shadow, never glow.

## 7. Text in / out
Words rise through masks (heavy), lift out through them; eyebrows and locations may fade-rise (small lines only).

## 8. Sound
Felt piano + string ensemble in D major; harp arpeggio rising with the grid tiles; a quiet clock tick on every beat ("since 2005");
stop-time at beat 19 for the dive, Gmaj9 drop on Gurugram, resolves to D on the lockup. SFX: silk whooshes on wipes, chimes on
key words, a deep boom on the drop, a felt thump on the lockup. -14 LUFS.
