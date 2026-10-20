# GLHC-002 verification and review

## GLHC-002R4 — hybrid water finalization and progressive loading (2026-10-20)

### Implementation

- Kept the route isolated and selected the lightweight hybrid renderer as its only runtime water path. Removed the GPUComputationRenderer import, half-float heightfield setup, compute loop, and A/B controls from the page. The previous R3 comparison record remains in `docs/GLHC-002R3-COMPARISON.md` as historical evidence.
- Replaced uniform buoy rings with analytic expanding wave normals. Their radius is angularly perturbed, the field combines two frequencies, fades with distance, and is lightly modulated by the shared buoy bob. Existing wave geometry, materials, model and camera timeline remain unchanged.
- Increased underwater water-surface body/opacity while lowering the transition contrast to soften the photographic horizon edge. This remains a shader/photo composite, not physical refraction.
- Kept the HTML route and prose available immediately. Bootstrap dynamically imports the scene and has a navigation-relative 10-second timeout. The status chip is restrained; the static buoy and full reading content remain available on timeout/failure. A retry is exposed on failure. Late readiness fades the canvas over the fallback at the visitor's current scroll progress.
- `scene-ready` now requires GLB load/decode, shader compilation, and a successful first rendered frame. Development console instrumentation reports navigation timestamp, dynamic scene JS duration, model load/decode duration and transfer size, renderer/shader compile, first usable frame, navigation-to-interactive time, cache/network classification, outcome and errors. Production hides the technical renderer readout. This instrumentation has not produced a mobile performance result.

### Verification

- `npm test`: **6/6 passed**.
- `npm run check`: **0 errors, 0 warnings, 0 hints**.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: **passed**. The lazy scene bundle is **610.44 kB minified / 157.41 kB gzip**. Vite still reports the >500 kB minified chunk warning. Compared to R3: **−5.27 kB minified / −1.66 kB gzip**.
- GLB remains **181,648 bytes**. R3's prior renderer report was **11 draws / 48,304 triangles**; the R4 preview could not be opened, so no new live renderer count or R4 FPS is claimed.
- `git diff --check`: **passed**.

### UAT and performance boundary

- The available in-app browser timed out connecting to the local Astro preview. R4 did not produce before/after screenshots or complete the requested 320×650, 390×844, 768×1024, 1440×900 states, forward/reverse scroll, reduced-motion, keyboard, static/loading fallback, console error or sensor-legibility browser checks. The screenshot files from earlier passes are not R4 evidence.
- No physical Android/iOS device or throttled mobile network run was available. Cold and warm R4 page readiness, scene resource timings, sustained frame rate, GPU time and memory are **unmeasured**. The 10-second target is a policy and instrumentation target, not a claimed result. The scene transfer size alone does not prove it.
- No homepage/root changes, merge, deployment, or GLB/model edits.

## GLHC-002R2 — cinematic water and environment refinement (2026-10-19)

- Isolated route `/prototype/glhc-002` only. Replaced the banded lake background with `public/assets/lake-surface-r2b.webp` (generated photographic lake horizon, 237,222 bytes) with subtle defocus to soften repetitive distant wavelets at screen scale. Removed the full-screen vertical underwater color gradient that created a false 42%-height seam; the blue-green atmosphere now uses soft radial light/haze.
- Increased overlapping wave displacement to about 0.15 scene units peak sum and synchronized buoy bob to the same surface function. Fine ripple normals fade across the near/far water-mesh join. Existing buoy model source and GLB were not modified.
- Blender was not installed. The background asset is a generated photographic plate; the water remains a real-time shader/photo composite without full reflection/refraction or caustics.

### Browser review

