import { orbitView } from './timeline.mjs';

/** Damp the unrotated pose and angle, never a chord between points on the orbit. */
export function advanceCamera(previous, position, target, progress, delta) {
  const alpha = 1 - Math.exp(-8 * Math.max(0, delta));
  const blend = (from, to) => Object.fromEntries(['x', 'y', 'z'].map(axis =>
    [axis, from[axis] + (to[axis] - from[axis]) * alpha]));
  const basePosition = previous ? blend(previous.basePosition, position) : { ...position };
  const baseTarget = previous ? blend(previous.baseTarget, target) : { ...target };
  let angleProgress = previous ? previous.progress + (progress - previous.progress) * alpha : progress;
  if (Math.abs(angleProgress - progress) < 1e-7) angleProgress = progress;
  const view = orbitView(basePosition, baseTarget, angleProgress);
  return { ...view, state: { basePosition, baseTarget, progress: angleProgress } };
}
