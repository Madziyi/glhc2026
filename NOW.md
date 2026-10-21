# Active Initiative

**Initiative:** GLHC-002R6 — final procedural water and buoy refinement.
**Status:** IMPLEMENTED / ORGANIZER VISUAL REVIEW AND PHYSICAL-DEVICE PERFORMANCE ACCEPTANCE PENDING.
**Implementation and verification:** Codex.

## GLHC-002R6 handoff (2026-10-20)
- Prototype now uses a procedural sunny sky/horizon with soft clouds, atmospheric blending and one continuous nonuniform water grid. The organizer's reference guides blue daylight and glints; no plants or photographic backdrop. Shared CPU/GPU wave coefficients run on one 1.25× elapsed-time clock, with unchanged base amplitudes, area-sampled lift and exponentially damped pitch/roll. Hull ripples displace geometry and normals and decay offshore. Dev `?compare=1` exposes 1.0×/1.25× speed comparison.
- Checks: 9/9 tests; Astro check 0/0/0; telemetry-disabled build passed; diff check passed. Final scene 616.71 kB minified / 159.52 kB gzip (+4.52 / +1.50 vs R5); existing Vite warning remains. Prototype avoids the 237,222-byte lake photograph. GLB unchanged at 181,648 B; renderer 11 draws / 44,916 triangles (R5: 11 / 48,304).
- Saved production UAT at 320×650, 390×844, 768×1024 and 1440×900 covers surface/crossing/underwater/sensors/paragraph B/descent/reverse, keyboard skip link, reduced motion, fallback and no overflow. Initial emulated OS reduced motion and actual no-JavaScript contexts passed. Full matrix precedes the final sunny polish; sunny surface captures/recordings are separate. R5/R6 mobile and desktop videos contain at least 15 seconds fixed surface animation. Files/scripts/raw JSON: `uat/glhc002-r6/`; details: `docs/GLHC-002R6-UAT.md`.
- No application errors in the matrix; four Chromium ReadPixels driver warnings in the narrow capture. SwiftShader software-rendering intervals are slow and host-sensitive. Separate recording-free samples: mobile median/p95 R5 283.3/433.3 ms vs R6 66.6/83.4; desktop R5 116.7/133.4 vs R6 133.4/150.0 (about 14% median regression). Full-matrix local readiness 654.9–6,124.1 ms. Physical-mobile GPU performance and the 10-second mobile target remain unverified. Retain the isolated R6 candidate for organizer judgment; do not begin another water engine experiment.
- Organizer approved the upper silver/blue finish and requested original yellow/underwater materials; those are preserved with a surface-only environment response. Final requested-finish artifacts: `uat/glhc002-r6/handoff/`.
- Latest requested-finish local ready samples: mobile 1,320.6 ms, desktop 1,470.7 ms, narrow still run 1,907.8 ms. Capture frame samples were slow (466.7/616.5 ms mobile/desktop) on SwiftShader, with no physical-GPU claim. Final stills and both videos exported; optional dev selector interaction hit the bounded capture deadline and remains unexercised.
- Approved geometry, homepage, main-site photos, prose and timeline remain unchanged. GLHC-003 planning handoff: `docs/GLHC-003-PLANNING-HANDOFF.md`. No integration, merge, deployment or infrastructure change. User file `desktop-surface.jpg` preserved.

## GLHC-002R5 implementation handoff (2026-10-20)
- Refined only the isolated GLHC-002 scene. Buoy lift now area-samples the existing analytic water height at the hull center and four nearby points; surface gradients produce subtle pitch/roll, damped with elapsed-time exponential smoothing. Two low-amplitude, faster wave components are shared between the height sampler and water mesh. Buoy geometry/model are unchanged.
- Enhanced the existing single-pass analytic ring normals with uneven moving phases tied to the shared wave bob and subtle local reflected highlights. No simulation, framebuffer, dependency, or additional draw pass was added. Underwater compositing/loading/fallback behavior is unchanged.
- Verification: `npm test` 6/6 passed; `npm run check` 0 errors/warnings/hints; telemetry-disabled build passed. Scene chunk 612.19 kB minified / 158.02 kB gzip; compared with R4 (611.34 / 157.68), +0.85 / +0.34 kB. Existing Vite >500 kB warning remains. GLB unchanged at 181,648 B. Renderer reports 11 draw calls / 48,304 triangles.
- Browser viewport override worked for 320×650, 390×844, 768×1024, 1440×900 surface screenshots; crossing anchor was reviewed at desktop. Ten seconds of fixed surface animation were observed in the local browser; frame interval readouts at seconds 5 and 10 were 12.4 and 12.5 ms. This is local browser evidence only, not a physical device or representative mobile network measure. Browser console error/warning logs were empty.
- The browser tool cannot record/export a continuous video or persist its screenshots into repository files. Thus R5 before/after recordings, saved screenshot artifacts, full sensor view, scroll reversal, and complete per-viewport state matrix were not produced in this pass. Existing R4 fallback/reduced-motion/accessibility evidence remains relevant; this pass did not retest those paths. Mobile 10-second readiness remains unverified.
- Remote feature head was confirmed at baseline `533947e05d40dd7c882e106437802434bb0b074c`; `origin/main` is an ancestor. Preserve untracked user file `desktop-surface.jpg`. No homepage edits, merge, or deployment.

