# Lessons — the mistakes we don't make twice

Each lesson has an ID. `playbook/tools/preflight.mjs` checks every one it can and **blocks the final render** on a FAIL
(`scripts/render.mjs` runs it). A lesson can only be waived in `script.json → waivers` with a written reason, which is
printed on every run. Source of each lesson: `AUDIT.md`.

| ID | Lesson | Where it went wrong | Machine check |
|---|---|---|---|
| L01 | **One reel, one message.** One product (or one range sold by one idea), one single-minded proposition (SMP) ≤ 14 words. | Kay (3 products), Rare (blush + mist), Summer Fridays (collector joke + #1 claim) | `script.smp` is one sentence ≤ 14 words; one `product`; a range needs `range_reason` |
| L02 | **Every shot shows what its line says.** Footage is chosen for the line, never for being pretty or available. No shot of a different product or category. | Kylie: blush and eyeliner shots in a fragrance ad → "one minute contour, one minute liner" | every shot in `shots.json` has `shows` + `category`; category must be the product's or `neutral`; every shot is used by a beat |
| L03 | **The device must BE the message,** not decoration around it. One world for the whole reel; no new device per section. | Summer Fridays (8 devices in 31 s), Kylie (clock + stone window + notes montage) | `device` + `device_why` set; ≤ 6 beats; beats ≥ 2.5 s (except `montage`) |
| L04 | **No pale empty canvas.** Default to footage full-bleed, dark or rich colour. Pale backgrounds only when they ARE the brand world, and then never as empty space. | Kay 52 %, Summer Fridays 54 %, rhode 100 % canvas frames | `--bg` luminance; after render: canvas frames ≤ 20 %, no pale run > 2 s |
| L05 | **Type that reads on a phone.** ≥ 44 px for anything that must be read, ≤ 7 words per super, ≤ 2 families, heavy weights for headlines, one text layer per frame. | thin serifs, 22–36 px labels, title + tag + notes + label stacks | parses every `line()` in `film.js`: size, words; counts `@font-face` families |
| L06 | **Music first, and music with a pulse people know.** Pick the song before the edit (a trending or genre-right track), cut the edit to its hook and drop. Never the same track twice; never the same genre twice in a row. No stock-library muzak for pitches. | every reel used Mixkit/synth beds chosen after the edit | `music.source` must be `song` or `supplied`; title/artist set; registry repeat checks; the drop lands on a beat that starts a `reveal`/`turn` |
| L07 | **A stranger can answer three questions after one watch:** what is it, what does it do for me, why should I care. Those answers are ON SCREEN. | rhode (never says what a lip shaper does), Sol de Janeiro (never says why you'd want to smell like 1962), Kylie (never says "perfume") | `recall.what` (product name) and the key words of `recall.does` appear in the supers |
| L08 | **Hook in 2–3 s with the product or the tension in frame.** No text-only hook on a blank background; the SMP or its setup on screen by 3 s. | Rare (4.5 s of text on cream), Kylie (eye crop, product at 3.5 s) | beat 0 is `hook`, ≤ 3 s, ≤ 8 words, `shows` has `product`/`person`/`tension`; the product is on screen by 3 s |
| L09 | **Proof, not adjectives.** At least one beat shows the product working: texture, application, the result, the spray on skin. | Sol de Janeiro (no one sprays anything), Kylie (no spray), rhode (pun, no result) | a beat with role `proof` whose shots are tagged `demo`/`texture`/`result`/`in-use` |
| L10 | **End on the product and one CTA.** Product name, what it is, price or where; no empty end card. | Kay / Rare / Kylie end cards: small type on cream for 2.5–4.5 s | last beat is `cta` with the product name and a price or a place; end card ≤ 2.5 s |
| L11 | **Don't repeat ourselves across reels.** Device, hook type, music genre and background must differ from the last reels. | five reels in a row: pale backgrounds; four: Mixkit beds; "window" device in four | `playbook/registry.json`: device repeat in last 5 = FAIL; same hook type as last 2 / same genre as last = WARN |
| L12 | **Every claim has a source.** Numbers, "#1", notes, prices come from the brand's own pages, quoted. | (done right in series 2 — keep it) | every `claims[]` entry has `source` |
| L13 | **The picture moves.** Big picture changes (cuts, moves, wipes) average ≥ 1.5 a second; no layout held still > 2 s. The CTA end card is exempt from both. | Sol de Janeiro 0.8 changes/s; rhode 1.1; Olaplex first render 1.07 (a 2.4 s held BEFORE as the hook, 2 s holds on each after) | after render, before the CTA: changes/s ≥ 1.2 (WARN < 1.5); longest still hold ≤ 2 s (FAIL > 3 s) |
| L14 | **Score story before craft.** The critique asks the three recall questions and "did any shot contradict its line?" before sync, loudness or motion. A reel that fails recall can't score above 5. | every reel self-scored 8 | the review log template puts recall first (CRITIQUE.md) |
| L15 | **Type lives inside the platform's safe area.** Reels/TikTok UI covers the top 14 % (269 px), the bottom 20 % (from 1536 px: caption, audio) and the right 12 % low down (buttons). Hook lines, labels, CTA and footnotes sit between. | Olaplex first final: scoreboard labels and logo under the top bar, footnote and "your hair wins." in the caption band; Glossier draft: label logo at y 76, glossier.com at y 1730 | gate: every DOM line's y and size (FAIL); canvas type and the right edge: review `safe_9x16.jpg` |
| L16 | **Clips at the resolution they have.** No shot upscaled past 1.6×; full-bleed only from sources ≥ 1000 px wide; frame-blend only real slow motion. | Olaplex and Glossier full-bleed shots at 1.78× (606/864 px sources) read soft; Glossier's near-1× swipe ghosted (double "Glossier.") with frame blending | gate: per-shot upscale from shots.json + ffprobe (WARN > 1.4, FAIL > 1.6) |
| L17 | **Type is a designed scale.** 3–4 sizes from one ratio, one hero line per beat, tight display setting, plates not shadows. | early reels mixed 8–10 sizes and leaned on text-shadows over busy footage | gate: distinct sizes (WARN > 5, FAIL > 8) and hierarchy (biggest ≥ 2.5× smallest readable); LOOK.md |

## How the system works
1. **Before any design:** write `script.json` (template: `playbook/templates/script.json`) the way a senior copywriter
   would (`SCRIPT_METHOD.md`): audience, insight, SMP, one-sentence story, beats with what each line SAYS and what each
   shot SHOWS, claims with sources, music plan, look.
2. **Tag the footage:** every shot in `shots.json` gets `shows` (plain words) and `category`.
3. **Run the gate early and often:** `node ../../playbook/tools/preflight.mjs .` (from the project). It prints PASS /
   WARN / FAIL per lesson. Design starts only when the script-level checks pass.
4. **Final render** runs the gate automatically and refuses to start on a FAIL. After the render, the gate checks the
   pixels (`--render renders/9x16.mp4`): pale canvas, pale runs, picture energy.
5. **Register** the finished reel (`--register`) so the next reel can't repeat its device, hook, genre or look.
