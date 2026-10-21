# GLHC 2026 Task Board

## Active
- GLHC-003 `[approved; ready to implement]` — replace glider-led main page with complete approved student-first website using R6 3D buoy renderer. Four narrative content chapters plus deep-water registration ending. Full contract: `docs/GLHC-003-BUILD-SPEC.md`.
- GLHC-003A `[next coding slice]` — photo hero, animated **$500 Prize** anchored to picture top-right, no-experience/public-display copy, continuous entrance into surface buoy via reused R6 scene.
- GLHC-003B `[pending A]` — science/students: camera at underwater sensors, two paragraphs, exactly one horizontal prose transition.
- GLHC-003C `[pending B; inputs supplied]` — import the organizer-supplied single collage image (optimized WebPs provided in handoff ZIP), then How it works, deep-water no-buoy ending. Set every registration CTA to the supplied `https://luma.com/pz0iw2m7`, opening securely in a new tab. Verify actual navigation in browser.
- GLHC-003D `[pending C]` — complete UAT, accessibility, fallback, startup timing, physical-device tests if available; present screenshots/video for organizer sign-off.

## Accepted baseline
- GLHC-002R6 `[organizer visually accepted / merged via PR #1]` — procedural sunny lake, yellow buoy, blue solar panels and silver metalwork, 1.25× floating motion, geometric ripples, waterline and camera. Model stays unchanged. UAT `docs/GLHC-002R6-UAT.md`. Physical mobile performance not approved yet.
- GLHC-001 `[merged; superseded home page]` — existing `/` will be replaced during GLHC-003, not yet replaced.

## Deferred / launch checks
- External Luma CTA browser navigation test (URL now organizer-supplied and configured).
- Import the supplied collage WebP files into GitHub from the handoff ZIP (not yet in repo).
- Public photography rights clearance.
- Production deployment and real-device 10-second 3D readiness testing; security/dependency audit and Lighthouse.
- Any new water-engine work: deferred unless specifically requested.

## Excluded
Glider-led core story, invented scientific telemetry, multi-card interactive art simulator, fabricated event schedule/location, registration gating.
