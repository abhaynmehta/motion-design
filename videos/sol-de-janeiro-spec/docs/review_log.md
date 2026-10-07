# Review log — Sol de Janeiro · "departures." (spec)

Scores 1–10: hook in first 2 s · readability at phone size · motion quality · variety · brand accuracy · sound sync.

## Round 0 (material)
- Only 7 product films on the site (Shopify `/products/<handle>.js` media), and most product photos carry burned-in
  headlines. The clean material: the ten packshots (cut out with magic_touch, all clean) and the 1080p home film. The home
  film shows the Intense line, so only shots without product are used, as the view through a plane window.
- The site's Knockout is licensed (Hoefler & Co) and its script face is a commercial font: deleted; Oswald (OFL) for
  Knockout, the site's own Noto Sans for body copy.
- Every claim is the product pages' own copy (years, events, notes, "the rhythm of Rio after hours"); prices from the
  store's variants (90 ml $26, 240 ml $39).

## Round 1 (stills)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 7 | 7 | 9 | 9 | — |

Evidence: t0.7 / t2.0 — the year flaps stepped through the whole alphabet (2026 → "8446", "Y96S"), the 2 → 1 flip took
42 flaps; t6.7 — NOW BOARDING still mid-flip a beat after the cue; t26.7 — "RIO DE JANEIRO" ran into "PICK YOUR YEAR.";
1976's line "disco nights in rio, until sunrise." was my wording, not the brand's.

Fixes:
1. Year flaps step through digits only (" 0123456789?"); flap time 0.025 s, column stagger 0.03 s, so even 9 → 8 lands
   inside a beat in the fast section.
2. NOW BOARDING starts a beat earlier (b13).
3. The Rio label lifts out before the end; 1976 now reads "THE RHYTHM OF RIO AFTER HOURS." (the product page's line).

## Round 2 (sheet)
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 8 | 9 | 9 | 8 |

Evidence: b33 and b38 — the 1962 window showed a frame of the Intense bottles and a tray of gold: the "jersey" in/out
straddled two cuts. Frame-difference scan of the home film: cuts at 1.668, 3.17, 3.75, 4.25 s … ; jersey re-cut to
3.19–3.73 s, orchids to 4.28–5.11 s, beach to 0–1.62 s. b4–b7 held still for 1.8 s: added "EVERY NUMBER IS A YEAR." on b5
(it also explains the idea). SFX written (251 cues: flap clatter, landings and take-offs, a synthesised airport
ding-dong for NOW BOARDING and the logo) and mixed to −14 LUFS.

## Round 3 (sheet, determinism) — SHIP
| hook | phone | motion | variety | brand | sync |
|---|---|---|---|---|---|
| 8 | 8 | 9 | 9 | 9 | 8 |

Evidence: the end card held 2.7 s after the logo (rule ≤ 2 s): the film ends at b63 (28.0 s, music re-cut with its
fade) and the ten bottles do a last wave on b60. Determinism 36/36.
Cover check (t16.45): the cut-outs carried part of the packshot shadow (lower left, a pale strip beside the bottle on the
coloured fields). scripts/clean_cutouts.py mirrors each bottle's clean right edge about its axis (from the cap rows) and
clears rows with no right edge; 39 lost 29 px of shadow, the others a few px at the base. Re-rendered.
