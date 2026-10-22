# GLHC-003 — integrated website / organizer UAT

Date: 2026-10-20/21. Branch: `feat/glhc-003-storytelling`.
Baseline: organizer setup `0ae92345220313fa9132639d4d82f47a76c85aa5`, including
main's accepted R6 merge `1524431`. No merge or production deployment performed.

## Delivered experience

The root homepage now contains the complete invitation → researchers/surface
buoy → waterline/sensor science → communication challenge/How It Works →
deep-water registration story. It replaces the glider-led opening.

- Full supplied lab-group photograph, no removed background or cropped faces;
  yellow **$500 Prize** burst attached to its upper-right corner and a nearby
  accessible winning-team qualification. Creative purpose, no-experience welcome, public-display
  possibility and registration are visible in the first viewport at all four sizes.
- One shared R6 scene, model, sky, water and 1.25× clock. Native vertical scroll
  determines physical camera location from chapter layout. Camera parks for both
  exact science paragraphs, with reading holds before and after their single
  horizontal transition. Reverse scrolling reverses that same transition.
- Supplied square collage is one intact responsive image, labeled as inspiration.
  Five editorial participation steps follow it. No cards/carousel/simulator or
  fabricated telemetry/event logistics were added.
- Registration continues below the equipment into open water. The model is omitted
  once the camera is well below it, including the mooring line; final registration
  reports `buoyVisible=false` and two environmental draws.
- Both current CTAs use `public/site-config.js`, read during Astro build and by the
  browser. Actual browser clicks reached `https://luma.com/pz0iw2m7`, title
  “Great Lakes Hackathon Challenge · Luma”, in a new tab with `window.opener=false`.
  No form submitted; current event dates, fees and availability are not asserted.
- Content-first HTML, no-JavaScript/static reading view, OS/user reduced motion,
  WebGL failure, 10-second fallback and Retry remain available. Initial layout is
  selected in the document head before body parsing, fixing native refresh scroll
  restoration that initially shifted a reader beyond the science chapter.

## Model and renderer preservation

GLB remains **181,648 bytes**, git blob
`599c5f5585306c5542041f86118946ba979d8377`. Builder, waves, isolated timeline,
prototype page and prototype styles are unchanged. Scene integration adds bounded
homepage camera/UI hooks, layout-bound caching and loading lifecycle safeguards.
No shader/material redesign or extra renderer is introduced. Original yellow and
underwater finishes, approved silver/blue upper finishes and ripples are retained.

## Automated verification

- `npm test`: **11/11 passed** (wave parity, original prototype timeline, integrated
  parked camera/one transition, monotonic continuous reversible descent, responsive
  bounds/overscroll and recruitment/registration contracts).
- `npm run check`: **0 errors, warnings or hints**.
- `$env:ASTRO_TELEMETRY_DISABLED='1'; npm run build`: **passed**.
- `git diff --check`: passed; Windows LF/CRLF notices are not whitespace failures.

Production output: homepage bootstrap **2.06 kB / 0.93 kB gzip**, shared preload
helper **1.11 / 0.65 kB**, deferred scene **618.66 / 160.26 kB**. The scene is
about **1.95 / 0.74 kB** above R6's 616.71 / 159.52 kB. Existing Vite >500 kB
chunk warning remains. No external fonts or old homepage runtime are loaded.
Steady surface/sensor renderer: **11 draws / 44,916 triangles**. Registration:
**2 draws / 32,992 triangles**. Supplied collage WebPs: **143,964 / 320,694 bytes**.

## Browser coverage and evidence

Local production preview: `http://127.0.0.1:4334`. Tested CSS viewports:
**320×650, 390×844, 768×1024, 1440×900**. The browser is Chromium/ANGLE Vulkan
**SwiftShader software rendering**, not physical mobile hardware.

Evidence is under `uat/glhc003/`:

