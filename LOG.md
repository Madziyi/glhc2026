# Project Log (append-only)

### 2026-10-20 — GLHC-002R5 water and buoy-motion refinement
- Sync: fetched origin; confirmed feature branch remote at requested baseline `533947e05d40dd7c882e106437802434bb0b074c`; `origin/main` is an ancestor. Preserved unrelated untracked `desktop-surface.jpg`.
- Changed isolated scene only: buoy lift samples analytic surface height at center and four hull offsets; small slope-driven pitch/roll uses frame-rate-independent damping. Added two low-amplitude short waves shared by buoy sampling and the water mesh. Increased irregular buoy-centered ring normal/highlight visibility using the current shader. No new render pass/simulation or buoy model change.
- Verification: `npm test` 6/6; initial Astro check found one unused-variable hint, removed before final check; telemetry-disabled build passed. Build scene JS 612.19 kB minified / 158.02 kB gzip (+0.85 / +0.34 kB from R4); Vite's >500 kB chunk warning persists. GLB 181,648 B; 11 draws / 48,304 triangles. Local browser observed 10 seconds at surface; `frameMs` samples at 5s/10s were 12.4/12.5 ms. No browser console errors/warnings.
- Browser viewport override captured the surface at 320×650, 390×844, 768×1024, and 1440×900; desktop crossing anchor also reviewed. Browser cannot export video/screenshots to repository artifacts. Before/after 10-second videos, persisted R5 screenshots, and the full responsive states/reverse-scrolling matrix were unavailable. No physical mobile/network run; 10-second mobile readiness is unverified.
- No homepage, GLB, merge, deployment, or live infrastructure changes. Organizer approval remains pending; next work after approval is GLHC-003.

### 2026-10-20 — GLHC-002R4 local preview follow-up
- Organizer provided a reachable local preview at port 4322. Browser-reviewed the 454×~748 CSS px view: surface, crossing, underwater sensor view, descent, reverse Home to 0%, reduced-motion reading view, forced `?fallback=1`, and keyboard skip link. Console errors/warnings empty. Capture showed the far underwater water surface still formed a high-contrast horizon, so added distance-based shader haze and alpha fade into a flat underwater CSS haze. Also compacted the narrow science card and clipped 1 px document overflow in fallback.
- Readiness audit found scene-ready could fire on a water-only frame before GLB arrival. It now waits until `buoy` exists, shader compile completes and the scene renders; dev timing data now includes module, model, shader and first-frame values as readout datasets. Prevented the 10-second timer from overwriting an actual failure state.
- Local dev preview sample: module 201.3 ms; model download/decode 148.1 ms; shader init 8.9 ms; first frame/navigation-to-ready 613.6 ms; 11 draw calls / 48,304 triangles. This local sample is not cold-cache/mobile proof. Responsive dimensions unavailable; no physical mobile or screenshot export.
- Final commands passed after these changes: `npm test` 6/6; Astro check 0/0/0; telemetry-disabled build; `git diff --check`. Lazy scene bundle now 611.34 kB minified / 157.68 kB gzip, still 4.37 / 1.39 kB smaller than R3; Vite's >500 kB warning remains. No homepage edits, merge, deployment, or Live State change.

### 2026-10-20 — GLHC-002R4 hybrid water/loading implementation
- Sync: fetched GitHub; confirmed remote feature head `6a9b51b` was an ancestor of local `262015e025ecfd9ce07391c1ab882098181ebb60`; pushed the six existing local commits safely before implementation. Preserved untracked `desktop-surface.jpg`.
- Changed isolated `/prototype/glhc-002`: removed Version B's GPU heightfield runtime and kept the single-pass hybrid shader. Added nonuniform buoy-centered analytic ripple normals with expansion/fade and gentle bob modulation; strengthened/softened the underwater water-surface blend. Kept static HTML/readable copy immediate; scene JS remains lazy. Added nonblocking loading/failure/retry UI and the 10-second fallback presentation. Scene-ready now requires GLB decode, shader compile and a usable rendered frame. Added dev-only navigation/module/model/renderer/first-frame/ready/cache/error instrumentation.
- Verification: tests 6/6; Astro check 0 errors/warnings/hints; telemetry-disabled production build passed; `git diff --check` passed. Deferred scene JS 610.44 kB minified / 157.41 kB gzip (R3: 615.71/159.07 kB); Vite chunk warning remains. GLB unchanged at 181,648 B. No new live draw/triangle count.
- UAT limit: local preview timed out from available in-app browser. No R4 screenshots, responsive matrix, runtime accessibility/fallback checks, or mobile measurements were captured. No claim of 10-second readiness or 60 fps. See R4 section in `docs/GLHC-002-UAT.md`.
- No homepage change, merge, or deployment. No live infrastructure change; `LIVE-STATE.md` unchanged.
- Next: visual review/capture in a working browser, including all required sizes and states; organizer approval remains the integration gate.

