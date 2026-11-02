"""Scene-aware 9:16 editorial adaptation; clean master + reflowed keyword captions."""
import json, subprocess, sys
from pathlib import Path
import cv2, numpy as np, imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'out/glhc-24s-waterfront-transition.mp4'
OUTPUT=ROOT/'out/glhc-portrait-9x16.mp4'
W,H=1080,1920
PAPER=(241,238,226); INK=(24,60,71); GOLD=(255,212,80)
CUES=json.loads((ROOT/'caption-cues.json').read_text())['cues']
def ease(v):
    p=max(0,min(1,v));return p*p*(3-2*p)
def font(n):return ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',n)
def text(im,lines,y,size=90,color='white',gap=12):
    d=ImageDraw.Draw(im)
    for line in lines:
        ft=font(size)
        while d.textbbox((0,0),line,font=ft)[2]>900:ft=font(ft.size-2)
        d.text((540,y),line,font=ft,anchor='mt',fill=color,stroke_width=1)
        y+=ft.size+gap
def crop(a,cx=960,width=607.5):
    left=max(0,min(1920-width,cx-width/2))
    return Image.fromarray(cv2.warpAffine(a,np.array([[W/width,0,-left*W/width],[0,H/1080,0]],np.float32),(W,H),flags=cv2.INTER_CUBIC))
def panel(im,a,box,dest):
    part=Image.fromarray(a).crop(box);part=part.resize((dest[2],dest[3]),Image.Resampling.LANCZOS);im.paste(part,dest[:2])
def point(t,keys):
    for (a,x),(b,y) in zip(keys,keys[1:]):
        if a<=t<=b:return x+(y-x)*ease((t-a)/(b-a))
    return keys[0][1] if t<keys[0][0] else keys[-1][1]
def frame(a,t):
    # Track the launch rig, glider, buoy and then the gold pulse.
    if t<13.3667:
        cx=point(t,[(0,700),(2,1020),(5,1000),(8,960),(10,1030),(10.6,1120),(13.37,1120)])
        im=crop(a,cx)
    elif t<24:
        cx=point(t,[(13.37,1120),(15,960),(17.5,650),(19,650),(20.5,760),(22,940),(24,960)])
        im=crop(a,cx)
    elif t<31.4334:im=crop(a,960)
    elif t<44.5:
        im=Image.new('RGB',(W,H),PAPER)
        # Full proposal remains readable; deadline gets its own vertical position.
        text(im,['ROUND 1'],220,52,INK)
        if t<41.2:
            panel(im,a,(285,130,1525,965),(45,600,990,667))
            panel(im,a,(1490,90,1810,555),(365,1275,350,509))
        else:
            panel(im,a,(260,130,1840,1000),(20,580,1040,573))
    elif t<50.6:
        im=Image.new('RGB',(W,H),PAPER)
        text(im,['ROUND 2'],220,52,INK)
        if t<46.5:
            # Five landscape columns become two portrait columns.
            for i in range(10):
                x=370+(i%5)*295;y=210+(i//5)*230
                panel(im,a,(x-86,y+18,x+86,y+125),(200+(i%2)*440,470+(i//2)*190,240,149))
        else:
            panel(im,a,(650,100,1270,665),(250,430,580,529))
        # Place each of the three support symbols on its own vertical row.
        for i,x in enumerate([450,960,1470]) if t>=46.5 else []:
            panel(im,a,(x-130,665,x+130,920),(140,1000+i*230,210,206))
        if 46.4<t<50.1:
            d=ImageDraw.Draw(im)
            for i,label in enumerate(['FUNDING','RESOURCES','MENTORSHIP']):
                d.text((390,1060+i*230),label,font=font(47),fill=INK)
    elif t<62.4:im=crop(a,960)
    else:
        # End card is typeset for portrait, rather than cropping the landscape URL.
        im=Image.new('RGB',(W,H),(5,38,56))
        panel(im,a,(910,170,1910,800),(110,860,860,542))
        text(im,['GREAT LAKES','HACKATHON'],380,104)
        text(im,['CHALLENGE'],625,104,GOLD)
        if t>=64.7:
            text(im,['raeonhacks.com'],1480,83,GOLD)
            ImageDraw.Draw(im).line((140,1605,940,1605),fill=GOLD,width=3)
    # Restore scientific labels as legible portrait callouts.
    if 17.5<t<20.1:
        overlay=im.copy();d=ImageDraw.Draw(overlay)
        d.rounded_rectangle((65,1270,1015,1450),radius=18,fill=(5,30,43))
        im=Image.blend(im,overlay,.92)
        text(im,['WATER-QUALITY BUOY','UNDERWATER SENSORS'],1300,42)
    # Rebuild the competition reveal above the buoy in the portrait safe area.
    if 10.5<=t<14.1:
        alpha=ease((t-10.5)/.65)*(1-ease((t-13.7)/.4))
        overlay=Image.new('RGB',(W,H),(5,38,56));text(overlay,['GREAT LAKES','HACKATHON'],260,97);text(overlay,['CHALLENGE'],485,97,GOLD)
        mask=Image.new('L',(W,H),0);ImageDraw.Draw(mask).rectangle((0,175,W,650),fill=int(245*alpha));im.paste(overlay,(0,0),mask)
    # Keyword captions are reflowed and kept clear of common social app controls.
    for c in CUES:
        if c['start']<=t<c['end']:
            words=c['text'].split();lines=[c['text']]
            if len(c['text'])>18:
                n=(len(words)+1)//2;lines=[' '.join(words[:n]),' '.join(words[n:])]
            y=(1460 if not(31.43<t<50.6) else 330)+int(28*(1-ease((t-c['start'])/.14)))
            overlay=im.copy();d=ImageDraw.Draw(overlay)
            d.rounded_rectangle((65,y-30,1015,y+len(lines)*105+15),radius=20,fill=(5,30,43))
            im=Image.blend(im,overlay,.78)
            text(im,lines,y,78,GOLD if len(lines)==1 else 'white')
    return im

def main():
    cap=cv2.VideoCapture(str(SOURCE));assert int(cap.get(7))==2022
    preview='--preview' in sys.argv
    samples=[.7,2.5,5.5,8,11.5,16,19,22.8,24.5,26.8,29.8,34,40,43,45.8,48,53,59.3,65.5,67]
    sheet=Image.new('RGB',(1080,1920),'#14232e');draw=ImageDraw.Draw(sheet)
    if preview:
        for i,t in enumerate(samples):
            cap.set(cv2.CAP_PROP_POS_MSEC,t*1000);ok,a=cap.read();assert ok
            im=frame(cv2.cvtColor(a,cv2.COLOR_BGR2RGB),t);im.thumbnail((216,384));sheet.paste(im,(i%5*216,i//5*480));draw.text((i%5*216+8,i//5*480+390),f'{t}s',fill='white')
        sheet.save(ROOT/'evidence/portrait-review.jpg');return
    raw=ROOT/'out/portrait-picture.mp4'
    cmd=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s','1080x1920','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p',str(raw)]
    p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    for f in range(2022):
        ok,a=cap.read();assert ok
        p.stdin.write(np.asarray(frame(cv2.cvtColor(a,cv2.COLOR_BGR2RGB),f/30)).tobytes())
        if f%300==0:print(f'{f}/2022',flush=True)
    p.stdin.close();assert p.wait()==0
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-v','error','-i',str(raw),'-i',str(SOURCE),'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart',str(OUTPUT)],check=True)
    print(OUTPUT)
if __name__=='__main__':main()
