# GLHC 2026 — stable context

## Purpose
A mobile-first photorealistic recruitment story for the Great Lakes Data Hackathon Challenge. Students use open hardware and real Great Lakes data to create public-facing water-quality communication. Immediately explain $500 prize **for the winning team**, possible public displays, and **no experience required**.

## Approved narrative (v2)
People-first wide student photo over moving lake + attached upper-right **$500 Prize** starburst → scientists & specific buoy at water surface → camera descends through waterline and pauses by the underwater cage/sonde → *two paragraphs with exactly one horizontally animated transition* about measurements and why Great Lakes matter → further descent to challenge, organizer's one four-image collage, short How it works (teams, supplied equipment, all levels welcome) → open deeper water, no buoy visible, external Luma registration CTA.

## Canonical source
`docs/GLHC-V2-SPEC.md` is the detailed, approved scene/asset/implementation contract. User-approved full buoy reference: `image(20261018-215310).png`; mechanical reference: `CB650_drawings.pdf` (manufacturer drawings of typical configurations). Use authorized source photos for people/researchers. Glider photos may appear only as supporting scientific context, not as central 3D object.

## Architecture
Astro + TypeScript static accessible shell; scroll-controlled Three.js canonical buoy and sensor assembly (GLB) + GSAP/ScrollTrigger or equivalent; lightweight 2D/photographic environment as appropriate. Horizontal panel movement consumes normal vertical scroll during a single pinned sensor pause. Must remain readable without WebGL and with reduced motion. No backend or customer data collection; registration handled by external verified Luma URL.

## Current state
GLHC-001 initial glider-led opening has browser UAT and build verification (see LOG); it is now a superseded prototype. GLHC-002 is the new isolated 3D buoy/waterline feasibility build. Do not equate committed code or a draft PR with live deployment.

## Non-goals and controls
No interactive data art, synthetic sensor telemetry, arbitrary water depths, forced scroll unlock, glider-led hero, secret keys, or unverified Luma URL. Need permission for production photos and NexSens drawings; avoid embedding copyrighted diagrams. Do not fabricate precise optional underwater apparatus beyond approved visual reference.

## Agent coordination
Follow `AGENTS.md`, `NOW.md`, `TASKS.md`, `LOG.md`, `LIVE-STATE.md` before edits; one writer at a time.
