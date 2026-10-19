# Active Initiative

**Initiative:** GLHC-002R — buoy material, waterline and framing visual-quality refinement.
**Status:** IMPLEMENTATION PASS COMMITTED / AWAITING ORGANIZER VISUAL REVIEW.
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
Organizer reviews the committed isolated prototype and requests any further visual iteration. Keep `/` intact and do not integrate until visual approval. Before treating GLHC-002R as fully accepted, capture the three required labeled stills and exact responsive browser screenshot matrix.

## Pending unrelated inputs
- Organizer four-photo communication-examples collage (later GLHC-004).
- Verified Luma event URL (later GLHC-004).
- Public rights approval for RAEON photos/manufacturer references (before launch).
