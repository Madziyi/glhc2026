# Active Initiative

**Initiative:** GLHC-002R2 — cinematic water and environment refinement.
**Status:** IMPLEMENTATION COMPLETE / ORGANIZER VISUAL REVIEW PENDING.
**Planning / review:** Terra. **Implementation, tests and browser UAT:** Codex Sol (delegate coding to Luna high if still part of local workflow).

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

## Next action
Review the refreshed isolated prototype and the captured browser states for visual quality. Keep `/` intact; do not merge or integrate until the organizer approves.

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
