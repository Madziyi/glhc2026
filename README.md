# Great Lakes Data Hackathon Challenge (2026)

Mobile-first storytelling website for a beginner-friendly Great Lakes data hackathon. Opens with a scroll-driven lake-surface / underwater journey and ends with a Luma registration CTA.

## First implementation (GLHC-001)

- Five reversible scroll story beats featuring a buoy and an underwater glider.
- Layered photographic water, moving waterline, responsive copy and prize messaging.
- Informative event section, novice-friendly messaging, real project photographs.
- End registration CTA, configurable in `public/site-config.js` (no fabricated Luma URL).
- Semantic content and reduced-motion fallback, skip intro, keyboard navigation.

**Visual status:** The buoy and glider are provisional image cutouts, not approved 3D models; no accurate underwater buoy mooring geometry has been invented. Realistic Three.js glider enhancement is a later bounded task, not already complete.

## Setup

```bash
npm install
npm run dev
npm test
npm run build
```

Set the registration URL in `public/site-config.js`:

```js
window.GLHC_CONFIG = Object.freeze({ lumaUrl: 'https://lu.ma/ACTUAL-EVENT' });
```

Only use the real URL once supplied by the organizer. The button stays disabled until then.

## Structure

- `src/pages/index.astro`: semantic site content, layout sections.
- `public/styles.css`: mobile-first cinematic styling and responsive layers.
- `public/main.js`: scroll progress, story changes, reversible transforms, Luma link behavior.
- `public/assets/`: web-optimized provisional imagery.
- `scripts/prepare_assets.py`: repeatable extraction from organizer-provided images (offline tooling).
- `tests/`: zero-dependency source contract tests.
- `docs/`: production notes and Codex Sol UAT instructions.
- `AGENTS.md`, `NOW.md`, `PROJECT.md`, etc.: durable human/agent shared context.

## Important limitations

The current scroll driver is vanilla `requestAnimationFrame` for a lightweight, dependency-free first pass. `gsap` and `three` are listed in the planned stack, but are not wired to the visual timeline yet. Sol should prioritize mobile browser UAT and photorealistic asset improvement before increasing rendering complexity. The repo includes an Astro source file; build verification requires `npm install`, which was unavailable in the initial authoring environment.

Credits: RAEON / GLOS scientific equipment imagery supplied by the project organizer; confirm public reuse permissions before launch. Do not describe illustrated underwater structures as measured hardware.
