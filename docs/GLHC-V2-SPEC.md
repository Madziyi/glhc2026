# GLHC v2 — Approved Narrative & Build Specification

Status: **Narrative approved; new 3D implementation not started.** This document supersedes GLHC-001's glider-led story. Do not erase old UAT artifacts; they document the superseded baseline. Scope and copy can be refined with organizer approval.

## Product goal
A mobile-first, photorealistic and cinematic recruitment experience for a Great Lakes water-quality data hackathon, moving from students → scientists / RAEON buoy → real underwater sensors → public communication challenge → Luma registration. Explain the competition clearly, make first-time students comfortable, emphasize a **$500 prize for the winning team** and possible public displays. Never suggest skills are prerequisites.

## Locked narrative sequence

### Scene 1 — People-first hero (above the surface)
- Show the supplied wide student-group photo prominently, in a respectful frame that keeps everyone visible. Animated realistic lake and waves in the background.
- A yellow, slow-animated starburst reading exactly **$500 Prize** overlaps the upper-right corner *of the photo*, not the page corner; avoid covering faces across breakpoints.
- Show Great Lakes Data Hackathon Challenge, no prior experience needed, public display opportunity and clear scroll invitation immediately. Keep basic event info accessible without completing animation.

### Scene 2 — Scientists and the monitoring buoy (at the surface)
- Downward scrolling shifts the composition from the group-photo hero to a true buoy-centered viewpoint.
- Show the specific supplied yellow buoy with solar tower/guard ring. Buoy naturally bobs; **virtual camera moves downward**, rather than moving the entire model vertically to fake descent.
- Short prose and supplied photos establish scientists collecting water-quality data; glider photos are supporting evidence of the wider monitoring community, never the protagonist.
- Preserve photorealism; no synthetic telemetry HUD or arbitrary coordinates/depth labels.

### Scene 3 — Crossing the surface; understanding lake science
- Camera passes through a believable moving waterline (air/underwater transition with softened refraction, reflection and color change), descends alongside the **same** buoy object, and **stops beside its underwater instrument cage and sonde**.
- This chapter has **exactly two prose panels**, no graphs or cards:
  A. What scientists measure using buoys. Draft: “Buoys equipped with scientific sensors collect measurements such as water temperature, dissolved oxygen, and indicators of algal activity. These observations help researchers understand how conditions in the Great Lakes change over time.”
  B. Why the Great Lakes matter. Draft: “The Great Lakes support millions of people, provide drinking water, and sustain important ecosystems. Pollution, warming temperatures, and harmful algal blooms can threaten their health. Understanding these changes helps scientists and communities make informed decisions.”
- **One horizontal transition only**: continued natural vertical scrolling slides A out and B into view while camera remains parked at the sensors. Then resumes downward vertical camera movement. Text remains accessible to keyboard and reduced-motion users. Draft wording is provisional.

### Scene 4 — Communicating data; the challenge
- Next depth level reveals the purpose of the competition: make science understandable through creative public-facing displays.
- Display **one organizer-supplied four-picture collage** as a single image (placeholder until provided). Accompany with short copy such as “There’s inspiration to draw from.” Do not build an interactive collage or another horizontal carousel.
- Following the collage, a short **How it works** explanation covers: form/join a team; provided open hardware/equipment and real data; all skill levels and disciplines welcome; what students will create. No data-to-art simulator and no unrelated monitoring-tools gallery.
- Any example imagery must be labelled as examples/inspiration, not guaranteed project results.

### Scene 5 — Open-water registration ending
- Camera continues descending beyond the buoy; **no buoy remains visible**.
- Clear high-contrast headline, accessible event summary, winning-team $500 prize and possible public display reminder, novice reassurance and prominent **Register Now** button pointing to organizer's verified external Luma event page.
- Until Luma URL is provided, CTA is clearly unavailable; do not fabricate a URL. For a valid URL, open securely with rel=noopener noreferrer. Do not force users to complete a scroll to reach registration; offer a navigation shortcut.

