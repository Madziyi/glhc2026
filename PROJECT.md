# GLHC 2026 — stable context

## Purpose
A mobile-first recruitment story for the Great Lakes Data Hackathon Challenge. Students use provided open hardware and real Great Lakes water-quality data to create public-facing experiences. The first screen explains the **$500 prize for the winning team**, possible public displays and **no experience needed**.

## Approved narrative
Student/group photograph over moving lake, attached upper-right prize starburst → researchers and monitoring buoy at the surface → camera descends through the waterline beside the same instrument cage/sonde → two exact science paragraphs with one horizontal transition while camera is parked → supplied single communication collage and How It Works → deeper open water, no buoy, external Luma registration.

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
GLHC-003 replaces the superseded glider-led root homepage on `feat/glhc-003-storytelling`. The organizer approved R6 visually after PR #1 merged as `1524431`; its physical-device performance acceptance remains open. GLHC-003 is for organizer UAT, not a production deployment. See `NOW.md` and `docs/GLHC-003-UAT.md` for exact verification boundaries.

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
(`#surface`); “What’s the challenge?” links to the curiosity/tools section
(`#how-it-works`). Native smooth scrolling honors static/reduced motion with
immediate movement. The prize qualification remains accessible
and appears visibly in registration.

Hero sizing responds to viewport height and width: portrait content distributes
space between the title, full photograph, paragraph and buttons, reserving a small
area for the scroll cue. Short landscape switches to two columns and side-by-side
links. Preserve readable text/tap sizes and natural page growth for enlarged text;
do not force a fixed-height clipped hero.

Surface-to-science camera contract: one full reversible orbit about the buoy
finishes before waterline crossing. The approved underwater camera/target must
remain identical. Orbit moves the camera and framing target, not the buoy asset.