## GLHC-002R4 implementation handoff (2026-10-20)
- Changed only `/prototype/glhc-002`: removed the experimental GPU heightfield from the runtime bundle and kept Version A's single-pass hybrid water. Analytic, buoy-centered uneven ring normals now expand and fade, with phase modulation tied to the shared gentle buoy bob. The underwater shader uses a fuller, lower-contrast surface response to soften the submerged edge.
- The route's HTML stays immediate; its Three.js scene remains dynamically imported. A restrained status chip shows only during initialization/timeout/failure; the CSS buoy and complete prose remain available, retry is offered after initialization failure, and late success fades in at the current scroll progress. Readiness now requires GLB load/decode, shader compile, and a successful render. Dev-only timing logs report module load, model load/decode, renderer/shader initialization, first frame, navigation-to-ready, cache/network classification and errors.
- Verification: `npm test` 6/6 passed; `npm run check` 0 errors/warnings/hints; telemetry-disabled production build passed; `git diff --check` passed. The final build's lazy scene JS is 611.34 kB minified / 157.68 kB gzip, down 4.37 / 1.39 kB from R3. Vite's >500 kB warning remains. GLB unchanged at 181,648 B. Browser readout after R4 adjustments: 11 scene draws / 48,304 triangles.
- Remote sync confirmed `origin/feat/glhc-001-opening` at `6a9b51b`; it was an ancestor of local `262015e`. The six pre-existing commits were safely pushed before implementation. No merge, homepage integration or deployment.
- Follow-up browser UAT is available at the organizer's local server `http://localhost:4322/prototype/glhc-002`, viewport 454×~748 CSS px: surface/crossing/sensor/descent inspected; reverse to 0%, forced fallback, reduced-motion, first-Tab skip link and no console errors/warnings checked. `?fallback=1` showed both science paragraphs; no horizontal overflow after a 1 px clipping fix. No screenshots were exported as files; requested 320×650, 390×844, 768×1024, 1440×900 matrix remains incomplete because the browser has no viewport override. Physical mobile remains untested.
- Local development sample: dynamic module 201.3 ms, model download/decode 148.1 ms, shader init 8.9 ms, first frame/navigation-to-ready 613.6 ms, 11 draws / 48,304 triangles. This is not cold-cache/mobile evidence; 10-second target remains **unmeasured on target hardware**. The Vite chunk warning remains.

## Next action
Organizer reviews the isolated R6 sunny prototype and saved R5/R6 evidence, then confirms the retained visual version before detailed GLHC-003 integration planning.

## Verified baseline
- `feat/glhc-001-opening` previously at `1df064817cb0c376f87297262c736522a80e539b`: isolated `/prototype/glhc-002` created while root `/` remains the superseded GLHC-001 site.
- GLHC-002: 6/6 tests, Astro check clean, production build passed, four viewport browser checks, 22 screenshots; 76,776-byte compressed GLB / 5,108 model triangles / 10 scene draw calls / ~155 kB gzipped deferred scene JS.
- Visual review by Terra of organizer's screenshots: structure and scroll feasibility accepted; **visual design not accepted for integration**. Flat materials, bright linear waterline/broad bands, mobile sonde/text competition and unpolished in-between horizontal copy need refinement.
- No physical device performance, Lighthouse, GPU time, deploy or rights sign-off verified.

## Implementation handoff (2026-10-19)
- Updated the reproducible model builder with softened hull profiles, fasteners, panel rails/clamps, solar cell detail, revised material response and a generated neutral fine-finish texture; regenerated the GLB (181,648 B, 11,924 model triangles, 9 material batches). Blender is unavailable in the environment.
- Refined water shader/light balance, camera pullback through the crossing, and the midpoint prose fade. Corrected a runtime regression where `smooth()` was used but not imported; production preview now renders the buoy and reports 10 calls / 44,692 triangles.
- `npm test`: 6/6 passed. `npm run check`: 0 errors/warnings/hints. Production build passed; Vite still reports the deferred scene chunk at 603.61 kB minified / 155.10 kB gzip.
- Browser preview confirmed at default in-app width (~375 CSS px) for surface and sensor paragraph A. Required exact 320×650, 390×844, 768×1024, 1440×900 viewport matrix and the three saved offline still renders were not completed in this pass; no physical-device check. This is not evidence of organizer visual approval.
- `/` remains unchanged, and no deployment/integration occurred. Detailed record: `docs/GLHC-002-UAT.md`.