## Canonical buoy asset — major architecture change
- **3D buoy is the protagonist**. Do not prioritize glider GLB or continue the old glider-led opening.
- Model the *specific user-approved buoy and submerged assembly* depicted in `image(20261018-215310).png`, cross-referencing the user-provided real buoy photo and `CB650_drawings.pdf` (especially sheets 1, 6 and 7). User approved this exact image as the 3D reference.
- Model recognizable: thick yellow circular float hull; square solar-panel tower; circular top guard ring; top weather sensor; under-hull mounts; silver instrument cage; blue/black sonde; red ballast weight; hanging mooring line. Preserve **relative proportions and placements**; use manufacturer drawings as modelling reference where applicable.
- The manufacturer PDF shows **typical CB-650 configurations**; do not assume every depicted optional component is installed. For conflicts, use the user-approved reference image as visual authority, and raise material ambiguities rather than inventing.
- Geometry can be optimized rather than engineering CAD-precise. Export textured compressed GLB; avoid needlessly high-poly components. Keep a static fallback illustration/photo.
- Do not publish the manufacturer's protected engineering drawings or copyrighted images as downloadable site assets without rights clearance.

## Architecture proposal (not yet locked to exact rendering method)
- Keep Astro + TypeScript as a static/content-first shell, accessible DOM paragraphs/CTA.
- Use GSAP/ScrollTrigger or equivalent deterministic scroll timeline for normalized story/camera phases and section pinning. A reader's vertical wheel/touch input remains natural.
- Use Three.js for the continuous canonical buoy + camera; integrate a realistic yet mobile-appropriate waterline effect. Above-water environment may use photography, layered 2D elements, or restrained shader effects; below-water environment is a lightweight depth gradient/fog and physically modest rays/particles.
- Choose rendering technique after proving a real side-by-side waterline crossing. Performance and visual honesty matter more than a particular library.
- Single timeline source for camera position, 3D objects and HTML transitions. Avoid stale telemetry or artificial 0–60 m readouts that appear factual.
- Make transition reversible and interruption-safe; use CSS/DOM and image fallback for no-WebGL and prefers-reduced-motion.
- Keep mobile-first; retain 320, 390, 768 and 1440px UAT widths, and test faces, overlays, prize positioning and actual sensor visibility.

## First build milestone — GLHC-002 (bounded feasibility prototype)
Implement **only** the buoy 3D GLB and in-browser vertical surface → waterline → sensor-side camera motion in a development route or isolated demo, with placeholders for editorial text. Do not dismantle the approved GLHC-001 UAT baseline until the new interaction has been reviewed.
1. Trace actual buoy proportions, geometry, materials and structure using user's authoritative image; save source modelling script/project and optimized GLB.
2. Create a believable reflection/refraction surface transition with fallback. Model floats and bobs slightly; camera descends along it.
3. The model's above- and below-water portions maintain a consistent position through crossing. Stop where cage/sonde are legible in narrow mobile framing.
4. Add only a two-panel, one-horizontal-transition placeholder to validate pinned camera behavior.
5. Browser review and screenshot at surface, split-water, sensor closeup and both text panels, at 320×650, 390×844, 768×1024 and 1440×900. Test reverse-scroll, reduced motion, keyboard navigation, page errors, overflow; report memory/frame-rate or other performance observations.
6. Do **not** create final collage, production copy, or Luma interaction as part of this isolated prototype.
7. Return screenshots, GLB asset size, commit SHA, visual limitations and a recommendation on whether to use full real-time Three.js water or a composited effect.

## Next milestones
- GLHC-003: integrate approved prototype into full people-first opening and science prose; conduct device UAT.
- GLHC-004: collage + How it works + deep water registration, responsive design; Luma URL once available.
- GLHC-005: polish, rights approvals, vulnerability audit, Lighthouse, deployment and launch approval.

## Approval and missing inputs
- Approved: story order, specific buoy target, two science paragraphs/one horizontal change, four-image collage as *one static picture*, How it works after it, deep-water Luma ending.
- Pending: collage image, verified Luma event URL, permissions for public-facing RAEON/manufacturer imagery, confirmation of any optional equipment details that are visually ambiguous.
- Deferred: data-to-art playground, synthetic sensor dashboards, glider protagonist, registration-unlocking, speculative depth/telemetry labels.
