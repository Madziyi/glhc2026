# GLHC-003 browser evidence

The scripts verify a **local production build**, not a deployed site or a physical phone.

## Reproduce

Use an installed Playwright module, Chromium and ffmpeg. Configure `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`, and `PLAYWRIGHT_BROWSERS_PATH` for your machine. Run the production preview and set `UAT_URL` (default `http://127.0.0.1:4334`).

- `node uat/glhc003/verify.mjs`: four viewport full journey, screenshots, mobile/desktop recordings, reverse scroll, landscape resize, first keyboard focus, secure registration popup and motion toggle. `UAT_SIZE=narrow|mobile|tablet|desktop` selects a run; `NO_VIDEO=1` skips recording.
- `node uat/glhc003/fallbacks.mjs`: actual no-JavaScript, OS reduced motion, forced fallback, blocked WebGL, delayed model with timeout/retry, plus isolated prototype regression.

Per-viewport JSON includes browser errors/warnings, CSS viewport sizes, hero/image/badge bounds, registration link properties and popup outcome, loading/paint timings, camera/panel states, draw calls/triangles and short animation-frame samples. Software rendering/capture overhead means these intervals are observations, not a calibrated device benchmark.

Screenshots are named by viewport and chapter. `*-walkthrough.webm` contains each complete scripted mobile/desktop journey, including reverse scrolling and viewport changes. No registration form is submitted.

See `docs/GLHC-003-UAT.md` for final results and remaining physical-device/release checks.

Final evidence additions:
- `final-stills.mjs` saves the corrected nine-state compositions in `final/` at all four sizes and verifies native refresh restoration on paragraph two. It caps requestAnimationFrame at4FPS only inside the capture browser, reducing software-renderer load; shipped code is unchanged.
- `record-final.mjs` captures final mobile/desktop native smooth-scroll walkthroughs with the same capture-only cadence cap. These are composition/state evidence, not FPS benchmarks.
- `link-check.mjs` clicks all three actual CTAs and records exact destination, title, secure link attributes and absent opener in `registration-results.json`.
- `final-motion.mjs` was an optional uncapped recapture; export was interrupted and its partial results include the pre-fix refresh defect. It is historical evidence, not the final acceptance result. Use `final-stills-results.json` for the corrected refresh behavior.
- `font-review.mjs` checks that Google Sans is actually loaded and captures the hero and both science paragraphs at all four widths after the organizer's final body-font request.
