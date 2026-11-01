import cv2
from PIL import Image,ImageDraw
from pathlib import Path
root=Path(__file__).resolve().parent
items=[('straight-swim-science.mp4',f) for f in [165,190,220,245,270,310]]+[('tv-power-waterfront.mp4',f) for f in [100,145,152,159,175,195]]
sheet=Image.new('RGB',(1440,1200),'#14232e');d=ImageDraw.Draw(sheet)
for i,(name,f) in enumerate(items):
 c=cv2.VideoCapture(str(root/'out'/name));c.set(cv2.CAP_PROP_POS_FRAMES,f);ok,a=c.read();assert ok;(im:=Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB))).thumbnail((480,270));x=i%3*480;y=i//3*300;sheet.paste(im,(x,y));d.text((x+8,y+275),f'{name} frame {f}',fill='white');c.release()
sheet.save(root/'evidence/straight-swim-tv-review.jpg')
