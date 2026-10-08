# Motion studio rules

## Playbook first (brand ads)
- Read `playbook/AUDIT.md` and `playbook/LESSONS.md` before starting any reel: they hold the mistakes we already made.
- Every reel starts with `script.json` written like a senior copywriter (`playbook/SCRIPT_METHOD.md`): one audience, one
  insight, ONE single-minded proposition, says / shows / serves for every beat. Footage is chosen to show what each line
  says; never a shot of another product or category.
- Run `node playbook/tools/preflight.mjs videos/<slug>` until clean. `render.mjs` refuses a final render on a FAIL.
- Look: footage, dark or rich colour grounds, not pale empty canvas (`playbook/LOOK.md`). Type ≥ 44 px, ≤ 7 words.
- Music: a real song picked first, cut to its drop (`playbook/MUSIC.md`). Songs are never committed.

## Render contract
- Every film is a pure function of time: window.seek(t) paints frame t.
- No CSS transitions, no setTimeout, no requestAnimationFrame in render mode, no state carried between frames. Seeded noise only (mulberry32), never Math.random.
- No will-change, translate3d or translateZ(0). Composited layers make the same t paint differently. Use 2D transforms.
- Render with node render.mjs, encode H.264 yuv420p, CRF 16.

## Motion
- Springs only: closed-form springs from lib/motion.js. No easing curves for anything that enters, exits or retargets.
- Any value with more than one target uses track(): one spring per change, each starting at its own time. Never restart a spring.
- Presets: snappy (buttons, toggles, leading edges), default (cards, containers, camera), heavy (big type, logo lockups), playful (visible overshoot, mascots only). Tiny overshoot on UI, none on type.
- Text inside a morphing box enters after the morph starts and leaves before the next one (swapAlpha).
- A pure opacity fade is never an enter or an exit.

## Look
- Banned defaults (clichés):
  - centered title on a gradient
  - everything fading in
  - corner labels and frame borders
  - glow on UI chrome
  - generic particle bursts
  - crossfades between shots
  - spins, glitches, light leaks
  - bouncy easing on UI
  - dead time
- One display face, one UI face. One accent color unless the brief says otherwise.
- Real product UI, logos and fonts. Never redraw UI that exists.
- Every 2 to 4 seconds something new must happen on screen, inside one consistent world (not a new device each time).

## Sound
- Music is a real song (supplied, or a preview clip) chosen before the edit; SFX are synthesized in code, fewer and bigger.
- Place hits on the measured beat grid (beats.json). Loudness -14 LUFS.

## Loop before you show me anything
1. Render one frame per beat as a contact sheet and LOOK at it.
2. First the stranger test: what is it, what does it do, why care, did any shot contradict its line? A fail caps every score at 5.
   Then score 1-10 on: story & message, hook in first 2s, readability at phone size, motion quality, variety, brand accuracy, music, sound sync.
3. Fix the 3 worst problems. Repeat until every score is 8+.
4. Only then do the full render.

The /motion-reel skill (.claude/skills/motion-reel) holds the full pipeline. Its reference/RULES.md has the detailed version of these rules.
