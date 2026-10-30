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


### 2026-10-20 — GLHC-002R6 final procedural lake and sunny reference polish
- Sync: fetched origin; feature head equals requested R5 baseline `00ed9c41af5020f32f9b01e4fc565ad798bffa83`; `origin/main` (`c9841d7`) is already an ancestor. Preserved untracked user `desktop-surface.jpg`; all implementation remains on the feature branch.
- Changed isolated prototype: shared CPU/GPU wave coefficients and 1.25x elapsed-time phase; unchanged wave amplitude, area-sampled lift and exponentially damped slope attitude; geometric irregular hull ripples with matching normals and decay; one continuous nonuniform grid instead of overlapping near/far water; procedural sky/horizon and CSS fallback without the lake photograph. Organizer's follow-up reference adds sunnier blue sky, soft procedural clouds, warm haze and brighter glints; no plants. Approved buoy GLB/builder, main site, prose and timeline are unchanged.
- Verification: 9/9 tests, Astro check 0 errors/warnings/hints, telemetry-disabled build and diff check passed. Final scene 613.87 kB minified / 158.61 kB gzip (+1.68/+0.59 vs R5); existing Vite warning remains. No 237,222-byte photographic request from prototype. GLB remains 181,648 B. Renderer 11 calls / 44,916 triangles vs R5 11 / 48,304.
- Saved R5/R6 mobile and desktop recordings each include at least 15 continuous seconds at fixed surface camera; four-size production matrix includes surface/crossing/underwater/sensors/paragraph B/descent/reverse, keyboard skip link, reduced motion, static fallback and no horizontal overflow. Initial emulated OS reduced motion and actual JavaScript-disabled paths also passed. Final sunny surface captures/recordings are separately labeled because the complete matrix preceded the palette/cloud polish. Evidence/scripts/raw JSON: `uat/glhc002-r6/`; full report: `docs/GLHC-002R6-UAT.md`.
- Limits: no application errors in completed matrix; four ReadPixels GPU driver warnings in narrow capture. SwiftShader software rendering, substantial host/capture timing variation; separate no-recording median/p95 mobile-size R5 283.3/433.3 ms vs R6 66.6/83.4, desktop R5 116.7/133.4 vs R6 133.4/150.0 (about 14% median regression). Local matrix readiness 654.9-6,124.1 ms is not physical-device/network evidence. No mobile GPU/10-second target acceptance, GPU timer or memory profile. Retain isolated R6 candidate for organizer visual and hardware review; no further water engine experiment.
- No homepage integration, merge, deployment, infrastructure, secrets or Luma change. Added `docs/GLHC-003-PLANNING-HANDOFF.md` for the full storytelling sequence; no integration implementation. Next: organizer reviews R6 and the saved comparison before detailed GLHC-003 planning.


### 2026-10-20 — R6 organizer follow-up: sunny reference and material approval
- Organizer supplied a sunny lake reference without plants, then requested silver upper metalwork, lighter dark-blue reflective photovoltaic glass, and brighter water. Approved the resulting upper silver/blue appearance, while requesting the prior yellow hull and underwater assembly appearance be retained.
- Kept geometry/GLB frozen. Added a tiny generated daylight environment for upper metal/glass; original direct lighting, yellow and submerged material response are retained. Shared steel batches use a height-based material blend to preserve their original submerged color/roughness/metalness and suppress added environment light below the surface. No new per-frame reflection scene or geometry split. Water is brighter teal; underwater haze unchanged.
- Final automated checks after these changes: 9/9 tests; Astro check 0 errors/warnings/hints; telemetry-disabled build passed. Final scene 616.68 kB minified / 159.52 kB gzip (+4.49/+1.50 vs R5). Previous R6 bundle figures above are historical. The existing Vite chunk warning remains.
- Earlier complete production matrix and controlled software-renderer comparison predate the final sunny/material polish. Final requested-finish capture results are separately labeled in `uat/glhc002-r6/approved/` and `docs/GLHC-002R6-UAT.md`. Physical-device acceptance remains open; no merge or deployment.

- Final finish correction: Three.js uses scene.environmentIntensity for a scene-wide environment, overriding the intended per-material intensity suppression. Removed the scene-wide assignment and attached the daylight map only to upper-finish materials. Original yellow and underwater-instrument materials now have no environment map; submerged shared metal batches retain their original finish through the height mask. This fixes the remaining pale washout seen during review.
- Final build after correction: scene 616.69 kB / 159.51 kB gzip (+4.50/+1.49 vs R5), tests 9/9, Astro check 0/0/0, build passed. Latest requested-finish evidence is `uat/glhc002-r6/handoff/`; earlier `approved/` references above denote an intermediate capture, not final overall visual acceptance.

- Published handoff verification boundary: all four requested sizes have final surface/crossing/sensor stills, and final mobile/desktop 15-second fixed-surface segments exported. Helpers reached bounded deadlines after saving those artifacts; optional dev speed-selector interaction was not completed and is not claimed tested. Complete earlier matrix and R5/R6 recordings remain labeled; obsolete partial material captures were removed.
- Added a finite-angle guard at the exact center of the radial GPU ripple function. Final checks after the guard: 9/9 tests, Astro 0/0/0, successful build; scene 616.71 kB minified / 159.52 kB gzip (+4.52/+1.50 vs R5), bootstrap 2.91/1.27 kB. No physical-device acceptance, merge or deployment.

- Latest finish observations: mobile/desktop readiness 1,320.6/1,470.7 ms; narrow still-run readiness 1,907.8 ms. Capture last-frame samples 466.7/616.5 ms on software rendering; final material cost not isolated from recording/host overhead. No page exceptions in final narrow/tablet stills; mobile capture has four ReadPixels driver warnings, desktop capture has none. Optional speed-selector interaction remains unverified after the bounded helper timeout.

