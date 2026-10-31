"""Original synthesized opening sound sketches; no third-party samples or services."""
import json, subprocess, re
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'out'/'sound-prototypes';OUT.mkdir(exist_ok=True)
SR=48000;DURATION=15.6;N=round(SR*DURATION);DROP=11.18
RNG=np.random.default_rng(20261031)
FF=imageio_ffmpeg.get_ffmpeg_exe()
T=np.arange(N)/SR

def filt(x,hz,kind='lowpass'):
    return signal.sosfilt(signal.butter(3,hz,btype=kind,fs=SR,output='sos'),x,axis=0)
def fade(t,a,b):
    x=np.clip((t-a)/(b-a),0,1);return x*x*(3-2*x)
def stereo(x,pan=0):
    if x.ndim==2:return x
    return np.column_stack((x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)))
def put(track,x,start,gain=1,pan=0):
    x=stereo(x,pan)*gain;i=round(start*SR);lo=max(0,-i);end=min(len(x),N-i)
    if end>lo:track[max(0,i):i+end]+=x[lo:end]
def hz(m):return 440*2**((m-69)/12)
def kick(strength=1):
    t=np.arange(int(.55*SR))/SR;freq=48+105*np.exp(-t*37)
    return strength*(np.sin(2*np.pi*np.cumsum(freq)/SR)*np.exp(-t*9)+filt(RNG.normal(size=len(t)),4000,'highpass')*.025*np.exp(-t*120))
def snare():
    t=np.arange(int(.3*SR))/SR;n=filt(RNG.normal(size=len(t)),[1300,6500],'bandpass')
    return n*np.exp(-t*20)*.25+np.sin(2*np.pi*185*t)*np.exp(-t*24)*.10
def hat(length=.09):
    t=np.arange(int(length*SR))/SR
    return filt(RNG.normal(size=len(t)),[6800,14500],'bandpass')*np.exp(-t*65)*.09
def pluck(m,duration=.8):
    t=np.arange(int(duration*SR))/SR;f=hz(m);env=(1-np.exp(-t*250))*np.exp(-t*6)
    return (np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*2*t)+.08*np.sin(2*np.pi*f*3*t))*env*.13
def bass(m,duration):
    t=np.arange(int(duration*SR))/SR;f=hz(m);env=(1-np.exp(-t*90))*np.exp(-t*2)*(1-fade(t,duration-.07,duration))
    return filt(np.sin(2*np.pi*f*t)+signal.sawtooth(2*np.pi*f*t)*.25,650)*env*.20
def pad(notes,duration,cinematic=False):
    t=np.arange(int(duration*SR))/SR;result=np.zeros((len(t),2))
    for j,m in enumerate(notes):
        for detune,pan in [(-.06,-.7),(.06,.7),(0,0)]:
            f=hz(m+detune);x=np.sin(2*np.pi*f*t)+.16*signal.sawtooth(2*np.pi*f*t)
            result+=stereo(filt(x,900 if cinematic else 1700),pan)*(.029 if cinematic else .024)
    env=fade(t,0,.35)*(1-fade(t,duration-.65,duration))
    return result*env[:,None]
def room(x):
    y=x.copy()
    for dt,gain in [(.083,.12),(.137,.09),(.211,.065),(.337,.045)]:
        k=int(dt*SR);y[k:]+=x[:-k,::-1]*gain
    return y
def write(path,x):
    wavfile.write(path,SR,np.round(np.clip(x,-1,1)*2147483647).astype(np.int32))

voice=np.frombuffer(subprocess.check_output([FF,'-v','error','-i',str(ROOT/'public/audio/ashley-reference.mp3'),'-t',str(DURATION),'-f','f32le','-ac','1','-ar',str(SR),'-']),dtype=np.float32).copy()
voice=np.pad(voice,(0,max(0,N-len(voice))))[:N]
voice*=.63/max(np.max(np.abs(voice)),1e-9)
detector=signal.sosfilt(signal.butter(2,8,fs=SR,output='sos'),voice**2)
speech=np.clip(np.sqrt(np.maximum(detector,0))/.035,0,1)
speech=np.convolve(speech[::240],np.ones(31)/31,mode='same')
speech=np.interp(np.arange(N),np.arange(len(speech))*240,speech)
duck=1-.52*speech

# Shared environmental effects: waves, launch hardware, water entry and submerged wash.
sfx=np.zeros((N,2));noise=RNG.normal(size=(N,2))
wave=filt(noise,[110,2600],'bandpass')
wave*=((.6+.4*np.sin(T*1.9+np.sin(T*.47)))[:,None])
surface=1-fade(T,2.65,3.2)+fade(T,8.45,9.0)
sfx+=wave*(.017*surface+.004)[:,None]
engine=sum(np.sin(2*np.pi*f*T+.06*np.sin(T*2.3)) for f in [43,86,129])*.006
put(sfx,engine*(1-fade(T,2.6,3.3)),0,pan=-.55)
for at in [1.85,2.08]:
    t=np.arange(int(.15*SR))/SR;put(sfx,filt(RNG.normal(size=len(t)),[650,4200],'bandpass')*np.exp(-t*45),at,.045,-.4)
