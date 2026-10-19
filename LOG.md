# Project Log (append-only)

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