### 2026-10-20 — Approved R6 and merged PR #1; opened GLHC-003
- Organizer accepted the R6 buoy/sky/water prototype visually as good enough to move beyond water-only work. Not claiming physical mobile performance, 10-second startup target or release readiness.
- Verified PR #1 pointed exactly to approved R6 commit `2f4b221daf183b9d1ce8900abe4e7697cb110ec6`, was 17 commits ahead / zero behind `main`, mergeable, had no recorded GitHub combined statuses, and user-reported 9 tests/build passing.
- Marked draft PR ready for review and merged into `main` with SHA `1524431cc33723bfeb063ac96fededfb77f575dc`. No deployment.
- Created `feat/glhc-003-storytelling` from merged `main`; updated project task/now/live state and wrote `docs/GLHC-003-BUILD-SPEC.md` defining five chapter website, actual GLB reuse, accessible progressive loading, placeholder collage, absent Luma URL and final UAT requirements.
- Next: Codex Sol executes GLHC-003 from new branch, beginning with the student-photo hero and cinematic handoff to the approved buoy.

### 2026-10-20 — Organizer supplied collage and Luma URL
- Received one composite image `collage.jpg` containing waterfront light installation, electronics controller and a purple LED matrix, to be displayed intact as the single inspiration collage. Prepared mobile/large-screen optimized WebP versions in `GLHC-003-collage-assets.zip` for Codex import; image binaries are not yet committed.
- Received exact Luma registration destination `https://luma.com/pz0iw2m7` and configured it on GLHC-003 branch, enabling existing registration controls in branch preview. Luma's current event metadata/registration state could not be independently verified; no new schedule/location claims.
- Updated GLHC-003 specification and handoff to remove stale missing-asset/disabled-CTA assumptions. Source copyright/public release permissions, final navigation UAT and real-device performance remain pending.
- No changes to R6 buoy model, camera, shader, production hosting, or main branch.

### 2026-10-20/21 — GLHC-003 complete storytelling implementation
- Synced origin and switched safely from R6 feature checkout to organizer-prepared `feat/glhc-003-storytelling`, baseline `0ae9234`, containing main's accepted merge `1524431`. Preserved user untracked source ZIP/collage and desktop-surface.jpg. Codex coordinated disjoint homepage/scene coding agents and read-only review; one writer owned durable context.
- Replaced root homepage with full people-first editorial narrative, supplied uncropped lab group photo and photo-corner animated $500 Prize/winning-team caption, welcoming first-screen facts, researchers and buoy, exact two science paragraphs/one horizontal transition, single supplied square collage, five participation steps and buoy-free deep-water Luma ending. Central configuration supplies real no-JS and runtime secure CTAs. No invented logistics or telemetry.
- Reused R6 renderer with bounded homepage hooks and a layout-derived timeline; camera parks for the prose transition and descends beyond instruments. Cached chapter bounds, generation-safe retry, explicit timeout/static path. Preserved GLB/builder/shaders/materials/waves and isolated prototype page/timeline/styles. Fixed mobile headline spacing, surface copy overlap, desktop camera side and native refresh restoration discovered during UAT. Reduced motion hides the live canvas and presents ordinary science prose.
- Automated results:11/11 tests, clean Astro diagnostics, successful telemetry-disabled production build, clean diff. Deferred scene618.66/160.26kB gzip (+1.95/.74 vsR6); homepage bootstrap2.06/.93 plus helper1.11/.65. Existing Vite warning remains. GLB181648B same blob599c5f5585306c5542041f86118946ba979d8377;11draws/44916triangles surface and sensors;2draws/32992triangles final registration.
- Initial complete four-size production UAT covers major states, reverse, keyboard skip, landscape/no overflow, motion toggle and Luma. Final corrected nine-state stills at all four sizes plus paragraph-two refresh checks are `uat/glhc003/final/`; no page exceptions. Final stills use test-only4FPS capture cadence, not shipped behavior. All three actual CTA clicks reached exact Luma URL/title withnoopener; no submission. Earlier normal-loop complete recordings/matrix remain labeled before camera polish. Detailed evidence and capture failures/boundaries: `docs/GLHC-003-UAT.md`.
- Initial local unthrottled FCP156–200ms,3Dready649.7–792.7ms; SwiftShader frame medians99.9–233.3ms. No physical-mobile/network/60FPS claim. Four ReadPixels warnings on initial narrow capture; other initial logs clear. Optional uncapped recapture export stalled and a later overwrite raised WindowsUNKNOWN file I/O; retained completed videos and captured final compositions in a fresh folder. Development module-fetch diagnostic inconclusive; production loaded correctly.
- Supplied optimized collage binaries included; original user source/ZIP remain untracked. No main merge, deployment, database, secrets or infrastructure changes. Next: organizer UAT and approval, then real-device and rights/launch checks.
- Final failure-path verification completed: no-JS, OS reduced motion, forced/blocked WebGL and12-second delayed-model timeout preserve readable content/no overflow; Retry recovers scene-ready. Isolated prototype initializes. Final automated pass after refresh fix:11/11 tests and Astro0/0/0.
- Organizer final typography request: applied locally hosted Google Sans to body/controls (35,968B variable Latin WOFF2,400–700), preload/swap and included official OFL/provenance. Kept editorial heading face. Targeted font-loaded responsive checks/evidence under `uat/glhc003/font-review/`; earlier full recordings predate this font-only addition.
- Organizer annotated hero follow-up: moved yellow Register Now into header and moved manual motion control to footer; changed h1 to Great Lakes Hackathon Challenge with yellow italic Challenge; inserted exact supplied art/science/technology, solo/team, creative-project and no-experience copy; removed redundant labels/header brand/visible caption/old copy. Starburst shape spins with upright text; centered supplied animated scroll_down.svg with SCROLL FOR A COOL BREAKDOWN. Preserved organizer-updated higher-resolution group photo. Google Sans loaded in browser; final targeted evidence `font-review/` supersedes earlier hero stills. Scene/timeline unchanged.
- Final annotated hero verification: all four font-loaded hero/science captures passed with no overflow/page errors, and both current header/ending CTAs reached the exact Luma event securely. Latest automated results remain11/11 tests, Astro0/0/0 and successful production build. Complete final camera walkthrough recordings exported before the last hero/font follow-up; evidence boundaries recorded honestly.

