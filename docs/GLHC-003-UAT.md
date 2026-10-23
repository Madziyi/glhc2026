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

Initial integration retained the **181,648-byte** R6 GLB, git blob
`599c5f5585306c5542041f86118946ba979d8377`. The subsequent organizer-authorized
buoy-detail revision below supersedes that asset and builder. Waves, isolated timeline,
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
This orbit-only pass made no model, material, shader, water renderer or draw-count changes. Tests cover a
constant-radius above-water orbit, full return before descent, exact endpoint
identity, existing parked sensor view and reversible/responsive timeline.

Browser evidence: `uat/glhc003/orbit/` and `orbit.mjs` cover start, quarter/half/
three-quarter/full turn, crossing, exact approved sensors and reverse scroll at
320×650,390×844,768×1024,1440×900. Sensor camera matches x/y/z3.65/-1.45/-11.8
on mobile and6.45/-1.45/-12.7 on tablet/desktop; look-target y remains-2.8/-.8.
Reduced-motion still exposes the static reading path. Capture-only4FPS cadence
and software-renderer limitations apply; this is not physical-device FPS evidence.

## Organizer buoy-detail revision — 2026-10-21

The orbit exposed the two ungridded side solar panels. Matching five busbars and
eight horizontal cell divisions now cover each side, alongside the existing front
grid. A white probe with a black lower cap hangs beside the blue probe, ending
0.12 model units (about 3.5 cm at the visual hull scale) higher. A shorter black
probe also hangs inside the cage. The upper flat plate and its inset details are
removed; the lower plate, cage rails, original yellow, blue probe and ballast remain.
These are visual details, not engineering dimensions or sensor specifications.

This explicit organizer request supersedes the earlier frozen-geometry boundary.
Both homepage and isolated prototype share the revised GLB:188,892 bytes, git blob
`b6f46fcedddcd0f15d7007e724a3f764b61b93c1` (+7,244 bytes). It contains10 material
batches and12,280 model triangles. The white housing adds one material batch.
Generator repeated byte-identically; all40 meshopt streams round-trip and no
zero-length normals are present. The finish PNG remains unchanged.

Verification:12/12 tests, Astro0 errors/warnings/hints, production build passed.
Deferred scene remains619.26kB/160.46kB gzip, with the existing Vite chunk warning.
Homepage surface reports11 draws/45,080 triangles; underwater12/45,272. The white
probe batch is culled from the surface camera. Four-size screenshots and raw
metrics in `uat/glhc003/buoy-details/` cover front and both side panels during the
orbit plus parked sensors at320x650,390x844,768x1024,1440x900. Visual review confirms
three separated probes, white black cap, and one remaining lower cage plate.
No page exceptions/overflow; all approved sensor camera coordinates unchanged.
Isolated prototype also loads the revised model (`prototype.json`). The first
prototype check timed out because the harness expected a nonexistent WEBGL data
flag; the corrected check uses actual model-load and rendered-triangle metrics.
The homepage matrix completed before that harness correction and was retained.
Capture-only4FPS software-renderer limitations apply; no device-FPS claim.
No merge or deployment. Prior model evidence remains historical.

## Homepage reference and section navigation — 2026-10-21

The latest supplied mockup removes the art/science/technology introduction and
bold welcome from the hero, retaining only the solo/team creative-project paragraph.
The later participation/registration welcome remains. The photograph keeps its full
composition with rounded corners and the spinning attached prize. Yellow pill links
read “What’s this about?” (`#surface`, section01) and “What’s the challenge?”
(`#how-it-works`, CURIOSITY IS YOUR STARTING POINT). They use native smooth anchor
scrolling, keyboard-focusable section targets and existing header clearance. Both
no-JavaScript/static and reduced-motion layouts retain immediate anchor navigation.
Fonts, registration URL/buttons, buoy and renderer remain unchanged. Mobile layout
follows the stacked reference; desktop retains the responsive two-column composition.
The scroll-cue words are yellow as supplied in the reference.

