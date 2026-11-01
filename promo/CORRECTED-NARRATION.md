# Corrected narration and gold story pulse

The organizer supplied ElevenLabs_2026-11-01T05_54_00_Ashley_pvc_sp100_s50_sb75_v4.mp3. Its byte-identical copy is public/audio/ashley-corrected.mp3. It replaces the earlier reference only in the revised film. No music/SFX is included.

## Timing
New audio67.3959375s; output2022 frames/67.4s at30FPS. Corrected scene boundaries:0,401,717,943,1335,1762,2022. Local automatic word timestamps in evidence/ashley-corrected-timing.json identify The Great Lakes13.38s, can experience23.90s, Be28.98s, Round1 31.44s, Round2 44.52s, Ready58.74s and URL instruction64.54s. Smooth monotonic frame remapping with natural endpoint speed (no added scene-boundary time stop) in src/corrected-timeline.json retains approved choreography and retimes major narration cues. Freeze supplies fractional legacy frames so geometry animation is evaluated smoothly rather than duplicating encoded frames.

## Gold pulse
Revised-only travelling pulse is a screen-space graphic projected from scene cameras, with gold core/rings/trail. It leaves sensor view and extends outward, swims directly upward and holds exactly the projected above-display starting height. During the direct dissolve only one pulse is drawn. The old Three.js story pulse is disabled only for revision mode; sensor callout leaders remain.

Display path stays above installations, then curves into the physical screen. TV_ENTRY_FRAME125 maps to corrected global frame869 (28.9667s), within one frame of Be28.98s. Entry equals projected LED centre. Gold entry flash resolves as the LED letter animation starts. The travelling pulse does not restart in closing. Small display rings retained. Opening CASH PRIZES and GET FEATURED AT TOURIST SPOTS overlays are invisible in revision mode. Calendar dates/sketch/folding/top10/resources/scenery retained.

## Rebuild and verification
Render Corrected-opening/science/waterfront/round1/round2/closing from src/index.jsx. Assemble with python promo/assemble-production.py corrected-assembly.json. Verify with python promo/verify-production-assembly.py corrected-assembly.json and node promo/verify-corrected-motion.mjs. Corrected narration is mapped once across the complete timeline, rather than concatenating AAC excerpts. Previous music prototypes and approved exports are retained. No website/shared-GLB changes.
