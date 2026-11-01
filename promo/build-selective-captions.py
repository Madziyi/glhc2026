"""Editable kinetic keyword captions over the verified master; audio is stream-copied."""
import json,subprocess
from pathlib import Path
import imageio_ffmpeg
root=Path(__file__).resolve().parent
plan=json.loads((root/'caption-cues.json').read_text())
def stamp(t):
 c=round(t*100);return f'{c//360000}:{c//6000%60:02}:{c//100%60:02}.{c%100:02}'
header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes
WrapStyle: 2
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Keyword,Arial,78,&H00FFFFFF,&H0050D4FF,&H00211908,&H80000000,-1,0,0,0,100,100,0,0,1,4,2,5,100,100,100,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
lines=[header]
for cue in plan['cues']:
 text=cue['text'];words=text.split();last=words.pop();text=' '.join(words)+(' ' if words else '')+r'{\c&H50D4FF&}'+last
 # One restrained overshoot, upward entrance, and clean fade; fixed centre.
 tags=r'{\an5\move(960,930,960,902,0,140)\fad(50,90)\fscx92\fscy92\t(0,90,\fscx104\fscy104)\t(90,190,\fscx100\fscy100)}'
 lines.append(f"Dialogue: 0,{stamp(cue['start'])},{stamp(cue['end'])},Keyword,,0,0,0,,{tags}{text}\n")
ass=root/'out/selective-captions.ass';ass.write_text(''.join(lines),encoding='utf-8-sig')
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-v','warning','-i',str(root/'out'/plan['source']),'-vf','ass=selective-captions.ass','-c:v','libx264','-preset','fast','-crf','16','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',plan['output']],cwd=root/'out',check=True)
print(root/'out'/plan['output'])
