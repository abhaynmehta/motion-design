# Session handoff — motion studio (spec-reel series)

This file is the portable context for resuming the work on another machine. It summarizes everything built in this
session and the exact state of the in-progress work. Session reference:
`https://claude.ai/code/session_01CAzWjdZgA662HRTtUMHD8j`.

> The live chat transcript (not committed — large, with embedded preview images) lives on the cloud box at
> `/root/.claude/projects/-home-user-motion-design/99594ef3-f982-5421-90be-3d342a1458c9.jsonl`. This doc is the faithful,
> usable substitute. Ask Claude to regenerate/extend it any time.

## How to resume
```sh
git clone https://github.com/abhaynmehta/motion-design.git
cd motion-design
git checkout claude/adoring-brahmagupta-vncqb5     # all this work lives here
```
- **Read first:** `CLAUDE.md` (studio rules), `playbook/AUDIT.md`, `playbook/LESSONS.md`, then `playbook/LOOK.md`,
  `playbook/SCRIPT_METHOD.md`, `playbook/MUSIC.md`. The full pipeline is the `/motion-reel` skill
  (`.claude/skills/motion-reel/`), whose `reference/RULES.md` is the long form of `CLAUDE.md`.
- **Branch / attribution:** develop on `claude/adoring-brahmagupta-vncqb5`; never push elsewhere without permission.
  Commit trailers used this session: `Co-Authored-By: Claude Opus <noreply@anthropic.com>` and the `Claude-Session:` URL
  above. Never put a model ID in commits, PRs, code or any pushed artifact.

## The system (what makes a reel here)
Every reel is its own folder under `videos/<slug>/`:
- `script.json` — the copywriter brief (one audience, one insight, ONE single-minded proposition; says/shows/serves per
  beat). Written **before** any design. `playbook/SCRIPT_METHOD.md` explains each field.