## Prior status at R3 start
The water comparison notes below document the previous decision point; R4 supersedes the comparison UI and keeps Version A as the route's runtime renderer. Keep `/` intact and do not integrate until the organizer approves.

## GLHC-002R3 handoff (2026-10-19)
- Added a query-gated A/B selector to the isolated prototype. A is the refined hybrid; B adds a 128×128 half-float GPU ripple heightfield and surface-normal sampling. Shared buoy GLB, broad waves/bob, camera, lighting and timeline are unchanged.
- Reviewed surface, crossing, sensor pause and fully descended states in the in-app browser at 1280×720. Verified reverse scroll to 0%. The remaining underwater surface boundary is still too straight for visual approval.
- Tests: 6/6 pass; Astro check: 0/0/0; production build passes. Scene bundle: 615.71 kB minified / 159.07 kB gzip (+7.25 / +2.32 kB from R2). Desktop intervals varied around 11–22 ms; B activation produced one 55.6 ms interval. Warm local scene-ready sample: 553.9 ms. None is mobile/GPU-time evidence.
- The browser could not set viewport dimensions or export screenshots as files. The requested responsive matrix, motion capture, physical iOS/Android, GPU timing, and memory measurement remain unverified. Blender unavailable. See `docs/GLHC-002R3-COMPARISON.md` and `docs/GLHC-002-UAT.md`.
- No homepage changes, merge, push, or deployment. Local comparison commit only.

## GLHC-002R2 implementation handoff (2026-10-19)
- Replaced the banded lake background with a generated, photographic calm-lake image optimized to WebP (237,222 bytes), with a subtle defocus to keep distant wavelets from forming parallel bands at screen scale. Removed the hard viewport-gradient seam from the underwater atmosphere.
- Increased synchronized small wave displacement and bobbing, and faded fine ripple normals at the near/far mesh join to soften the water transition. Buoy geometry and model assets are unchanged.
- Blender is unavailable. Production browser review was performed at 320×650, 390×844, 768×1024, and 1440×900, including surface, crossing, sensor pause, prose transition, paragraph B, reverse scrolling, and reduced-motion fallback. The screenshot provider displayed captures during the session; it did not export them as repository files. Latest production bundle console filter is clean; stale errors are from earlier bundle hashes.
- `npm test`: 6/6 passed. `npm run check`: 0 errors, warnings, hints. Production build passed; Vite reports a 607.18 kB minified / 156.25 kB gzip scene-chunk warning. The renderer reports 11 draw calls / 48,304 triangles after the GLB loads.
- Residual visual limit: at some underwater angles the projected surface horizon remains a straight, sharp line. This composite still approximates reflection/refraction; visual approval remains pending. No integration or deployment.
- Detailed record: `docs/GLHC-002-UAT.md`.

## GLHC-002R2 reference-inspired water addendum (2026-10-19)
- Used the linked ThreeJS Water demo as an effect reference: animated buoy-centered ripple normals, layered cross-directional surface shimmer, and restrained procedural caustic light below the surface. The water shader remains one pass; buoy geometry and the GLB remain unchanged.
- This does not port the demo's GPU heightfield, raytraced optics, or pool renderer. The buoy still bobs in sync with the shared analytic lake waves. This is a visual prototype, not a measured water-physics simulation.
- No five-second loading target appears in the repository requirements found during this pass. The approved refinement gate does require recording bundle size and load regressions. Physical mobile GPU performance remains unverified; see `docs/GLHC-002-UAT.md` for the latest build size and limitations.
- Current in-app browser screenshots were reviewed at the default 1440×900 viewport for surface, crossing, and underwater sensor states. The browser did not export these captures as repository files. The underwater horizon still has a sharp projected edge, and the current effect is not approved for integration.
- `npm test`: 6/6 passed. `npm run check`: 0 errors, warnings, hints. Production build passed; scene chunk is 608.46 kB minified / 156.75 kB gzip and triggers Vite's 500 kB warning. Full multi-pass effects remain a separately profiled option; do not infer five-second compliance from bundle size or desktop frame intervals.
- Blender remains unavailable. No deployment or homepage integration.
- Implementation commit: `9da3a7a242660572344dd74f73ea38c0735a7db6` on `feat/glhc-001-opening`.

## Pending unrelated inputs
- Organizer four-photo communication-examples collage (later GLHC-004).
- Verified Luma event URL (later GLHC-004).
- Public rights approval for RAEON photos/manufacturer references (before launch).