### 2026-10-21 — GLHC-003 lower-right researcher photo
- Enlarged the surface-story researcher photograph to2× previous dimensions, aligned it right and added22svh flow spacing. It belongs to the section and scrolls naturally; no sticky/fixed positioning or new animation.
- Production build passed; four-size browser checks verify exact160px upward displacement for160px native scroll, no overflow and no page exceptions. Evidence/script: `uat/glhc003/surface-photo/`, `surface-photo.mjs`.
- Static reading layout and approved renderer/camera/model unchanged. No merge or deployment. Next: organizer reviews updated draft PR#2.

### 2026-10-21 — Surface camera orbit before descent
- Added one complete eased camera orbit during22–94% of the surface section, rotating camera and framing target around the stationary buoy. Native scroll remains the controller; reverse scroll retraces the orbit. A settled interval precedes the unchanged waterline descent.
- Original view is returned exactly at orbit completion; crossing, underwater orientation and parked sensors unchanged. New orbit tests plus prior suites pass12/12; Astro0/0/0 and production build pass. Scene619.26/160.46kB gzip; geometry/materials/shaders/draw counts unchanged.
- Four-size browser evidence/script in `uat/glhc003/orbit/`, `orbit.mjs`: orbit stages, reverse, waterline, approved sensor coordinates and reduced mode. Captures use test-only4FPS/software renderer, not physical-device performance evidence. Supplied MP4 reference reviewed via extracted frames outside the repository after the minimal bundled encoder could not decode it.
- No merge/deploy. Next: organizer reviews the updated motion in draft PR#2.

### 2026-10-21 — Organizer buoy grids, probes and open upper cage
- Task: GLHC-003 buoy detail follow-up. Status: done, organizer review pending.
- Changed deterministic builder/shared GLB: matching grids on the two side panels; long white black-capped probe slightly shorter than blue; short black probe; upper cage plate/insets removed, lower retained. Explicit organizer request supersedes frozen-geometry scope. Original hull/finishes, camera, water and clock retained; both routes share this asset.
- Model188,892B, blob `b6f46fcedddcd0f15d7007e724a3f764b61b93c1`,10 batches/12,280 triangles. Repeated generation byte-identical;40 compression streams round-trip, zero invalid normals. Texture unchanged.
- Verification:12 tests, Astro0/0/0, production build and diff checks pass. Four-size production screenshots at front/both sides and parked sensors show grids and three distinct probes; approved camera coordinates unchanged, no overflow/page exceptions. Evidence/script: `uat/glhc003/buoy-details/`, `buoy-details.mjs`. Shared prototype initializes. Initial prototype-only harness assertion incorrectly expected a nonexistent data flag; corrected to actual readiness metrics and passed. Scene619.26/160.46kB; surface11 draws/45,080 triangles, sensors12/45,272. Existing Vite warning and test-only4FPS/software-renderer limits remain.
- Live state: no merge or deployment. Known issues: physical-device acceptance remains open. Preserved unrelated untracked source files.
- Next action: organizer reviews buoy details and complete story in draft PR#2. Commit: this published handoff.

### 2026-10-21 — Homepage reference and section shortcuts
- Task: GLHC-003 organizer hero reference. Status: done, organizer review pending.
- Changed homepage/CSS: removed extra intro and welcome, kept solo/team paragraph, rounded photograph, added yellow pill links to section01 and curiosity/tools, yellow scroll-cue words. Fonts, registration, model and renderer retained. Native smooth anchors use focusable targets; static/reduced modes scroll immediately.
- Verification:12/12 tests, Astro0/0/0, production build and diff checks pass. Four viewport sizes verify both actual smooth-scroll clicks, intermediate movement, correct hashes/focus, visible target headings, no overflow/page errors. Separate no-JS and OS-reduced contexts pass both links. Evidence/script: `uat/glhc003/hero-navigation/`, `hero-navigation.mjs`; mobile/desktop hero reviewed visually. Existing Vite warning and software-renderer capture limitations remain.
- Live state: no merge or deployment. Known issues: existing physical-device/launch acceptance remains open. Unrelated untracked sources preserved.
- Next action: organizer reviews the simplified opening and navigation in draft PR#2. Commit: this published handoff.

### 2026-10-21 — Responsive hero fit and balanced spacing
- Task: GLHC-003 responsive opening. Status: done, organizer review pending.
- Changed CSS: viewport-height-aware photograph/heading, distributed portrait spacing and small cue reserve, compact short-tablet grid, two-column short landscape with side-by-side links and header-clear prize. Retained full photo, content, fonts, registration, navigation and scene. Text enlargement can grow the page; no fixed-height clipping.
- Verification:11 default-text viewports from320x568 to1440x900, including375x667 SE,393x852 iPhone16,768x600 and two landscape sizes. Full hero/buttons/cue fit, no horizontal overflow/page errors; final mobile/landscape visual review. Script/evidence: `hero-responsive.mjs`, `hero-balanced/`, superseding final landscape shots in `hero-balanced-landscape/`.12 tests, Astro0/0/0, final production build and diff pass; scene bundle unchanged. Corrected initial4px compact overflow and reran; earlier exploratory scene-ready timeout occurred during concurrent rebuild, final sequential checks passed. Software-renderer capture/device acceptance limits remain.
- Live state: no merge/deployment. Known issues: physical-device/launch acceptance remains open; unrelated untracked sources preserved.
- Next action: organizer reviews balanced responsive hero in draft PR#2. Commit: this published handoff.

