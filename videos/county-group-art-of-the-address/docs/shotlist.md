# Shotlist: County Group brand film · 24 s · 80 BPM · 32 beats · formats 16x9 + 9x16

STATUS: APPROVED — user: "ok, go ahead and build it, make it super luxury and super classy … something I can show in my office."
(Approved as the 15 s vertical plan; rebuilt at 24 s / 80 BPM for the luxury pacing, 16:9 first for the office screen, and with
"Two decades of addresses." replacing "Eleven addresses." after the user clarified the portfolio has more than 11 projects.)

| # | Beats | Time (s) | Shot | On-screen text (exact) | Motion | SFX | 9:16 notes |
|---|---|---|---|---|---|---|---|
| 1 | 0–3.5 | 0.0–2.6 | Hook on cream: gold hairline draws, eyebrow, two-line headline | COUNTY GROUP · SINCE 2005 / The art of / the address. | words rise (heavy), "The" pre-released so f0 reads; hairline draws (default) | shimmer b0, chime b1.5 | headline 120 px, block at y≈40 % |
| 2 | 3.5–4 | 2.6–3.0 | Curtain: brown closes down from the hairline | — | headline lifts out b3.25; curtain (default) | silk peaks b4 | same |
| 3 | 4–16 | 3.0–12.0 | Gallery: 6 renders, a wipe every 2 beats, each with Nº, name, location | Nº 01 Orange COUNTY · INDIRAPURAM, GHAZIABAD · Nº 04 Cleo … · Nº 06 COUNTY 107 · SECTOR 107, NOIDA · Nº 07 Ivy … · Nº 09 Ivory … · Nº 11 Clove … SECTOR 151, NOIDA | wipe with gold edge (spHit default), image drift, type rises/lifts per shot | silk on each cut | image top, type below |
| 4 | 16–19 | 12.0–14.25 | Clove collapses into its tile; 11 tiles rise one per ¼ beat; title; tile 12 is an empty dark tile where a gold arch draws | Two decades of addresses. | collapse (default), card rise (snappy), arch draw | silk b16, harp per tile (music), chime b18.5 | 3 × 4 grid |
| 5 | 19–20 | 14.25–15.0 | Dive into tile 12 (music stops) | — | push-through, expo-in | riser peaks b20 | same |
| 6 | 20–26 | 15.0–19.5 | Gurugram: an arched jaali window draws in gold; type left | County Life. / Now in Gurugram | lattice draws outward, words rise (heavy); light rises in the arch at b24 | boom b20, shimmer b24 | arch above, type below |
| 7 | 26–32 | 19.5–24.0 | End card on cream: arch iris, arch mark, lockup, URL; gold rule sweep at b30 | COUNTY / GROUP / countygroup.in | arch iris (default), words rise (heavy), slow push | silk b26, thump b27, chime b28, shimmer b30 | lockup centred column at x = 90 |

## Music
Project-local `scripts/music.py`: Dmaj9 · Bm9 · Gmaj7#11 · Em9–A13sus4 · Dmaj9/F# (stop at b19) · Gmaj9 (drop b20) · A6sus4 · Dmaj9 (b26).

## Open questions for the user
- Showing a Gurugram project by name needs its HARERA number on screen: add it to `timeline.json` `copy.rera` and it renders as small print.
- Real logo: drop `assets/brand/logo.png` (or .svg) and the end card uses it instead of the typographic lockup.