- Production preview: `http://127.0.0.1:4332/prototype/glhc-002` (the earlier 4331 preview was not reachable from the in-app browser). Browser captures were displayed and visually reviewed during this session at **320×650**, **390×844**, **768×1024**, and **1440×900**.
- Checked surface at 0%, approach/crossing at 34–41%, sensor pause and reading composition around 49–60%, horizontal prose transition around 67%, paragraph B at 76%, and below-surface descent near 97%. Reverse scrolling returned to the surface. Reduced-motion mode exposed both prose paragraphs in a static reading layout.
- Renderer reports 11 calls / 48,304 triangles after the model loads. The current scene bundle produced no browser errors when filtered by its current asset hash; captured console errors were from previous bundle hashes.
- The in-app screenshot provider showed these captures in the working session but did not provide a filesystem export. No screenshot files were added for R2; the existing baseline screenshots below remain untouched. Physical-device mobile checks were not run.

### Verification and remaining visual review

- `npm test`: **6/6 passed**.
- `npm run check`: **0 errors, 0 warnings, 0 hints**.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: **passed**. Vite warns that the deferred scene chunk is **607.18 kB minified / 156.25 kB gzip**.
- `git diff --check`: **passed** before this documentation update.
- The false viewport-gradient seam and old repeated background image were removed. A straight projected water horizon remains visible at some underwater camera angles; the current composite still does not model physically accurate reflection, refraction, or caustics. Organizer visual approval is still required before site integration.

## Prior GLHC-002R baseline

## GLHC-002R implementation addendum — 2026-10-19

- Isolated route only; homepage source and public assets remain unchanged. No integration or deployment.
- Model source and GLB were refined with softened buoy hull transitions, PV cell/grid and mounting detail, fasteners/fittings, revised PBR material values and a reproducible generated finish texture. Blender is not installed, so no Blender project or offline render was produced. The model remains procedural and should be judged against the approved reference; the procedural material pass does not establish photorealism.
- Water shader and lighting were softened, camera pullback was eased across the waterline, and science-panel midpoint opacity was improved. A first production preview exposed `smooth is not defined` in the animation loop; importing `smooth` from the shared timeline helper fixed it. Production preview then rendered the buoy; surface readout showed 10 calls / 44,692 triangles including water.
- Asset output: `public/models/glhc002-buoy.glb` is 181,648 bytes, with 11,924 model triangles across 9 material batches; `public/models/glhc002-finish.png` is a generated 5,435-byte texture. The lazy scene bundle is 603.61 kB minified / 155.10 kB gzip.
- Verification: `npm test` 6/6 passed; `npm run check` 0 errors, warnings or hints; production Astro build passed. `git diff --check` was clean before context edits.
- Browser review: production preview at `http://127.0.0.1:4331/prototype/glhc-002` confirmed the surface render and sensor paragraph A at the in-app browser's default ~375 CSS px width. Screenshot output was visually inspected in the working session. The requested saved image matrix at 320×650, 390×844, 768×1024 and 1440×900, crossing/midpoint/paragraph B captures, and the three labeled still renders were **not completed**. Desktop/tablet responsive composition and physical mobile remain unverified. The organizer must review visual quality before integration.
- A runtime console error from the initial build was corrected and the rebuilt preview displayed the rendered model. Stale console entries from the earlier page load should not be treated as current post-fix errors.

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

## GLHC-002R2 reference-inspired shader addendum — 2026-10-19

