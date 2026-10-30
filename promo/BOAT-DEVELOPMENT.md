# Detailed research launch boat

Original film visualization of a compact lake-research workboat, not a named vessel or manufacturer engineering model. Designed around the approved launch origin and crane-tip coordinates so the shot sequence remains unchanged.

Model: src/production-boat.js. Bow+Z, working deck aft. Continuous lofted deep-V/flared hull, closed transom, boot stripe/antifouling, non-slip deck, wheelhouse lower shell/corner pillars/glazing/helm, roof/mast/radar/antennas/navigation lamps, tubular rails with launch opening, hatches/cleats/locker/work bench, coiled rope/lifebuoy/fenders, hydraulic crane/hoses/pivots/piston rods/winch/pulley, twin inboard shafts/propellers/rudders.187 meshes/60895 triangles; all coordinates finite. Hull/environment dimensions are visual staging units, not an engineering specification.

Production opening uses createProductionBoat only in opt-in production mode. Hook Object3D feeds the rendered cable every frame, including boat bob/roll. Bridle branches connect hub to front/rear glider lifting points before release and then retract. Approved glider/camera paths, timing, fish/captions/fixed buoy and13.5s narration preserved. RoughOpening and full rough retain previous defaults.

Outputs: out/boat-detailed-review.mp4 (12s silent orbit with hanging glider), out/boat-detailed-hero.png, out/opening-boat-detailed-pass.mp4 (13.5s with original narration), out/boat-launch-detail.png.

Evidence: boat-model-geometry.json checks finite geometry/parts and crane tip[-67,4.7,-.3] at rest; boat-model-render.json/boat-model-review.jpg full decode/multi-angle inspection; boat-opening-render.json/boat-opening-review.jpg full decode/launch views/unchanged audio. No external model or texture downloads. No website/deployment or new package changes.

Production work remaining: water/lighting, deployment surface interaction and sound design, final whole-film transition/material polish. Original complete rough preserved. Final spoken.com correction remains with organizer.