Verification:12/12 tests pass; Astro0 errors/warnings/hints; production build and
diff check pass. Existing scene chunk warning remains, bundle unchanged. Script
`uat/glhc003/hero-navigation.mjs` and evidence `hero-navigation/` cover320x650,
390x844,768x1024,1440x900. Actual clicks record multiple intermediate native scroll
positions and land with section tops80px below the viewport edge, target headings
visible, correct URL hash and section focus. All four sizes have no overflow or page
exceptions. Separate OS-reduced and actual no-JavaScript contexts pass both links
with computed scroll behavior auto. Hero screenshots show rounded corners and the
removed copy; Google Sans remains applied. Test-only4FPS software-renderer cap is
for captures only, not performance acceptance. No merge/deployment.

## Responsive hero spacing — 2026-10-21

The organizer identified hero overflow on iPhone SE and then a bunched content
stack with excessive empty space above the cue. Hero sizing now responds to both
viewport height and width. Portrait uses a full-height minimum with distributed
space between title, photograph, paragraph and buttons, reserving96px (92px on
the shortest phones) for the cue. Photo size and heading adapt with the available
height; buttons remain at least44px high. The document may grow for enlarged text
rather than clipping content. Short tablets compact the grid, and short landscape
uses two columns with side-by-side buttons and the prize clear of the fixed header.

Production geometry/screenshot checks pass at375x667,393x852,320x568,360x640,
430x932,768x1024,768x600,1366x768,1440x900,667x375,568x320: hero no taller than the
viewport at default text size, both buttons above the cue, cue within the screen,
heading below header, no horizontal overflow or page exceptions. Evidence/script:
`uat/glhc003/hero-balanced/`, `hero-responsive.mjs`. Final landscape photograph/
badge clearance refinement is separately captured in `hero-balanced-landscape/`;
those two screenshots supersede the earlier landscape stills. Mobile SE/16 and
landscape final screenshots reviewed visually. Initial exploratory captures were
superseded after correcting4px compact-phone overflow; an earlier browser run's
scene-ready wait timed out during a concurrent rebuild. The final11-size run and
subsequent focused landscape run completed successfully after builds finished.

Tests12/12, Astro0/0/0, final production build/diff check pass. Renderer, model,
fonts and link destinations unchanged; existing Vite chunk warning remains.
Test-only4FPS software-renderer captures do not verify physical-device performance.
No merge or deployment.

## Slower homepage jumps — 2026-10-21

Organizer clarified the requested slowdown applies to clicks on the two homepage
buttons and scroll cue, not manual scrolling or camera progression. Those three
links now use a3,200ms smoothstep animation in `section-scroll.js`, preserving
80px header clearance, final hash/history and keyboard focus. Wheel, touch,
pointer, scroll keys, resize, history navigation and motion preference changes
cancel an active jump. Reduced/static motion uses immediate native anchors;
no-JavaScript links remain functional. Scene and manual scroll remain unchanged.

Tests12/12, Astro0 errors/warnings/hints, production build/diff pass. Bootstrap
3.48kB/1.48kB gzip (+1.42/.55); scene remains619.26/160.46kB. Existing Vite warning
remains. Actual Chromium mobile/desktop clicks measure3.10–3.38 seconds versus
1.46/1.52-second prior native long-jump references, ratios2.03–2.30. All three
links reach correct hash, target focus and80px offset. Wheel interruption stops
progress; OS-reduced and actual no-JS anchors pass. Raw timed positions/script:
`uat/glhc003/slow-scroll/results.json`, `slow-scroll.mjs`. Capture-only4FPS cap
and software renderer apply; these timings verify navigation duration, not GPU
performance. No merge or deployment.

## Four sections and two-round challenge — 2026-10-22

