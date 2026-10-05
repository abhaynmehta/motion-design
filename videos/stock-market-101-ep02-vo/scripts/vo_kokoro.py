# Voiceover with Kokoro-82M (Apache-2.0), Hindi voices → audio/vo/<id>.wav (48 kHz mono) + audio/vo/lines.json (durations,
# leading/trailing silence trimmed) + an ASR check with faster-whisper (Hindi) so every line is verified intelligible.
#   <venv>/bin/python scripts/vo_kokoro.py [--only l3,l7]
import json, sys, numpy as np, soundfile as sf
from kokoro import KPipeline
S = json.load(open('vo_script.json'))
only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
pipe = KPipeline(lang_code='h', repo_id='hexgrad/Kokoro-82M')
def resample(a, sr0=24000, sr1=48000):
    t0 = np.arange(len(a)) / sr0; t1 = np.arange(int(len(a) * sr1 / sr0)) / sr1
    return np.interp(t1, t0, a).astype(np.float32)
def trim(a, sr=48000, th=0.012, pad=0.03):
    env = np.convolve(np.abs(a), np.ones(int(0.01 * sr)) / int(0.01 * sr), 'same')
    idx = np.where(env > th)[0]
    if not len(idx): return a
    i0 = max(0, idx[0] - int(pad * sr)); i1 = min(len(a), idx[-1] + int(pad * sr))
    return a[i0:i1]
out = json.load(open('audio/vo/lines.json')) if only else {}
for L in S['lines']:
    if only and L['id'] not in only: continue
    v = S['voices'][L['who']]
    parts = [a.numpy() for _, _, a in pipe(L['tts'], voice=v['voice'], speed=v['speed'])]
    a = trim(resample(np.concatenate(parts)))
    a = a / max(1e-6, np.abs(a).max()) * 0.89
    sf.write(f"audio/vo/{L['id']}.wav", a, 48000, subtype='PCM_24')
    out[L['id']] = {'who': L['who'], 'dur': round(len(a) / 48000, 3)}
    print(L['id'], L['who'], out[L['id']]['dur'], 's')
from faster_whisper import WhisperModel
m = WhisperModel('small', device='cpu', compute_type='int8')
for L in S['lines']:
    if only and L['id'] not in only: continue
    segs, _ = m.transcribe(f"audio/vo/{L['id']}.wav", language='hi', beam_size=3)
    out[L['id']]['asr'] = ''.join(s.text for s in segs).strip()
    print(L['id'], '|', L['tts'], '\n     ASR:', out[L['id']]['asr'])
json.dump(out, open('audio/vo/lines.json', 'w'), ensure_ascii=False, indent=1)
