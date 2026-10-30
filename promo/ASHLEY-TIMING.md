# Ashley reference / timing and rough first scene

Organizer source: ElevenLabs_2026-10-29T03_51_32_Ashley_pvc_sp100_s50_sb75_v4.mp3. Original copied unchanged into ignored public/audio/ashley-reference.mp3. Source SHA256: ef6d9222bacc447c94f66f9bd02d2f4d98f505770a835cc3292ae25b7ecf2134. Measured full duration68.5975625s. Ending intentionally deferred per organizer.

Timing was automatically transcribed locally using faster-whisper base.en and word timestamps; approximate ASR alignment, not claimed manual listening. Initial PyAV19 decoding was incompatible; converted locally via FFmpeg to16kHz PCM and transcribed the array. Audio never uploaded. Local packages/models live in ignored .local-python/ and .local-models/; system packages unchanged.

## Scene boundaries

| Scene | Start | End |
| --- | --- | --- |
| Opening / target audience and opportunity | 0.00s | 13.50s |
| Lake science / sensors | 13.50s | 22.60s |
| Creative installations / BE CREATIVE | 22.60s | 31.17s |
| Round1 / sketch | 31.17s | 44.35s |
| Round2 / supported building and awards | 44.35s | 58.90s |
| CTA / ending to revise later | 58.90s | 68.60s |

## Rough opening only

13.5-second405-frame1080p30 rough blocking pass, with original voiceover portion on the timeline. Story: glider lowers from rough research boat, crosses waterline, travels toward the reviewed buoy model, camera rises to title reveal. No docking/data-transfer depiction. CASH PRIZES at4.54s; title starts10.50s around spoken event name; next science sentence begins13.52s, beyond this clip.

Original procedural hull/wing/boat geometry is deliberately simple; this pass evaluates shot order, motion path, framing and narration timing. High-quality hull/deployment detail, water/lighting/reflections, camera continuity and effects remain after organizer agreement. No claim this is a finished cinematic asset. No ending edits or full-film rebuild.

Buoy GLB/finish copied byte-for-byte from reviewed repository public/models/. Environment is an isolated adaptation of reviewed website water/sky shader source; website renderer itself is untouched. Source motion is deterministic by frame. Current source: src/rough-opening.jsx and src/opening-environment.js.

## Reproduce

Place supplied source MP3 at public/audio/ashley-reference.mp3 inside promo, then run npm run render:rough-opening. Local output out/opening-rough-ashley.mp4. Audio intentionally excluded from Git; supplied local original is needed to rebuild.

Automatic timing helper: transcribe-reference.py, with local faster-whisper base.en available in .local-python/. Transcription is a production convenience, not a website dependency.


## Revised rough spatial blocking

Organizer requests launch much farther from buoy and no sensor reveal in the opening. Boat shifted from14 to70 scene units from buoy; glider remains43+ units from origin and weaves laterally/vertically underwater. Camera follows while looking away from the buoy, then surfaces around8.73s at45.76 units away and flies toward its surface view. Buoy transform fixed at origin; sensors reserved for next science section. Underwater camera frustum checked against a conservative sensor-region bounding box for every frame; zero intersections. This verifies screen exclusion without deleting/hiding sensor geometry.

Revised output: out/opening-rough-distant-buoy.mp4. Narration/13.5s duration unchanged. Pure frame path: src/rough-opening-path.mjs. Geometric verification: node verify-opening-path.mjs, with evidence/opening-flight-path.json. Original nearby-buoy export remains historical.