### 2026-10-21 — Slower homepage section jumps
- Task: GLHC-003 navigation timing. Status: done, organizer review pending.
- Organizer clarified only homepage button/cue jumps. Added3.2-second eased navigation with user-input/resize/history/motion-change cancellation, final focus/hash and header clearance. Static/reduced/no-JS use native anchors. Manual scroll, camera/story, model and registration unchanged.
- Verification:12 tests, Astro0/0/0, production build/diff pass. Mobile/desktop actual clicks for all3 links measured3.10–3.38s,2.03–2.30x native1.46/1.52s references; correct destinations/focus/80px clearance. Wheel cancels; reduced/no-JS pass. Evidence/script: `uat/glhc003/slow-scroll/`, `slow-scroll.mjs`. Bootstrap3.48/1.48kB gzip, scene unchanged. Existing Vite/capture/device limits remain.
- Live state: no merge/deployment. Known issues: existing physical-device/launch acceptance remains open; unrelated untracked sources preserved.
- Next action: organizer reviews slower section jumps in draft PR#2. Commit: this published handoff.

### 2026-10-22 — Four sections, two challenge rounds and shorter science scroll
- Task: GLHC-003 organizer narrative refinement. Status: done, organizer review pending.
- Sync: fetched main908c22f with PR#2 merged, fast-forwarded baseline and branched `codex/challenge-rounds`. Unrelated untracked user sources preserved.
- Changed homepage/CSS:1/4–4/4 labels, combined challenge/How It Works with supplied two-round copy and emphasized conclusion; mobile Round One/collage/Round Two order, desktop collage beside Round One. Hero button now targets section4, existing3.2s easing retained. Old how-it-works fragment remains a compatibility anchor. Registration unnumbered.
- Science reveal travel now48svh vs90 (about47% less),64 vs125 in short landscape. Camera stays parked, reading holds and reverse preserved; exact science paragraphs/prototype/model/water unchanged.
- Verification:12 tests, Astro0/0/0, production build/diff pass. Five-size production checks plus reduced/no-JS: actual button destination/focus/header clearance, labels, mobile order, forward/reverse panel states, no overflow/page errors. Mobile/desktop screenshot review. Evidence/script: `uat/glhc003/challenge-rounds/`, `challenge-rounds.mjs`. Initial float midpoint test needed tolerance; initial preview was not running, started it and matrix passed. Scene619.26/160.46kB; bootstrap3.48/1.48, existing Vite/capture/device limits remain.
- Live state: source PR#2 merge verified, no deployment performed/verified; this follow-up unmerged. Known issues: external physical-device/launch acceptance remains open.
- Next action: organizer reviews the new follow-up PR. Commit: this published handoff.

### 2026-10-22 — Simplified round headings
- Task: organizer section4 annotation. Status: done, organizer review pending.
- Changed: single small accessible “4/4: How it works” heading; removed repeated large title and How It Works kicker. Titles use Round 1 - Submit Your Idea / Round 2 - Bring Your Idea to Life; subtitles retain only Open To Everyone / Build & Showcase. Body, collage order, links, scene and timing unchanged.
- Verification:12 tests, Astro0/0/0, production build/diff pass. Mobile393x852 and desktop1440x900 exact text/label-size/no-overflow/no-page-error checks and screenshot review pass. Evidence/script: `uat/glhc003/round-heading-review/`, `round-heading-review.mjs`. Existing Vite/capture/device limits remain.
- Live state: no merge/deployment. Next action: organizer reviews updated PR#3. Commit: this published handoff.

### 2026-10-22 — Constant-radius smoothed camera orbit
- Task: remove in/out bumps during uneven orbit scrolling. Status: done, organizer review pending.
- Cause: Cartesian interpolation between rotated positions cut chords across the circle; look target moved immediately ahead of the camera. Changed integrated camera to damp base camera/target and angular progress together before rotation, with no post-rotation Cartesian lerp. Prototype retains its old camera branch; approved settled framing/model/waves/prose/navigation remain unchanged.
- Verification:15 tests, Astro0/0/0, production build/diff pass. Regressions cover abrupt/reverse input, radius/framing distance,30/60/120Hz invariance, exact settled endpoint and synchronized descent. Four-size browser checks with64 transient samples each show radius variation at most0.00001, endpoint within0.01, original underwater camera/look positions and no page errors. Evidence/script: `orbit-smoothing-final/`, `orbit-smoothing.mjs`. Supplied25.57s recording reviewed via frame extraction; generated reference/partial captures removed. Initial fixed-delay/literal-angle harness replaced by bounded endpoint wait, final matrix passed.
- Scene619.82/160.69kB gzip (+.56/.23), bootstrap unchanged. Existing Vite/capture/device limits remain; no physical-FPS claim.
- Live state: no merge/deployment. Next action: organizer reviews orbit fix in PR#3. Commit: this published handoff.

### 2026-10-22 — Six-second fading invitation preloader
- Task: organizer final intro request. Status: done, organizer review pending.
- Added full-screen exact invitation fading in1.1s, parent overlay/text fading out together.7s after6s timer. Scene starts concurrently. Independent inline dismissal restores inert/scroll state even with blocked bootstrap/delayed model; reduced motion has no fades, actual no-JS skips overlay. Explicit organizer timing supersedes prior no-intro-gate boundary.
- Verification:15 tests, Astro0/0/0, production build/diff pass. Four-size browser intro/readability/background readiness/timing/cleanup/no-overflow/no-page-error checks and mobile post-intro navigation pass. Reduced, no-JS, blocked bootstrap,8s-delayed model pass; blocked/slow scenes do not delay dismissal. Evidence/script: `uat/glhc003/preloader/`, `preloader.mjs`. Hold6.01–6.43s, cleanup.70–1.22s under software-renderer callback load; configured CSS fades1.1s/.7s. Scene/bootstrap sizes unchanged, existing Vite/device limits remain.
- Live state: no merge/deployment. Next action: organizer reviews preloader in PR#3. Commit: this published handoff.