t=np.arange(int(1.35*SR))/SR
splash=filt(RNG.normal(size=len(t)),[250,6000],'bandpass')*fade(t,0,.018)*np.exp(-t*4)
put(sfx,splash,2.25,.080,-.3)
sub=filt(RNG.normal(size=N),[65,550],'bandpass')*.025
put(sfx,sub*fade(T,2.85,3.25)*(1-fade(T,8.35,8.85)),0)
for j in range(9):
    t=np.arange(int(.24*SR))/SR;f=600+j*91
    bubble=np.sin(2*np.pi*(f*t+190*t*t))*np.exp(-t*32)*fade(t,0,.006)
    put(sfx,bubble,3.12+j*.23,.010,pan=np.sin(j)*.5)
put(sfx,splash,8.58,.038,.2)
sfx*=duck[:,None]
write(OUT/'shared-water-launch-effects.wav',sfx)
write(OUT/'voiceover.wav',stereo(voice))

for variant,bpm,cinematic in [('A-bright-electronic',120,False),('B-cinematic-electronic',108,True)]:
    beat=60/bpm;music=np.zeros((N,2));accents=np.zeros_like(music)
    chords=[[50,57,62,65],[46,53,58,62],[53,60,65,69],[48,55,60,64]]
    for k,start in enumerate(np.arange(-1, DURATION,beat*4)):
        notes=chords[k%4];put(music,pad(notes,beat*4+.9,cinematic),start)
    start=DROP-24*beat
    notes=[74,77,81,77,72,76,79,76]
    for k,at in enumerate(np.arange(start,DURATION,beat/2)):
        if at<0:continue
        if not (10.43<at<DROP):put(music,pluck(notes[k%8]-(12 if cinematic else 0)),at,.30 if cinematic else .62,np.sin(k*1.8)*.55)
    for k,at in enumerate(np.arange(DROP-32*beat,DURATION,beat)):
        if at<0:continue
        after=at>=DROP-.001;gain=.62 if after else .20
        if 10.43<at<DROP:continue
        if k%2==0 or after:put(music,kick(),at,gain)
        if k%4 in [1,3]:put(music,snare(),at,.82 if after else .22)
        put(music,hat(),at+beat/2,.9 if after else .35,np.sin(k)*.35)
        if after:
            put(music,bass([38,34,41,36][int((at-DROP)/(beat*4))%4],beat*.75),at,.95 if cinematic else .72)
            if cinematic:
                t=np.arange(int(.8*SR))/SR;tom=np.sin(2*np.pi*(66*t-3*t*t))*np.exp(-t*8)
                if k%2==0:put(music,tom,at,.16,np.sin(k)*.4)
    # Restrained rising texture, breath, then impact exactly on 'Great'.
    build=fade(T,8.9,10.40)*(1-fade(T,10.40,10.48))
    rise=filt(RNG.normal(size=N),[800,8000],'bandpass')*.024
    accents+=stereo(rise*build)
    t=np.arange(int(2.4*SR))/SR
    impact=np.sin(2*np.pi*(43*t+1.8*(1-np.exp(-t*18))))*np.exp(-t*3.4)*.25
    impact+=filt(RNG.normal(size=len(t)),[150,4800],'bandpass')*np.exp(-t*13)*.09
    put(accents,impact,DROP,1 if cinematic else .73)
    put(accents,pluck(86,1.6),DROP+.02,.30 if cinematic else .55,.35)
    if cinematic:
        put(music,pad([38,50,57,62,65,69],4.7,True),DROP,1.25)
    music=room(music)
    breath=1-.94*fade(T,10.38,10.50)*(1-fade(T,11.12,DROP))
    music*=breath[:,None]
    music*=duck[:,None]*(.76 if cinematic else .92)
    accents*=duck[:,None]
    ending=1-fade(T,15.20,DURATION)
    music*=ending[:,None];accents*=ending[:,None];sfx_end=sfx*ending[:,None]
    mix=stereo(voice)+music+accents+sfx_end
    # Only catch isolated transients; final loudness/true-peak managed by FFmpeg.
    mix=np.tanh(mix*1.04)/1.04
    raw=OUT/f'{variant}-premaster.wav';write(raw,mix)
    write(OUT/f'{variant}-music.wav',music);write(OUT/f'{variant}-accents.wav',accents)
    master=OUT/f'{variant}-mix.wav'
    subprocess.run([FF,'-y','-v','error','-i',str(raw),'-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar',str(SR),'-c:a','pcm_s24le',str(master)],check=True)
    meter=subprocess.run([FF,'-hide_banner','-i',str(master),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    measured=json.loads(re.findall(r'\{[^{}]*\}',meter.stderr)[-1]);gain=-16-float(measured['input_i'])
    normalized=OUT/f'{variant}-normalized.wav'
    subprocess.run([FF,'-y','-v','error','-i',str(master),'-af',f'volume={gain}dB','-c:a','pcm_s24le',str(normalized)],check=True)
    normalized.replace(master)
    video=ROOT/'out'/f'opening-sound-{variant}.mp4'
    subprocess.run([FF,'-y','-v','error','-i',str(ROOT/'out/glhc-production-above-display-dot.mp4'),'-i',str(master),'-t',str(DURATION),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','256k','-movflags','+faststart',str(video)],check=True)
    print(video,flush=True)

(OUT/'cue-sheet.json').write_text(json.dumps({'duration':DURATION,'sample_rate':SR,'source':'Original procedural synth and noise-based effects; not generated service music or field recordings','title_this_is':10.54,'title_great_lakes_impact':DROP,'splash':2.25,'submerge':[2.85,3.25],'surface':8.58,'build':[8.9,10.48],'breath':[10.48,11.18],'variants':{'A':'120BPM brighter electronic','B':'108BPM cinematic electronic'},'loudness_target_lufs':-16,'true_peak_ceiling_dbtp':-1.5},indent=2))