### 2026-10-19 — GLHC-002R2 water/environment refinement begins
- Scope: prioritize natural lake waves/reflections and buoy interaction, physical-feeling reversible waterline crossing, underwater depth/light, and responsive sensor composition. The approved buoy geometry is provisionally frozen; no site narrative or homepage work.
- Sync: fetched `origin/main` (`c9841d7`) and `origin/feat/glhc-001-opening` (`6a9b51b`); working branch starts at user-specified commit `115b67d`. Main is an ancestor. Preserved untracked `desktop-surface.jpg`.
- Baseline: reviewed shared workflow/project state, prior GLHC-002R spec/UAT and current Three.js scene, CSS composite, camera and timeline. No deployment/live state changes.
- Next: implement environment and composition changes in the isolated route, then six-scene state capture, reverse-scroll/runtime checks, tests/check/build and commit. Do not merge or integrate.

### 2026-10-18 — GLHC-001 kickoff / first implementation
- Changed: Authored Astro single-page structure, responsive cinematic CSS, reversible scroll controller, provisional photograph cutouts, challenge and registration ending, source contract tests; adapted Terra/Sol context workflow.
- Decisions: Photorealistic hybrid. Start with 2D image masks and prepare 3D only when authentic glider model is available. Luma URL is required before CTA activates. No data-to-art widget.
- Verification: `node --test tests/*.test.mjs` passed (3/3), `node --check public/main.js` passed. Astro install/build and browser UAT not yet verified because authoring sandbox cannot contact npm and blocks local Chromium navigation.
- Live state: No hosting or deployment verified.
- Known issues: Glider cutout provisional; buoy segmentation needs visual review. Luma URL missing. Production asset rights unconfirmed.
- Next action: Codex Sol runs real browser UAT, improves realism, returns screenshots and verification details.

### 2026-10-18 — GLHC-001 branch sync and Sol browser UAT
- Sync: initialized Git metadata for the supplied workspace, fetched `origin/main` (`c9841d7`) and `origin/feat/glhc-001-opening` (`3683301`), then applied the workspace baseline as tracked changes on the feature branch. No remote history was reset.
- Changed: imported the full workspace implementation/context; fixed narrow mobile overlap between HUD and hero kicker; lowered the underwater glider below descriptive copy at mobile/tablet/desktop widths; saved 16 viewport/scene screenshots in `uat/`.
- Verification: `npm install` added 455 packages (npm reported 3 vulnerabilities: 1 low, 1 high, 1 critical); `npm test` passed 3/3; `ASTRO_TELEMETRY_DISABLED=1 npm run build` passed (Astro 5.18.2). Browser UAT passed at 320×650, 390×844, 768×1024 and 1440×900: zero page errors/sideways overflow, scene 04 at progress 0.72, reverse to scene 01, skip link receives first Tab, reduced-motion fallback visible, disabled Luma link has no phantom navigation.
- Limitations: online npm audit could not reach `registry.npmjs.org`; no Lighthouse/Core Web Vitals run or deployment verification. The glider image still has obvious lake-water fringe and requires an approved, verified replacement asset; RAEON usage approval and the real Luma URL remain outstanding.
- Screenshots: `uat/{mobile-narrow,mobile,tablet,desktop}-{surface-hero,waterline-transition,underwater-glider,registration-ending}.png`.
- Next: Terra reviews the branch handoff; GLHC-002 replaces the glider artwork when an accurate approved asset is available.

### 2026-10-18 — GLHC v2 redesign approved by organizer
- Direction: Changed from glider-led opening to people-first student image, 3D **specific** yellow buoy and underwater sonde/cage. The buoy is the only continuous 3D hero object.
- Story: scene 3 contains just two science paragraphs with **one horizontal transition**, then vertical descent. Scene 4 includes single organizer-provided four-picture collage (pending) and a short team/equipment/inclusivity explanation. Final view is deeper open water, no buoy, Luma registration.
- Asset authority: user-provided complete buoy image (`image(20261018-215310).png`), real-world equipment photos and `CB650_drawings.pdf` cross-reference; no assertion that all optional typical CB-650 modules are deployed.
- Documentation: `docs/GLHC-V2-SPEC.md` captures explicit cinematic sequencing, constraints, technical milestone and UAT criteria.
- Verification: requirements/design only. No new 3D asset, browser tests, npm audit or deployment verified in this change.
- Next: GLHC-002 isolated buoy/waterline/sensor camera prototype; collage and real Luma link may arrive later.