### 2026-10-23 — Tourist-attractions hero callout and plural cash prizes
- Task: organizer hero/prize refinement. Status: done, organizer review pending.
- Sync: PR#3 merged on main386060d; fast-forwarded and branched `codex/hero-cash-prize`. Preserved unrelated untracked sources.
- Changed: yellow bottom-right rectangle on hero photo with exact two-line tourist-attractions wording/arrow. Container-scaled to photo, static display text. Replaced all live fixed-dollar references with CASH Prizes after organizer plural clarification; metadata, accessible caption, badge and registration updated, no single-winning-team implication. Historical evidence remains unchanged.
- Verification:15 tests, Astro0/0/0, production build/diff pass. Six sizes320x568,375x667,393x852,768x1024,1440x900,667x375: exact copy, both lines fit, rectangle within photo, hero fits, no overflow/page errors. Mobile/desktop visual review confirms no faces covered. Initial compact line fit adjusted, final matrix passed. Evidence/script: `uat/glhc003/hero-cash-prizes/`, `hero-cash-prize.mjs`. Bundles unchanged; existing Vite/capture/device limits remain.
- Live state: main source merge observed, no production deployment performed/verified. Next action: organizer reviews new follow-up PR. Commit: this published handoff.

### 2026-10-23 — Attend the info session CTA labels
- Task: rename registration buttons. Status: done, organizer review pending.
- Sync: PR#4 merged as595f8c0; started `codex/info-session-cta`. Both header/ending buttons now read Attend the info session; neutral new-tab note, same central Luma URL/security/configuration. No event details invented.
- Verification:15 tests, Astro0/0/0, build/diff pass.320x568,393x852,1440x900 exact labels/URL/security/no-clipping/no-overflow/page-error checks pass; mobile header visually reviewed. Evidence/script: `uat/glhc003/info-session-cta/`, `info-session-cta.mjs`. Existing Vite/device limits remain, runtime unchanged.
- Live state: source merge observed; no deployment. Next action: organizer reviews new follow-up PR. Commit: this published handoff.

### 2026-10-23 — Hero submission opening/closing dates
- Task: add organizer dates below hero description. Status: done, organizer review pending.
- Sync: PR#5 merged as692dcfe; started `codex/submission-dates`. Exact two-line Nov5/Dec3 wording supplied by organizer; no year/time inferred. Grouped dates with description, adapted compact photo/spacing to retain hero fit. Existing CTAs/preloader/camera unchanged.
- Verification:15 tests, Astro0/0/0, build/diff pass. Seven viewport sizes320x568 through1440x900 plus short landscape: exact text/placement/full hero fit/no overflow/page errors. Mobile screenshot reviewed. Evidence/script: `uat/glhc003/submission-dates/`, `submission-dates.mjs`. Runtime bundles unchanged, existing Vite/device limits remain.
- Live state: source merge observed; no deployment. Next action: organizer reviews new follow-up PR. Commit: this published handoff.

### 2026-10-23 — Uppercase submission status words
- Task: capitalize OPEN/CLOSE. Status: done. Updated live date lines and verification expectations/current context; dates/layout unchanged.
- Verification: production build/diff pass; static browser exact-text/no-clipping checks at320/393/1440px pass (`uat/glhc003/submission-dates/capitalization-results.json`). Prior screenshots predate casing change. No merge/deployment.
- Next action: organizer reviews updated PR#6. Commit: this published handoff.


### 2026-10-25 — GLHC-004 promo opening prototype
- Task: organizer-authorized 10–15s opening inspired by supplied explainer. Status: rendered; organizer review pending.
- Synced main55a9194, fast-forwarded checkout, branched codex/promo-prototype. Unrelated untracked sources preserved. NOW reprioritized; website handoff preserved in promo/WEBSITE-HANDOFF.md.
- Isolated Remotion/React project with lockfile, Google Sans/OFL, public-domain Natural Earth lake outlines. Original editable SVG, typography and navy/yellow/aqua palette. Illustrations are conceptual. Official name Great Lakes Hackathon Challenge; full promo will state top winners' designs WILL be displayed at tourist attractions.
- Verification: rendered and decoded450/450 frames,1920×1080/30FPS/15s. Eight representative initial frames inspected, lake framing/island fill corrected and corrected opening inspected. Website tests15/15, diff check passes; website implementation unchanged.
- Remotion Studio loaded in IAB. Custom review-page UAT unverified after two localhost connection failures; hypotheses Python-server/firewall or IAB routing. MP4 delivered directly. Audio intentionally absent. Browser download/render required elevated execution after sandbox DNS/launch failures.
- No deployment/infrastructure changes. Output local/ignored, reproducible via README. Next: organizer reviews graphics/pacing before full promo.


### 2026-10-25 — GLHC-004 full silent promo
- Task: extend organizer-approved opening into the complete promo. Status: done as silent draft; organizer review pending.
- Synced origin/main55a9194 (unchanged), continued codex/promo-prototype. Split approved opening into reusable component; FullPromo adds eight scenes for student invitation, Round1 idea-only entry, ten selections, supported Round2, build/test/showcase, cash prizes, guaranteed tourist-attraction displays for top winners and supplied submission CTA.75s/2250frames/1080p30. No website implementation edits.
- Content: official Great Lakes Hackathon Challenge, RAEON organizer, no award/funding amounts; dates Nov5-Dec3,2026, Dec3 11:59PM Eastern deadline and raeonhacks.com/project directly from pasted organizer brief. No live portal verification asserted. Conceptual graphics, no fabricated readings or prior-participant claims.
- Verification: initial full render inspected at12 representative times; full-resolution closing card and corrected trophy still checked. Corrected export rendered2250/2250 and every frame decoded successfully. Five approved-opening samples have exactly zero decoded pixel difference in initial/final full exports. Eight new scene intervals cover450-2249 without gaps/overlap; package/lock consistency and git diff check pass. Evidence and repeatable decoder/contact-sheet helper in promo/.
- Removed unintended local parent-package dependency from isolated promo manifest/lock. README, visual script and local review page updated. Audio intentionally absent; timing editable. No new browser playback/UAT or production deployment claim. Previous localhost preview limitations retained; MP4 delivered directly.
- Next action: organizer reviews full silent draft, then supplies audio for timing/sound pass. Commit: published branch handoff.


