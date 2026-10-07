# Summer Fridays · Lip Butter Balm — "nobody owns just one." (spec reel)

A 32-second 9:16 reel for Summer Fridays' Lip Butter Balm, cut from the brand's own public product films and product photos,
set to Mixkit's "Cherry on Top". **Unsolicited spec work for outreach — not affiliated with or endorsed by Summer Fridays.**
Footage, product photos and logo belong to Summer Fridays; the footage and photos are not committed here.

**The idea:** the lip-balm meme. *me: "i only need 1 lip balm."* → *also me:* fifteen tubes pop onto a shelf (each pop a
little higher than the last) → 15 flavours, 0 self-control → four gateway flavours, each tube squeezing its texture into
the frame → the #1 lip brand* → certified collector → pick your first → start with one *(you won't stop at one.)*

**Techniques new to this series:** person mattes (MediaPipe) so type sits *behind* the person (the "1" in the hook, the
"#1"), a die-cut sticker from a freeze frame with a white border, product cut-outs from the store's photos (point-prompt
segmentation), and a tube-shaped window that grows into the next shot.

**Renders:** `renders/9x16.mp4` (music + SFX, −14 LUFS) · `renders/9x16_sfx-only.mp4` (SFX only, for adding a song in-app).

## Rebuild
```sh
sh scripts/fetch_sources.sh      # brand films, product photos, Mixkit track → frames, cut-outs, mattes, music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final; --sheet / --draft / --verify for review
```
Docs: `brief.md`, `docs/style_guide.md`, `docs/shotlist.md`, `docs/review_log.md`.
