# OLAPLEX Nº.7 Bonding Oil — "humidity vs your hair." (spec reel)

A 24-second 9:16 reel for OLAPLEX Nº.7 Bonding Oil, built from the brand's own unretouched before/after films, two
creator clips and the product page's claims. **Unsolicited spec work for outreach — not affiliated with or endorsed by
OLAPLEX.** Footage, packshots and logo belong to OLAPLEX; the films and packshots are not committed here.

**The idea (SMP: "Three drops and humidity loses."):** frizz is a daily match against the weather, so the reel is a
live broadcast. Humidity goes 3 – 0 up on three frizzy BEFOREs; *until 3 drops* — she taps Nº.7 into her palm and works
it through; the bottle lands; three replays of the brand's unretouched befores/afters bring your hair back 1, 2, 3, each
with its claim (125 % more shine*, 72-hour frizz control, 77 % less breakage); on the song's lift the winner, full
time 3 – 4: *your hair wins.* End card: Nº.7 Bonding Oil · $32 · olaplex.com.

**Built with the playbook (`../../playbook/`):** script.json first (SMP, beats with says/shows/serves, music, look), the
preflight gate before every final, and the pixel checks after it. The gate failed the first final render (1.07 picture
changes a second: a 2.4 s held hook and 2 s holds on each after) — see `docs/review_log.md` for what changed.

**Renders:**
- `renders/9x16.mp4` — SFX only (scoreboard beeps, whistle, whoosh, chime) at −14 LUFS: the version to share or to add
  a song to in-app.
- `renders/9x16_song.mp4` — the pitch cut with the temp song (Lady Gaga, "Abracadabra"). Copyrighted: gitignored, never
  committed, sent to the user directly. Cue sheet: `docs/music_cue.md`.

## Rebuild
```sh
sh scripts/fetch_sources.sh      # films, packshot, temp song → frames, bottle cut-out, music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final (runs the playbook gate first); --sheet / --draft / --verify for review
```
Docs: `script.json`, `brief.md`, `docs/style_guide.md`, `docs/shotlist.md`, `docs/review_log.md`, `docs/music_cue.md`.