### 2026-10-26 - GLHC-004 Section2 comparative motion studies
- Task: build both animated concepts and actual-photo approaches for Section2. Status: both rendered/verified; organizer comparison pending.
- Synced main55a9194 unchanged; continued codex/promo-prototype. Organizer's new direction supersedes earlier style approval: no repeated editorial layouts or small slogans; discuss/build section by section. Agreed Section1 lake/buoy/sensor/signal remains unimplemented.
- A: Three.js real geometry, illuminated rods, water/speaker station, hinged shells, continuous camera travel, signal trail, transition to paper trace. Original conceptual objects, no exact reconstruction or scientific-reading claim.
- B: original extracted +POOL Light, Ripple Effect and CLAMS photographs from supplied deck. Pan/zoom, ripple/ellipse reveals and linked trace. No claimed real motion in source stills, no prior entrant implication. Source/credits and public-use rights boundary in SECTION2-STUDIES.md; deck untouched.
- Verification: both360/360-frame renders completed; every frame decoded,12s1920x1080/30FPS. Full-resolution3D still and six representative moments per version inspected, including transitions and common sketch ending. Evidence versioned under promo/evidence/. Manifest/lock consistency verified. No audio/browser-playback/deployment claims.
- Added pinned three0.180.0 only inside promo. Older compositions preserved; website implementation unchanged, unrelated sources preserved. Next: organizer chooses A/B/blend before Section3. Commit: published branch handoff.


### 2026-10-26 - Selected A: expressive Great Lakes LED display
- Task: replace third shell installation in selected A with animated LED screen. Status: rendered/verified; organizer review pending.
- Synced main55a9194 unchanged; continued codex/promo-prototype. Retained first two installations/continuous camera; replaced shell geometry with freestanding display, geographic Great Lakes mask and original animated shader of currents/ribbons/color, with final camera push. No numerical dashboard/headings. B remains historical and unchanged.
- Intent: express water quality through engaging environmental art. Shader colors/movement remain conceptual, with no actual readings or validated safety classification. Proposed third voiceover beat now bring the Great Lakes to life through animation.
- Verification: revised A rendered360/360; decoded all360 frames,12s1920x1080/30FPS. Full-resolution frame295 and six-point final contact sheet inspected; diff check passes. Evidence section2-led-review.jpg/section2-led-verification.json. MP4 local at promo/out/section2-a-led-display.mp4. No audio/browser playback/deployment claims.
- No website/dependency changes. Next action: organizer reviews revised A before Section3. Commit: published branch handoff.


### 2026-10-26 - LED screen invitation: BE CREATIVE
- Task: animate BE CREATIVE inside the display and align proposed narration to light/sound/digital display invitation. Status: rendered/verified; organizer review pending.
- Synced main55a9194 unchanged. Replaced geographic lake mask with frame-deterministic canvas letter animation mapped into the3D LED screen. Staggered upward reveal, moving illuminated color, same camera/screen/first two installations. No added film overlay text. Proposed narration recorded in SECTION2-STUDIES.md; audio remains later.
- Verification:360/360 rendered and every frame decoded,12s1920x1080/30FPS. Full-resolution frame310 and six representative moments inspected for reveal/readability/perspective. Diff check passes. Evidence section2-be-creative-review.jpg and section2-be-creative-verification.json. Local MP4 section2-a-be-creative.mp4. No audio sync/browser playback/deployment claim.
- Website/dependencies unchanged. Next action: organizer reviews then Section3 discussion. Commit: published branch handoff.


### 2026-10-26 - Section3 self-drawing invitation prototype
- Task: build agreed self-drawing sketch direction. Status: rendered/verified; organizer review pending.
- Synced main55a9194 unchanged, continued promo branch. Organizer accepted Section2 as prototype only, requested smoother/richer final animation. Added isolated10s Section3 composition; matching warm-paper/curve handoff, animated original SVG light/sound/screen sketches and traveling camera, supplied full-composition lab photo, return to unfinished YOUR IDEA page. No persistent editorial headers/captions.
- Verification:300/300 rendered, every frame decoded,10s1920x1080/30FPS. Six representative stages inspected; photo copied byte-identically from public/assets/team-lab.webp and full image preserved. Evidence section3-review.jpg/section3-verification.json. Render compilation and diff check pass. Audio timing provisional, no browser playback/deployment claim.
- Added source/credits/proposed narration in SECTION3-STUDY.md. No website/dependency changes. Section1 remains unimplemented. Next: organizer reviews Section3, then Round1 discussion. Commit: published branch handoff.


### 2026-10-27 — In-person / virtual info session modal
- Organizer asked for both “Attend the info session” CTAs to open a styled modal with an in-person option at University of Windsor (`https://luma.com/pz0iw2m7`) and a virtual option (`https://luma.com/zrbvt2az`).
- Implemented shared native dialog, Escape/backdrop/close behavior, return-focus, accessible headings, matching GLHC dark navy/yellow styling, and both options as secure new-tab Luma links. With JS disabled or no dialog support, CTA anchors go to a visible choice section.
- Updated centralized public configuration and added a source contract test. GitHub-only static verification was performed; no local browser UAT or full Astro build is claimed.
- No hosting configuration or production deployment was modified.


