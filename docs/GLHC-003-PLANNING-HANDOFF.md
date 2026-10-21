# GLHC-003 — Full Website Storytelling Integration

Implementation update (2026-10-21): the complete homepage is implemented on the
feature branch. This document remains the original planning contract. Current
verification, evidence and release boundaries: [GLHC-003-UAT.md](GLHC-003-UAT.md).

Status: **APPROVED FOR IMPLEMENTATION**, after organizer accepted R6 and PR #1 merged into `main` (`1524431`). New work is on `feat/glhc-003-storytelling`.

Follow the detailed implementation and acceptance contract in **`docs/GLHC-003-BUILD-SPEC.md`**.

Approved order: student/group photograph over moving lake with photo-corner $500 Prize starburst and explicit winning-team clarification → buoy/scientists at surface → waterline and same buoy sensors, parked camera with exactly **two science paragraphs and one horizontal transition** → single organizer-supplied four-image inspiration collage and short How It Works → deep-water, buoy-free external Luma registration conclusion.

Organizer has now supplied a single collage image (`collage.jpg`) and exact registration destination `https://luma.com/pz0iw2m7`. Optimized asset ZIP is available in the coordinating thread for import to `public/assets/`; images are not yet committed. The configured Luma URL is organizer-supplied, but event details and current registration availability are not independently verified. Use a functioning secure CTA after browser checks, not an unavailable placeholder. Supplied photographs require public-release rights approval before launch.

The R6 GLB/renderer and isolated prototype are the baseline; no more water-engine exploration. Implement content-first HTML with lazy scene loading, 10-second mobile readiness target and full static fallback. Verify all widths and interactions. Do not merge or deploy GLHC-003 without organizer review.
