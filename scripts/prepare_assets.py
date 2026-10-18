"""Prepare provisional, locally supplied RAEON visual assets for the first hero proof of concept.
Requires Pillow and OpenCV. These are not run during the website build.
"""
from pathlib import Path
from PIL import Image, ImageFilter
import cv2
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
INPUT=ROOT/'design-sources'
OUT=ROOT/'public/assets'
OUT.mkdir(parents=True,exist_ok=True)
# 1. Optimize original photo as an accurate reference and as a fallback.
buoy=Image.open(INPUT/'RAEON-Buoy_PC-Katelynn-Johnson-1-600x600.jpg').convert('RGB')
buoy.save(OUT/'buoy-reference.webp','WEBP',quality=82,method=6)
# 2. Construct a water-and-sky plate from the original scene by removing the buoy.
b=np.asarray(buoy)
removal=np.zeros((600,600),np.uint8)
pts=np.array([[302,76],[321,76],[329,242],[356,270],[353,327],[391,344],[396,388],[365,415],[266,420],[235,386],[235,344],[266,330],[277,260],[302,250]],np.int32)
cv2.fillPoly(removal,[pts],255)
removal=cv2.dilate(removal,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(25,25)))
# Use row-by-row interpolation between surrounding lake and sky rather than costly inpainting across the whole scene.
plate=b.copy().astype(np.float32)
for y in range(60,440):
 xs=np.where(removal[y]>0)[0]
 if len(xs):
  xl=max(0,int(xs.min())-16);xr=min(599,int(xs.max())+16)
  left=plate[y,max(0,xl-8):xl].mean(axis=0)
  right=plate[y,xr+1:min(600,xr+9)].mean(axis=0)
  for x in range(xl,xr+1):
   t=(x-xl)/max(1,(xr-xl))
   plate[y,x]=left*(1-t)+right*t
plate=cv2.GaussianBlur(plate.astype(np.uint8),(0,0),1.4)
Image.fromarray(plate).save(OUT/'lake-surface.webp','WEBP',quality=82,method=6)
# 3. Semitransparent photo cutout. Hand-guided silhouette; intentionally provisional.
mask=np.zeros((600,600),np.uint8)
# antenna + long cable
cv2.line(mask,(315,80),(313,261),255,6)
cv2.rectangle(mask,(308,82),(323,99),255,-1)
# solar panel assembly
p=np.array([[305,248],[328,256],[349,326],[358,344],[268,346],[275,322],[288,269]],np.int32)
cv2.fillPoly(mask,[p],255)
# cylinder float silhouette
cv2.ellipse(mask,(312,353),(77,24),0,0,360,255,-1)
cv2.rectangle(mask,(237,350),(386,377),255,-1)
cv2.ellipse(mask,(312,377),(75,35),0,0,180,255,-1)
# tuned lower rounded edge
cv2.ellipse(mask,(311,378),(75,33),0,0,180,255,-1)
mask=cv2.GaussianBlur(mask,(5,5),1.1)
rgba=np.dstack((b,mask))
rgba[mask<2,:3]=0
Image.fromarray(rgba,'RGBA').crop((228,72,400,416)).save(OUT/'buoy-cutout.webp','WEBP',quality=88,method=6)
# 4. Glider proof-of-concept cutout from the source photograph.
glider=Image.open(INPUT/'Glider-Lake-O-.png').convert('RGB')
g=np.asarray(glider)
h,w=g.shape[:2]
# broad but hand-fitted silhouette from original 928x552 frame
poly=np.array([[74,319],[111,298],[161,271],[190,254],[247,254],[276,242],[295,238],[315,225],[346,218],[373,229],[391,230],[450,233],[481,218],[521,220],[565,225],[602,222],[625,210],[652,208],[673,226],[689,213],[699,201],[710,208],[716,233],[715,257],[748,257],[755,280],[731,298],[703,301],[671,295],[655,310],[617,310],[594,313],[579,332],[560,351],[531,362],[512,342],[488,329],[468,329],[435,336],[399,329],[366,337],[341,355],[303,359],[263,355],[226,356],[177,358],[143,365],[118,353],[88,345]],np.int32)
m=np.zeros((h,w),np.uint8)
cv2.fillPoly(m,[poly],255)
# key wing outcropping from original photo
cv2.fillPoly(m,[np.array([[286,245],[244,223],[245,215],[346,234],[384,241]],np.int32)],255)
cv2.fillPoly(m,[np.array([[445,325],[510,387],[533,380],[496,320]],np.int32)],255)
m=cv2.GaussianBlur(m,(7,7),1.8)
rgba=np.dstack((g,m));rgba[m<2,:3]=0
Image.fromarray(rgba,'RGBA').crop((65,188,773,404)).save(OUT/'glider-cutout.webp','WEBP',quality=87,method=6)
# original documentary images for informational section
for src,dest in [('images.jpg','team-lab.webp'),('bafkreicepyubnbly4qb6hjq2j4a4knwdakxd63gusgikindhzwjfbqg7yi.webp','team-water.webp')]:
 im=Image.open(INPUT/src).convert('RGB');im.thumbnail((1100,950));im.save(OUT/dest,'WEBP',quality=79,method=6)
for x in OUT.iterdir():
 print(x.name, f'{x.stat().st_size/1024:.1f} KiB')
