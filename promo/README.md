# Great Lakes Hackathon Challenge · motion graphics

Silent 15-second opening and full 75-second promo, both 1920×1080 at30FPS. Audio comes later. All animated artwork is editable SVG/HTML; no external footage is required.

```powershell
cd promo
npm ci
npm run studio
npm run render
```

The render command writes `out/glhc-opening.mp4`. Remotion Studio provides playback and a frame scrubber. Edit opening timing and copy in `src/opening.jsx`; composition registration is in `src/index.jsx`.

## Timing

- 0–4.17s: expanding pulse, geographic lakes, “What if you could hear the lakes?”
- 4.17–7.9s: “Turn data into feeling” and abstract waveform.
- 7.9–11.6s: light/sound/movement and a conceptual kinetic light installation.
- 11.6–15s: official event title and “No experience needed.”

Navy #052638, yellow #ffd450, aqua #89d3d0 and white #f6f6ed connect to the website. Illustrations and waveform are conceptual, not sensor readings or prior participant projects. The standalone opening excludes dates/prizes; FullPromo includes supplied dates, cash prizes and the guaranteed public-display commitment for top winners.

## Sources and rights

Great Lakes outlines: Natural Earth `ne_10m_lakes.geojson`, public domain, https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_lakes.geojson . Five named lake polygons projected into SVG coordinates; islands retained as geographic rings. Original graphic scenes authored for this prototype.

Google Sans copied from the website's locally hosted font; OFL license included in `public/OFL.txt`.

Review Remotion's applicable license before organizational/commercial production use: https://www.remotion.dev/license .


## Full promo / silent draft 01

Organizer approved the opening on October25,2026. `FullPromo` extends it to75 seconds,2250 frames at1080p/30FPS. `Opening` remains available unchanged. Run `npm run render:full` to export `out/glhc-full-promo.mp4`.

Full timeline: opening0–15s; student invitation15–23s; Round1 idea submission23–31s; ten ideas advance31–38s; supported Round2 building38–47s; build/test/showcase47–55s; cash prizes55–61s; guaranteed public displays for top winners61–68s; submission dates/deadline/link68–75s.

Content follows the organizer's pasted event brief and subsequent explicit name/display corrections. November5–December3,2026, December3 11:59PM Eastern deadline and raeonhacks.com/project were directly supplied; no live portal availability is asserted. No award values/funding amounts invented. Concept graphics depict possible projects rather than prior entrants' work. Full editable scene source is `src/full.jsx`.

Verification helper: `python verify-render.py` uses OpenCV/Pillow to decode the full export, sample the opening against the approved MP4 and create a scene contact sheet. Local outputs stay in ignored `out/`; final verification/contact sheet are preserved in `evidence/`.
