"""Check opening preview duration, picture, loudness and true peak; not listening QA."""
import subprocess,json,re
from pathlib import Path
import cv2,numpy as np,imageio_ffmpeg
from scipy.io import wavfile

root=Path(__file__).resolve().parent;out=root/'out/sound-prototypes'
ff=imageio_ffmpeg.get_ffmpeg_exe();report={}
for variant in ['A-bright-electronic','B-cinematic-electronic']:
    path=out/f'{variant}-mix.wav'
    result=subprocess.run([ff,'-hide_banner','-i',str(path),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    meter=json.loads(re.findall(r'\{[^{}]*\}',result.stderr)[-1])
    sr,data=wavfile.read(path);assert sr==48000 and len(data)==748800
    c=cv2.VideoCapture(str(root/'out'/f'opening-sound-{variant}.mp4'));frames=0
    while c.read()[0]:frames+=1
    assert frames==468,frames
    errors=[];source=cv2.VideoCapture(str(root/'out/glhc-production-above-display-dot.mp4'))
    for frame in [0,180,335,467]:
        c.set(cv2.CAP_PROP_POS_FRAMES,frame);a,im=c.read();source.set(cv2.CAP_PROP_POS_FRAMES,frame);b,original=source.read();assert a and b
        error=float(cv2.absdiff(im,original).mean());assert error<5;errors.append(error)
    report[variant]={'sampleRate':sr,'audioSeconds':len(data)/sr,'videoFrames':frames,'integratedLUFS':float(meter['input_i']),'truePeakDbTP':float(meter['input_tp']),'loudnessRangeLU':float(meter['input_lra']),'pictureMeanErrors':errors}
    assert float(meter['input_tp'])<=-1.5
    assert abs(float(meter['input_i'])+16)<.2
report.update(titleImpactSeconds=11.18,generatedServiceUsed=False,thirdPartySamplesUsed=False,manualListeningPerformed=False)
(root/'evidence/opening-sound-verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
