# Underneat High Waist Tummy Tucker Shorts — "roll down? aaj nahi." (spec reel)

A 21-second 9:16 Hinglish reel for Underneat (Kusha Kapila's shapewear brand), cut from the brand's own how-to film for
the High-Waisted Tummy Tucker Shorts. **Unsolicited spec work for outreach — not affiliated with or endorsed by
Underneat.** Footage and logo belong to Underneat; the film is not committed here.

**The idea (SMP: "Shapewear that stays up."):** every woman who has worn shapewear to a party has spent half the night
yanking up a waistband that keeps rolling down. So the reel's one graphic is a waistband: a coral band across the frame
that carries every line. *shapewear? phir se roll down.* — the words sag and roll off it; *gravity ko belly se pyaar
hai.* (the brand's own joke) — and they roll off again. On the drop of "Shararat" the tiny loop clips the shorts to her
bra, two loops clip the band, it snaps up and locks: *meet the tiny loop.* From then on the words land and stay —
*walk. spin. bend. nothing moves.* — and in the fitted dress: *roll down? aaj nahi.* End card: High Waist Tummy Tucker
Shorts, ₹1,999, sizes XS–5XL, underneat.in.

**Craft notes:** the band sits exactly over the film's burned-in captions (source rows 695–760), so the reel's words
replace the film's; every shot is the full 606 px source frame in an 840 px window (1.39×); a warm black stage so the
coral is only the band and the logo; type scale 52 / 84 / 120 / 160 (Bricolage Grotesque, Inter Tight).

**Renders:** `renders/9x16.mp4` (SFX only, −14 LUFS) · `renders/9x16_song.mp4` (with the temp song, "Shararat";
copyrighted: gitignored, sent directly; cue sheet `docs/music_cue.md`).

## Rebuild
```sh
sh scripts/fetch_sources.sh && node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30   # then: sh ../../playbook/tools/split_song.sh .
```