### 2026-10-18 — GLHC-002 isolated 3D buoy prototype / responsive browser UAT
- Sync: fast-forwarded requested `feat/glhc-001-opening` to `ba3a87c`; fetched `origin/main` (`c9841d7`), confirmed it is already an ancestor. Kept all work on the requested feature branch.
- Roles: parent planned/reviewed/verified and owned context; organizer explicitly requested Luna high for coding. Organizer reattached the approved complete assembly reference. Parent inspected manufacturer PDF sheets 1, 6 and 7; protected reference drawings/images are not shipped.
- Changed: isolated `/prototype/glhc-002`, reproducible procedural model source, meshopt GLB (76,776 B / 9 batches / 5,108 triangles), photographic/shader lake with natural bobbing, real descending camera, parked sensors and exactly one horizontal change between two DOM science paragraphs, reduced-motion/no-JS static layout and failure handler. Existing homepage source/assets unchanged; no collage or registration development.
- Corrections: reviewed exporter transforms and rounded cage geometry, mobile framing, timeline clamping/descent, route imports, narrow overflow/prose clipping, motion recovery and static failure-mode invariants before handoff.
- Verification: full `npm test` 6/6 passed; Astro check zero errors/warnings/hints; production build passed (603 kB scene chunk / 155 kB gzip warning retained); model builder validates 27 codec round trips and buffer bounds; diff check clean. Parent browser-reviewed production preview at 320×650, 390×844, 768×1024 and 1440×900, reverse scroll, sensor pause, both paragraphs, keyboard entry, static reading and simulated WebGL failure. Final production logs empty; no sideways overflow. Saved 20 scene screenshots + 2 fallback/reading screenshots in `uat/glhc002/`.
- Performance: observed 10 scene draw calls / 37,876 triangles; active frame intervals around 11 ms, with background-throttled intervals around 1 s. These are in-app desktop-browser samples, not sustained mobile FPS or GPU time. No Lighthouse, physical-device/touch UAT, OS preference mutation or deployment verification.
- Limitations/decision: visual model details and water compositing need organizer review; refraction/reflection approximated, broad bands/seams remain, mobile prose can cover lower cage/ballast. Retain composite approach for refinement; profile actual mobile GPUs and bundle loading before integration.
- Live state: local preview only; no deployment/infrastructure or Luma link changed.
- Next action: organizer reviews isolated prototype and screenshots before integration. Detailed evidence and screenshot index: `docs/GLHC-002-UAT.md`.

### 2026-10-18 — Organizer approves GLHC-002R visual refinement
- Terra reviewed four supplied screenshot states and `docs/GLHC-002-UAT.md` on commit `1df0648`. Camera, compressed buoy geometry and tests show feasibility, but flat materials and waterline optics are visibly below requested photorealism. Mobile sensor/paragraph framing and midway desktop panel slide need refinement.
- Decision: keep GLHC-002 isolated; aim for a reproducible PBR / Blender-led model/material pass (Blender availability to be checked, not presumed), more natural composite water, better responsive compositions. Do not jump to heavy full-simulation optics without justified visual/performance comparison.
- New explicit acceptance spec: `docs/GLHC-002R-VISUAL-REFINEMENT.md`. Await fresh renders, screenshots, verified tests, physical-mobile caveats and organizer visual approval before site integration.
- No source code, build or deployment was changed/verified in this planning commit. Next: Codex Sol implements GLHC-002R.

### 2026-10-19 — GLHC-002R implementation pass
- Changed: refined the procedural buoy mesh/materials and generated finish texture, water optics/light, crossing camera pullback and horizontal panel midpoint fade. Kept all work on the isolated prototype route; Blender was unavailable.
- Debugging: production browser initially stayed at PREPARING because `scene.js` referenced `smooth()` without importing it. Added the missing import; the rebuilt preview rendered the buoy and reported 10 draw calls / 44,692 triangles including water.
- Verification: `npm test` passed 6/6; `npm run check` reported 0 errors/warnings/hints; production build passed with the existing large lazy-scene chunk warning (603.61 kB / 155.10 kB gzip). Default in-app browser width confirmed surface and sensor paragraph A.
- Limits: three saved still renders and requested exact viewport/state screenshot matrix were not produced; desktop/tablet and physical-mobile composition remain unverified. This is not organizer visual approval and must not be integrated yet.
- Next: organizer reviews this isolated iteration; capture outstanding render/browser matrix if more visual iteration is requested.

