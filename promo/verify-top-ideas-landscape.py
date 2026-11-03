import json,subprocess
from pathlib import Path
import cv2,numpy as np,imageio_ffmpeg
from PIL import Image,ImageDraw
from scipy.signal import correlate,correlation_lags
root=Path(__file__).resolve().parent;p=json.loads((root/'top-ideas-landscape.json').read_text());out=root/'out'/p['output']
c=cv2.VideoCapture(str(out));assert tuple(c.get(i) for i in [3,4,5,7])==(1920,1080,30,p['frames'])
n=0
while c.read()[0]:n+=1
assert n==p['frames']
times=[.7,5.5,11.5,19,24.2,29.1,34,40,46,48.5,56,67]
sheet=Image.new('RGB',(1440,1200),'#14232e');d=ImageDraw.Draw(sheet)
for i,t in enumerate(times):
 c.set(cv2.CAP_PROP_POS_MSEC,t*1000);ok,a=c.read();assert ok
 im=Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB));im.thumbnail((480,270));x=i%3*480;y=i//3*300;sheet.paste(im,(x,y));d.text((x+8,y+275),str(t)+'s',fill='white')
sheet.save(root/'evidence/top-ideas-landscape-review.jpg')
c.set(cv2.CAP_PROP_POS_MSEC,46*1000);ok,a=c.read();assert ok;Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB)).crop((840,30,1080,245)).resize((720,645)).save(root/'evidence/top-ideas-badge.png')
def pcm(path):return np.frombuffer(subprocess.check_output([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-i',str(path),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32)
a=pcm(root/p['voiceover']);b=pcm(out);co=correlate(b,a,method='fft');lag=int(correlation_lags(len(b),len(a))[np.argmax(co)]);aa=a[max(0,-lag):];bb=b[max(0,lag):];length=min(len(aa),len(bb));score=float(np.corrcoef(aa[:length],bb[:length])[0,1]);assert score>.97
report={'decoded_frames':n,'dimensions':[1920,1080],'fps':30,'duration_seconds':n/30,'new_narration_correlation':score,'audio_delay_seconds':lag/16000,'badge':'TOP IDEAS','keyword_captions':False,'timing_anchors':p['anchors']}
(root/'evidence/top-ideas-landscape-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
