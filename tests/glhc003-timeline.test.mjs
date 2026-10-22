import test from 'node:test';
import assert from 'node:assert/strict';
import { storyAt, orbitView } from '../src/scripts/glhc003/timeline.mjs';

const bounds = { surface: 800, crossing: 1600, science: 2400, scienceEnd: 4000, registration: 6400 };

test('integrated camera parks for both science paragraphs and one transition', () => {
  const start = storyAt(bounds.science, bounds);
  let previous = 0;
  for (let y = bounds.science; y <= bounds.scienceEnd; y += 20) {
    const t = storyAt(y, bounds);
    assert.equal(t.cameraParked, true);
    for (const field of ['cameraX', 'cameraY', 'cameraZ', 'targetY']) assert.equal(t[field], start[field]);
    assert.ok(t.panel >= previous);
    previous = t.panel;
  }
  assert.equal(start.panel, 0);
  assert.equal(storyAt(bounds.scienceEnd, bounds).panel, 1);
  assert.equal(storyAt(bounds.science + (bounds.scienceEnd - bounds.science) * .2, bounds).panel, 0);
  assert.equal(storyAt(bounds.science + (bounds.scienceEnd - bounds.science) * .8, bounds).panel, 1);
  // The reveal now completes sooner, with settled reading space at both ends.
  assert.equal(storyAt(bounds.science + (bounds.scienceEnd - bounds.science) * .62, bounds).panel, 1);
  assert.ok(Math.abs(storyAt(bounds.science + (bounds.scienceEnd - bounds.science) * .42, bounds).panel - .5) < 1e-9);
});

test('integrated descent is continuous, reversible, and finishes below the equipment', () => {
  let previous = storyAt(0, bounds);
  const samples = [];
  for (let y = 0; y <= bounds.registration; y += 10) {
    const t = storyAt(y, bounds);
    assert.ok(t.cameraY <= previous.cameraY + 1e-9);
    assert.ok(Math.abs(t.cameraY - previous.cameraY) < .15);
    samples.push(t);
    previous = t;
  }
  assert.deepEqual(samples, Array.from({ length: samples.length }, (_, i) => storyAt(bounds.registration - i * 10, bounds)).reverse());
  assert.ok(previous.cameraY < -13);
  assert.ok(previous.targetY < -13);
  assert.equal(previous.phase, 'registration');
});

test('layout bounds preserve chapter composition after viewport resize and clamp overscroll', () => {
  for (const scale of [.4, .8, 1.7]) {
    const resized = Object.fromEntries(Object.entries(bounds).map(([key, value]) => [key, value * scale]));
    for (const y of [0, 800, 1600, 2400, 3000, 4000, 5200, 6400]) {
      const original = storyAt(y, bounds), actual = storyAt(y * scale, resized);
      assert.equal(actual.phase, original.phase);
      assert.equal(actual.cameraParked, original.cameraParked);
      for (const field of ['cameraY', 'cameraZ', 'targetY', 'panel']) assert.ok(Math.abs(actual[field] - original[field]) < 1e-9);
    }
  }
  assert.deepEqual(storyAt(-200, bounds), storyAt(0, bounds));
  assert.deepEqual(storyAt(9000, bounds), storyAt(bounds.registration, bounds));
  const collapsed = storyAt(0, { surface: 0, crossing: 0, science: 0, scienceEnd: 0, registration: 0 });
  for (const field of ['cameraY', 'cameraZ', 'targetY', 'panel', 'progress']) assert.ok(Number.isFinite(collapsed[field]));
});

test('surface orbit completes one turn before the unchanged waterline descent', () => {
  const position = { x: 7.1, y: 4.1, z: -10.5 }, target = { x: 2.8, y: 1.1, z: 0 };
  const radius = Math.hypot(position.x, position.z);
  let previous = 0;
  for (let y = bounds.surface; y <= bounds.crossing; y += 4) {
    const t = storyAt(y, bounds), view = orbitView(position, target, t.orbitProgress);
    assert.ok(t.orbitProgress >= previous);
    assert.equal(t.cameraY, 4.1, 'orbit must stay above the surface');
    assert.equal(view.position.y, position.y);
    assert.ok(Math.abs(Math.hypot(view.position.x, view.position.z) - radius) < 1e-9);
    previous = t.orbitProgress;
  }
  assert.equal(previous, 1);
  const halfway = orbitView(position, target, .5);
  assert.ok(Math.abs(halfway.position.x + position.x) < 1e-9);
  assert.ok(Math.abs(halfway.position.z + position.z) < 1e-9);
  assert.deepEqual(orbitView(position, target, 0), { position, target });
  assert.deepEqual(orbitView(position, target, 1), { position, target });
  const settled = bounds.surface + .96 * (bounds.crossing - bounds.surface);
  assert.equal(storyAt(settled, bounds).orbitActive, false);
  for (const y of [bounds.crossing, 2000, bounds.science, 3200, bounds.scienceEnd, bounds.registration]) {
    assert.equal(storyAt(y, bounds).orbitActive, false);
    assert.deepEqual(orbitView(position, target, storyAt(y, bounds).orbitProgress), { position, target });
  }
});