### 2026-10-19 — GLHC-002R2 environment refinement
- Changed only the isolated prototype environment and scene shader: replaced the visibly banded lake backdrop with a generated 237,222-byte WebP and subtle defocus, removed the viewport-wide blue gradient seam, increased synchronized calm-water displacement/bobbing, and faded ripple normals at the near/far water mesh join. The approved buoy geometry/GLB remains untouched; Blender was unavailable.
- Browser-reviewed production output at 320×650, 390×844, 768×1024, and 1440×900, covering surface, crossing, sensor pause, both prose paragraphs/transition, reverse scroll, and reduced-motion fallback. Latest bundle console filter had no errors. Visual captures were inspected in the browser session, but could not be exported into repository screenshot files.
- Verification: `npm test` 6/6; `npm run check` 0 errors/warnings/hints; `npm run build` passed; `git diff --check` clean. Build retains Vite's 607.18 kB minified / 156.25 kB gzip warning. Renderer readout after model load: 11 calls / 48,304 triangles.
- Limit: the projected horizon still appears straight at some underwater angles; the shader/photo composite is not physically accurate refraction or reflection. No deployment or homepage integration; visual approval pending.
- Next: organizer reviews the isolated prototype before integration.

### 2026-10-19 — GLHC-002R2 ThreeJS Water inspiration pass
- Reference reviewed: the demo emphasizes heightfield interaction, raytraced reflection/refraction, and caustics. Adapted only its visual cues to the calm lake: buoy-centered moving ripple normals, less directional surface shimmer, and low-intensity procedural underwater caustics in the existing water shader. No new render pass, dependencies or buoy geometry changes.
- Clarified performance scope: no five-second loading requirement was found in the project docs. The approved refinement spec asks us to record bundle size/loading regressions and verify on physical mobile where available. Current bundle remains deferred, but full heightfield/optical passes require measured mobile GPU and startup testing before integration.
- Browser review: surface, crossing and sensor-side underwater states checked in the in-app browser at 1440×900; renderer reported 11 calls / 48,304 triangles. Existing stale shader errors in the console refer only to old `scene.D95RGkDq.js` and `scene.DPjCA_iT.js` bundles; current bundle filter was empty. Browser capture bytes were displayed for visual review but not exported as files. The viewport override did not change the in-app browser dimensions, so this pass did not repeat narrow/mobile captures.
- Verification after final shader/CSS change: `npm test` 6/6, Astro check 0 errors/warnings/hints, production build passed (scene chunk 608.46 kB / 156.75 kB gzip, Vite warning), `git diff --check` passed with only line-ending conversion notices.
- Limit: the projected surface horizon remains sharp at underwater angles. Current ripples modify normals/shimmer, while the buoy's vertical bob remains synchronized to the analytic shared waves; the water is not a heightfield or physics simulation. Keep isolated pending organizer visual approval; no deployment or site integration.
- Next: organizer reviews the updated isolated prototype and decides whether the next pass should profile a full heightfield-water port.
- Implementation commit: `9da3a7a242660572344dd74f73ea38c0735a7db6` (`Refine GLHC-002 water environment`).

### 2026-10-19 — GLHC-002R3 advanced water rendering comparison
- Sync: fetched `origin`; `origin/feat/glhc-001-opening` remains `6a9b51b89899fb0b487112f4b1aa7d61d8959b22`, `origin/main` is `c9841d7c7f9e11abe1ca4fc29b0413648851a861`, local HEAD was `2ebb9edd6ba2c84e3bf06066c91ee7d5a862fef0`; both requested R2 commits are ancestors. Preserved untracked `desktop-surface.jpg`.
- Changed only the isolated route/prototype controls, water shader, and shared context: a `?compare=1` selector switches A (hybrid) and B (128×128 half-float GPU heightfield). Model, broad analytic swell/bob, camera, lighting and timeline are shared. B falls back to disabled when WebGL2 float targets are unsupported. No source code from the linked MIT project was copied; implementation reference and license context are documented in `docs/GLHC-002R3-COMPARISON.md`.
- Browser: captured/displayed A and B at surface, crossing, sensor pause and bottom states at the in-app browser's fixed 1280×720. Home returned to 0%. Browser logs were clear. Remaining underwater boundary is still largely straight; no organizer visual approval.
- Verification: `npm test` 6/6; `npm run check` 0 errors/warnings/hints; production build passed. Scene bundle 615.71 kB minified / 159.07 kB gzip (+2.32 kB gzip vs R2). Readout 11 scene draws / 48,304 tris; B's compute pass is omitted by Three renderer counter reset. Desktop frame intervals varied around 11–22 ms with one 55.6 ms first-B-activation interval; warm local scene-ready sample was 553.9 ms. These are not GPU timing or cold page-load evidence.
- Limitations: no requested responsive viewport matrix, saved screenshot files, motion recording, initial resource timing, GPU/memory profiling, physical iOS/Android, or Blender renders. Screenshot provider presented images in-session but did not export bytes. User requested no integration/merge/deploy; none occurred.
- Next: organizer reviews the isolated A/B states at `/prototype/glhc-002?compare=1`; decide on further optical work after review. Commit remains local on `feat/glhc-001-opening`.
