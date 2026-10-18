# GLHC 2026 — Project Contract

Mobile-first, cinematic Great Lakes hackathon website. Surface buoy → waterline → underwater glider → beginner-friendly challenge → registration on an external Luma event page.

**Goals:** Students understand the event, the $500 winning-team prize, possible public displays, and that no previous experience is necessary. Photorealistic Great Lakes artwork, accurate RAEON equipment, reversible mobile scroll. Responsive tablet/desktop layout.

**Stack:** Astro / TypeScript, layered 2D assets, progressive enhancement; GSAP ScrollTrigger and Three.js only when adding visible value. No backend, database, authentication, or in-house registration.

**Boundaries:** Do not invent Luma URL, venue, event schedule or accurate underwater equipment geometry. Data-to-art playground deferred. Reduced-motion fallback, no scroll trapping, no false claims of live deployment. Production image rights must be checked.

**Source:** `src/pages/index.astro`, `public/styles.css`, `public/main.js`, `public/site-config.js`; full prepared asset and source bundle delivered separately for Sol import/UAT. GitHub main is the shared source of truth after review.
