import cv2
from PIL import Image,ImageDraw
from pathlib import Path
root=Path(__file__).resolve().parent
items=[('long-curve-science.mp4',f) for f in [150,190,212,235,260,278,295,310,318]]+[('24s-waterfront.mp4',f) for f in [0,30,149]]
sheet=Image.new('RGB',(1440,1200),'#14232e');d=ImageDraw.Draw(sheet)
for i,(name,f) in enumerate(items):
 c=cv2.VideoCapture(str(root/'out'/name));c.set(cv2.CAP_PROP_POS_FRAMES,f);ok,a=c.read();assert ok;(im:=Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB))).thumbnail((480,270));x=i%3*480;y=i//3*300;sheet.paste(im,(x,y));d.text((x+8,y+275),f'{name} frame {f}',fill='white');c.release()
sheet.save(root/'evidence/24s-transition-review.jpg')
