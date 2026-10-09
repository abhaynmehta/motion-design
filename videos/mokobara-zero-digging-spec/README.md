# Mokobara Transit Z Backpack — "time spent digging: 0 seconds." (spec reel)

An 18-second 9:16 Hinglish reel for Mokobara's Transit Z Backpack, cut from the brand's own product films. **Unsolicited
spec work for outreach — not affiliated with or endorsed by Mokobara.** Footage and logo belong to Mokobara; the films
are not committed here.

**The idea (SMP: "In the Transit Z, time spent digging is zero seconds."):** the charger is always in the bag, just never
where your hand goes: a black bag is a black hole. So the reel opens inside one: pitch dark, a giant yellow *2%* (the
laptop), *charger kahan hai?*, and a torch beam hunting across a black backpack. On the 808 of "Big Dawgs" a zip rips
the dark open into Mokobara yellow — *Transit Z.* — and from then on every compartment opens with its own zip and its
item is found at once, each stamped **0 SEC**: *charger.* (the suspended charger pocket), *cards.*, *chaabi.*, *phone.*
(the secret magnetic pocket). Zipped shut: *sab sorted.* Then Mokobara's own line, set as a stat: *time spent digging:
0 seconds.* (the giant 0 rhymes with the hook's giant 2 %). End card: logo, Transit Z Backpack, ₹6,299, mokobara.com.

**Craft notes:** every shot is keyed off its white studio sweep onto the yellow (`scripts/prep_key.py`: border-connected
white, guided-filter edges, contact shadows kept, MediaPipe magic-touch protecting the white phone), so the whole reel
lives inside the bag's lining with no pale canvas; the films' burned-in labels are cropped away; every shot keeps the full
source width (1.33× / 1.2×, playbook L16); the zip is the only transition (a slider crosses the frame on the beat, the
halves part in a V with tape and teeth), and its sound is synthesized (`zip` / `rip` in sfx.mjs). Type scale
52 / 84 / 168 / 520 (Space Grotesk + Space Mono, OFL).

**Renders:** `renders/9x16.mp4` (SFX only; −16.9 LUFS, because a few zips and clicks cannot be raised further without crushing them) · `renders/9x16_song.mp4` (with the temp song, "Big Dawgs";
copyrighted: gitignored, sent directly; cue sheet `docs/music_cue.md`).

## Rebuild
```sh
sh scripts/fetch_sources.sh            # films, temp song, frames, key (needs a venv with mediapipe: see the script)
node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py
node scripts/render.mjs                # then: sh ../../playbook/tools/split_song.sh .
```
