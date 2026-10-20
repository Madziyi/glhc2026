# GLHC-002R3 — Advanced Water Rendering Comparison

**Status:** comparison prototype ready for organizer visual review; no production integration or deployment.
**Route:** `/prototype/glhc-002?compare=1` (`water=a` or `water=b`)
**Working branch:** `feat/glhc-001-opening`

## Scope and controls

The page exposes a development-only A/B selector when `compare=1` is present. Version A retains the photographic lake, analytic displaced surface, Fresnel-like shader, and shared analytic buoy bob. Version B adds a 128×128 half-float GPU heightfield with ping-pong updates and buoy-centered impulses. It samples that field for local surface displacement and normals. Both versions share the same approved GLB, materials, camera, scroll timeline, broad swell, atmosphere, and lighting. No buoy source or exported model file changed.

The GPU field is initialized only in comparison mode. Version B is disabled when WebGL2 or `EXT_color_buffer_float` is unavailable. Its local ripple field is a visual interaction, not a full buoyancy solver: the buoy continues to bob against the common analytic swell, and the GPU ripples do not feed back into buoy position. There is no raytraced scene reflection/refraction or differential-area caustic pass.

The upstream [ThreeJS Water repository](https://github.com/jeantimex/threejs-water) was reviewed. Its README describes GPU ping-pong heightfield simulation, Fresnel reflection/refraction, and differential-area caustics, and its project license is MIT. No upstream source was copied or vendored; the small wave update was written for this scene using the existing Three.js dependency and its GPUComputationRenderer add-on. The upstream MIT notice therefore remains with the upstream project; this implementation includes attribution through this reference link.

## Visual comparison and UAT

The Codex in-app browser rendered and displayed A and B captures at **1280×720** for the surface, waterline approach, sensor pause, and fully descended view. The camera returned from the bottom to 0% progress, confirming reverse scroll continuity. The screenshots were visible in the browser-review session but that browser provider did not export captured pixels as repository files. No offline Blender renders were produced; Blender is unavailable. No motion recording was supported.

| Moment | Version A | Version B | Observation |
| --- | --- | --- | --- |
| Surface with buoy | Captured | Captured | Same model and composition. GPU ripples add a localized, finer wake; overall surface still reads as a shader/photo composite. |
| Approaching water | Captured around 26% | Same route and timeline available | Broad swell, buoy position, and camera are shared. |
| Halfway through surface | Exercised while crossing | Toggle remains available | A single screenshot cannot establish continuity; animation remains live while scrolling. |
| Fully underwater / upward surface view | Captured at 100% | Captured at 100% | Added far swell and lower grazing-angle opacity soften the seam slightly, but the surface still projects as a mostly straight boundary. |
| Sensor close-up | Captured at the sensor pause | Captured at the same pause | Buoy, sonde, cage, copy, and lighting composition match. GPU ripple differences are subtle at this camera angle. |
| Reverse to surface | Verified with keyboard Home to 0% | Same deterministic camera timeline | No camera discontinuity observed. |

**Responsive/browser limits:** The active in-app browser remained 1280×720. It did not expose a viewport-resize capability, so the requested 320×650, 390×844, 768×1024, and 1440×900 capture matrix was not completed for this pass. Physical iOS Safari and Android Chrome were unavailable. This is desktop browser evidence only.

## Performance evidence

- `npm test`: 6/6 passing.
- `npm run check`: 0 errors, warnings, or hints.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: passed. The deferred scene chunk is **615.71 kB minified / 159.07 kB gzip**, compared with R2's **608.46 kB / 156.75 kB gzip**: **+7.25 kB minified / +2.32 kB gzip**. The Vite 500 kB warning remains.
- Approved buoy GLB remains **181,648 bytes** and unchanged. The scene readout showed **11 main-scene draw calls / 48,304 triangles**. The GPU heightfield adds one 128×128 compute pass per rendered frame while B is active; Three's per-render `renderer.info` readout resets before the visible scene pass, so that compute pass is not included in the on-page count.
- At 1280×720, visible desktop `frameMs` samples varied around **11–22 ms** during browser interaction; first activation of B showed one **55.6 ms** interval. A local production-preview sample measured **553.9 ms** from scene-script start to model-ready with a warm model cache. This is not cold first-load time, full page load, or a five-second target result. These samples are not GPU-time queries, sustained FPS, or proof of mobile performance. Memory, physical devices, Lighthouse, and cold resource timing were not measured. No five-second acceptance target is specified in the checked project context.

## Assessment and recommendation

Version A is simpler and remains the production recommendation until Version B demonstrates a clear visual gain on the requested responsive matrix and physical mobile hardware. B gives a useful localized height ripple with a small transfer increase, but it does not correct the remaining straight submerged surface boundary by itself and incurs a GPU compute pass plus a WebGL2 float-target support requirement. Keep both versions isolated for organizer review. Do not merge, deploy, or integrate into `/` until the organizer approves the visual quality.

## Verification boundary

This pass does not verify physical buoyancy, accurate optical refraction, GPU time, memory, touch interaction, or mobile frame stability. Browser captures are session-visible evidence, not committed image artifacts. The root homepage and approved buoy model remain unchanged.
