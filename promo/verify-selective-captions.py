import json,subprocess,hashlib
from pathlib import Path
import cv2,numpy as np,imageio_ffmpeg
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parent
plan=json.loads((root/'caption-cues.json').read_text())
a=cv2.VideoCapture(str(root/'out'/plan['source']));b=cv2.VideoCapture(str(root/'out'/plan['output']))
assert (b.get(3),b.get(4),b.get(5),b.get(7))==(1920,1080,30,2022)
count=0
while b.read()[0]:count+=1
assert count==2022
sheet=Image.new('RGB',(1920,1200),'#14232e');draw=ImageDraw.Draw(sheet);report=[]
for i,cue in enumerate(plan['cues']):
 t=cue['start']+min(.27,(cue['end']-cue['start'])/2)
 for cap in [a,b]:cap.set(cv2.CAP_PROP_POS_MSEC,t*1000)
 ok,x=a.read();ok2,y=b.read();assert ok and ok2
 diff=cv2.absdiff(x,y).max(axis=2);mask=diff[800:1000]>65;ys,xs=np.where(mask);assert len(xs)>100,cue
 bounds=[int(xs.min()),int(ys.min()+800),int(xs.max()),int(ys.max()+800)]
 assert bounds[0]>80 and bounds[2]<1840 and bounds[1]>810 and bounds[3]<990,bounds
 im=Image.fromarray(cv2.cvtColor(y,cv2.COLOR_BGR2RGB));im.thumbnail((480,270));xx=i%4*480;yy=i//4*300;sheet.paste(im,(xx,yy));draw.text((xx+8,yy+275),f"{t:.2f}s {cue['text']}",fill='white');report.append(dict(text=cue['text'],bounds=bounds))
for t in [11.5,20,29.8,36,55,65]:
 for cap in [a,b]:cap.set(cv2.CAP_PROP_POS_MSEC,t*1000)
 ok,x=a.read();ok2,y=b.read();assert ok and ok2;assert cv2.absdiff(x,y).mean()<5
ff=imageio_ffmpeg.get_ffmpeg_exe()
def audio_hash(name):return subprocess.check_output([ff,'-v','error','-i',str(root/'out'/name),'-map','0:a:0','-c:a','copy','-f','md5','-']).decode().strip()
assert audio_hash(plan['source'])==audio_hash(plan['output'])
assert all('CHALLENGE' not in c['text'] for c in plan['cues'])
sheet.save(root/'evidence/selective-captions-review.jpg')
result=dict(decoded_frames=count,caption_count=len(report),unchanged_audio_packet_hash=audio_hash(plan['output']),competition_reveal_caption=False,caption_bounds=report,uncaptioned_samples=6)
(root/'evidence/selective-captions-verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
