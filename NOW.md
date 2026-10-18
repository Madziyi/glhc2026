# Active Initiative

**Initiative:** GLHC-001 — cinematic opening implementation and browser UAT
**Status:** PARTIAL — workspace baseline synced to the feature branch; tests, build and responsive browser UAT completed; pending review
**Planning & initial implementation:** Terra
**Next implementation and browser verification:** Codex Sol

## Goal
Build a mobile-first, photorealistic surface-to-underwater scroll opening featuring the buoy, glider, five narrative stages, novice-friendly event messaging and a final Luma registration handoff.

## Scope
- Above-water buoy with realistic background; glider descending below a moving waterline.
- Scroll in both directions, no scroll hijacking, accessibility and fallback.
- Clear prize and public-display invitation; no experience required.
- End registration CTA reads validated `window.GLHC_CONFIG.lumaUrl` from `public/site-config.js`.
- Responsive challenge, team and final CTA sections.

## Non-goals
- Final GLB reconstruction and accurate submerged buoy structure.
- Back-end registration, payment, email capture, sensor dashboard or sample-data playground.
- A live deployment before Luma URL and rights review.

## Blockers / boundary
- Real Luma registration URL not provided; CTA intentionally disabled.
- The Luma registration URL has not been supplied, so the CTA remains disabled.
- Provisional glider cutout quality is insufficient for final release; proper 3D glider/model must be assessed.
- Need asset usage approval from RAEON.

## Acceptance
See `docs/SOL_UAT.md`. Implemented code and tests are not proof of a deployed website.

## Verification
- `npm install`: completed, 455 packages added; npm reported 3 dependency vulnerabilities (1 low, 1 high, 1 critical).
- `npm test`: passed, 3/3.
- `npm run build`: passed with `ASTRO_TELEMETRY_DISABLED=1`.
- Browser UAT: 320×650, 390×844, 768×1024 and 1440×900; no horizontal overflow or page errors; scene reversal and reduced-motion fallback verified.
- Screenshots: `uat/` contains the surface hero, waterline transition, underwater glider and registration ending at all four viewport sizes.
- See `docs/SOL_UAT.md` for the exact run record. No deployment was performed or verified.

## Next action
Terra reviews the feature-branch handoff. Before production, replace the visibly water-fringed glider cutout with a verified asset, confirm photo rights and provide the real Luma registration URL.
