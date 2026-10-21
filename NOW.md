# Active Initiative — GLHC-003

**Status:** GLHC-003 FULL WEBSITE INTEGRATION — READY FOR IMPLEMENTATION on `feat/glhc-003-storytelling`.

## Baseline verified
- Organizer visually approved GLHC-002R6 buoy, procedural lake, ripple effects and waterline as good enough to proceed.
- PR #1 from `feat/glhc-001-opening` merged to `main` as merge commit `1524431cc33723bfeb063ac96fededfb77f575dc` on 2026-10-20.
- R6 reported 9 passing tests, zero Astro check errors/warnings/hints, passing production build, 11 draws / 44,916 triangles; responsive screenshot matrix and fixed-camera recordings saved. Physical mobile and 10-second readiness remain **unverified**.
- The current `/` still shows the **old glider-led GLHC-001 development homepage**. The approved buoy story remains separately at `/prototype/glhc-002`. Merging did NOT integrate the new experience or deploy a site.

## One next task
Implement `docs/GLHC-003-BUILD-SPEC.md` in vertical slices, replacing main-page narrative on the new feature branch while preserving the isolated R6 prototype. Product direction is approved; focus on the whole site, not water-only iteration. Return screenshots, recordings where possible, test/bundle/performance outcomes for organizer review.

## Content assets now supplied (2026-10-20)
- Organizer supplied a **single composite water-quality communication collage** (night waterfront light visualization, open-hardware controller, purple LED panel), mounted in the coordinating ChatGPT conversation as `collage.jpg`. Two optimized responsive WebP variants are prepared in a handoff ZIP to be imported by Codex into `public/assets/`; the binaries are **not yet committed to GitHub**.
- Organizer supplied Luma registration URL exactly as `https://luma.com/pz0iw2m7`. It is now set in `public/site-config.js` on the GLHC-003 branch. The registration destination comes directly from the organizer; its event details/current registration state were not independently verified.
- GLHC-003 must use this collage as **one image** (not a carousel or generated replacement), with descriptive alt text. The source composite has three visually distinct regions despite earlier informal wording “four-photo collage”; do not fabricate a fourth.
- Remaining release blockers: image/publication rights and physical iOS/Android performance with representative mobile network.

## Next action
Codex imports `GLHC-003-collage-assets.zip` from the coordinating thread, verifies files at `public/assets/glhc-communication-collage-{640,1080}.webp`, builds the approved five-scene story and tests that every Register Now CTA opens the exact supplied Luma URL securely. Do not invent date, venue, schedule or event status from the supplied URL.
