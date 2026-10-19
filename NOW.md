# Active Initiative

**Initiative:** GLHC-002 — faithful 3D buoy + surface-to-sensors feasibility prototype.
**Status:** IMPLEMENTED / BROWSER UAT COMPLETE — isolated prototype awaiting organizer visual review; existing website preserved.
**Planning / review / browser UAT / context:** parent Codex; **coding:** Luna high, explicitly requested by organizer.

## Ground truth
- GLHC-001 code and 16 responsive UAT screenshots were completed on commit `48b5b18` in PR #1; 3 tests passed, Astro build passed, no horizontal overflow/page errors in checked sizes. This is the *superseded glider-led baseline*, not current approved narrative.
- Organizer subsequently revised the experience to be **people-first, buoy-centric, sensor-side science with two paragraphs and one horizontal transition, single four-image collage, How it works, deep-water Luma registration**.
- The actual 3D target is the organizer-approved full yellow buoy + underwater instrument assembly image. See `docs/GLHC-V2-SPEC.md`.
- GLHC-002 now has a reproducible meshopt-compressed visual buoy reconstruction (76,776 B / 5,108 triangles), a composited lake/waterline, actual camera descent and parked sensor-side two-panel transition at `/prototype/glhc-002`.
- Six tests passed; Astro check returned zero issues; production build passed with a documented 603 kB scene-chunk warning. Parent checked four browser viewports and saved 22 screenshots. See `docs/GLHC-002-UAT.md` for exact evidence, performance observations and limits.
- Original homepage source/assets remain unchanged from `ba3a87c`. No deployment was performed or verified.

## Next action
Organizer reviews the isolated `/prototype/glhc-002` experience and screenshots against the supplied assembly image, particularly hardware details and waterline realism, before authorizing integration. Retain the composited water approach for refinement unless physical-device profiling justifies full reflection/refraction. Do not overwrite GLHC-001 visuals before review.

## Verification boundary / limitations
- Browser viewport UAT: 320×650, 390×844, 768×1024, 1440×900; reverse scrolling, parked camera, both paragraphs, keyboard entry, reduced-motion control and simulated WebGL fallback checked. No final production page errors or horizontal overflow observed.
- Physical mobile devices, touch behavior, actual OS motion-setting changes, blocked WebGL/context loss, Lighthouse, GPU memory and deployment were not verified.
- Fine assembly proportions/mounts/weather sensor and procedural surface materials require visual review. Reflection/refraction are approximated with photographic/shader compositing; visible broad bands/seams remain. Lower cage/ballast can sit behind mobile prose.
- Scene bundle remains approximately 603 kB / 155 kB gzip despite the small compressed model. Active frame-interval samples around 11 ms are desktop in-app-browser observations; background throttling also produced roughly 1 s intervals.

## Blockers & pending assets
- Collage of 4 examples (one image): awaiting organizer; not needed for GLHC-002.
- Verified Luma registration URL: awaiting organizer; final CTA remains disabled.
- Permissions for publishing RAEON/manufacturer visual assets: awaiting approval.
- Do not invent scientific readouts, depth metrics, or unconfirmed rigging.
