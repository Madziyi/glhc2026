import { timelineAt, smooth, STORY } from '../glhc002/timeline.mjs';

const clamp = n => Math.max(0, Math.min(1, n));
const fraction = (y, start, end) => clamp((y - start) / Math.max(end - start, 1));

/** Rotate the camera and its framing target around the buoy, never the model. */
export function orbitView(position, target, progress) {
  // Preserve the approved view exactly outside the orbit, including its endpoint.
  if (progress <= 0 || progress >= 1) return { position, target };
  const angle = progress * Math.PI * 2;
  const c = Math.cos(angle), s = Math.sin(angle);
  const rotate = point => ({ x: point.x * c + point.z * s, y: point.y, z: point.z * c - point.x * s });
  return { position: rotate(position), target: rotate(target) };
}

/** Physical chapter positions come from layout, so native scroll and resize agree. */
export function storyAt(y, bounds) {
  const { surface, crossing, science, scienceEnd, registration } = bounds;
  const approach = smooth(0, Math.max(surface, 1), y);
  const cross = fraction(y, crossing, science);
  const scienceProgress = fraction(y, science, scienceEnd);
  const after = fraction(y, scienceEnd, registration);
  const p = y < crossing ? 0
    : y < science ? STORY.crossStart + (STORY.sensorPark - STORY.crossStart) * cross
    : y <= scienceEnd ? STORY.sensorPark + (STORY.panelEnd - STORY.sensorPark) * scienceProgress
    : STORY.panelEnd + (1 - STORY.panelEnd) * after;
  const t = timelineAt(p);
  // Reserve a genuine reading hold at each settled panel; the single lateral
  // reveal occupies only the middle of the sensor chapter's native scroll.
  if (y >= science && y <= scienceEnd) {
    t.panel = smooth(.22, .62, scienceProgress);
    t.panelIndex = t.panel < .5 ? 0 : 1;
  }
  // A distant opening becomes the approved surface composition, then follows
  // the original crossing. The final descent continues beyond the prototype.
  t.cameraY += 1.2 * (1 - approach);
  t.cameraZ -= 5 * (1 - approach);
  const departure = smooth(0, 1, after);
  t.cameraY -= departure * 11;
  t.targetY -= departure * 12;
  t.cameraZ -= departure * 2;
  t.departure = departure;
  t.sensorProgress = smooth(STORY.crossStart, STORY.sensorPark, p);
  // A full reversible surface orbit supplies the change in perspective. Finish
  // before crossing begins, leaving the existing descent and sensor view intact.
  t.orbitProgress = smooth(.22, .94, fraction(y, surface, crossing));
  t.orbitActive = t.orbitProgress > 0 && t.orbitProgress < 1;
  t.phase = y < surface ? 'invitation' : y < crossing ? 'surface'
    : y < science ? 'crossing' : y <= scienceEnd ? 'sensors'
    : y < registration ? 'challenge' : 'registration';
  t.cameraParked = y >= science && y <= scienceEnd;
  t.panelVisible = t.phase === 'sensors';
  t.progress = clamp(y / Math.max(registration, 1));
  return t;
}
