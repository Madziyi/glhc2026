# GLHC 2026 — stable context

## Purpose
A mobile-first cinematic invitation to a Great Lakes water-quality data hackathon. Students use open hardware and real water-quality datasets to invent public-facing installations. The website must explain the challenge, emphasize no previous experience is required, communicate the $500 winning-team prize/public-display possibility, and convert visitors to an external Luma registration page.

## Primary users
Interested students across all disciplines, including first-time hackathon participants, plus organizers reviewing the event.

## Core principles
- Make the event understandable from the first screen, without watching animations.
- The opening uses a photorealistic Great Lakes surface-to-underwater scroll story.
- Mobile is the primary layout, with tablet/desktop composed deliberately.
- Prevent performance, motion or WebGL requirements from blocking basic content.
- Show real RAEON hardware accurately; concept frames are not documentation of submerged equipment.

## Stack
Astro + TypeScript shell, static build, CSS and progressively enhanced scroll animation; GSAP and Three.js reserved for later 3D glider pass. No backend, database, authentication, or user data collected on the site. Luma handles registration on their platform.

## Source of truth
`src/pages/index.astro`, `public/styles.css`, `public/main.js`, `public/site-config.js`. Public source photographs included for initial proof of concept; production asset rights/quality still require organizer confirmation. The registered event URL is blank until supplied.

## Constraints
- Mobile first, accessible navigation and prefers-reduced-motion mode.
- Do not invent a Luma registration URL, event date, venue, eligibility restrictions, or equipment accuracy.
- No water-quality data playground in the current scope.
- Never store secrets. Any live/deployment claim must be verified externally.

## Deliverables
An opening demo, informative challenge/participation copy, closing Luma CTA, and a cross-runtime context system for planner (Terra) and local UAT/code agent (Sol).
