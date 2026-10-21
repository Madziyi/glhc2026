# GLHC-003 — Organizer assets and external registration link

**Supplied 2026-10-20.** The two missing content inputs are now available.

## Water-quality communication inspiration collage

- Source: organizer-attached `collage.jpg` (1080×1080 original).
- Prepared media handoff: `GLHC-003-collage-assets.zip` in coordinating ChatGPT thread, with:
  - `public/assets/glhc-communication-collage-640.webp` (640×640, responsive smaller image).
  - `public/assets/glhc-communication-collage-1080.webp` (1080×1080, larger image).
  - `source/collage.jpg` (original copy, for provenance; do not include source in site build unless needed).
- **These binaries are not yet checked into GitHub.** Codex must import from the ZIP to this branch and check image rendering in its browser. Do not imply that docs alone supply the binary assets.
- Display as **one static, square collage image** at Scene 4, not an interactive grid or carousel. User explicitly supplied this single image in lieu of earlier unspecified four-photo composite. It visibly contains three regions; do not add or generate extra imagery.
- Suggested alt text: “Collage of a green illuminated waterfront installation, an electronics controller with lights, and a purple LED display.”
- Suggested introduction: “There’s inspiration to draw from.” Treat as illustrative inspiration, not projects produced by hackathon entrants.
- Display image at full square ratio with responsive max-width and optimized image selection. Preserve its legibility and don't crop the LED panel. Lazy-load when below first viewport.
- Confirm rights to publish third-party/example images before public deployment; provided for prototype and planning use.

## Luma registration

- **Exact user-supplied destination:** https://luma.com/pz0iw2m7
- `public/site-config.js` now defines `window.GLHC_CONFIG.lumaUrl` with that value on the development branch.
- Both the navigation registration shortcut and final “Register Now” control must use the same central configuration, via a secure `https://` link, `target="_blank"` and `rel="noopener noreferrer"`.
- Verify button/navigation behavior in browser and ensure keyboard accessible. Page content/current availability not independently inspected; do not assert registration is open or publish inferred date/location/fees.
- If Luma does not load or event is closed, show truthful status rather than silently changing destination.
