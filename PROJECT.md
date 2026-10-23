# GLHC 2026 — stable context

## Purpose
A mobile-first recruitment story for the Great Lakes Data Hackathon Challenge. Students use provided open hardware and real Great Lakes water-quality data to create public-facing experiences. The opening introduces the creative invitation and **$500 prize**; section4 explains the two rounds and no-experience requirement.

## Approved narrative
Student/group photograph over moving lake, attached upper-right prize starburst →1/4 At The Surface →2/4 Beneath The Surface →3/4 Understanding The Science (two exact paragraphs, one parked horizontal transition) →4/4 What’s The Challenge (How It Works, Round One, supplied inspiration collage, Round Two) →unnumbered deep-water registration. On mobile the collage follows Round One and precedes Round Two. The combined fourth section uses the organizer’s exact two-round copy:10 ideas advance, then selected participants receive budget/equipment/support, build and showcase, compete for cash awards and public display at tourist destinations. Do not invent funding amounts, dates or selection mechanics.

## Architecture
Astro static HTML and responsive CSS deliver the complete content and registration independently of JavaScript. A lightweight bootstrap progressively imports one Three.js R6 renderer. `src/scripts/glhc003/timeline.mjs` maps actual chapter layout to a deterministic native-scroll camera/prose timeline, with reading holds on both science panels. The shared scene detects the integrated homepage; `/prototype/glhc-002` retains its isolated camera/timeline behavior.

R6 water and approved finishes remain the baseline: original yellow and underwater materials, silver upper framework, reflective dark-blue solar glass, one procedural sky/water grid and shared 1.25× CPU/GPU wave clock. The organizer explicitly authorized a bounded model revision after the orbit revealed the sides: grids on all three solar panels, a long white black-capped probe and short black probe inside the cage, and removal of the upper cage plate. The lower plate remains. Shared GLB is now 188,892 bytes; both routes use it. No water-engine research or broader geometry redesign is part of GLHC-003.

## Content and registration
- Hero: supplied `team-lab.webp`, full 638:480 composition, no removed background or cropped faces.
- Research support: supplied `team-water.webp`; glider is not the protagonist.
- Inspiration: supplied square `glhc-communication-collage-{640,1080}.webp`, one complete image depicting three visual regions. Describe as inspiration, not prior entrants' work.
- Official organizer-supplied registration destination: `https://luma.com/pz0iw2m7`. `public/site-config.js` is the single configuration. Astro reads it at build time for real no-JS links; runtime reads the same configuration. All CTAs use HTTPS, `_blank`, `noopener noreferrer`.
- Do not invent event dates, venue, fees or registration availability. Current event details belong on Luma.

## Progressive enhancement
The full story remains readable without JavaScript, with OS/user reduced motion, when WebGL fails and after the 10-second readiness timeout. Static views present both science paragraphs in order. Native scroll is never intercepted. Retry starts a fresh bounded initialization. The homepage's controls/copy are DOM content, not a rendered canvas interface.

## Current initiative and acceptance
GLHC-003 replaced the superseded glider-led root homepage and merged via PR#2 as `908c22f`. Current organizer follow-up is on `codex/challenge-rounds`, based on that main. The organizer approved R6 visually after PR#1; physical-device performance acceptance remains open. Source merge does not verify production deployment. See `NOW.md` and `docs/GLHC-003-UAT.md` for exact verification boundaries.

## Release controls
No custom registration backend, fabricated scientific telemetry, interactive data-art simulator, forced animation unlock, additional horizontal chapters or glider-led opening. Image publication rights and representative physical iOS/Android/network readiness must be checked before launch. Do not merge or deploy GLHC-003 without organizer approval.

Follow `AGENTS.md` and `AGENT-WORKFLOW.md`; the active implementation agent owns durable context until its handoff is published.

Typography follow-up: body and controls use locally hosted Google Sans with
preload, `font-display:swap` and included OFL license; heading typography remains
separate. See `uat/glhc003/font-review/` for the final font-loaded review.

Latest hero direction (2026-10-21) uses the event name as the main heading,
yellow italic Challenge, only the solo/team creative-project paragraph beneath
the rounded-corner photo, two yellow pill section links, a header-only yellow registration shortcut, spinning prize shape and
centered supplied animated scroll SVG. Manual motion preference is in the footer;
OS reduced motion remains automatic. This supersedes older invitation copy and
visible winning-team caption placement. “What’s this about?” links to section01
(`#surface`); “What’s the challenge?” links to section4 (`#challenge`). The old
`#how-it-works` fragment remains within section4 as a compatibility anchor.
Both hero links and its scroll cue use a3.2-second eased,
interruptible scroll when motion is enabled. Manual wheel/touch scrolling stays
native. Native anchors honor static/reduced motion with immediate movement and
remain available without JavaScript. The prize qualification remains accessible
and appears visibly in registration.

Hero sizing responds to viewport height and width: portrait content distributes
space between the title, full photograph, paragraph and buttons, reserving a small
area for the scroll cue. Short landscape switches to two columns and side-by-side
links. Preserve readable text/tap sizes and natural page growth for enlarged text;
do not force a fixed-height clipped hero.

Surface-to-science camera contract: one full reversible orbit about the buoy
finishes before waterline crossing. The approved underwater camera/target must
remain identical. Orbit moves the camera and framing target, not the buoy asset.

The integrated science chapter is220svh (260svh in short landscape), with its
horizontal reveal across22–62% of the parked scroll interval. This reduces
vertical travel about47% versus the previous280svh/22–72% interval, preserving
settled reading holds and reversible camera/paragraph behavior. Static science
remains normal document flow; the isolated prototype timing is unchanged.

Latest section4 heading refinement (2026-10-22): only “4/4: How it works” appears
as a small accessible section heading; repeated large challenge heading and extra
kicker are removed. Titles are “Round 1 - Submit Your Idea” and “Round 2 - Bring
Your Idea to Life”; subtitles are “Open To Everyone” and “Build & Showcase”.
Full body copy, mobile collage order and section4 navigation remain unchanged.
