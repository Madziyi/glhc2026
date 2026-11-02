"""Decode portrait export, compare its editorial frames and verify untouched audio."""
import json,subprocess,hashlib
from pathlib import Path
import cv2,imageio_ffmpeg
from PIL import Image,ImageDraw
from importlib.util import spec_from_file_location,module_from_spec
root=Path(__file__).resolve().parent
spec=spec_from_file_location('portrait',root/'build-portrait.py');m=module_from_spec(spec);spec.loader.exec_module(m)
a=cv2.VideoCapture(str(m.SOURCE));b=cv2.VideoCapture(str(m.OUTPUT))
assert tuple(b.get(i) for i in [3,4,5,7])==(1080,1920,30,2022)
count=0
while b.read()[0]:count+=1
assert count==2022
times=[.7,2.5,5.5,8,11.5,16,19,22.8,24.5,26.8,29.8,34,40,43,45.8,48,53,59.3,65.5,67]
sheet=Image.new('RGB',(1080,1920),'#14232e');d=ImageDraw.Draw(sheet);errors=[]
for i,t in enumerate(times):
 f=round(t*30)
 for c in [a,b]:c.set(cv2.CAP_PROP_POS_FRAMES,f)
 ok,x=a.read();ok2,y=b.read();assert ok and ok2
 expected=cv2.cvtColor(__import__('numpy').asarray(m.frame(cv2.cvtColor(x,cv2.COLOR_BGR2RGB),f/30)),cv2.COLOR_RGB2BGR)
 error=float(cv2.absdiff(expected,y).mean());assert error<6,(t,error);errors.append({'seconds':t,'mean_pixel_error':error})
 im=Image.fromarray(cv2.cvtColor(y,cv2.COLOR_BGR2RGB));im.thumbnail((216,384));sheet.paste(im,(i%5*216,i//5*480));d.text((i%5*216+8,i//5*480+390),str(t)+'s',fill='white')
def audio_hash(path):return subprocess.check_output([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-i',str(path),'-map','0:a:0','-c:a','copy','-f','md5','-']).decode().strip()
assert audio_hash(m.SOURCE)==audio_hash(m.OUTPUT)
sheet.save(root/'evidence/portrait-rendered-review.jpg')
report={'decoded_frames':count,'dimensions':[1080,1920],'fps':30,'duration_seconds':count/30,'audio_packet_hash':audio_hash(m.OUTPUT),'reframed_samples':errors,'caption_cues':len(m.CUES),'underwater_transition_end_seconds':24,'tv_cue_seconds':869/30,'method':'scene-aware subject tracking and portrait paper/resource/end-card recomposition'}
(root/'evidence/portrait-verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='reframed_samples'}))
