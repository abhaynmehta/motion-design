# Typsy Beauty · Spritz body & hair mists — "the dessert menu" (spec reel)

A 28-second 9:16 reel for Typsy's dessert body & hair mists (Chocolate Fondant, Coconut Crumble, Strawberry Cheesecake),
cut from the brand's own public campaign films, set to Mixkit's "Pop 05". **Unsolicited spec work for outreach — not
affiliated with or endorsed by Typsy Beauty.** Footage and logo belong to Typsy and the footage is not committed here.

**The idea:** you can't eat this… but you can wear it. A café menu where each dessert's thumbnail opens into its world
(what it smells like, its notes, the bottle) and folds back with a tick, then the bill: 0 calories, 100% compliments,
*no sharing required.*

**Renders:** `renders/9x16.mp4` (music + SFX, −14 LUFS) · `renders/9x16_sfx-only.mp4` (SFX only, for adding a song in-app:
put a drop on 2.55 s, "…but you can wear it.").

## Rebuild
```sh
sh scripts/fetch_sources.sh      # brand films + the Mixkit track → frames + music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final; --sheet / --draft / --verify for review
```
Docs: `brief.md`, `docs/style_guide.md`, `docs/shotlist.md`, `docs/review_log.md`.
