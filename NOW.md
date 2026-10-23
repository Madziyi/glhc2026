# Active Initiative — GLHC-003

**Status:** COMPLETE IMPLEMENTATION / organizer review and merge approval pending.
**Branch:** `codex/challenge-rounds`, based on GitHub main `908c22f` (PR#2 merged).

## Current experience
Root homepage contains the invitation/photo, four numbered story sections and unnumbered buoy-free registration. Sections1–3 cover surface, crossing and parked science; section4 has just the label “4/4: How it works”, followed by “Round 1 - Submit Your Idea” / “Open To Everyone” and “Round 2 - Bring Your Idea to Life” / “Build & Showcase”. No large repeated challenge heading or extra How It Works kicker remains. Mobile order is Round One → inspiration collage → Round Two. Hero challenge link targets section4 (`#challenge`). The science reveal now requires about47% less vertical scrolling, retaining parked camera, reading holds and reverse behavior.

Latest organizer hero reference keeps “Great Lakes Hackathon Challenge” with yellow italic Challenge, solo/team paragraph, rounded photograph and two yellow pill links. “What’s this about?” targets `#surface` (1/4); “What’s the challenge?” now targets `#challenge` (4/4). Both links and the cue retain3.2-second cancellable easing. Static/reduced motion uses immediate native anchors; no-JS links work. Header Register Now, spinning prize with upright text, yellow scroll cue, existing fonts and high-resolution photo remain.

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
- Scene619.26kB/160.46kB gzip; bootstrap3.48/1.48 plus helper1.11/.65. Latest model surface11draws/45,080triangles; sensors12draws/45,272triangles (one new white-material batch). Final registration2draws/32,992triangles. Existing Vite warning remains.

## Release boundary
PR#2 source merge is verified; this follow-up is unmerged. No production deployment performed or verified. Physical iOS/Android, representative mobile-network10-second readiness and sustained60FPS remain unverified. Screenshot/final-video capture uses a test-only4FPS cadence cap on SwiftShader; initial unmodified-loop local timings are separately recorded and are not device acceptance. Publication rights remain a launch check. Untracked source ZIP/original collage and desktop-surface.jpg are preserved.

## One next action
Organizer reviews the combined two-round challenge and shorter science transition in the new follow-up PR, then requests revisions or approves merge.

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

Latest responsive follow-up: hero photograph, heading and spacing use viewport
height as well as width. Portrait space is distributed between content blocks,
with a small reserved cue area rather than a large empty bottom gap. Compact
landscape uses two columns and side-by-side links. All11 tested default-text
viewports fit the entire hero, both buttons and cue; enlarged content may grow
naturally. Evidence: `uat/glhc003/hero-balanced/` and final landscape-only
refinement in `hero-balanced-landscape/`; script `hero-responsive.mjs`.

Latest navigation timing:3.2-second eased hero button/cue jumps measured2.03–2.30x
prior native long-jump duration on mobile/desktop. Wheel interruption stops the
animation; correct80px target clearance, focus/hash and reduced/no-JS anchors pass.
Evidence/script: `uat/glhc003/slow-scroll/`, `slow-scroll.mjs`. Tests12/12,
Astro0/0/0, build passed; bootstrap3.48/1.48kB gzip, renderer unchanged.

Active organizer follow-up (2026-10-22): combine challenge/How It Works into one
4/4 section with supplied two-round copy; mobile inspiration follows Round One;
hero challenge link targets section4. Shorten science chapter and lateral-reveal
scroll while preserving parked camera, reading holds, reverse scroll and slow
3.2-second navigation. Verify responsive DOM order, navigation and panel travel.
PR#2 is now merged on GitHub main as908c22f; this pass starts from that source.

Latest four-section/two-round verification: five viewports320x650,393x852,
768x1024,1440x900,667x375 pass section4 jump/focus/80px clearance, numbering,
mobile Round One/image/Round Two order, shorter panel reveal and reverse return,
parked camera, no overflow/page exceptions. Reduced/no-JS paths pass. Reveal
travel is53% of prior distance (51% in short landscape). Evidence:
`uat/glhc003/challenge-rounds/`; tests12/12, Astro0/0/0, build/diff pass.

Current organizer follow-up: simplify section4 to the single label “4/4: How it
works”, remove repeated large heading/kicker, name headings “Round 1 - Submit
Your Idea” and “Round 2 - Bring Your Idea to Life”, retain only Open To Everyone
and Build & Showcase as subtitles. Preserve copy, layout order and navigation.

Heading simplification verified:12 tests, Astro0/0/0, production build/diff pass.
Mobile393x852 and desktop1440x900 show the single small section heading, exact
round labels/subtitles, no overflow/page errors. Evidence/script:
`uat/glhc003/round-heading-review/`, `round-heading-review.mjs`. PR#3 update.

Current follow-up: fix orbit zoom pumping under uneven/fast/reverse scrolling.
Investigate Cartesian damping across the circular path and unsynchronized look
orientation; smooth the base camera/target and angular progress before rotation,
then verify constant orbit radius and exact settled underwater orientation.

Latest orbit fix: camera/target base pose and angular progress now share temporal
smoothing before rotation, preventing circular-path chord shortcuts and aim
mismatch.15 tests pass, Astro0/0/0, build/diff pass. Four-size transient browser
checks include8 abrupt/reversing inputs and64 samples each; radius variation is
at most0.00001 model units, original endpoint returns within0.01, settled sensor
camera/look targets unchanged. Evidence: `uat/glhc003/orbit-smoothing-final/`.
Scene619.82/160.69kB gzip (+.56/.23), bootstrap unchanged3.48/1.48. Existing
Vite/software-renderer/device limits remain. No merge/deployment; PR#3 updated.
