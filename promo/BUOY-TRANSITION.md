# Buoy-to-waterfront revision

The film runtime removes64 triangles belonging to the short angled cable stub in the combined Marine_fasteners_and_fittings mesh. Filtering uses the isolated local bounds x(-.10,.02), y(-.96,-.76), z(-.10,.10). It retains other fittings and probe geometry. Shared website GLB is not modified.

ProductionScience frames280-317 blend directly into ProductionWaterfront local frames-38..-1 with smoothstep opacity. RoughWaterfront accepts frameOverride and silent so the incoming scene can render before its nominal start without duplicate narration. Both former navy bridge overlays are disabled/removed in production. Waterfront local0 follows the preview local-1, maintaining environmental and particle animation continuity. Rough/default science still retains its historical fade.

Production manifest now points to opening-clean-buoy.mp4, science-seamless-waterfront.mp4 and waterfront-no-dark-fade.mp4. Other approved sections and2058-frame68.6s timing are retained. Full cut is glhc-production-seamless.mp4; original continuous narration is mapped once. Spoken domain correction remains separate.

Evidence: buoy-seamless-transition.json, buoy-waterfront-transition-review.jpg and assembled-production-verification.json. No deployment changes.
