# Codex Sol — GLHC-001 implementation / UAT handoff

## Roles and sync
Terra owns the design direction and acceptance review; Sol owns runnable implementation, browser UAT, local debugging, build verification and evidence. Before editing, sync with remote repository, read root context files and honor the one-writer rule. Do not overwrite active edits from another agent. Do not claim GitHub main has advanced until verified.

## First pass
1. `npm install`; `npm test`; `npm run build`; `npm run dev`.
2. View actual site on mobile 390×844, narrow mobile 320×650, tablet 768×1024, desktop 1440×900.
3. Screenshot at surface, transition around 35–50% scroll, underwater glider, challenge section, final Luma CTA.
4. Scroll backward from underwater to the surface and ensure scene states reverse and do not flash or overlap.
5. Validate that the introductory text, $500 prize, public display opportunity, and no-experience message appear on the first viewport.
6. Check `prefers-reduced-motion`, keyboard skip, anchor navigation, no sideways scrolling, and mobile address-bar resize.
7. With URL unset, confirm registration CTA is disabled and has no phantom destination. With a **test-only real Luma URL** configured, confirm it opens securely in a new tab; restore production config to blank afterward.
8. Check real-image quality, foreground cutout edges, readability and waterline continuity. Prioritize replacing imperfect artifacts rather than adding animation complexity.
9. Check Lighthouse or equivalent; report measured environment, LCP/CLS/INP if available, and asset weights. Do not claim performance goals have been met without measurements.
10. Update NOW/TASKS/LOG/LIVE-STATE and send a standard handoff with screenshot paths and commit SHA.

## Important corrections welcome
The current glider is a masked photo with residual water texture; it is only a proof-of-concept substitute for a proper 3D asset. User-provided concept renders are visual inspiration, **not** accurate underwater hardware. Do not fabricate tether, mooring or depth measurements. The built-in scroll controller uses requestAnimationFrame rather than GSAP; migrate to GSAP only if it demonstrably improves choreography without harming mobile performance.

## Out of scope
No dashboard, data-to-art playground, auth, backend, live sensor streams or event calendar integrations.

## Execution record — 2026-10-18

- Workspace baseline: reconciled onto `feat/glhc-001-opening`, preserving the fetched branch history.
- Dependency install: `npm install` completed; 455 packages added. npm reported 3 dependency vulnerabilities (1 low, 1 high, 1 critical). An `npm audit` follow-up could not reach `registry.npmjs.org` in this environment.
- Tests: `npm test` passed, 3/3.
- Production build: `ASTRO_TELEMETRY_DISABLED=1 npm run build` passed (Astro 5.18.2, static output). The setting avoids Astro telemetry writes outside the workspace.
- Viewports: 320×650, 390×844, 768×1024 and 1440×900. No horizontal overflow or browser page errors were observed.
- Scroll: at journey progress 0.42 the waterline transition showed scene 03 and waterline near 41%; at 0.72 the glider scene showed scene 04 and full glider opacity. Scrolling back to the top returned to scene 01.
- Accessibility/fallback: first Tab focused the skip link; reduced-motion mode limited the journey to one viewport, hid underwater animation and kept the intro visible. With no Luma URL, registration stayed `aria-disabled="true"` at `#register` and activation did not navigate.
- Fixes: hid the redundant HUD eyebrow on mobile and lowered the intro copy to clear the HUD; moved the glider below the description on mobile, tablet and desktop.
- Screenshots: `uat/{mobile-narrow,mobile,tablet,desktop}-{surface-hero,waterline-transition,underwater-glider,registration-ending}.png`.
- Known issue: the underwater glider cutout retains visible lake-water texture around the hull. A verified replacement asset and RAEON usage approval are still needed. No Lighthouse/Core Web Vitals run or deployment verification was performed.
