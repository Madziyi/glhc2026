"""Decode the complete production cut, inspect scene boundaries and compare continuous narration."""
import json,subprocess
from pathlib import Path
import cv2,numpy as np,imageio_ffmpeg
from PIL import Image,ImageDraw
from scipy.signal import correlate,correlation_lags
root=Path(__file__).resolve().parent
plan=json.loads((root/'production-assembly.json').read_text())
video=root/'out'/plan.get('output_file','glhc-production-full.mp4')
capture=cv2.VideoCapture(str(video));decoded=0
while capture.read()[0]:decoded+=1
assert decoded==plan['total_frames'],decoded
assert (capture.get(3),capture.get(4),capture.get(cv2.CAP_PROP_FPS))==(1920,1080,30)
errors=[]
for scene in plan['scenes']:
    source=cv2.VideoCapture(str(root/'out'/scene['file']))
    for local in [0,scene['frames']//2,scene['frames']-1]:
        source.set(cv2.CAP_PROP_POS_FRAMES,local);capture.set(cv2.CAP_PROP_POS_FRAMES,scene['start_frame']+local)
        ok,a=source.read();ok2,b=capture.read();assert ok and ok2
        error=float(cv2.absdiff(a,b).mean());assert error<5,(scene['scene'],local,error)
        errors.append(dict(scene=scene['scene'],local_frame=local,mean_pixel_error=error))
    source.release()
times=[.5,7,13.6,20,23.7,24.3,29,34,40,46,53,67]
sheet=Image.new('RGB',(1440,1200),'#14232e');draw=ImageDraw.Draw(sheet)
for i,t in enumerate(times):
    capture.set(cv2.CAP_PROP_POS_MSEC,t*1000);ok,frame=capture.read();assert ok
    image=Image.fromarray(cv2.cvtColor(frame,cv2.COLOR_BGR2RGB));image.thumbnail((480,270));x=i%3*480;y=i//3*300
    sheet.paste(image,(x,y));draw.text((x+12,y+278),f'{t}s',fill='white')
sheet.save(root/'evidence/assembled-production-review.jpg')
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
def pcm(path):return np.frombuffer(subprocess.check_output([ffmpeg,'-v','error','-i',str(path),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32)
a=pcm(root/plan['voiceover']);b=pcm(video);cross=correlate(b,a,method='fft');lag=int(correlation_lags(len(b),len(a))[np.argmax(cross)])
aa=a[max(0,-lag):];bb=b[max(0,lag):];length=min(len(aa),len(bb));score=float(np.corrcoef(aa[:length],bb[:length])[0,1]);assert score>.97,score
result=dict(decoded_frames=decoded,duration_seconds=decoded/30,fps=30,dimensions=[1920,1080],scene_samples=errors,continuous_audio_correlation_to_source=score,codec_delay_seconds=lag/16000,displayed_domain='raeonhacks.com',reference_spoken_domain_pending_correction=True)
(root/'evidence/assembled-production-verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps({k:v for k,v in result.items() if k!='scene_samples'}))
