# Minimalist SPF 50 — "50 likha. 56.6 nikla." (spec reel)

A 22-second 9:16 Hinglish reel for Minimalist's SPF 50 sunscreen, built from the brand's own application film, packshot
and the lab report printed on its product page. **Unsolicited spec work for outreach — not affiliated with or endorsed by
Minimalist.** Footage, packshot and wordmark belong to Minimalist; the film and packshot are not committed here.

**The idea (SMP: "SPF 50 on the label, 56.6 in the lab."):** after the viral "we tested your sunscreen" videos, nobody
takes the number on a tube on trust. Minimalist's whole brand is published proof, and its product page carries an
independent in-vivo test (ISO 24444:2019) that measured SPF 56.6. So: *SPF 50 likha hai. par hai kya?* — *humne lab se
poocha.* A black lab readout climbs on the song's build, freezes on its dead stop, and on the slam locks past the label's
50 at **56.6** (PA++++). Then the doubts that follow: *white cast? zero.* (a close-up after) — *moisturiser jaisa halka.*
— and the line people repeat: *50 likha. 56.6 nikla.* End card: Minimalist SPF 50 sunscreen, ₹359, beminimalist.co.

**Craft notes:** person cut-outs (MediaPipe mattes refined with a guided filter against each frame, crisp hair) on
Minimalist orange, every shot ≤ 1.38× its 608 px source (1.51× during the punch-ins); a five-size type scale
(48/72/108/162/300); the readout's figures in IBM Plex Mono, tabular.

**Renders:** `renders/9x16.mp4` (SFX only, −14 LUFS) · `renders/9x16_song.mp4` (with the temp song, Karan Aujla's
"Tauba Tauba"; copyrighted: gitignored, sent directly; cue sheet `docs/music_cue.md`).

## Rebuild
```sh
sh scripts/fetch_sources.sh      # film, packshot, models, temp song → frames, cut-out, mattes, music
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --fps 30 # final (runs the playbook gate); then sh ../../playbook/tools/split_song.sh .
```
