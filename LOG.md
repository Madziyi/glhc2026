# Project Log (append-only)

### 2026-10-18 — GLHC-001 kickoff / first implementation
- Changed: Authored Astro single-page structure, responsive cinematic CSS, reversible scroll controller, provisional photograph cutouts, challenge and registration ending, source contract tests; adapted Terra/Sol context workflow.
- Decisions: Photorealistic hybrid. Start with 2D image masks and prepare 3D only when authentic glider model is available. Luma URL is required before CTA activates. No data-to-art widget.
- Verification: `node --test tests/*.test.mjs` passed (3/3), `node --check public/main.js` passed. Astro install/build and browser UAT not yet verified because authoring sandbox cannot contact npm and blocks local Chromium navigation.
- Live state: No hosting or deployment verified.
- Known issues: Glider cutout provisional; buoy segmentation needs visual review. Luma URL missing. Production asset rights unconfirmed.
- Next action: Codex Sol runs real browser UAT, improves realism, returns screenshots and verification details.

### 2026-10-18 — GLHC-001 branch sync and Sol browser UAT
- Sync: initialized Git metadata for the supplied workspace, fetched `origin/main` (`c9841d7`) and `origin/feat/glhc-001-opening` (`3683301`), then applied the workspace baseline as tracked changes on the feature branch. No remote history was reset.
- Changed: imported the full workspace implementation/context; fixed narrow mobile overlap between HUD and hero kicker; lowered the underwater glider below descriptive copy at mobile/tablet/desktop widths; saved 16 viewport/scene screenshots in `uat/`.
- Verification: `npm install` added 455 packages (npm reported 3 vulnerabilities: 1 low, 1 high, 1 critical); `npm test` passed 3/3; `ASTRO_TELEMETRY_DISABLED=1 npm run build` passed (Astro 5.18.2). Browser UAT passed at 320×650, 390×844, 768×1024 and 1440×900: zero page errors/sideways overflow, scene 04 at progress 0.72, reverse to scene 01, skip link receives first Tab, reduced-motion fallback visible, disabled Luma link has no phantom navigation.
- Limitations: online npm audit could not reach `registry.npmjs.org`; no Lighthouse/Core Web Vitals run or deployment verification. The glider image still has obvious lake-water fringe and requires an approved, verified replacement asset; RAEON usage approval and the real Luma URL remain outstanding.
- Screenshots: `uat/{mobile-narrow,mobile,tablet,desktop}-{surface-hero,waterline-transition,underwater-glider,registration-ending}.png`.
- Next: Terra reviews the branch handoff; GLHC-002 replaces the glider artwork when an accurate approved asset is available.
