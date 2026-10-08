# Music — pick the song first, then cut the reel to it (Lesson L06)

Pitches go to brand teams who live on Reels; a stock-library bed reads as a template. Use real, current or
genre-perfect songs as the temp track. (The user adds the disclaimer and decides what's sent; the brand would license
or swap the track if they run the ad.)

## Choosing
1. **Match the SMP's feeling, then the audience's playlist.** Indian D2C brands → Hindi/Punjabi/Hinglish trending
   audio or a Bollywood hook; global brands → current English pop/R&B/house; fragrance → sensual R&B, Latin, or a
   cinematic build; workout/energy → a drop.
2. **Trending check:** Instagram's Reels audio browser is the source of truth; for research use weekly trackers
   (Later, SocialPilot, Spotify "Trending on Reels" playlists, JioSaavn "Trending On Reels").
3. **Never the same track twice, never the same genre twice in a row** (registry check).

## Getting the audio
- **Supplied:** the user drops the song (or the exact reel audio) into Drive; we pull it from there.
- **Preview clip:** Apple's public iTunes Search API returns a 30 s preview of most commercial songs (usually the hook):
  `curl "https://itunes.apple.com/search?term=<artist+title>&media=music&entity=song&limit=5&country=in"` → `previewUrl`.
  30 s is a reel. Save it to `audio/track/` (gitignored).
- Not from YouTube/Spotify/Instagram downloads (login walls and bot checks are off limits).
- **Copyrighted songs are never committed.** `audio/track/` and the with-song render (`renders/9x16_song.mp4`) are
  gitignored; the repo keeps the SFX-only render and a cue sheet (song, artist, which second of the song the reel starts
  on) so anyone can rebuild the with-song version. After the final render: `sh playbook/tools/split_song.sh videos/<slug>`
  (moves the song cut to `_song.mp4`, writes the SFX-only `9x16.mp4` at −14 LUFS).

## Cutting to it
- Measure the grid (`beats.py`) and find the **hook** (first sung/played motif) and the **drop** (biggest energy jump:
  low-band onset, see `playbook/tools/find_drop.py`).
- Put the hook's first beat on frame 0 or the drop on the reel's turn/reveal. Cuts land on beats; the big reveal lands
  on the drop. Never fade music in from silence on frame 0.
- In script.json, `song_start_s` is where the reel enters the song (song seconds) and `drop_at_s` is where the drop
  lands in the REEL (reel seconds = song seconds − song_start_s). The gate checks a turn/reveal/proof/payoff beat
  starts within 0.3 s of it. Starting later in the song is how you shorten the reel without moving the drop off a beat.
- SFX: fewer, bigger. One signature sound per reel plus whooshes on real moves; no tick-roll texture under a song.
- Mix the song at −14 LUFS with SFX sitting 8–10 dB under it.
