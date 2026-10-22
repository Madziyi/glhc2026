# Active Initiative — GLHC-003

**Status:** COMPLETE IMPLEMENTATION / organizer review and merge approval pending.
**Branch:** `feat/glhc-003-storytelling`, based on organizer setup `0ae92345220313fa9132639d4d82f47a76c85aa5` and accepted R6 main merge `1524431`.

## Current experience
Root homepage contains the complete five-scene journey: invitation/photo → researchers and surface buoy → continuous waterline descent and parked sensor science → supplied collage and How It Works → buoy-free deep-water registration.

Latest organizer hero reference supersedes earlier invitation copy: “Great Lakes Hackathon Challenge” with yellow italic Challenge; only the solo/team creative-project paragraph remains. The art/science/technology introduction and bold no-experience welcome are removed from the hero (the later welcome remains). The group photograph has rounded corners. Two yellow pill links, “What’s this about?” and “What’s the challenge?”, smoothly scroll to `#surface` (section01) and `#how-it-works` (“CURIOSITY IS YOUR STARTING POINT”). Native anchors remain functional without JavaScript; static/reduced motion scrolls immediately. A yellow Register Now button stays in the header. Prize shape spins with upright text; centered animated scroll_down.svg reads “SCROLL FOR A COOL BREAKDOWN” in yellow. Existing Google Sans/fonts and higher-resolution group photo retained.

Body and controls use locally hosted Google Sans (35,968-byte variable Latin WOFF2, weights 400–700, preload/swap and included OFL). Headings keep their separate editorial face. Motion preference is accessible in the footer and automatic OS reduced motion remains honored.

Both current registration CTAs (header/ending) use central `https://luma.com/pz0iw2m7`, work without JavaScript and passed actual secure new-tab browser clicks, with matching event title and no opener. No form submitted or logistics invented.

## Preserved technical contracts
- Organizer-authorized buoy-detail revision:188,892-byte GLB, blob `b6f46fcedddcd0f15d7007e724a3f764b61b93c1`. Builder adds side-panel grids and two cage probes (long white with black cap, short black), removes only the upper plate, and retains the lower plate. Both routes share the revised model. Waves/isolated timeline/page/styles unchanged; one renderer and 1.25× clock retained.
- Same physical buoy throughout crossing; parked camera and exactly one horizontal transition between two exact science paragraphs, with reading holds. Continuous reverse scroll, responsive chapter bounds and deeper final camera with no buoy.
- Readable no-JS/reduced/WebGL-failure/timeout alternatives, bounded Retry and generation-safe loading. Initial layout choice occurs before body parsing to preserve native refresh restoration.

## Verification and evidence
- Latest checks:12/12 tests, Astro zero errors/warnings/hints, successful telemetry-disabled production build and diff check.
- Initial complete four-size production UAT covers forward/reverse, keyboard skip, landscape/no overflow, motion toggle and registration. No application errors; narrow recorded four ReadPixels driver warnings.
- Final camera nine-state screenshots at all four sizes and paragraph-two refresh checks: `uat/glhc003/final/`, `final-stills-results.json`. Complete mobile/desktop videos exported. These precede the final hero/font follow-up.
- Latest hero and both science panels at320×650,390×844,768×1024,1440×900: `uat/glhc003/font-review/`. Google Sans actually loaded; no overflow/page errors. Current two-CTA results: `registration-results.json`.
- No-JS, OS reduced motion, forced/blocked WebGL and delayed-model timeout/retry passed; isolated prototype initializes. Exact evidence boundaries and capture failures: `docs/GLHC-003-UAT.md`.
- Scene619.26kB/160.46kB gzip; bootstrap2.06/.93 plus helper1.11/.65. Latest model surface11draws/45,080triangles; sensors12draws/45,272triangles (one new white-material batch). Final registration2draws/32,992triangles. Existing Vite warning remains.

## Release boundary
No main merge or production deployment. Physical iOS/Android, representative mobile-network10-second readiness and sustained60FPS remain unverified. Screenshot/final-video capture uses a test-only4FPS cadence cap on SwiftShader; initial unmodified-loop local timings are separately recorded and are not device acceptance. Publication rights remain a launch check. Untracked source ZIP/original collage and desktop-surface.jpg are preserved.

## One next action
Organizer reviews the draft PR and latest hero/complete-story evidence, then requests revisions or approves merge and real-device/launch checks.

Latest surface editorial refinement: researcher photo is doubled in size and
placed lower-right using section-owned normal flow. It enters that position as
the section arrives, then moves upward with native scroll. Four-size before/after
scroll evidence: `uat/glhc003/surface-photo/`. No scene/camera changes.

Latest transition refinement: one full scroll-driven camera orbit now eases around
the buoy as the surface chapter gives way to “A different perspective”. It finishes
and settles before the original waterline descent; approved submerged framing is
unchanged. Reverse scroll reverses the orbit; reduced motion stays static. Evidence:
`uat/glhc003/orbit/`. Checks:12 tests, Astro0/0/0, build passed; scene619.26/160.46kB.

Latest buoy-detail follow-up verified at320×650,390×844,768×1024,1440×900:
all three panels have matching grids, white/short black probes are separated
beside the blue probe, upper plate removed and lower plate retained. Camera
coordinates remain unchanged; no overflow/page exceptions. Evidence:
`uat/glhc003/buoy-details/`. Repeated generation is byte-identical;40 compressed
streams round-trip and no zero normals. Tests12/12, Astro0/0/0 and build pass.

Latest homepage reference: simplified hero, rounded photograph and two yellow
pill section links verified at320x650,390x844,768x1024,1440x900. Both native smooth
jumps arrive with the target heading visible beneath the header; no overflow or
page exceptions. No-JS and OS reduced motion links pass with immediate scrolling.
Evidence: `uat/glhc003/hero-navigation/`, `hero-navigation.mjs`. Tests12/12,
Astro0/0/0, production build/diff check passed. Renderer/model/fonts unchanged.
