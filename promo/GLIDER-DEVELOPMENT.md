# Detailed glider development

Source: organizer screenshots supplied2026-10-30, especially the broadside G3 Slocum Glider views, rear-fin views and nose closeup. Procedural visual reconstruction from those images, not manufacturer CAD or a dimensional engineering model. No third-party model/texture downloads.

Reusable model: src/production-glider.js, bow+Z/up+Y. Smooth revolved yellow hull and charcoal nose; central saddle/clamping rails and fasteners; foil-section wings with thickness; tapered tail, upright rudder, exposed supports, paired rear probes/guards; side ports/vents, curved hull lettering and seeded subtle finish texture.83 meshes/165244 triangles; finite-coordinate and required-part checks in evidence/glider-model-geometry.json. Colour/UV orientation checked in rendered studio review.

Model review: GliderReview,12s1920x1080/30FPS silent orbit. Output out/glider-detailed-review.mp4, hero out/glider-detailed-hero.png. Studio lighting is for geometry/material inspection, not final lake lighting.

Opening integration: ProductionOpening opt-in leaves approved RoughOpening unchanged by default.13.5s source narration retained. Shape-preserving cubic travel replaces stop/start waypoint easing; glider orientation follows its path with a blended release. Broader, slower depth arcs. Brief low-detail fish school3.25-5.65s in background. CASH PRIZES ends frame196, GET FEATURED AT TOURIST SPOTS begins201; event title retained. Boat lower hull darkened below waterline. Fixed buoy and exact science camera handoff retained; all underwater camera frames exclude sensor region.

Production boundary: detailed glider plus first integrated motion pass. Boat geometry, lake/deployment effects, full-film lighting/camera/transitions/music and final spoken.com still need further production work. Earlier complete rough is preserved, not silently replaced by this pass. No full-film rerender/deployment.
