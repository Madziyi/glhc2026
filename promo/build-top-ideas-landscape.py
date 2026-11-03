"""Retain approved landscape footage, align its key cues to new narration."""
import json,subprocess
from pathlib import Path
import imageio_ffmpeg
root=Path(__file__).resolve().parent
p=json.loads((root/'top-ideas-landscape.json').read_text());anchors=p['anchors']
expression='T'
for (a,b),(c,d) in reversed(list(zip(anchors,anchors[1:]))):
 segment=f'({b:.12f}+(T-{a:.12f})*{(d-b)/(c-a):.12f})'
 expression=f'if(lt(T,{c:.12f}),{segment},{expression})'
filters=f"setpts='{expression}/TB',fps=30,tpad=stop_mode=clone:stop_duration=0.1"
graph="[0:v]trim=end_frame=1335,setpts=PTS-STARTPTS[a];[1:v]trim=end_frame=427,setpts=PTS-STARTPTS[b];[0:v]trim=start_frame=1762,setpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=1:a=0,"+filters+"[video]"
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-v','warning','-i',str(root/'out'/p['source']),'-i',str(root/'out'/p['round2_source']),'-i',str(root/p['voiceover']),'-filter_complex',graph,'-map','[video]','-map','2:a:0','-t',str(p['duration_seconds']),'-c:v','libx264','-preset','fast','-crf','16','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart',str(root/'out'/p['output'])],check=True)
print(root/'out'/p['output'])
