# Active Initiative — GLHC-003

**Status:** COMPLETE IMPLEMENTATION / organizer review and merge approval pending.
**Branch:** `feat/glhc-003-storytelling`, based on organizer setup `0ae92345220313fa9132639d4d82f47a76c85aa5` and accepted R6 main merge `1524431`.

## Current experience
Root homepage contains the complete five-scene journey: invitation/photo → researchers and surface buoy → continuous waterline descent and parked sensor science → supplied collage and How It Works → buoy-free deep-water registration.

Latest organizer hero direction supersedes earlier invitation copy: “Great Lakes Hackathon Challenge” with yellow italic Challenge; exact art/science/technology and solo/team creative-project invitation; bold no-experience welcome. A yellow Register Now button occupies the header. Redundant labels/header brand/visible photo caption and old hero button are removed. The photo-corner prize shape spins with upright text; centered supplied animated scroll_down.svg reads “SCROLL FOR A COOL BREAKDOWN”. Higher-resolution organizer group photo retained.

Body and controls use locally hosted Google Sans (35,968-byte variable Latin WOFF2, weights 400–700, preload/swap and included OFL). Headings keep their separate editorial face. Motion preference is accessible in the footer and automatic OS reduced motion remains honored.

Both current registration CTAs (header/ending) use central `https://luma.com/pz0iw2m7`, work without JavaScript and passed actual secure new-tab browser clicks, with matching event title and no opener. No form submitted or logistics invented.

## Preserved technical contracts
- R6 GLB:181,648 bytes, blob `599c5f5585306c5542041f86118946ba979d8377`. Builder/waves/isolated timeline/page/styles unchanged; one renderer, original shaders/materials and 1.25× clock retained.
- Same physical buoy throughout crossing; parked camera and exactly one horizontal transition between two exact science paragraphs, with reading holds. Continuous reverse scroll, responsive chapter bounds and deeper final camera with no buoy.
- Readable no-JS/reduced/WebGL-failure/timeout alternatives, bounded Retry and generation-safe loading. Initial layout choice occurs before body parsing to preserve native refresh restoration.

## Verification and evidence
- Latest checks:11/11 tests, Astro zero errors/warnings/hints, successful telemetry-disabled production build and diff check.
- Initial complete four-size production UAT covers forward/reverse, keyboard skip, landscape/no overflow, motion toggle and registration. No application errors; narrow recorded four ReadPixels driver warnings.
- Final camera nine-state screenshots at all four sizes and paragraph-two refresh checks: `uat/glhc003/final/`, `final-stills-results.json`. Complete mobile/desktop videos exported. These precede the final hero/font follow-up.
- Latest hero and both science panels at320×650,390×844,768×1024,1440×900: `uat/glhc003/font-review/`. Google Sans actually loaded; no overflow/page errors. Current two-CTA results: `registration-results.json`.
- No-JS, OS reduced motion, forced/blocked WebGL and delayed-model timeout/retry passed; isolated prototype initializes. Exact evidence boundaries and capture failures: `docs/GLHC-003-UAT.md`.
- Scene618.66kB/160.26kB gzip; bootstrap2.06/.93 plus helper1.11/.65. Surface/sensors11draws/44,916triangles; final registration2draws/32,992triangles. Existing Vite warning remains.

## Release boundary
No main merge or production deployment. Physical iOS/Android, representative mobile-network10-second readiness and sustained60FPS remain unverified. Screenshot/final-video capture uses a test-only4FPS cadence cap on SwiftShader; initial unmodified-loop local timings are separately recorded and are not device acceptance. Publication rights remain a launch check. Untracked source ZIP/original collage and desktop-surface.jpg are preserved.

## One next action
Organizer reviews the draft PR and latest hero/complete-story evidence, then requests revisions or approves merge and real-device/launch checks.

Latest surface editorial refinement: researcher photo is doubled in size and
placed lower-right using section-owned normal flow. It enters that position as
the section arrives, then moves upward with native scroll. Four-size before/after
scroll evidence: `uat/glhc003/surface-photo/`. No scene/camera changes.
