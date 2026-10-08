# Style guide: Glossier Ultralip "the (cashmere) sweatpants of lipstick"

## 1. Palette
| Token | Hex | Source |
|---|---|---|
| `--ground` / `--bg` | #2A0A12 | deep berry, the darker Ultralip shades; rendered as a ribbed knit (V-stitch per rib, seeded) |
| `--ink` | #FFFFFF | supers over film, end-card lines |
| `--accent` | #F5D3DC | Glossier pink: the tube, the woven label, the hang tag, seam stitches, glossier.com |
| `--wine` | #4A1222 | the label's ink (care-label print) |
Footage is cropped tight on lips and faces so the films' white walls never read as a pale canvas.

## 2. Type
- Display: Figtree 800/900 and Figtree Italic (the wordmark leans): hook supers 100–170 px, label lines 70–160 px.
- UI: DM Mono 500, uppercase, tracked: label headers (COMPOSITION / SIZE / CARE) and ULTRALIP, 44–56 px.
- The real Glossier. wordmark (site icon sprite) in black on the label, in white on the end card.
- Everything sits inside the Reels safe area (y 269–1536): the label hangs from a neckline seam at y 150.

## 3. Rhythm
SZA "Snooze" preview, 142.9 bpm grid (beat 0.4198 s), bars of 4 start on the kick; the reel enters on the bar at song
beat 10 (4.43 s), so cuts land on reel beats 0, 2, 4 …; the chorus lift is reel beat 36 (15.11 s) = the care side,
"live in it.". Montage cuts every 2 beats (0.84 s).

## 4. Transitions
The film settling from full screen into the window under the label (spring) · the label dropping in and swinging (a
spring's impulse response) · the label turning over (scaleX through 0, content swaps at the edge) · rows rising through
masks with a ticked box · the film sliding away for the end card · the tag dropping on its cord. Never: crossfades,
spins, glitches.

## 5. Device
A woven care label sewn into the neckline of the frame: the lipstick is labelled like clothing. Front (name + line),
composition (proof), size (range), care (payoff), then the price hang tag (CTA).
