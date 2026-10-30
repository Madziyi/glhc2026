# Opening water and deployment pass

ProductionOpening only. Approved boat/glider models, path,13.5s narration/captions and science end pose preserved. Other scene/default water callers keep production=false; website water source unchanged.

Surface: production-only320x320 regional/exponential water grid, dense around the boat-to-buoy corridor;72% previous displacement scale.1280x720 planar reflection render via pinned Three Reflector, filtered/distorted in the water shader. Above-water boat/glider/buoy reflections; reflection pass skipped underwater. Local elongated glider-entry normal disturbance replaces conspicuous torus rings.

Deployment:30 small physical bubble meshes from the brief entry emission;22 tiny ballistic spray droplets; both time-limited.150 faint underwater particles. Old rough spheres/rings disabled only in production. No sustained glider exhaust bubbles.

Lighting: production material patch preserves prior hull-paint shader, attenuates red with depth, applies restrained animated caustic light. Underwater vignette and subpixel waterline blur. CPU production-water-height.mjs matches the vertex wave field for camera submersion. Background lower hemisphere uses depth colour. Camera near plane reduced .08->.015 only in production to remove close-surface clipping band. Geometric route unchanged.

Verification: first surface/underwater/buoy reflection images inspected. Initial pale waterline band traced through background and near clipping; near-plane correction removed it in frame90. All405 path samples finite;172 underwater/transition frames exclude sensor region, zero intersections. Wave-relative camera crossings3.0333s and8.7s. Full final export/decode/audio evidence in evidence/water-deployment-*.

Output out/opening-water-detailed-pass.mp4. Original full rough and prior passes retained. No sound-design/music/audio replacement in this visual pass; final spoken.com correction remains organizer-owned. Next production work is consistency of later sections/transitions and sound, subject to organizer review.
