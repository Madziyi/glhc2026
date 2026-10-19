# Active Initiative

**Initiative:** GLHC-002R — buoy material, waterline and framing visual-quality refinement.
**Status:** APPROVED / AWAITING CODEX SOL IMPLEMENTATION.
**Planning / review:** Terra. **Implementation, tests and browser UAT:** Codex Sol (delegate coding to Luna high if still part of local workflow).

## Verified baseline
- `feat/glhc-001-opening` previously at `1df064817cb0c376f87297262c736522a80e539b`: isolated `/prototype/glhc-002` created while root `/` remains the superseded GLHC-001 site.
- GLHC-002: 6/6 tests, Astro check clean, production build passed, four viewport browser checks, 22 screenshots; 76,776-byte compressed GLB / 5,108 model triangles / 10 scene draw calls / ~155 kB gzipped deferred scene JS.
- Visual review by Terra of organizer's screenshots: structure and scroll feasibility accepted; **visual design not accepted for integration**. Flat materials, bright linear waterline/broad bands, mobile sonde/text competition and unpolished in-between horizontal copy need refinement.
- No physical device performance, Lighthouse, GPU time, deploy or rights sign-off verified.

## Next action
Sol carries out GLHC-002R exactly per `docs/GLHC-002R-VISUAL-REFINEMENT.md`: detailed model/material preview, composited water optics polish, sensor camera / panel mask correction; then tests and new browser UAT. **Keep existing `/` intact and don't merge or deploy.**

## Pending unrelated inputs
- Organizer four-photo communication-examples collage (later GLHC-004).
- Verified Luma event URL (later GLHC-004).
- Public rights approval for RAEON photos/manufacturer references (before launch).
