# Guide music → audio/music.wav: "Big Dawgs" (Hanumankind & Kalmi) — the 30 s iTunes preview (audio/track/, gitignored,
# never committed; playbook/MUSIC.md). Per-beat energy on the preview: 120 bpm, beat 0.5 s, first beat 0.032 s; a quiet
# open (beats 0-4), the 808 enters at 2.36 s (reel 2.33 s, beat 4.66), then hits every 16 beats from beat 7 (3.53 s).
# The reel starts on the first beat (0.032 s in), so reel beat b = 0.5 b s. 20 ms fade-in, 0.6 s fade-out.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/big-dawgs-preview.m4a'
BEAT = 0.5; PRE = 0.0; START = 0.032; NB = 40
TL = json.load(open('timeline.json')); DUR = float(TL['duration'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = x[int(START * SR): int((START + DUR) * SR)].copy()
fi = int(0.02 * SR); out[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(0.6 * SR); out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.5)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
beats = [round(PRE + i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'start_in_song': START, 'duration': round(len(out) / SR, 4), 'bpm': 120.0, 'beat': BEAT,
           'offset': PRE, 'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [2.33, 3.5, 11.5],
           'note': 'measured on the iTunes preview (per-beat 30-120 Hz energy): the 808 enters at reel 2.33 s (beat 4.66) and hits hardest on beats 7, 23, 39.'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')
