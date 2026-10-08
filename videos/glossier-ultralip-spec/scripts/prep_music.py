# Guide music → audio/music.wav: SZA "Snooze" — the 30 s iTunes preview (audio/track/, gitignored, never committed; see
# playbook/MUSIC.md). find_drop.py on the preview: 142.9 bpm grid, beat 0.4198 s, first beat 0.232 s; bars of 4 grid
# beats start on the kick (song beats 2, 6, 10 …); the chorus lift is song beat 46 = 19.54 s. The reel enters on the bar
# line at song beat 10 (4.43 s), so reel beat 0 = frame 0 and the lift lands on reel beat 36 (15.11 s). 20 ms fade-in
# (no click, not a fade from silence), 0.6 s fade at the end.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/snooze-preview.m4a'
BEAT = 0.4198; PRE = 0.0; START = 0.232 + 10 * BEAT; NB = 56
TL = json.load(open('timeline.json')); DUR = float(TL['duration'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = x[int(START * SR): int((START + DUR) * SR)].copy()
fi = int(0.02 * SR); out[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(0.6 * SR); out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.5)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
beats = [round(PRE + i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'start_in_song': round(START, 4), 'duration': round(len(out) / SR, 4), 'bpm': round(60 / BEAT, 3), 'beat': BEAT,
           'offset': PRE, 'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [],
           'note': 'find_drop.py grid on the iTunes preview, entered at song beat 10; the chorus lift = reel beat 36 (15.11 s).'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')
