# GLHC-002R6 — procedural lake / final water milestone

Date: 2026-10-20. Branch: `feat/glhc-001-opening`.
Baseline: `00ed9c41af5020f32f9b01e4fc565ad798bffa83` (R5).
Status: implemented; organizer visual review and physical-device performance acceptance pending.

## Implementation and boundaries

- One elapsed-time clock runs the CPU hull sampler and GPU waves at **1.25×**.
  Base amplitudes are unchanged. A shared coefficient table generates the GLSL
  base-wave function, preventing CPU/GPU coefficient drift. Buoy lift remains an
  area sample; slopes drive pitch/roll with exponential elapsed-time damping.
  Hidden tabs pause the wave clock and resume without a phase jump.
- Hull-centered waves now displace geometry as well as its normals. Uneven
  outgoing rings start outside the flotation hull, decay offshore, and respond
  subtly to the sampled hull attitude. Reflection highlights follow these normals.
- One nonuniform **128×128** water grid replaces both overlapping water meshes.
  Its spacing is concentrated near the hull and expands toward ±2,500 world
  units. Broad waves blend continuously into low-frequency distant waves. There
  is no transparent patch overlap, separate reflection scene, heightfield, fluid
  simulation, new dependency or postprocessing.
- Procedural sky, atmospheric horizon, distance haze and opaque double-sided
  water replace the photographic composite. Actual camera height relative to
  waves controls sky/underside immersion. Underwater fog and the directional
  lighting transition remain lightweight. Static/initial/reduced-motion backgrounds
  use CSS gradients and request no lake photograph.
- Organizer's additional sunny reference is implemented as clearer blue sky,
  warm horizon light, soft procedural clouds and brighter reflected glints.
  Plants are excluded. The reference image is not shipped as a background.
- Follow-up material review: the organizer approved silver upper metalwork and
  lighter dark-blue solar glass, then requested the original yellow and underwater
  appearance. Runtime material overrides preserve the GLB. A generated 128x64
  daylight environment is baked once for restrained metal/glass reflections;
  it adds no per-frame scene reflection. The original direct lights are restored.
  Yellow/sonde/ballast materials receive no added environment light. Shared steel
  batches blend back to their original color, roughness, metalness and environment
  response below the surface, without splitting or changing approved geometry. The environment is assigned to selected materials explicitly; it is not a scene-wide environment, so original yellow and instrument materials receive none.
  Water transmission is brighter teal; underwater haze remains unchanged.
- Development-only `?compare=1` exposes a shared **1.0× / 1.25×** speed selector;
  changing it preserves the current phase by source design. Production omits this control. The optional browser interaction check did not complete before the capture deadline; its two settings are not claimed as browser-tested.
- Buoy GLB and builder, homepage, main-site photographs, prose, camera timeline,
  one horizontal transition, registration and collage remain unchanged.

## Automated and browser checks

- `npm test`: **9/9 passed**, including generated CPU/GPU base-wave parity,
  speed/amplitude separation and localized, finite, dissipating hull ripples.
- `npm run check`: **0 errors, warnings or hints**.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: **passed**. Existing Vite chunk-size
  warning remains. `git diff --check`: passed.
- Production matrix: **320×650, 390×844, 768×1024, 1440×900**. Surface, crossing,
  underwater, sensors/paragraph A, paragraph B, descent and reverse-to-surface
  were captured. No horizontal overflow in any state. First Tab focuses the
  skip link. Reduced-motion toggle and forced fallback expose both paragraphs
  in a static layout without overflow. Initial emulated OS reduced motion and
  actual JavaScript-disabled contexts also expose both paragraphs.
- No application exceptions or shader errors in the completed production matrix.
  The narrow run recorded four Chromium **GPU stall due to ReadPixels** driver
  warnings during capture; the other three viewport logs were empty. These
  warnings are preserved in the raw JSON, not hidden as a clean console claim.
- The full matrix predates the final sunny palette/cloud refinement; final
  sunny/material surface, crossing and sensor captures are saved separately under `handoff/`.
  The sunny change does not alter layout, camera, fallback behavior or buoy waves.

## Evidence index

All paths are relative to `uat/glhc002-r6/`:

| Evidence | Paths |
| --- | --- |
| R5 unchanged surface videos (15 seconds after readiness) | `r5-mobile.webm`, `r5-desktop.webm` |
| R5 surface stills | `r5-mobile-surface.png`, `r5-desktop-surface.png` |
| R6 complete production runs, beginning with 15 seconds fixed surface animation | `final/r6-mobile.webm`, `final/r6-desktop.webm` |
| R6 surface, halfway, underwater, sensors, paragraph B, descent, reverse, reduced, fallback | `final/r6-{narrow,mobile,tablet,desktop}-{state}.png` |
| Initial reduced-motion and no-JavaScript | `final/reduce-initial.png`, `final/no-js-initial.png` |
| Latest sunny/material surface, crossing and sensors | `handoff/{narrow,mobile,tablet,desktop}-{surface,crossing,sensors}.png` |
| Latest surface recordings | `handoff/{mobile,desktop}-surface.webm` |
| Matrix raw results | `final/results.json` |
| Controlled production R5/R6 samples | `comparison.json` |
| Latest runtime/still results | `handoff/results.json`, `handoff/stills.json` |