Baseline is GitHub main908c22f (merged PR#2); follow-up `codex/challenge-rounds`.
The four story labels now read1/4 At The Surface,2/4 Beneath The Surface,
3/4 Understanding The Science,4/4 What’s The Challenge. Closing registration
is unnumbered. The former separate challenge/participation sections are one
section4 with How It Works and the organizer’s complete Round One/Two copy:
solo/team ideas, all skills, real-data creativity, no prototype;10 ideas advance;
then budget, equipment/support, build, cash awards, and public display at tourist
destinations. The concluding sentence is emphasized. Mobile document order is
Round One, supplied inspiration collage, Round Two; desktop places collage beside
Round One. Hero challenge link targets `#challenge` with existing3.2s easing.
The old `#how-it-works` fragment remains inside section4 for compatibility.

Science height reduces280 to220svh (short landscape350 to260), reveal interval
22–72% becomes22–62% of the parked scroll. Default reveal travel becomes48svh
versus90svh, about47% less scrolling; short landscape64 versus125svh,49% less.
Both exact paragraphs, settled holds, parked camera and reverse scroll remain.
Original prototype timing, water, model, hero fit/fonts and registration unchanged.

Tests12/12, Astro0 errors/warnings/hints, build/diff pass; scene619.26/160.46kB gzip,
bootstrap3.48/1.48, existing Vite warning. Extended tests check four-section/content
contracts and shorter reveal endpoint/midpoint; initial exact midpoint assertion
was corrected to floating-point tolerance. Production browser evidence/script:
`uat/glhc003/challenge-rounds/`, `challenge-rounds.mjs`. Five sizes320x650,
393x852,768x1024,1440x900,667x375 pass actual section4 link/hash/focus/80px offset,
labels, mobile visual/document order, panel start/mid/end and reverse, unchanged
parked view, no overflow/page exceptions. Separate OS-reduced and actual no-JS
contexts pass navigation and readable content. Mobile/desktop full section
screenshots reviewed. Initial preview connection refusal was resolved by starting
the local preview; completed matrix passed. Test-only4FPS software-renderer limits
remain; no physical-device or production-deployment claim.

## Section4 heading simplification — 2026-10-22

Organizer annotation replaces the repeated large heading/kicker with the single
small accessible heading “4/4: How it works”. Round titles now read “Round 1 -
Submit Your Idea” and “Round 2 - Bring Your Idea to Life”, with subtitles “Open To
Everyone” and “Build & Showcase”. Body copy, mobile collage placement, section4
fragment/navigation and science timing are unchanged. Legacy how-it-works anchor
is retained inside the small heading.

Verification:12 tests, Astro0 errors/warnings/hints, production build and diff
check pass. Mobile393x852 and desktop1440x900 browser checks/visual review confirm
exact heading/subtitle strings, a small label (under12px), no repeated kicker,
no overflow/page exceptions. Evidence/script: `uat/glhc003/round-heading-review/`,
`round-heading-review.mjs`. Prior five-size science/order checks remain applicable
to the unchanged interactions. Renderer/bootstrap output unchanged; existing Vite
warning and physical-device acceptance boundary remain. No merge/deployment.

## Orbit zoom-pumping fix — 2026-10-22

Reviewed the supplied25.57-second recording using sampled video frames. The
renderer interpolated between already-rotated camera positions in Cartesian
space, cutting chords across the orbit during uneven/fast/reverse scroll input.
Its target rotated immediately, ahead of the damped camera. This could change
camera radius and framing distance, producing the reported in/out bump.

`camera.mjs` now damps the unrotated camera, unrotated target and continuous orbit
progress with the same time-based response, then rotates camera/target together.
There is no second Cartesian interpolation after rotation. Angular easing continues
through endpoint settling; initial refresh uses the actual pose immediately.
The prototype retains its original camera branch. Orbit route/scroll boundaries,
approved sensor pose, buoy/waves/materials, prose and3.2-second section jumps stay
unchanged. Diagnostics expose actual rendered angle, radius and look coordinates.

15 tests pass: new regressions cover abrupt forward/reverse progress at30/60/120
and4Hz, constant radius and camera-to-target distance, frame-rate-independent
response, exact eventual orbit return, synchronized descent and no initial fly-in.
Astro0 errors/warnings/hints, production build/diff pass. Scene619.82/160.69kB gzip
(+.56/.23), bootstrap3.48/1.48 unchanged; existing Vite warning remains.

Script/evidence: `uat/glhc003/orbit-smoothing.mjs`, `orbit-smoothing-final/`.
320x650,393x852,768x1024,1440x900 each exercise8 abrupt/reversing orbit inputs with
64 transient samples. Radius remains11.34637 mobile/12.67518 desktop within0.00001
model units. Completion returns the original camera within0.01; settled sensors
match x/y/z3.65/-1.45/-11.8 and lookY-2.8 on phones,6.45/-1.45/-12.7 and lookY-.8
on larger viewports. No page exceptions; final underwater screenshot reviewed.
An initial harness required a literal fully settled angle after a fixed delay;
replaced with a bounded condition-based endpoint/position wait and the full matrix
passed. Reference contact frames and partial exploratory captures were removed;
the original supplied recording is untouched. Capture-only4FPS software-renderer
sampling verifies geometry/behavior, not physical-device FPS or video fluidity.
No merge/deployment performed.

## Six-second introduction preloader — 2026-10-22

Explicit organizer request adds a full-screen navy overlay with the exact bold
invitation: “Into art, science, technology, or just curious? This event is for you.”
Words fade in1.1s after a.15s delay. A6,000ms inline timer starts the.7s opacity
fade on the parent overlay, taking words and background out together. Scroll and
underlying interaction are restored after dismissal. Background content is inert
while covered, retaining any existing inert state afterward. No-JavaScript skips
the overlay entirely. OS reduced motion shows the6s message without fades.

Scene/module loading starts as before behind the intro. Its dismissal does not
wait for scene-ready and is independent of bootstrap execution; blocked/delayed
3D cannot keep the overlay up forever. This gives rendering time but is not a
six-second rendering-readiness guarantee. Existing timeout/retry remain independent.

15 tests, Astro0 errors/warnings/hints, production build/diff pass. Bootstrap and
scene bundles unchanged3.48/1.48 and619.82/160.69kB gzip; existing Vite warning.
Script/evidence: `uat/glhc003/preloader.mjs`, `preloader/`.320x568,393x852,
768x1024,1440x900 show exact readable text within viewport, scene-ready while
covered, correct fade class and hidden state, restored interaction/no overflow/
page exceptions. Mobile button navigation works after dismissal. Additional OS
reduced, actual no-JS, blocked bootstrap and8s-delayed model scenarios pass;
slow/blocked cases dismiss even though scene is not ready. Measured hold6.01–6.43s
and final cleanup.70–1.22s after fade start reflect callback scheduling/software
renderer load; CSS durations remain1.1s/.7s. Reduced removes immediately at6s.
Capture-only4FPS software rendering is not physical-device readiness evidence.
Mobile/desktop intro screenshots reviewed. No merge/deployment.

## Hero annotation and CASH Prizes — 2026-10-23

Based on GitHub main386060d (PR#3 merged), branch `codex/hero-cash-prize`.
Hero photo now has a yellow rectangle inside the bottom-right corner containing
“YOUR IDEA COULD BE FEATURED” / “AT TOURIST ATTRACTIONS ↗”. It is static text,
not an invented link. Photo-container sizing keeps it proportional at different
hero dimensions and preserves the full source photograph and visible faces.
The organizer clarified plural CASH Prizes: the starburst, registration, meta
description and accessible photo caption now omit the fixed dollar amount and
single-winning-team implication. Registration/caption say prizes for top projects,
consistent with Round Two. No counts or monetary values invented. Historical
reports/screenshots are retained as evidence of their versions.

Verification:15 tests, Astro0 errors/warnings/hints, production build/diff pass.
No old dollar amount remains in live source/generated pages. Updated existing
content contract expects CASH Prizes/cash awards. Six viewport checks320x568,
375x667,393x852,768x1024,1440x900,667x375 pass exact copy, text fit, photo-contained
rectangle, hero viewport fit and no overflow/page exceptions. Mobile/desktop
screenshots reviewed; callout overlays the lower floor area, leaving faces visible.
An initial compact callout line exceeded its text box; adjusted its minimum type
size/tracking and the full final matrix passed with plural wording. Evidence:
`uat/glhc003/hero-cash-prizes/`, script `hero-cash-prize.mjs`.
Renderer/bootstrap sizes unchanged619.82/160.69 and3.48/1.48kB gzip. Existing Vite
warning and capture-only4FPS/software-renderer/device limits remain. Preloader,
scene/camera, navigation and registration destination unchanged. No merge or
production deployment performed/verified in this pass.

## Info-session CTA labels — 2026-10-23
Both header and ending buttons now read “Attend the info session”; the closing
new-tab note is neutral. Existing central Luma URL, _blank/noopener noreferrer
behavior and configuration hooks remain. No session dates/details invented.
15 tests, Astro0/0/0, build/diff pass. Browser checks at320x568,393x852,1440x900
verify both exact labels, URLs/security attributes, no clipping/overflow/page
exceptions. Mobile header visual review passes. Evidence/script:
`uat/glhc003/info-session-cta/`, `info-session-cta.mjs`. Runtime bundles unchanged;
existing Vite/software-renderer/device limits remain. No merge/deployment.