- The linked ThreeJS Water demo was reviewed visually and through its project README. Its key cues are interactive ripples, changing reflections/refractions, and caustic light. This isolated prototype now uses a small animated ripple-normal field centered at the buoy, multi-directional surface shimmer to reduce repeated bands, and subtle procedural underwater caustic highlights. These additions stay in the existing water shader pass; no new dependency, water mesh, or buoy geometry was added.
- The buoy's vertical movement remains synchronized with the shared analytic wave-height function. The new ripple normals affect highlights but do not implement wave-height physics or cause local buoy displacement. The linked demo uses a GPU heightfield with ping-pong render targets and additional optical passes; a closer port remains a separate profile-and-review decision. Its repository documents mobile Safari float-target and stripe artifacts.
- No explicit five-second loading target was found in `PROJECT.md`, `NOW.md`, or the active refinement specification. The approved gate asks for bundle/loading regression evidence and physical mobile checks when available. The current scene chunk is **608.46 kB minified / 156.75 kB gzip** (Vite's >500 kB warning); the scene stays deferred from the page bootstrap. This does not prove a five-second page-load target or mobile frame-rate acceptance.
- Final browser review used the existing in-app preview at **1440×900** for the surface, crossing, and underwater sensor state; the browser renderer reported up to **11 calls / 48,304 triangles**. Current bundle console filtering returned no errors or warnings; old shader errors refer to earlier bundle hashes only. The provider displayed the browser screenshots in-session but could not export them into repository files. Attempted responsive viewport override remained at 1440×900, so mobile was not recaptured for this shader iteration; prior viewport evidence above remains from the earlier pass.
- `npm test`: **6/6 passed**. `npm run check`: **0 errors, 0 warnings, 0 hints**. `ASTRO_TELEMETRY_DISABLED=1 npm run build`: **passed**. `git diff --check`: **passed** (Git reports expected CRLF conversion notices for edited LF files).
- Blender is unavailable. At some underwater camera angles, the projected surface edge remains a sharp, straight horizon. The current effect is a lightweight visual adaptation, not the demo's heightfield, buoyancy physics, raytraced reflection/refraction, or differential-area caustics. Keep the prototype isolated until organizer visual review; no integration or deployment occurred.

## GLHC-002R3 advanced water rendering comparison — 2026-10-19

- The isolated prototype accepts `?compare=1` to expose a dev-only A/B control. A is the R2 photographic/shader hybrid with analytic waves. B adds a 128×128 half-float GPU ping-pong wave field for buoy-centered height ripples and normals. The buoy asset, analytic broad swell/bobbing, camera, lighting and scroll timeline are shared. Version B is gated on WebGL2 and `EXT_color_buffer_float`.
- Upstream [jeantimex/threejs-water](https://github.com/jeantimex/threejs-water) was inspected. It documents GPU heightfields, Fresnel optics and caustics under MIT. No upstream code was copied; we adapted the general heightfield approach with Three.js's existing GPUComputationRenderer add-on. Details and comparison recommendation: `docs/GLHC-002R3-COMPARISON.md`.
- In-app browser A/B review covered surface, waterline approach, sensor pause and fully descended camera at the available 1280×720 viewport. Reverse scroll returned from progress 100% to 0%. Browser console was clear. A's grazing-angle water opacity and far swell were adjusted; the underwater water surface still reads as a mostly straight boundary, especially at the sensor pause. B's local wake is visible at the surface but adds little at the sensor camera angle.
- Runtime readout: 11 main-scene draws / 48,304 triangles. B adds one GPU-compute pass updating 16,384 texels per frame while active; renderer.info resets between that pass and the visible scene render, so the readout does not count it. At desktop 1280×720, frame interval samples varied around 11–22 ms during browser interaction; B's first activation showed one 55.6 ms interval. A local production-preview measurement was 553.9 ms from scene-script start to model-ready with a warm model cache. These are not cold page load or GPU-time measurements, sustained FPS, or mobile evidence.
- `npm test`: **6/6 passed**. `npm run check`: **0 errors, 0 warnings, 0 hints**. `ASTRO_TELEMETRY_DISABLED=1 npm run build`: **passed**. Scene chunk **615.71 kB minified / 159.07 kB gzip**, Vite >500 kB warning remains; compared to R2, +7.25 kB minified / +2.32 kB gzip. Buoy GLB stays **181,648 bytes**.
- The in-app browser remained 1280×720 and offered no viewport resize or screenshot export. Requested 320×650, 390×844, 768×1024, and 1440×900 captures were not available in this pass. Screenshots were shown during the session but are not committed files; no offline renders or motion recording. Physical iOS/Android, load timing, GPU time and memory remain unverified. Blender unavailable.
- Root `/`, buoy source, and GLB were not changed. No merge, integration or deployment. Recommendation: retain A for now; B's visual gain does not yet justify its GPU pass and render-target compatibility risk without responsive/mobile evidence. Organizer visual approval remains pending.