### 2026-10-29 - Ashley audio and rough first-scene blocking
- Task: use supplied recording; organizer explicitly narrowed next work to rough first scene, high quality only after agreement. Status: rendered/verified; organizer shot/timing review pending. Ending deferred unchanged.
- Synced main8b4e7d9. Deliberately merged reviewed website info-session chooser into promo branch. NOW/LOG context conflicts resolved preserving promo handoff plus upstream append-only log; previous NOW saved in promo/PREVIOUS-HANDOFF.md. No additional website edits.17/17 repository tests pass.
- Source Ashley MP3 copied unchanged into ignored public/audio/. Local faster-whisper base.en timestamps: full68.5976s; opening spoken0-12.78s; next science starts13.52s. Local tool/model downloads only, audio not uploaded. PyAV19 decoder incompatibility resolved by decoding FFmpeg PCM into array; no system-package edits. Automatic transcript evidence and sourceSHA recorded; no manual listening claim.
- Added original rough3D boat/crane/glider, reviewed byte-identical buoy GLB and isolated adaptation of existing water/sky shaders. Deployment, underwater travel near buoy (no docking), rise/title10.5s; CASH PRIZES beat4.54s.13.5s405frames1080p30 with supplied audio. No full-film rebuild or ending edits.
- Verification:405/405 rendered and decoded. Full-resolution deployment/underwater/title frames and six export moments inspected. Audio decoded13.5s, source-prefix correlation0.984 after42.7ms codec-delay compensation (<2frames); zero-lag comparison initially failed, delay isolated by waveform cross-correlation. Diff check passes. Evidence opening-rough-review.jpg/opening-rough-verification.json and ashley-timing.json. No browser playback/deployment claim.
- Latest narrative/CTA raeonhacks.ca supersedes older video .com/project copy. Sketch now belongs with Round1; previous sections remain study assets. Rough geometry/material/water/camera/effects still need high-quality pass after approval.
- Next action: organizer reviews first-scene shot/timing path. Commit: published branch handoff.


### 2026-10-29 - Distant launch, underwater weave and camera-only surface fly-in
- Task: organizer correction to rough opening spatial story. Status: rendered/verified; organizer review pending.
- Confirmed interrupted prior commit/push had completed as a22062b; current main8b4e7d9 unchanged. Boat moved14 to70 scene units from fixed buoy; glider launches at-67 and remains43+ units away while weaving laterally/vertically. Camera follows underwater, surfaces at8.733s about45.76 units from buoy, then pans/flys into surface hero view. Buoy transform fixed; no underwater sensor view. Existing405-frame narration/ending unchanged.
- Added pure rough-opening-path.mjs and meaningful geometric check: conservative sensor bounding box excluded from camera frustum at every underwater frame; minimum underwater camera distance46.04. Geometry remains loaded, not deleted/hidden. Water occludes sensors after surfacing.
- Verification:405/405 render/decode,13.5s1920x1080/30FPS. Full-resolution surfaced/distant-buoy frame279 and nine export moments inspected, including transition. Decoded narration waveform matches previous opening1.0 correlation; AAC padding unchanged. Diff check passes. Evidence opening-flight-path.json, opening-distant-buoy-review.jpg and opening-distant-buoy-verification.json.
- Local review output opening-rough-distant-buoy.mp4; prior rough retained. No new website/dependency/deployment changes, no manual audio listening/browser-playback claim. High-quality build remains after organizer approval. Next: review revised spatial blocking. Commit: published branch handoff.


### 2026-10-29 - Rough science continuation
- Organizer accepted distant opening as rough blocking and requested next section. Added RoughScience:273 frames/9.1s, continuous surface camera into original sensor cage, slight orbit, symbolic data pulse and studio-navy fade. Opening path unchanged; final polish/ending deferred. No fabricated readings.
- Verification:273/273 frames rendered/decoded1920x1080/30FPS; six export moments visually inspected. Original Ashley audio slice13.5-22.6s matches at0.987 correlation after42.6875ms AAC delay compensation. Diff check passed. Evidence science-rough-review.jpg/science-rough-verification.json. No manual listening/browser playback/deployment claim.
- Published implementation8481341 on promo branch. Initial context update encountered Windows default text decoding; completed TASKS/LOG with explicit UTF-8 in this follow-up. Next: organizer reviews descent/sensor/pulse staging before creative sequence.


### 2026-10-29 - Matching buoy/sensor callouts
- Task: organizer requested two highlighting dots and thin leaders matching the third transition dot. Added projected anchors on buoy body and sensor cluster, aqua pulsing rings, animated1.5px leaders and concise labels Water-quality buoy / Sensors. Callouts fade during departure; existing third pulse, camera path and narration unchanged. Shifted buoy label into open water after visual review.
- Verification:273/273 exported frames decoded,9.1s1920x1080/30FPS; six representative moments inspected. Decoded audio correlation1.0 against accepted science rough. Evidence science-callouts-review.jpg/science-callouts-verification.json. Diff check passes after whitespace cleanup. Output science-rough-callouts.mp4. No final polish, manual audio listening, browser playback or deployment claim.
- Initial edit invocation used the wrong relative directory and made no changes; reran at repository root. Rendering required normal approved browser execution. Next: organizer reviews callout placement/timing. Commit: published promo branch handoff.


### 2026-10-29 - Section3 creative-installation rough
- Organizer accepted science callouts as rough and requested next section. Reused selected light rods, sound bowl and BE CREATIVE LED; added matching aqua dot/rings, light growth, Ashley source slice22.6-31.1667s and paper/sketch bridge. Export257frames/8.5667s. Earlier silent12s concept retained; no website/ending changes. Final seamless transition and production polish deferred.
- Verification: initial and final revisions257/257 decoded1920x1080/30FPS; six final export moments inspected. Light hold adjusted after first render to match spoken cue. Initial export audio slice correlation0.989 with codec-delay compensation; audio trim unchanged in timing-only revision. Diff check passed. Evidence creative-rough-review.jpg/creative-rough-verification.json. No manual listening, browser playback or deployment claim.
- Next: organizer reviews section3 timing/staging before Round1 sketch rough. Commit: published promo branch handoff.


### 2026-10-29 - Three landscaped waterfront moments
- Organizer requested rough passes for light/sound/display in landscaped waterfront and explicitly removed visitors. Added conceptual lake horizon, sand strip, promenade, planted beds, benches and edge trees around existing installations. Wider three-shot framing and subtle camera movement; no people. RoughWaterfront starts on can experience24.10s and ends31.1667s,212 frames. Earlier studio rough retained. Science extension22.6-24.1s remains future assembly work.
- Verification:212/212 frames render/decode1920x1080/30FPS; six final export moments inspected. Tree obscuring screen in initial render moved to site edge. Source audio correlation0.9878 after42.6875ms AAC delay. Three silent slowed excerpts decoded90/89/92 frames. Evidence waterfront-review.jpg/waterfront-verification.json; diff check passed. No manual listening/browser playback/deployment claim.
- Initial module import required explicit .js extension; corrected. Initial slowed excerpt was truncated by output duration; corrected using trim before timestamp stretch. No changes to supplied recording/website/ending. Final continuous transition and material/camera polish remain deferred.
- Outputs section3-waterfront-rough.mp4 and waterfront-{light,sound,display}-study.mp4. Next: organizer reviews the three scenic moments. Commit: published promo branch handoff.


