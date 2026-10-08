# Playbook — how we make brand reels now

Read in this order:
1. `AUDIT.md` — every reel so far, critiqued honestly, with measurements; the root causes.
2. `LESSONS.md` — the 15 lessons (L01–L15) and which ones the gate checks.
3. `SCRIPT_METHOD.md` — research → insight → single-minded proposition → story shape → beat sheet (says / shows /
   serves) → supers → the stranger test. Worked example: the Kylie reel rewritten.
4. `LOOK.md` — grounds, layout and type that hold a phone screen.
5. `MUSIC.md` — pick a real song first, cut to its drop; how to get the audio; never commit songs.

Tools:
- `templates/script.json` — the first file of every reel (init copies it).
- `tools/preflight.mjs` — the gate. `node playbook/tools/preflight.mjs videos/<slug> [--render <mp4>] [--register]`.
  The kit's `render.mjs` runs it before every final render and refuses on a FAIL, then runs the pixel checks after.
- `tools/audit_render.py` — pale canvas, pale runs, picture changes per second and the longest still hold (before the
  CTA, `--until`), on any render.
- `tools/find_drop.py` — a song's bpm, beat phase and drops.
- `tools/split_song.sh` — after a final with a copyrighted temp song: song cut → `_song.mp4` (gitignored), SFX-only
  `9x16.mp4` for the repo.
- `registry.json` — every finished reel's device, hook type, genre, track and ground; the gate refuses repeats.
- `tests/kylie-as-made/` — the Kylie reel as it was made; the gate flags 17 problems in it (a regression test for the
  gate: `node playbook/tools/preflight.mjs playbook/tests/kylie-as-made` must keep failing on L01, L02, L06–L10).
