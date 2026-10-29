# GLHC 2026 Task Board

## Active - GLHC-004 revised motion storytelling
- `[superseded style]` - first15s/75s drafts remain historical; organizer rejected the repeated heading/illustration/caption approach.
- `[direction agreed]` - Section1 lake/buoy/sensors/signal journey; not implemented yet.
- `[A selected; revision rendered and verified]` - Section2 A light sculpture, water/sound station and LED display with animated BE CREATIVE lettering, replacing earlier lake artwork and shells.12s1080p30, no persistent text. B retained as historical alternative. See promo/SECTION2-STUDIES.md.
- `[prototype accepted]` - Section2 A BE CREATIVE direction; final camera/material/animation polish still pending.
- `[rendered and verified; review pending]` - Section3 self-drawing invitation, concept drawings, supplied group photo and YOUR IDEA page.10s1080p30, silent.
- `[pending]` - discuss Round1 after Section3 review; final smoothness/animation/audio pass follows agreed sequence.

## Website handoff — GLHC-003
- GLHC-003A `[implemented]` — people-first hero, attached CASH Prizes starburst, tourist-attractions photo annotation and no-experience/public-display copy, immediate registration and progressive moving lake.
- GLHC-003B `[implemented]` — approved R6 scene integrated into a surface camera orbit returning before continuous descent; parked sensors, exact two paragraphs and one horizontal transition with settled reading holds.
- GLHC-003C `[implemented and locally verified; organizer review pending]` — combined section4 with supplied two-round copy and responsive inspiration collage; deep-water buoy-free ending; all registration links use configured Luma destination. Four-section labels, corrected section4 jump and about47% shorter science reveal verified at five viewports plus no-JS/reduced motion (`uat/glhc003/challenge-rounds/`).
- Latest heading simplification `[implemented and locally verified]` — single “4/4: How it works” label; Round 1/2 title prefixes; only Open To Everyone / Build & Showcase subtitles. Mobile/desktop evidence: `uat/glhc003/round-heading-review/`.
- Orbit pumping fix `[implemented and locally verified; organizer review pending]` — damp unrotated camera/target and angular progress before rotation; prevent chord shortcuts and target/camera lag mismatch. Four-size transient radius/endpoint/sensor checks and15 tests pass; evidence `uat/glhc003/orbit-smoothing-final/`. Prototype branch retains original camera behavior.
- Six-second preloader `[implemented and locally verified; organizer review pending]` — exact art/science/technology invitation fades in, holds until6s then overlay/text fade out together. Background scene starts immediately; independent dismissal, interaction restoration, reduced/no-JS, blocked bootstrap and delayed model checks pass. Evidence: `uat/glhc003/preloader/`.
- GLHC-003D `[local verification complete; organizer/device acceptance pending]` — four-size production browser journey, screenshot/video evidence, keyboard, motion/fallback/retry, resize/refresh, actual secure CTA navigation, tests/check/build and performance observations. Physical devices remain external acceptance.
- Organizer buoy detail follow-up `[implemented and locally verified; organizer review pending]` — matching grids on all three panels, white black-capped probe slightly shorter than blue, short black probe, upper cage plate removed and lower plate retained. Four-size evidence: `uat/glhc003/buoy-details/`.
- Organizer homepage reference follow-up `[implemented and locally verified; organizer review pending]` — remove extra introductory/welcome lines, round photo corners, add yellow pill links smoothly navigating to section01 and curiosity/tools; keep fonts and registration. Four-size smooth-scroll plus no-JS/reduced-motion checks: `uat/glhc003/hero-navigation/`.
- Responsive hero spacing `[implemented and locally verified; organizer review pending]` — height/width-aware photo, heading, balanced gaps and compact landscape layout. Entire hero fits11 tested default-text viewports; evidence `hero-balanced/` plus final `hero-balanced-landscape/`.
- Slower section jumps `[implemented and locally verified; organizer review pending]` —3.2-second easing on both hero buttons and cue; mobile/desktop timing at least2x prior native duration, interruption and reduced/no-JS checks pass. Manual scroll/story unchanged. Evidence: `uat/glhc003/slow-scroll/`.

## Accepted baseline
- GLHC-002R6 `[organizer visually accepted / merged via PR #1]` — accepted geometry and procedural lake baseline. Explicit organizer follow-up revises the shared model with panel grids and cage details only; historical R6 evidence predates this revision. No further water-engine iteration.
- GLHC-001 `[superseded]` — prior glider-led opening evidence remains historical; it no longer defines root-page design.

## Organizer review / launch checks
- Review combined section4,1/4–4/4 labels, mobile inspiration placement and shorter science reveal before merging the `codex/challenge-rounds` follow-up. Prior GLHC-003 PR#2 merged as908c22f.
- Physical iOS/Android, representative mobile network, 10-second readiness and release performance acceptance.
- Public publication rights for supplied photography and inspiration examples.
- Security/dependency audit, Lighthouse and deployment approval.

## Excluded
Glider-led core story, fake scientific telemetry, data-art simulator, fabricated schedule/location, custom registration backend and registration gating.

Latest organizer follow-up: hero callout/CASH Prizes wording on `codex/hero-cash-prize` for review after PR#3 merged as386060d. Historical evidence still contains prior dollar/singular copy.

Info-session CTA labels: both header/ending links renamed “Attend the info session”; destination/security retained. Based on main595f8c0 (PR#4 merged), branch `codex/info-session-cta`.

Hero submission dates: supplied Nov5 opening / Dec3 closing text added under description, responsive hero verification in progress on `codex/submission-dates`, based on merged PR#5 main692dcfe.

Submission-date casing: OPEN and CLOSE capitalized; build/diff and320/393/1440px
static browser exact-text/no-clipping checks pass. PR#6 update.

## 2026-10-27 — Info session selector
- [x] Both info-session CTAs now open one modal with two organizer-supplied Luma links; no-JavaScript fallback provides both options.
- [x] Native dialog, Escape/backdrop/close controls, focus return, narrow layouts and reduced-motion CSS implemented.
- [ ] Physical browser/production build UAT not performed by this connector-only edit; verify in deployment before announcing.
