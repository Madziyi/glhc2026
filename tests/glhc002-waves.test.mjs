import test from 'node:test';
import assert from 'node:assert/strict';
import { MOTION_SPEED, surfaceHeightAt, rippleHeight, waveGLSL } from '../src/scripts/glhc002/waves.mjs';

test('CPU buoyancy matches the generated GPU base wave expression', () => {
  const expression = waveGLSL.match(/return ([^;]+);/)[1]
    .replaceAll('sin(', 'Math.sin(').replaceAll('p.x', 'x').replaceAll('p.y', 'z');
  const gpu = new Function('x', 'z', 'time', `return ${expression}`);
  for (const t of [0, 1, 16, 43.7]) for (const x of [-1.18, 0, 1.18]) {
    assert.ok(Math.abs(gpu(x, .7, t) - surfaceHeightAt(x, .7, t)) < 1e-12);
  }
});

test('motion speed changes elapsed wave phase while preserving baseline amplitude', () => {
  assert.equal(MOTION_SPEED, 1.25);
  assert.equal(surfaceHeightAt(0, 0, 0), 0);
  assert.equal(surfaceHeightAt(1, -1, 8 * MOTION_SPEED), surfaceHeightAt(1, -1, 10));
  assert.ok(Math.abs(surfaceHeightAt(1, -1, 10) - surfaceHeightAt(1, -1, 8)) > .001);
});

test('hull ripples are finite, localized, and dissipate offshore', () => {
  for (const time of [0, 1, 10, 100]) {
    assert.ok(rippleHeight(0, 0, time) === 0);
    assert.ok(rippleHeight(.5, .5, time) === 0);
    assert.ok(Number.isFinite(rippleHeight(1.5, 0, time, .02, -.01)));
    assert.ok(Math.abs(rippleHeight(30, 0, time)) < .000001);
  }
  assert.notEqual(rippleHeight(2, 0, 1), rippleHeight(2, 0, 2));
  assert.notEqual(rippleHeight(2, 0, 1), rippleHeight(0, 2, 1));
});