| Files | Meaning |
| --- | --- |
| `final/{size}-{hero,surface,waterline,sensors-paragraph-1,paragraph-2,challenge,collage,how-it-works,registration}.png` | Complete camera composition matrix, all four sizes; precedes final hero/font follow-up. |
| `{size}-results.json` | Initial complete production interaction matrix: forward/reverse, first-Tab skip link, no overflow, landscape resize, motion toggle, registration popup, timings and console. Predates final camera framing and refresh fix. |
| `final-stills-results.json` | Final camera/panel/visibility states and refresh inside paragraph two; capture-only frame cadence cap. |
| `registration-results.json`, `luma-destination.png` | Current two secure CTA clicks; official destination. |
| `fallback-results.json`, `*-science.png`, `*-registration.png` | No-JS, initial OS reduced motion, forced/blocked WebGL and delayed-model timeout/retry. |
| `prototype-regression.json`, `prototype-regression.png` | Retained isolated reference initializes with its original camera behavior. |
| `mobile-walkthrough.webm`, `desktop-walkthrough.webm` | Complete earlier production walkthroughs, including reverse and resize; predate final camera framing. |
| `final/{mobile,desktop}-walkthrough.webm` | Final camera journey with native smooth scrolling, science pause and reverse; before hero/font follow-up. Capture cadence capped to reduce software-renderer load; not performance recordings. |

Final stills and final recordings use a **test-only 4 FPS requestAnimationFrame
cadence cap** in the capture browser. This does not alter shipped code. They
demonstrate layout/state and are not smoothness/FPS benchmarks. Earlier matrix
timing samples below use the normal unmodified animation loop.

The first dev preview could not fetch its deferred scene module, so UAT used the
production preview. An isolated dev-server diagnostic stalled at shell execution
and did not establish an application-specific cause. Production modules loaded.
An optional uncapped continuous recapture stalled during export and a later
overwrite returned Windows `UNKNOWN` file I/O. Completed recordings were preserved;
fresh final screenshots use a separate directory. Partial native-motion results
are retained separately and do not supersede final refresh checks.

## Local loading and performance observations

Initial complete matrix, fresh browser context per size, local unthrottled network:

| Viewport | First contentful paint | Scene ready | Frame interval median / p95 |
| --- | ---: | ---: | ---: |
| 320×650 | 164 ms | 649.7 ms | 99.9 / 100.0 ms |
| 390×844 | 196 ms | 792.7 ms | 116.7 / 133.4 ms |
| 768×1024 | 156 ms | 655.9 ms | 166.7 / 183.3 ms |
| 1440×900 | 200 ms | 776.4 ms | 233.3 / 266.6 ms |

Samples contain only 14–39 frame intervals; host load, software rendering and
capture overhead dominate. The narrow run recorded four Chromium ReadPixels GPU
stall warnings; the other initial matrix logs contain no warnings. All four have
zero page/application errors. Local startup is not representative mobile/network
evidence. Later capture-capped/reload readiness is separately recorded in JSON.

**Not established:** physical iOS/Android behavior, representative mid-range
mobile network readiness within ten seconds, sustained 60 FPS, GPU timings,
memory profile, Lighthouse/Web Vitals or public deployment. The 10-second fallback
is a usable-content safeguard, not proof of meeting the device performance target.

## Organizer handoff

Review the complete final compositions and story pacing. Before launch, confirm
publication rights for supplied photographs/inspiration examples and measure real
mobile performance. The work is a complete development-branch implementation for
organizer review; merge and production deployment remain unapproved.

Final fallback acceptance: actual no-JavaScript and initial OS-reduced contexts, forced and blocked WebGL, plus12-second delayed GLB all preserve both paragraphs, all registration links and zero horizontal overflow. Timeout enters static mode at10seconds; Retry recovers scene-ready. Prototype regression initializes successfully. Final automated pass after the early-layout restoration fix:11/11 tests and Astro0errors/0warnings/0hints.

## Organizer font follow-up — 2026-10-21