- `shots.json` — footage picks (in/out in source seconds, inside the film's own scene cuts; crop mode/size), → frames.
- `timeline.json` — marks + SFX on the measured beat grid (`beats.json`), → `cues.json` + `film/data.js` via `sync.mjs`.
- `film/film.js` — the deterministic film: `window.seek(t)` paints frame t. Springs only (`lib/motion.js`), no CSS
  transitions / rAF / setTimeout / state between frames, seeded noise only (mulberry32), 2D transforms only.
- `audio/` — `music.wav` (temp song, gitignored), `sfx.mjs` → `sfx.wav`, `mix.py` → `mix.wav` at −14 LUFS.
- `docs/` — brief, style_guide, shotlist, review_log, music_cue; `scripts/fetch_sources.sh` rebuilds uncommitted assets.

**Pipeline (from a project dir):**
```sh
sh scripts/fetch_sources.sh                 # re-download films + temp song, extract frames (+ key/matte where used)
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs --draft --fps 30    # review draft;  python3 scripts/review.py <n> [--draft]
node scripts/render.mjs --verify            # determinism: 12 probes cold vs warm must be identical
node scripts/render.mjs                      # final: 60 fps, motion blur, H.264 yuv420p CRF 16
sh ../../playbook/tools/split_song.sh .      # move 9x16.mp4→9x16_song.mp4 (gitignored) + write SFX-only 9x16.mp4
```

**The gate (`node playbook/tools/preflight.mjs <dir> [--render <mp4>] [--register]`):** L01–L17, must be clean before a
final render; `render.mjs` refuses a FAIL. Highlights added this session:
- **L13** picture-change rate / longest hold (CTA exempt via `--until`, `audit_render.py`).
- **L15** Reels safe area (DOM lines must sit y 269–1536).
- **L16** clip quality: per-shot upscale ≤ 1.4× crisp, 1.4–1.6× WARN, > 1.6× FAIL (declare `display:` for runtime scale).
- **L17** type scale: 3–4 sizes from one ratio (WARN > 5, FAIL > 8), hierarchy ≥ 2.5× biggest/smallest.
- `--register` appends the reel to `playbook/registry.json`; L06/L11 read it to block repeated music genre / device /
  hook / ground.

## Music & song rules (important)
- Pick a **real song first**, cut to its drop. Trending/copyrighted temp tracks are fine for the pitch (the user adds the
  disclaimer and swaps the IG-library audio when posting).
- **Songs are NEVER committed.** `.gitignore` excludes `audio/track/`, `audio/song*`, `*.wav`, `renders/*_song*.mp4`,
  `renders/.*.split`. Deliver the **with-song** render to the user directly (SendUserFile); commit the **SFX-only**
  render + `docs/music_cue.md`. Note: on reels whose SFX are sparse clicks/zips, the SFX-only cut can sit below −14 LUFS
  under linear gain (true-peak bound) — that's expected; the song cut is the −14 reference.

## The reels (all on this branch)
Committed & delivered (SFX-only render in each `renders/9x16.mp4`; song cut sent separately):

| # | Slug | SMP / line | Device | Music (temp) | Ground |
|---|------|-----------|--------|--------------|--------|
| 01 | kay-beauty-three-drops | 3 new drops, pick yours | strips open into each launch | synth score | pale |
| 02 | kylie-cosmetics-spec | one of each, obviously | stone window + day clock | smooth jazz | pale |
| 03 | rare-beauty-spec | just a little | the dot window | soft pop | pale |
| 04 | typsy-beauty-spec | the dessert menu | café menu + bill | pop | footage |
| 05 | summer-fridays-spec | nobody owns just one | meme + tube shelf | pop | pale |
| 06 | rhode-lip-day-spec | never skip lip day | workout HUD + kinetic words | house | pale |
| 07 | sol-de-janeiro-spec | departures (each Cheirosa # = a year in Rio) | split-flap board | bossa nova | colour |
| 08 | olaplex-no7-spec | humidity vs your hair | live-match scoreboard, 3–0 → 3–4 | dance pop | dark |
| 09 | glossier-ultralip-spec | the (cashmere) sweatpants of lipstick | garment care label + hang tag | R&B | dark |
| 10 | minimalist-spf50-spec | SPF 50 on the label, 56.6 in the lab (Hinglish) | lab gauge climbs past 50 to 56.6 on the drop | Tauba Tauba (Karan Aujla) | colour (orange) |
| 11 | underneat-no-roll-spec | shapewear that stays up / roll down? aaj nahi (Hinglish) | coral waistband band; words roll off until the loop clips it | Shararat (Dhurandhar) | dark |
| 12 | mokobara-zero-digging-spec | time spent digging: 0 seconds (Hinglish) | torch in a black bag → zip rips dark into yellow → each pocket 0 SEC | Big Dawgs (Hanumankind & Kalmi) | colour (yellow) |
| 13 | youthiapa-raised-right-spec | Raised Right (mostly): tees for kids who broke every house rule (Hinglish) | Mummy's rules handwritten; each broken by an evidence photo + struck through; song's dead stop = the glare, slam = "Raised Right" | In The Night No Control (1996) | dark (green) |
| 14 | bummer-underrated-views-spec | Modal Stretch Trunks hide a view only you get (Hinglish) | a scrolling filmstrip of scenic-waistband trunks through a fixed viewfinder, each named like a holiday spot | Aap Jaisa Koi (Nazia Hassan, 1980) | dark (navy) |

Outreach pack for the series: `outreach/beauty-spec-series.md` (DM + email per brand; reels 1–14).

### Mokobara (#12) — notable technique (committed this session, commit `3b834c1`)
- Films shot on a white studio sweep → **`scripts/prep_key.py`** keys the sweep out and bakes each frame onto the reel
  ground: border-connected white, guided-filter edges (He et al.), contact shadows kept as a shade of the ground,
  MediaPipe magic-touch keypoints to **protect** white objects (the phone) the key would eat, per-shot `holes` boxes for
  sweep pockets enclosed by arms, `feather` to fade a cut edge, `out:"rgba"` for packshots that keep alpha.
- New SFX `zip` / `rip` synths added to `sfx.mjs` (skill engine + project copy).
- Needs a MediaPipe venv to rebuild frames (see below).

### Youthiapa "Raised Right" (#13) and Bummer "underrated views" (#14) — shipped this session
Both final, gate-clean (script + pixels), determinism 12/12, registered, outreach added, committed and delivered.
- **Youthiapa (streetwear, Bhuvan Bam):** Mummy's house rules handwritten in Kalam; each broken by a printed evidence
  photo that slaps onto a pile and strikes the rule out in orange; the song's dead stop is the glare, the slam is
  "Raised Right." Fonts Kalam + Bodoni Moda (OFL).
- **Bummer (innerwear):** the real product truth is the scenic printed waistband, so each trunk is a "view." Built from
  still packshots (1254 px) as a **constant-scroll filmstrip** behind a fixed cyan viewfinder — crisp (≤0.7×, L16) and
  always moving (needed to pass **L13**, which is tuned for full-frame video: a static postcard reel scored 0.63
  changes/s and failed; the scrolling strip scores 4/s). Fonts Archivo + DM Mono (OFL).
- **Stills-reel lesson:** a reel built from product stills must keep large-area motion going (a scroll/carousel), not
  just a Ken-Burns drift — the gate's `changes_per_s` needs mean full-frame luminance diff > 12 per 0.25 s, which a
  small static card on a dark ground never reaches. Full-bleed is not an option when the source is < ~1700 px (L16).

**No reel is mid-build right now.** Next candidate brands with usable assets: `bummer.in` (more prints), `sleepyowl.co`
(coffee, 1 film), or re-scan the inventory. Always pick a new device/hook/ground/genre (registry L11 enforces it).

## Rebuilding uncommitted (heavy) assets on a fresh machine
Each project commits only source (code, JSON, docs, OFL fonts, `source/manifest.json`). Brand films, extracted frames,
mattes/keys and the temp song are **not** committed — regenerate them:
```sh
cd videos/<slug> && sh scripts/fetch_sources.sh
```
Projects that key/matte footage (**mokobara**, **minimalist**, **underneat**) need a MediaPipe venv + the public models;
their `fetch_sources.sh` headers give the exact steps, e.g.:
```sh
python3 -m venv .mp && .mp/bin/pip install mediapipe pillow scipy
PY_MP=.mp/bin/python sh scripts/fetch_sources.sh
```
Chromium + Playwright are preinstalled on the cloud box (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`); on your own
machine, `npm i -D playwright && npx playwright install chromium` inside the project if `render.mjs` can't find a browser.

## Candidate brands / footage for future reels (researched this session)
Indian D2C with usable homepage/product films on their Shopify CDN (inventory scans in the session scratchpad):
`mokobara.com` (done), `youthiapa.com` (Bhuvan Bam — in progress; 5 home films + products), `bummer.in` (16 home films),
`sleepyowl.co` (1). Others scanned had few/no hosted videos. Beauty set (reels 01–09) came from brand sites' product
films. Pick a **new** device/hook/ground/genre each time — the registry (L11) enforces it.

## Trending-music research (Oct 2026) — source links
- Metricool trending IG songs — https://metricool.com/trending-instagram-songs
- que.es July 2026 reel trends — https://www.que.es/2026/07/16/tendencias-instagram-reels-julio-2026-2/
- tynmagazine Hindi songs 2026 — https://tynmagazine.com/?p=252208
- Brut: Instagram reviving old Bollywood — https://www.brut.media/in/articles/from-in-the-night-no-control-to-sajna-hai-mujhe-how-instagram-is-bringing-old-bollywood-songs-back
- CSR Journal: why vintage songs trend in 2026 — https://thecsrjournal.in/why-vintage-songs-are-trending-again-in-2026-across-reels-shorts-and-bollywood/
- Underneat (Kusha Kapila) context: [inc42](https://inc42.com/buzz/kusha-kapilas-d2c-innerwear-brand-underneat-raises-6-mn), [YourStory](https://yourstory.com/2025/12/underneat-pre-series-a-funding-fireside-ventures), [Outlook Business](https://www.outlookbusiness.com/start-up/investors/kusha-kapilas-shapewear-brand-underneat-bags-6-mn-from-fireside-ventures), [Storyboard18](https://www.storyboard18.com/brand-marketing/kusha-kapilas-underneat-hits-rs-150-crore-arr-in-eight-months-raises-6-million-85982.htm)

## Constraints & gotchas
- **Network:** outbound HTTPS is via a proxy with a CA bundle. Never disable TLS or unset `HTTPS_PROXY`. Don't route
  around login walls / bot checks (YouTube, Vimeo, Instagram; Underneat's site sits behind a "Verifying your connection"
  check — the end-card frame was used for its logo instead).
- **Fonts:** never download licensed brand fonts; use OFL substitutes close to the brand's type. ₹ lives in the
  latin-ext subset — preload it (`core.js` loads every face with a sample spanning ₹ € – · …) or canvas paints a tofu
  on the first frame it appears (caught by `render.mjs --verify`).
- **Determinism:** SVG `<img>` drawn to canvas rasterizes lazily → rasterize to an offscreen canvas before frame 0
  (logos). No composited-layer hints (will-change/translate3d/translateZ) — they change what the same t paints.
- **Labels:** cover brand films' burned-in captions with a design device (Underneat's band) or crop them out
  (Mokobara/Youthiapa).
- **Spec work:** every reel is labelled unsolicited spec, not affiliated; footage/logos belong to the brands.

## Task snapshot (motion-reel todo list)
#24 "new brand reels built with the new system" — in progress (umbrella). #27–29 (Minimalist, Underneat, Mokobara)
done. **#30 Youthiapa Raised Right — in progress** (round 1 done; see its `docs/review_log.md`). Everything #1–#23,
#25, #26 complete.
