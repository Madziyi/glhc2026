# GLHC-002 verification and review

Run date: 2026-10-18 (America/New_York). Isolated route: `/prototype/glhc-002`. Coding: Luna high; implementation planning, review and browser UAT: parent Codex.

## Scope boundary

Only the continuous buoy / waterline / sensor-side camera and the two-paragraph horizontal transition are in scope. Existing `/` remains the GLHC-001 baseline. No collage, registration, deployment or production integration is part of this pass.

## Reference review

Organizer reattached the authoritative full assembly image during implementation. Parent visually inspected manufacturer PDF sheets 1, 6 and 7. The supplied full image determines equipment placement; optional typical configurations do not establish installed hardware. Manufacturer source drawings are not shipped as public assets.

## Verification record

### Commands and asset checks

- `npm test`: **6/6 passed**, including the three original homepage contracts and three timeline tests. Timeline checks cover clamping, deterministic reversal, downward continuation and identical camera coordinates throughout the horizontal transition.
- `npm run check`: **0 errors, 0 warnings, 0 hints**. Luna reran this after the mobile/fallback corrections.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: **passed**, generating `/` and `/prototype/glhc-002`. Final CSS and fallback patches were also rebuilt successfully by Luna.
- Build warning: the lazy Three.js scene chunk is **602.91 kB minified / 154.94 kB gzip**, above Vite's 500 kB warning threshold. The bootstrap is approximately **1.6 kB / 0.83 kB gzip**; exact hashes/small bootstrap size change with fallback handling. The scene is imported only by the isolated prototype, and is deferred for an initial reduced-motion preference.
- `git diff --check`: passed. The original `src/pages/index.astro`, `public/styles.css`, `public/main.js` and existing public assets have **no diff from `ba3a87c`**.
- Model source: `node scripts/build-buoy.mjs`. Export: `public/models/glhc002-buoy.glb`, **76,776 bytes**, `EXT_meshopt_compression`, **9 material batches / 5,108 model triangles**. Source builder checks **27 encoder/decoder round trips**, compressed/fallback buffer bounds and **0 zero-length normals**. This is not an independent engineering-CAD or Khronos-validator certification.

### Browser execution

Parent tested the production build through Astro preview at `http://127.0.0.1:4324/prototype/glhc-002` in the Codex in-app browser. Requested responsive viewport sizes were **320×650, 390×844, 768×1024 and 1440×900**. This was browser viewport testing with wheel/keyboard input, not physical iOS/Android/tablet hardware or touch testing.

All four views were visually inspected at the surface, waterline crossing, parked sensors with paragraph A, the horizontal transition, and paragraph B. Scene shortcuts and normal scrolling work in both directions. Observed transition progress was approximately 0.64–0.66, with `data-camera-parked=true`; paragraph B was checked around 0.81. The camera parks from normalized progress 0.43 through 0.82 (also verified by the timeline tests).

- **Overflow:** final content `scrollWidth` equals `clientWidth`: 305 at the 320 viewport, 375 at 390, 753 at 768 and 1425 at 1440 when the browser scrollbar occupies 15 px. The 320 body minimum-width bug was found and corrected.
- **Prose:** both full paragraphs are readable at all checked widths. The 320px clipping bug was corrected; final science-copy `clientHeight` and `scrollHeight` are both **273 px**. The sonde remains visible above the mobile text; tablet/desktop place the cage beside the text. The lower cage/ballast can sit behind the mobile prose during its pause.
- **Keyboard:** first Tab focuses “Skip prototype controls”; normal keyboard scrolling and anchor navigation are available.
- **Reduced motion:** the visible control switches to a static assembly illustration and both prose panels in normal vertical order; unchecking resumes rendering. Both panels have `aria-hidden=false` in static mode. Initial OS preference and runtime media changes are wired in source; the OS setting itself was not changed in this browser session.
- **WebGL failure:** the development `?fallback` path invokes the same static-mode handler and was exercised at narrow width. Both panels are exposed, the long pinned layout is removed, and the motion control is checked/disabled after unrecoverable failure. Actual GPU context loss and blocked-WebGL hardware were not forced.
- **No JavaScript:** the authored HTML defaults to the static class with both prose panels exposed. Actual browser JavaScript disabling was not performed.
- **Runtime:** final production browser error/warning logs were empty during the inspected runs. Development-only failures (import paths, an uninitialized scroll clamp, exporter transforms and hot-reload dependency races) were corrected before the production captures.

### Performance observations