The full R6 videos include the state checks after the initial fixed-camera segment.
Export finalized successfully (mobile 2:35.16, desktop 3:25.56); the long duration
reflects slow headless screenshot capture. These are browser recordings, not
physical-device recordings. R5 and R6 use the same model, camera positions,
direct lighting and CSS viewport sizes. Sky/reflections and the requested upper material finishes differ by design. The recording-free comparison predates the final sunny/material polish.

Capture scripts: `baseline.mjs`, `verify.mjs`, `compare.mjs`, `handoff.mjs`, `finish-stills.mjs` in the
same evidence directory. Set `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH` and, where
needed, `PLAYWRIGHT_BROWSERS_PATH` to installed local runtimes. `verify.mjs` accepts
`UAT_URL`. `baseline.mjs` must target the unchanged R5 snapshot via `R5_URL`.
Comparison uses R5 production port 4333 and R6 production port 4332. Rebuild
the selected revision before recording; do not overwrite the R5 evidence with R6.

## Performance evidence and limits

- GLB unchanged: **181,648 bytes**.
- Renderer: **11 draws / 44,916 triangles**, versus R5 **11 / 48,304**. One water
  draw plus one sky draw replaces the two former water draws. No extra scene pass.
- Final deferred scene: **616.71 kB minified / 159.52 kB gzip**, up **4.52 / 1.50 kB**
  from R5's **612.19 / 158.02 kB**. Bootstrap: **2.91 / 1.27 kB**. The prototype also avoids requesting
  the former **237,222-byte** photographic background.

Full-matrix local production measurements before the sunny polish:

| Viewport | Navigation to ready | Frame interval median / p95 / max (ms) |
| --- | ---: | ---: |
| 320×650 | 900.5 ms | 49.9 / 50.1 / 66.8 |
| 390×844 | 6,124.1 ms | 266.7 / 449.9 / 800.1 |
| 768×1024 | 813.7 ms | 383.3 / 483.4 / 500.0 |
| 1440×900 | 654.9 ms | 450.1 / 650.0 / 699.9 |

Separate 15-second fixed-camera production samples without recording:

| Viewport | R5 median / p95 | R6 median / p95 |
| --- | ---: | ---: |
| 390×844 | 283.3 / 433.3 ms | 66.6 / 83.4 ms |
| 1440×900 | 116.7 / 133.4 ms | 133.4 / 150.0 ms |

Both report **ANGLE / Vulkan SwiftShader software rendering**. This is a
controlled browser/configuration comparison, not a calibrated hardware benchmark;
capture overhead, host contention, cache and sequential order vary substantially.
This comparison predates the final upper-finish environment map and does not measure its final material cost. The desktop sample regressed about 14% in median interval even though triangles
decreased; the mobile-size sample improved. Do not infer physical mobile GPU FPS
or general performance superiority. Readiness samples are local and unthrottled;
there is no physical iOS/Android test, representative mobile network, GPU timer,
memory profile or demonstrated 10-second mobile readiness acceptance.

## Visual assessment and stopping decision

The procedural version removes the static photo/surface mismatch and mesh join;
outgoing hull ripples have geometric shape, and the underwater view loses the
photographic horizon. Retain this isolated R6 candidate for organizer review.
It remains stylized: the distant horizon can show orderly wave bands, reflections
are analytic rather than scene reflections, and fine detail is not photorealism.
The default 1.25× phase is covered by shared-wave tests and reported in runtime datasets; the optional speed-selector interaction was not completed; whether its motion and
the final sunny appearance feel natural is an organizer judgment from the saved
recordings. Physical-device performance acceptance remains open.

No further water engine experiment, merge, deployment or homepage integration is
authorized by this handoff. Next: organizer reviews R6, then continues the
GLHC-003 planning handoff in `GLHC-003-PLANNING-HANDOFF.md`.


## Final finish verification addendum

- User approved the upper silver/blue finishes and requested the original yellow
  and underwater appearance. Final surface and sensor captures confirm that split.
- `handoff/` contains surface/crossing/sensor stills at all four requested sizes,
  plus finalized mobile and desktop videos beginning with 15 seconds at a fixed
  surface camera. `handoff/results.json` records mobile/desktop startup and last
  observed frame intervals; `handoff/stills.json` records the narrow/tablet states,
  no horizontal overflow and no page exceptions. Chromium capture-driver warnings
  remain separate from application errors in the raw results.
- The recording helper reached its 240-second deadline after completing both
  requested recordings; the narrow/tablet still helper saved all six stills before
  its 120-second deadline. The optional development speed-selector interaction
  did not finish. No claim is made that both selector options were exercised.
  Intermediate failed/pale-finish captures were removed; complete baseline and
  pre-polish matrix evidence remains under the labeled `final/` directory.
- Final code also guards the radial shader angle at the exact hull center against
  an undefined two-zero arctangent. Nine tests, clean Astro diagnostics and the
  production build passed after this numerical guard.

- Final requested-finish local ready samples: mobile **1,320.6 ms**, desktop
  **1,470.7 ms**; narrow still run **1,907.8 ms** (tablet resized in that same
  session). Last observed capture-frame intervals were **466.7 ms** mobile and
  **616.5 ms** desktop. These slow SwiftShader/capture observations are not a
  sustained distribution or physical-device performance result; final PBR
  material cost has not been isolated from host and recording overhead.
