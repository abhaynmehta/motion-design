# Glossier Ultralip — "the (cashmere) sweatpants of lipstick." (spec reel)

A 22-second 9:16 reel for Glossier Ultralip, built from Glossier's own Ultralip application films, packshots and
product-page copy. **Unsolicited spec work for outreach — not affiliated with or endorsed by Glossier.** Footage,
packshots and the wordmark belong to Glossier; the films and packshots are not committed here.

**The idea (SMP, the brand's own line: "The (cashmere) sweatpants of lipstick."):** lipstick is the skinny jeans of the
makeup bag — great in photos, off the second you get home. Ultralip is the comfy thing you don't take off. So the reel
treats the lipstick like a garment: *lipstick, but make it sweatpants.* A woven care label drops in at the neckline and
the film settles under it. The label reads like clothes do — front: Glossier. ULTRALIP, the (cashmere) sweatpants of
lipstick; composition: moisture of a balm, sheen of a gloss, colour of a tint, in one (each row lands with its proof
shot); size: one size, 9 shades (four skin tones, four shades, then the bullets); and on the chorus lift, care: *wear
daily. live in it.* It ends on the tube and a price hang tag: Ultralip $22, glossier.com.

**Built with the playbook (`../../playbook/`):** script.json first, the preflight gate, the pixel checks, three review
rounds with the stranger test first (`docs/review_log.md`). New to the series: a procedural ribbed-knit ground, a woven
label drawn in canvas that hangs from a seam and swings on a spring's impulse response, and turns over (scaleX) between
its sides; laundry care symbols; a price hang tag.

**Renders:**
- `renders/9x16.mp4` — SFX only (label swish, machine stitches, row pops, thump, chime) at −14 LUFS: share this, or
  add a song in-app.
- `renders/9x16_song.mp4` — the pitch cut with the temp song (SZA, "Snooze"). Copyrighted: gitignored, never committed,
  sent directly. Cue sheet: `docs/music_cue.md`.

## Rebuild
```sh
sh scripts/fetch_sources.sh      # films, packshots, temp song → frames, tube cut-out, music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final (runs the playbook gate first); then sh ../../playbook/tools/split_song.sh .
```
Docs: `script.json`, `brief.md`, `docs/style_guide.md`, `docs/shotlist.md`, `docs/review_log.md`, `docs/music_cue.md`.
