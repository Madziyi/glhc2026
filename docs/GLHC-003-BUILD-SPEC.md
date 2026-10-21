# GLHC-003 — Full Website Storytelling Integration

**Status:** Approved for implementation on `feat/glhc-003-storytelling`.  
**Baseline:** `main` at merge commit `1524431cc33723bfeb063ac96fededfb77f575dc` (PR #1, approved GLHC-002R6).  
**Goal:** Replace the old glider-led `/` homepage with the organizer-approved mobile-first, five-chapter Great Lakes Data Hackathon experience. Do not redo the finished buoy renderer.

## Constraints and source of truth

- Read `AGENTS.md`, `PROJECT.md`, `NOW.md`, `TASKS.md`, `docs/GLHC-V2-SPEC.md` and `docs/GLHC-003-PLANNING-HANDOFF.md` before implementation.
- R6's specific buoy GLB, yellow hull, silver metalwork, dark-blue solar panels, 1.25× shared wave clock, synchronized ripples, atmospheric sky, full camera descent, 10-second readiness fallback and accessible static layout are the approved technical baseline. Preserve them; no additional water-engine work.
- Main navigation, critical copy and registration shortcut are HTML, accessible independent of WebGL.
- Mobile design first (320×650 and 390×844), then 768×1024 and 1440×900. The animation is reversible; natural vertical wheel/touch/keyboard scrolling must not be trapped.
- No invented venue, dates, historical readings or Luma event URL; no scientific HUD, data simulator, glider-led opening or model rebuild.
- Code on the new GLHC-003 branch. Keep `/prototype/glhc-002` intact as regression reference until integrated main-site UAT passes.

## Scene 1 — People-first invitation (first viewport)

- Use organizer-supplied wide research/student group photograph (asset already in repo, verify exact source/crop). Present as an editorial photo **over a moving lake/water environment**; do not cut out people or crop away faces on phone.
- **$500 Prize** yellow starburst overlays the **upper-right corner of the photograph**, with subtle motion and no face occlusion. Distinct explanatory copy **“for the winning team”** must be visible nearby to avoid misrepresenting individual awards.
- Immediate headline: *Great Lakes Data Hackathon Challenge* (can pair with a short compelling message), short explanation that students use real Great Lakes data/open hardware to make creative public displays; explicitly **no experience required** and public-display possibility.
- Include visible scroll cue and registration shortcut (disabled/labelled appropriately until verified Luma URL is supplied). Initial meaningful content does not await WebGL; test no-JS and reduced-motion.

## Scene 2 — The scientists and the buoy at the surface

- Vertical scroll hands off from photo-based hero into approved R6 3D buoy at the realistic lake surface. Use purposeful photographic supporting context for people collecting measurements and what the buoy is, avoiding a glider protagonist.
- Avoid visible abrupt cut, layout jump, mismatched lighting, or camera reset when Three.js becomes ready; retain fallback on slow/failed WebGL.
- Photorealistic feel, no speculative technical labels or sensor readings.

## Scene 3 — The underwater science pause

- Continue the **same 3D buoy**, descend through the waterline and park camera beside sonde / instrument cage.
- Preserve exact two agreed paragraphs from `docs/GLHC-V2-SPEC.md` as the default copy (editorial corrections only with organizer approval).
- Normal **vertical scrolling causes exactly ONE horizontal transition** from paragraph 1 (“What scientists measure”) to paragraph 2 (“Why the Great Lakes matter”). No additional panels/carosels/graphs. While text slides, camera stays parked. Then vertical descent resumes.
- Mobile should keep the sonde visible and paragraphs readable. Desktop uses ample breathing room; intermediate masked animation should not cut headlines into unreadable fragments at settled positions.

## Scene 4 — The public communication challenge

- Camera moves to a deeper chapter. Explain turning real water-quality data into engaging displays and communication projects for the public.
- Show **the single organizer-supplied collage image** as one static responsive image, captioned as inspiration (e.g. “There's inspiration to draw from…”). It depicts (i) night waterfront green-light visualization, (ii) open-hardware controller/Raspberry Pi-style electronics, and (iii) close-up purple LED panel. Earlier planning called this a four-picture collage, but the supplied composite visibly has three regions: use it intact, do not fabricate a fourth. Import the optimized 640/1080 WebP assets from the delivered `GLHC-003-collage-assets.zip` to `public/assets/`. Use `picture`/`srcset` if helpful, descriptive alt text and correct aspect-ratio sizing. The files are not yet committed.
- A short “How it works” section immediately after the collage explains: form/join a team; provided open hardware/equipment and real lake data; no prior skills required, all disciplines welcome; build an interactive public-facing experience.
- No data-to-art interactive playground or second horizontal scroll.

## Scene 5 — Deeper open-water registration

- Descend deeper; buoy must be **out of frame** by the final call to action.
- Clear accessible “Register Now” action routed to an external organizer-verified **Luma** event. **Organizer supplied URL:** `https://luma.com/pz0iw2m7`, configured in `public/site-config.js`. Every registration CTA should open this exact HTTPS URL in a secure new tab (`rel="noopener noreferrer"`); verify links and do not infer event dates or ticket status from the URL. The Luma event page was not independently inspected. Keep navigation jump to this section available.
- Restate the winning-team $500 prize, participation without experience, and potential public displays. No artificially gated/unlocked registration.

## Implementation plan (vertical slices)

1. **003A foundation:** Audit currently shipped `/` and R6 prototype. Refactor R6 scene into a reusable, dynamically imported component with one shared normalized scroll timeline and static accessible fallback. Build scene 1 people-first photo hero and prize burst; verify the visual entrance into R6 surface scene. Avoid duplicate Three.js instances.
2. **003B story:** Build researcher context, underwater sensor pause and exactly one horizontal text transition. Ensure cameras and scene progression remain stable on reverse scrolling.
3. **003C finish:** Add collage placeholder, “How it works,” deep-water conclusion with no buoy, and disabled Luma CTA configuration. Maintain layout/information quality without missing assets.
4. **003D validation:** Test content-first page, normal/reverse scrolling, keyboard, native touch where available, reduced motion, WebGL blocked, slow 3D loading, narrow overflow, all responsive states, total bundle/load readiness. Gather screenshots and recordings. Repair regressions without adding new features.

## Review/acceptance gates

- First viewport unmistakably communicates **$500 for winning team**, public display opportunity, and **no prior experience required**.
- Student photograph with anchored upper-right prize burst, no faces blocked at 320/390/768/1440 CSS widths.
- One continuous descent with actual approved buoy, two paragraph panels (one horizontal switch), collage slot, team instructions and open-water registration.
- 3D is progressively loaded; usable HTML before scene ready; **target 3D ready within 10 seconds on representative mid-range mobile device/network**. Do not claim achieved without appropriate test; fallback always available.
- Never lose scroll position when WebGL initializes late; no artificial preloader duration.
- Automated `npm test`, `npm run check`, telemetry-disabled `npm run build`; browser UAT at 320×650, 390×844, 768×1024, 1440×900 covering full story, reverse, static/reduced-motion, and disabled CTA.
- Report production JS sizes, errors, known limitations, cold vs warm readiness, physical mobile not tested if unavailable; attach before/after screenshot and motion evidence, commit SHA.
- Maintain approved 3D model and `/prototype/glhc-002` during integration. No deployment/merge of GLHC-003 until organizer review.

## Outstanding external inputs

1. Import organizer's single composite image from `GLHC-003-collage-assets.zip` (WebPs prepared; not yet committed).
2. Organizer-supplied Luma URL is available in `public/site-config.js`; external CTA/browser and registration-state verification pending.
3. Rights/publication approval for researcher/student/RAEON photography (can prototype with supplied photos; do not assert public release clearance).
4. Physical mobile/browser/network 10-second readiness and launch performance testing.

GLHC-002/R6 is **organizer visually accepted as a development baseline**, not production/mobile-performance certified.
