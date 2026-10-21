# GLHC-002R — Cinematic Visual Refinement (Approved for Implementation)

**Status:** Approved by organizer on 2026-10-18, awaiting Codex Sol implementation and fresh visual approval.  
**Baseline:** `1df064817cb0c376f87297262c736522a80e539b` (GLHC-002 isolated route, verified by UAT).  
**Location:** Keep all development isolated to `/prototype/glhc-002`; the existing `/` website and earlier evidence must remain intact.

## Objective and quality bar

Transform GLHC-002 from a structurally accurate technical demonstration into a **photorealistic, cinematic visual prototype** that can be approved for later integration into the people-first GLHC v2 story. Judge the result primarily by the actual rendered appearance at mobile and desktop resolutions, not by tests passing or by GLB size alone. This is *not* a promise of AAA console rendering in browsers.

The organizer approved a **specific yellow buoy + submerged assembly** (full-length image `image(20261018-215310).png`, shared in coordinating conversation). Reference also includes real RAEON buoy photos and `CB650_drawings.pdf` pages 1/6/7. Manufacturer drawings show typical configurations; the organizer's full visual reference takes precedence in appearance and positioning. Do not redistribute copyrighted source references publicly without permission. Do not invent unverified equipment beyond the reference.

## Priority A — Model/material refinement

1. Inspect `scripts/build-buoy.mjs` and compare actual rendering with the approved reference. Note differences in hull profile, solar tower & cell grid, guard ring, weather sensor, cage bars/plates, blue-black sonde, under-hull fittings, red ballast, cabling, mooring line. Prioritize visible silhouette/material differences.
2. Investigate Blender availability for **real modelling and PBR preview renders**. If available, create a reproducible Blender source/project or Python build script, bake/use optimized textures where valuable, export web `.glb`, and retain source. If Blender is not available, use a reproducible alternative modelling path with real PBR textures and rendered reference checks; document the limitation. Do not call untextured primitive meshes a photorealistic asset.
3. Replace overly uniform colours and plastic appearance with credible painted polymer/metal, matte solar glass, brushed stainless steel, bolts/seams and restrained surface wear consistent with the reference; do not artificially weather hardware beyond believable levels.
4. Produce still previews of **above-water**, **split waterline**, and **sensor assembly close-up**. Clearly label which are offline renders vs browser captures.
5. Preserve compression/efficient materials. Treat 76,776 B as the prototype measurement, **not a hard budget**. Document final GLB size, triangle/draw-call counts and any material/texture increases.

## Priority B — Water optics and light

1. Keep photographic / shader-composite technique as the default. Refine the current hard horizontal waterline, broad stripe artifacts and two-world separation. Natural wave contours should intersect the yellow hull and vary gently over time.
2. Underwater should have plausible haze/attenuation, natural sunlight falloff and reflections/refraction cues at the waterline. Avoid saturated sci-fi teal, glowing HUD effects, and heavy decorative particles.
3. Prefer low-cost shader/texture improvements and camera/exposure coordination. **Do not** introduce a full physically based water simulation, reflection render target, or extra heavy postprocessing unless a visual side-by-side and actual performance measurement justify it.
4. Maintain realistic continuity when descending and reversing: no hull teleport, popping seam, mismatched above/below displacement or distracting compositing edge.

## Priority C — Editorial camera and responsive composition

1. At narrow mobile sizes, position camera so the sonde and upper cage remain legible without being hidden behind science text. Lower cage/ballast may be partly outside crop but avoid confusing assembly silhouette. Consider moving copy above/below object in the planned composition, not only zooming randomly.
2. Desktop sensor chapter should compose buoy to left and science text to right (or other verified strong composition) with breathing room.
3. Preserve camera parking during the science prose, **two paragraphs with exactly one horizontal slide**, reversible through natural vertical scrolling. Improve clipping/track masking/spacing so midway states look purposeful (the earlier desktop intermediate screenshot showed cropped fragments of both headings). Avoid truncating actual text at steady states.
4. Retain static reduced-motion view, no-WebGL/JS fallback, keyboard use, skip links, touch-friendly interaction, no scroll lock/overflow.

## Sequencing and review gates

**Gate 1 — Render / asset review.** Compare model and materials side by side with provided approved reference. Supply 3 still renders, model notes and questions about ambiguous mechanical details. Only proceed to expensive environment work after self-assessment.

**Gate 2 — Visual browser UAT.** Integrate improved model/water/camera into isolated route; supply 320×650, 390×844, 768×1024 and 1440×900 browser screenshots for (i) surface, (ii) crossing, (iii) sensor/paragraph A, (iv) horizontal midpoint, (v) paragraph B. Provide a short before/after comparison against `uat/glhc002/` reference renders. Check consistency in motion in both directions; still screenshots alone cannot prove absence of jitter.

**Gate 3 — Performance and stability.** Run `npm test`, `npm run check`, `ASTRO_TELEMETRY_DISABLED=1 npm run build` and browser JS logs. Record compressed GLB byte size, geometry counts, draw calls, scene JS bundle size and any loading regression. Test touch and physical mobile if available; otherwise explicitly label them **unverified**. Frame intervals alone do not establish mobile FPS, GPU time or Core Web Vitals.

**Gate 4 — Organizer approval.** Report visual limitations honestly and pause before integration into `/`. Do not merge draft PR or deploy without approval. No work on collage, new hero, Luma link or other GLHC-003/004 features in this task.

## Acceptance criteria

- Buoy is recognizable as the *specific approved assembly*, with visible buoy hull, solar panel tower/ring, sensor mounting, cage, sonde and ballast appropriately framed.
- It looks like a credible professionally rendered product/environment at normal mobile size, rather than flat primitives; texturing, lighting and surface crossing demonstrably improve compared with GLHC-002 baseline.
- No obvious rigid straight bright band used as the only waterline; buoy remains coherent while moving between air and underwater.
- Sensor-side camera pause and one horizontal prose transition remain correct in both directions, and text is readable at tested breakpoints.
- Accessibility/static fallbacks and existing root route unchanged.
- Build and test evidence and visual screenshots published in `docs/GLHC-002R-UAT.md`, asset/source reproducibility and exact commit SHA reported.
- Visual quality is **reviewed by organizer** before marking done/approving integration.

## Deferred / unresolved

- Real Luma event URL, single organizer-created 4-image collage, rights clearance, full-site integration, security audit and launch all remain separate.
- Physical device performance remains unverified until tested on hardware.
