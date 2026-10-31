"""Stitch reviewed scene exports, replacing their sliced audio with the original full recording."""
import json,subprocess
from pathlib import Path
import imageio_ffmpeg
root=Path(__file__).resolve().parent
plan=json.loads((root/'production-assembly.json').read_text())
command=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-v','warning']
filters=[]
for i,scene in enumerate(plan['scenes']):
    path=root/'out'/scene['file']
    if not path.exists():raise FileNotFoundError(f'Render required scene first: {path}')
    command+=['-i',str(path)]
    filters.append(f"[{i}:v]trim=end_frame={scene['frames']},setpts=PTS-STARTPTS[v{i}]")
command+=['-i',str(root/plan['voiceover'])]
filters.append(''.join(f'[v{i}]' for i in range(len(plan['scenes'])))+f"concat=n={len(plan['scenes'])}:v=1:a=0[video]")
command+=['-filter_complex',';'.join(filters),'-map','[video]','-map',f"{len(plan['scenes'])}:a:0",'-t',str(plan['duration_seconds']),'-r',str(plan['fps']),'-c:v','libx264','-preset','fast','-crf','16','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart',str(root/'out/glhc-production-full.mp4')]
subprocess.run(command,check=True)
print(root/'out/glhc-production-full.mp4')
