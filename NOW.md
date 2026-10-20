# Active Initiative

**Initiative:** GLHC-002R4 — hybrid water finalization and progressive loading.
**Status:** IMPLEMENTATION AND AUTOMATED CHECKS COMPLETE / VISUAL UAT AND ORGANIZER APPROVAL PENDING.
**Implementation and verification:** Codex.

## GLHC-002R4 implementation handoff (2026-10-20)
- Changed only `/prototype/glhc-002`: removed the experimental GPU heightfield from the runtime bundle and kept Version A's single-pass hybrid water. Analytic, buoy-centered uneven ring normals now expand and fade, with phase modulation tied to the shared gentle buoy bob. The underwater shader uses a fuller, lower-contrast surface response to soften the submerged edge.
- The route's HTML stays immediate; its Three.js scene remains dynamically imported. A restrained status chip shows only during initialization/timeout/failure; the CSS buoy and complete prose remain available, retry is offered after initialization failure, and late success fades in at the current scroll progress. Readiness now requires GLB load/decode, shader compile, and a successful render. Dev-only timing logs report module load, model load/decode, renderer/shader initialization, first frame, navigation-to-ready, cache/network classification and errors.
- Verification: `npm test` 6/6 passed; `npm run check` 0 errors/warnings/hints; telemetry-disabled production build passed; `git diff --check` passed. The build's lazy scene JS is 610.44 kB minified / 157.41 kB gzip, down 5.27 / 1.66 kB from R3. Vite's >500 kB warning remains. GLB unchanged at 181,648 B. Existing R3 renderer evidence is 11 scene draws / 48,304 triangles; this pass did not get a live browser readout.
- Remote sync confirmed `origin/feat/glhc-001-opening` at `6a9b51b`; it was an ancestor of local `262015e`. The six pre-existing commits were safely pushed before implementation. No merge, homepage integration or deployment.
- Browser preview connection timed out in the available in-app browser. Therefore no R4 before/after screenshots, responsive matrix, reduced-motion/keyboard/WebGL runtime UAT, frame-rate sample, or physical mobile run is claimed. The 10-second mobile target is instrumented but **not measured or demonstrated**. Existing screenshot files are from prior iterations and are not R4 evidence.

## Next action
Review the isolated R4 prototype in a working browser and capture the requested viewport/state matrix before organizer visual approval or integration.

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
