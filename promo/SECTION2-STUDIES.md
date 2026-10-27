# Section2 / comparative motion studies

Two silent12-second1920x1080/30FPS studies. This replaces the former repeated headline/illustration/caption direction. No persistent text or tiny slogans. Both end in a drawn trace on warm paper to connect to the student-idea section.

A / Section2Concept: real Three.js geometry and animated lighting in a continuous space. Camera travels from luminous sculpture to water/sound bowl to moving shells. Original concept objects, not reconstructions of named installations. Abstract signals are visual metaphors, not water-quality readings. Geometry/material/lighting/camera are editable in src/section2.jsx.

B / Section2Photos: original photographs extracted unchanged from the organizer-supplied Hackathon prep powerpoint.pptx. Camera-like pan/zoom and expanding ripple masks connect the images; the trace overlay is conceptual. The actual photos remain still photographs, not footage of installations in operation.

## Common script

Turn a measurement into light. A changing pattern into sound. Or build something that moves with the data. What would you create?

## Source images / credits

- public/section2/pool-light.jpg: deck slide3, original image6.jpg. +POOL Light. Deck source: https://pluspool.com/programming/details/light-installation/
- public/section2/ripple-effect.png: deck slide2, original image5.png. Ripple Effect. Deck references Kaufman/Kaufmann et al.; exact photograph copyright/credit not specified in the supplied file.
- public/section2/clams.jpg: deck slide7, original image10.jpg. CLAMS by Marco Barotti. Deck sources: https://www.marcobarotti.com/CLAMS and https://ars.electronica.art/outofthebox/en/clams/

These are existing independent works used as inspiration, not prior hackathon participants' projects. Organizer supplied the deck for this internal comparison. Public-release image permissions/credit details remain unverified. No deck edits were made.

## Render

npm run render:section2:a
npm run render:section2:b

Remotion Studio exposes both compositions. out/ is local/ignored. Source assets are versioned for reproduction. No music or voiceover added. Section1 remains a discussed direction and is not represented as implemented by these studies.


## Selected A revision / LED screen (2026-10-26)

Organizer selected A and replaced its third installation (shells) with an animated LED display. Current A output: out/section2-a-led-display.mp4. The light sculpture and water/sound station remain; camera now pushes toward a freestanding screen. Its shader fills the geographic Great Lakes silhouettes with evolving currents, luminous ribbons and subtle color changes. No numerical dashboard or extra copy. It expresses a possible environmental artwork; no actual measurements, validated thresholds or water-safety classifications are claimed. A final scientific mapping remains future design work.

Revised proposed voiceover: "Turn a measurement into light. A changing pattern into sound. Or bring the Great Lakes to life through animation. What would you create?"

Previous shell version output and B are historical alternatives. The existing photo version is unchanged. New LED artwork uses the already credited public-domain Natural Earth lake outlines; all display geometry and shader animation are original and editable.


## Current selected A / BE CREATIVE (2026-10-26)

Organizer replaced the LED lake artwork with animated words BE CREATIVE within the physical display. Each letter rises into place in a staggered reveal, followed by a flowing illuminated color treatment. Typography is a CanvasTexture inside the3D screen, so perspective/camera movement remain natural. No overlay slogan was added elsewhere. Light sculpture, water/sound installation and paper-transition ending remain.

Current output: out/section2-a-be-creative.mp4. Previous screen artwork is historical. Proposed narration: "You can express the data through light, through sound, or through a digital display. Be as creative as possible." Audio remains a future pass; existing12s timing is adjustable.
