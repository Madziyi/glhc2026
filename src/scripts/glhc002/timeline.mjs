/** Shared normalized story timeline for the camera and the two prose panels. */
export const STORY = Object.freeze({
  surface: 0.16,
  crossStart: 0.16,
  sensorPark: 0.43,
  panelStart: 0.50,
  panelEnd: 0.82,
  descentEnd: 1,
});

const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Camera stays beside the cage for the complete horizontal prose transition. */
export function timelineAt(progress) {
  const p = clamp(progress);
  const crossing = smooth(STORY.crossStart, STORY.sensorPark, p);
  const leavePark = smooth(STORY.panelEnd, STORY.descentEnd, p);
  const panel = smooth(STORY.panelStart, STORY.panelEnd, p);
  return {
    progress: p,
    cameraY: 4.1 - 5.55 * crossing - 1.15 * leavePark,
    cameraZ: -10.5 + 1.8 * crossing + 2.2 * leavePark,
    cameraX: 4.3 - 0.65 * crossing,
    targetY: 1.1 - 2.45 * crossing - 0.5 * leavePark,
    waterMix: smooth(STORY.crossStart, STORY.sensorPark, p),
    bob: p <= STORY.sensorPark ? 1 : (p >= STORY.panelEnd ? 0.25 : 0.15),
    panel,
    panelIndex: panel < 0.5 ? 0 : 1,
    cameraParked: p >= STORY.sensorPark && p <= STORY.panelEnd,
    aboveWater: p < STORY.crossStart,
  };
}
