import test from 'node:test';
import assert from 'node:assert/strict';
import { STORY, timelineAt } from '../src/scripts/glhc002/timeline.mjs';

test('timeline clamps progress and has explicit beginning and end states', () => {
  assert.equal(timelineAt(-1).progress, 0);
  assert.equal(timelineAt(2).progress, 1);
  assert.equal(timelineAt(0).aboveWater, true);
  assert.equal(timelineAt(1).cameraParked, false);
});

test('camera parks throughout the one horizontal panel transition', () => {
  for (const p of [STORY.sensorPark, 0.48, STORY.panelStart, 0.66, STORY.panelEnd]) {
    assert.equal(timelineAt(p).cameraParked, true, `camera should be parked at ${p}`);
  }
  for (const field of ['cameraX', 'cameraY', 'cameraZ', 'targetY']) {
    assert.equal(timelineAt(0.5)[field], timelineAt(0.82)[field], `${field} should not drift while panels move`);
  }
  assert.equal(timelineAt(0.48).panelIndex, 0);
  assert.equal(timelineAt(0.66).panelIndex, 1);
});

test('timeline is deterministic and reversible at the same scroll progress', () => {
  const forward = [0.1, 0.24, 0.43, 0.62, 0.9].map(timelineAt);
  const reverse = [0.9, 0.62, 0.43, 0.24, 0.1].map(timelineAt).reverse();
  assert.deepEqual(reverse, forward);
  assert.ok(timelineAt(0.9).cameraY < timelineAt(STORY.panelEnd).cameraY);
});
