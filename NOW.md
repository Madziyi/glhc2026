# Active Initiative â€” GLHC-004 Promo opening prototype

Status: prototype rendered and locally verified; organizer review pending on `codex/promo-prototype`, synced to main `55a9194`.

Organizer explicitly reprioritized to a 10â€“15-second motion-graphics prototype inspired by the supplied Nations Championship explainer. Website review context is preserved in `promo/WEBSITE-HANDOFF.md`.

Scope: isolated Remotion project in `promo/`, original vector graphics, geographic Great Lakes silhouette, kinetic text, silent 1920Ã—1080/30FPS opening and local preview. Website source stays untouched.

Decisions: official name Great Lakes Hackathon Challenge. Top winners WILL have their designs displayed at tourist attractions. No prize values invented. Navy/yellow/aqua branding. Audio arrives later; timing remains editable. Conceptual data graphics carry no fabricated scientific readings.

Acceptance: render a playable 10â€“15s MP4; inspect representative frames and browser preview; provide source and durable handoff.

Verification: Remotion rendered all 450 frames. OpenCV decoded all 450 frames, 1920×1080, 30FPS, 15 seconds. Representative frames visually inspected; opening adjusted to retain all five lakes. Existing website tests pass 15/15. `git diff --check` passes. Remotion Studio loaded in the in-app browser; custom review-page browser UAT is unverified after two localhost connection failures. MP4 delivery is available directly at `promo/out/glhc-opening.mp4`.

Known limits: silent landscape opening only; full promo, final audio timing, and vertical adaptation remain future work. Local render browser requires elevated execution in this environment. Browser preview connection hypotheses: Python server reachability/firewall or IAB localhost routing. No production deployment.

Next action: organizer watches MP4 and reviews graphics/pacing before extending the promo.
