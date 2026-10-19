# GLHC-002 implementation plan

Date: 2026-10-18. Branch: `feat/glhc-001-opening`; synced baseline `ba3a87c`, with `origin/main` an ancestor. User requested Luna high for coding; parent owns planning, review, browser verification and durable context.

## Goal and scope

Reviewable, isolated `/prototype/glhc-002/` feasibility experience: one continuous reconstructed yellow buoy and underwater assembly, animated lake surface, descending camera, sensor-side pause and exactly one horizontal change between two science paragraphs. Preserve the existing `/` website and its assets. No collage, registration or production integration.

## Visual authority

Organizer supplied the full assembly image in this chat (`codex-clipboard-cc79b26d-b3c7-4ddd-856c-11d0570e2c08.png`). Use that image for relative proportions and equipment placement. Cross-reference local `CB650_drawings.pdf` sheets 1, 6 and 7, without publishing the drawings. Typical optional pipe/anchor hardware is not evidence of the approved configuration. Geometry is a visual reconstruction, not engineering CAD.

## Implementation sequence

1. Author reproducible model source and optimized GLB: bevelled thick yellow float, panel tower, guard ring/weather sensor, under-hull mounts, rounded silver cage, exposed blue/black sonde, red ballast and thin mooring.
2. Create dedicated Astro route, styles, static fallback and Three.js scene. Share materials/geometries; cap pixel ratio and avoid costly rendering passes where a convincing composite suffices.
3. Drive camera and DOM from one normalized vertical-scroll timeline. Keep model rooted at the surface with small natural bob/roll. Pause camera at sensors before the single horizontal paragraph change. Support reversal and resize without scroll interception.
4. Supply readable static/reduced-motion content and WebGL failure fallback, keyboard shortcuts and natural page scrolling.
5. Run model/timeline checks, existing tests, Astro check/build and diff check. Browser review surface, crossing, sensors, panel A, transition and panel B at 320×650, 390×844, 768×1024 and 1440×900. Inspect overflow, runtime errors, reversal, keyboard, reduced motion and rendering diagnostics.
6. Record asset sizes, observed performance and visual limitations; update shared context and commit/push on the requested feature branch.

## Acceptance and review boundary

The same assembly remains continuous across the waterline; cage and sonde must be legible at mobile widths. Text is readable and exactly two science panels participate in one horizontal transition. Performance observations describe the actual test environment, not physical mobile hardware or production Web Vitals. Build success does not imply deployment. Visual realism and assembly fidelity remain subject to organizer review before replacing `/`.

## Risks

Surface reflection/refraction may need refinement after feasibility review. Procedural geometry/materials cannot establish engineering fidelity. Source imagery and manufacturer drawing rights remain pending for public release. Browser viewport emulation cannot prove physical-device GPU behavior.

## Next action

Implementation and parent browser verification are complete; see `docs/GLHC-002-UAT.md`. Organizer reviews the isolated prototype's assembly fidelity, optical approximation and responsive screenshots before integration.