Body text and controls use locally hosted **Google Sans** (official variable Latin
WOFF2, weights400–700,35,968bytes), with `font-display: swap` and font preload.
Headings retain their separate editorial face. Font source/provenance and the
complete SIL Open Font License are in `public/fonts/google-sans/`.
No external font request is needed. The complete journey recordings and earlier
`final/` screenshots precede this body-font addition; targeted loaded-font hero
and both-science-panel checks at all four sizes are in `font-review/` with
`font-review/results.json`. Renderer, model, camera and interaction are unchanged.

## Final annotated hero revision — 2026-10-21

Organizer's latest markup supersedes the earlier invitation wording/composition:
- One yellow Register Now button in the header; the underline link and motion control are removed from that header. Manual Less motion remains in the footer, and OS reduced motion still applies automatically.
- Main heading is “Great Lakes Hackathon Challenge”, with yellow italic “Challenge”. Removed the redundant header brand, invitation labels, visible photo caption and old supporting lines.
- Exact supplied art/science/technology welcome and solo/team creative-project copy, ending with bold “No experience needed. Everyone welcome.”
- Photo-corner starburst shape spins continuously; prize text stays upright. A centered “SCROLL FOR A COOL BREAKDOWN” cue uses the organizer's animated `scroll_down.svg`. Motion alternatives suppress both animations.
- The organizer-updated higher-resolution `team-lab.webp` is preserved. Google Sans is confirmed loaded for body/controls at320/390/768/1440 widths. Latest hero and science stills are in `font-review/`; the earlier complete recordings and `final/` matrix predate these last typography/hero changes. The 3D scene and science timeline remain unchanged.

Current page has two registration CTAs (header and ending), both from the same central configuration. Earlier three-CTA navigation evidence describes the preceding hero version. No merge or deployment authorized.

## Surface-photo placement follow-up — 2026-10-21

The researcher photograph is twice its previous normal-story size (mobile244px
wide/256px image-height cap; desktop clamp320–520px/520px cap). It aligns to the
section's right edge after22svh of additional flow spacing. It remains a static
normal-flow figure: no fixed/sticky positioning, parallax or scroll handler.
Browser measurements at all four sizes verify that scrolling160px moves its
viewport top upward160px, with no horizontal overflow or page exceptions.
Evidence: `uat/glhc003/surface-photo/`; reproduction script `surface-photo.mjs`.
Production build passed; existing deferred-scene chunk warning unchanged. The
static reading layout and approved buoy/renderer/timeline are unchanged.

## Surface orbit — 2026-10-21

The transition from “A lake full of questions” to “A different perspective” now
contains one full360° camera orbit around the buoy. It eases through22–94% of the
surface chapter, then settles before the existing waterline descent starts.
Camera and look target rotate together about the actual buoy; the model does not
spin. Native scroll controls progress and reverse scroll reverses the same orbit.

At the orbit endpoints the original camera/target are returned exactly, avoiding
floating-point rotation residue. The entire crossing, sensor pause and later
camera path retain their approved positions and orientation. New diagnostics
expose cameraX/cameraZ and orbit progress for direct verification.

Verification:12/12 tests pass, Astro zero errors/warnings/hints, telemetry-disabled
build passes. Scene619.26kB/160.46kB gzip (+.60/.20kB versus the prior version).
No model, material, shader, water renderer or draw-count changes. Tests cover a
constant-radius above-water orbit, full return before descent, exact endpoint
identity, existing parked sensor view and reversible/responsive timeline.

Browser evidence: `uat/glhc003/orbit/` and `orbit.mjs` cover start, quarter/half/
three-quarter/full turn, crossing, exact approved sensors and reverse scroll at
320×650,390×844,768×1024,1440×900. Sensor camera matches x/y/z3.65/-1.45/-11.8
on mobile and6.45/-1.45/-12.7 on tablet/desktop; look-target y remains-2.8/-.8.
Reduced-motion still exposes the static reading path. Capture-only4FPS cadence
and software-renderer limitations apply; this is not physical-device FPS evidence.
