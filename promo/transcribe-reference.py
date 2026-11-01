import sys,json,hashlib,subprocess
import imageio_ffmpeg
from pathlib import Path
sys.path.insert(0,str(Path('promo/.local-python').resolve()))
from faster_whisper import WhisperModel
model=WhisperModel('base.en',device='cpu',compute_type='int8',download_root='promo/.local-models',cpu_threads=4)
import numpy as np
source=Path(sys.argv[1]) if len(sys.argv)>1 else Path('promo/public/audio/ashley-reference.mp3')
output=Path(sys.argv[2]) if len(sys.argv)>2 else Path('promo/evidence/ashley-timing.json')
raw=subprocess.check_output([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-i',str(source),'-f','f32le','-ac','1','-ar','16000','pipe:1'])
audio=np.frombuffer(raw,dtype=np.float32)
segments,info=model.transcribe(audio,language='en',word_timestamps=True,beam_size=5,vad_filter=True)
result={'duration':info.duration,'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'method':'local faster-whisper base.en word timestamps; automatic transcription, not manual listening','segments':[]}
for s in segments:
 row={'start':s.start,'end':s.end,'text':s.text,'words':[{'start':w.start,'end':w.end,'word':w.word} for w in s.words]};result['segments'].append(row);print(f'{s.start:.2f}-{s.end:.2f} {s.text}',flush=True)
output.write_text(json.dumps(result,indent=2),encoding='utf-8');print('DURATION',info.duration)
