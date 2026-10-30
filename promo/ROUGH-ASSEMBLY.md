# Complete rough assembly

Review output: out/glhc-rough-full.mp4 (68.6s,1920x1080,30FPS).

Uses the latest approved exported roughs. Scene order/frame counts and original narration path are in rough-assembly.json. Full original audio replaces all sliced scene audio, avoiding repeated AAC boundary padding. Original local recording is ignored by Git; it still says .ca and the organizer will correct this to .com. The end card already displays raeonhacks.com.

| Scene | Timeline |
|---|---|
| Distant glider opening |0-13.5s|
| Science with callouts, extended pulse handoff |13.5-24.1s|
| Continuous waterfront pan |24.1-31.1667s|
| Slow light-only Round1 sketch |31.1667-44.3333s|
| Round2 build/showcase |44.3333-58.9s|
| Closing invitation |58.9-68.6s|

ScienceAssembly uses the same science/callout scene with a slower final pulse and later fade to fill the earlier1.5s assembly gap. Original science composition retained unchanged by default. Other scenes are stitched from their reviewed files without retiming; assembly re-encodes video only and encodes original narration once.

To reproduce: render required scene outputs listed in rough-assembly.json (ScienceAssembly via npm run render:science-assembly), then run python assemble-rough.py followed by python verify-assembly.py from promo. Python tools used: imageio_ffmpeg,cv2,numpy,PIL,scipy. No extra packages installed for assembly.

This is a rough-flow review, not final-polish approval. Final camera/materials/transitions, music/sound design and spoken-domain replacement remain future work.