The renderer reported **10 draw calls** (9 model batches plus water) and **37,876 triangles** including the 128×128 water mesh. Some components are frustum-culled at particular views. Active rendering samples were approximately **11.0–11.3 ms between animation frames**; the in-app browser also produced approximately **1,011 ms intervals when background-throttled**. These are frame-interval observations, not GPU render time, a sustained FPS benchmark or evidence of physical-mobile performance. No GPU memory measurement, Lighthouse, Core Web Vitals or hardware-device profiling was run. Pixel ratio is capped at 1.35 on narrow views and 1.7 on wider views at renderer creation.

### Screenshots

The browser screenshot provider excludes/rescales browser chrome/scrollbars and can constrain capture height; delivered JPEG pixel dimensions differ from the requested CSS viewport sizes. These are direct browser captures, not retouched renders.

| Viewport | Surface | Waterline | Sensors / paragraph A | Horizontal transition | Paragraph B |
| --- | --- | --- | --- | --- | --- |
| 320×650 | [view](../uat/glhc002/mobile-narrow-surface.jpg) | [view](../uat/glhc002/mobile-narrow-waterline.jpg) | [view](../uat/glhc002/mobile-narrow-sensors-panel-a.jpg) | [view](../uat/glhc002/mobile-narrow-horizontal-transition.jpg) | [view](../uat/glhc002/mobile-narrow-paragraph-b.jpg) |
| 390×844 | [view](../uat/glhc002/mobile-surface.jpg) | [view](../uat/glhc002/mobile-waterline.jpg) | [view](../uat/glhc002/mobile-sensors-panel-a.jpg) | [view](../uat/glhc002/mobile-horizontal-transition.jpg) | [view](../uat/glhc002/mobile-paragraph-b.jpg) |
| 768×1024 | [view](../uat/glhc002/tablet-surface.jpg) | [view](../uat/glhc002/tablet-waterline.jpg) | [view](../uat/glhc002/tablet-sensors-panel-a.jpg) | [view](../uat/glhc002/tablet-horizontal-transition.jpg) | [view](../uat/glhc002/tablet-paragraph-b.jpg) |
| 1440×900 | [view](../uat/glhc002/desktop-surface.jpg) | [view](../uat/glhc002/desktop-waterline.jpg) | [view](../uat/glhc002/desktop-sensors-panel-a.jpg) | [view](../uat/glhc002/desktop-horizontal-transition.jpg) | [view](../uat/glhc002/desktop-paragraph-b.jpg) |

Additional full-page evidence: [reduced-motion reading](../uat/glhc002/mobile-reduced-motion.jpg), [simulated WebGL fallback](../uat/glhc002/mobile-narrow-webgl-fallback.jpg).

## Review limitations and recommendation

- This is an optimized visual reconstruction from the organizer's image, with procedural material colors and modelled panel grid. Fine rigging, weather-sensor details, mounting geometry, proportions and surface finish need organizer review; it is not engineering CAD or a production photorealistic textured scan.
- The lake uses photographic background, wave geometry/shading, a projected softened waterline and an underwater color overlay. Reflection/refraction are approximations; there is no full scene-reflection render target, physically accurate underwater refraction, caustic simulation or water-body optical model. Broad wave bands and the compositing seam remain visible at some angles.
- **Recommendation:** retain the photographic/shader composite for the next visual refinement pass. It establishes the continuous camera/assembly interaction with ten draw calls. Only move to full real-time reflection/refraction after hardware profiling and a side-by-side visual comparison justify the cost.
- The JavaScript scene chunk remains large despite the small model. Profile initial loading and physical mobile devices before integration; do not treat the desktop interval samples as mobile acceptance.
- Source image/manufacturer drawing rights remain pending for public release. The engineering drawings and clipboard reference image are not shipped as downloadable site assets. No deployment was performed or verified.

## Handoff

Task: GLHC-002 — isolated buoy/waterline/sensor-camera prototype.
Status: implementation and responsive browser UAT complete; organizer visual review pending.
Changed: dedicated Astro route, deterministic camera/prose timeline, procedural compressed GLB, composited lake, reversible sensor pause, static fallbacks, tests and screenshots.
Decisions: keep `/` intact; exactly two science prose panels / one horizontal transition; no invented telemetry/depths, collage or registration work.
Verification: six tests, clean Astro checks, successful build with documented bundle warning, four browser viewport passes and 22 screenshot artifacts.
Live state: local preview only; no hosting/deployment verified.
Known issues: visual/optical fidelity, bundle size and physical-device performance require the follow-up review above.
Next action: organizer reviews this isolated prototype against the approved assembly image before integration.
Commit: see the feature-branch handoff commit containing this document (SHA returned in the chat).