### 2026-10-29 - Spaced waterfront terrace and stationary LED tubes
- Organizer approved foreground partial walkway, green seating strip, expanded paved installation area then lake; requested build plus earlier spacing/light/stand changes. Created grouped installations48 units apart on terrace z-8, wider scenic framing with one featured design. Benches/planted beds moved to green strip; sound design retained. Varied-height tubes remain fixed and green then yellow bands travel within their surfaces. Screen uses central substantial column and rectangular base following supplied image. No visitors; source24.1s entrance unchanged.
- First render reviewed; adjusted camera/strip widths to restore partial foreground walkway and corrected colour clock to green first. Final212/212 frames rendered/decoded,7.0667s1920x1080/30FPS; six final moments inspected. Source narration correlation1.0 to previous waterfront export.303 camera samples exclude conservative neighbour installation boxes, zero intersections. Diff check passed. Evidence waterfront-spaced-review.jpg/waterfront-spaced-verification.json. No manual listening/browser playback/deployment claim.
- Output section3-waterfront-spaced.mp4. Earlier studies retained historical. Science22.6-24.1s extension and final transitions/polish remain future assembly work; website/ending untouched. Next: organizer reviews revised section3 before Round1. Commit: published promo branch handoff.


### 2026-10-29 - Continuous waterfront pan and terrace/path distinction
- Organizer requested terrace without lines,25% narrower; patterned foreground pavement with more width; continuous moving camera rather than separate shots. Terrace depth12->9, foreground path4->5, staggered brick joints only on path. Green seating band retained. Added pure waterfront-motion.mjs with narration-timed quintic lateral pans0->48->96 and continuous camera/dot positions. Water/sound clocks now continuous across former shot boundaries. Previous designs/recording/ending unchanged.
- Verification:212/212 render/decode1920x1080/30FPS,7.0667s; nine final moments inspected including transitional scenery and unobstructed holds. Audio correlation1.0 to previous export.212 camera-frame samples monotonic; epsilon continuity checks at45/69/83/105 boundaries pass, maximum centre step4.068 units/frame. Evidence waterfront-pan-review.jpg/waterfront-pan-verification.json/waterfront-pan-motion.json. Diff check passed. No manual listening/browser playback/deployment claim.
- Rough pans remain fast within supplied narration. Output section3-waterfront-pan.mp4; earlier exports historical. Science22.6-24.1s extension remains assembly task. Next: organizer reviews pan/layout before Round1 or final polish. Commit: published promo branch handoff.


### 2026-10-29 - Round1 sketch-to-submission rough
- Organizer accepted waterfront rough and requested next section. Added395-frame Round1 using unchanged Ashley31.1667-44.3333s. Paper-line handoff becomes sketch page; light/sound/current central-column screen drawings, December3 calendar, JUST AN IDEA physical stamp, solo/team pencils and page into envelope/aqua seal for Round2. Reused sketch primitives; historical study retained. No website/ending/full-film assembly edits.
- First render reviewed; separated sketches, delayed team pencils to narration, aligned shrinking page with envelope. Final395/395 frames decoded1920x1080/30FPS,13.1667s; six final moments inspected. Source-slice audio correlation0.999961, alignment delay42.6875ms. Diff check passed. Evidence round1-rough-review.jpg/round1-rough-verification.json. No manual listening/browser playback/deployment claim.
- Output round1-sketch-rough.mp4. Final polish/continuous assembly and science extension remain deferred; supplied ending unchanged. Next: organizer reviews Round1 before Round2 rough. Commit: published promo branch handoff.


### 2026-10-29 - Slower light-only Round1 sketch and submission labels
- Organizer requested light sculpture drawing only, slower, no pencils; replace stamp with Just submit your idea, deadline caption above calendar, opening Nov5th at left. Removed all pencil nodes/helper and other sketch drawings from RoughRoundOne. Enlarged light drawing, quarter-rate progress spans most of395-frame clip. Added exact requested labels; envelope and source narration retained. Other compositions unchanged.
- Verification:395/395 rendered/decoded1920x1080/30FPS,13.1667s; six final moments inspected including gradual strokes and both date labels. Audio correlation1.0 to previous Round1 export; diff check passed. Evidence round1-light-review.jpg/round1-light-verification.json. No manual listening/browser playback/deployment claim.
- Output round1-light-sketch-rough.mp4. Previous export historical. Next: organizer reviews simplified Round1 before Round2. Commit: published promo branch handoff.


### 2026-10-29 - Round2 resources, building and showcase rough
- Organizer accepted simplified Round1 and requested next section. Added RoughRoundTwo437frames with unchanged Ashley44.3333-58.9s. Prior envelope fans into exactly ten proposals; representative light sketch receives coin/tool/support symbols, dissolves into waterfront as tubes assemble, tests with green/yellow pulses, showcases with CASH PRIZES marker and public-display scene. No invented funding amount, real location or visitors. Ending deferred unchanged.
- Shared installation scene adds opt-in roundTwo assembly/orbit mode; earlier composition defaults preserved. No website/deployment/full-film assembly changes.
- Verification:437/437 render/decode1920x1080/30FPS,14.5667s; nine final export moments inspected including10 selection, support, assembly, prize and waterfront. Source-slice correlation0.987576 after42.6875ms AAC delay. Diff check passed. Evidence round2-rough-review.jpg/round2-rough-verification.json. No manual listening/browser playback/deployment claim.
- Output round2-build-rough.mp4. Final polish/science extension remain later assembly work. Next: organizer reviews Round2 before deferred ending discussion. Commit: published promo branch handoff.
