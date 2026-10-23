import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceCamera } from '../src/scripts/glhc003/camera.mjs';

const position = { x: 7.1, y: 4.1, z: -10.5 }, target = { x: 2.8, y: 1.1, z: 0 };
const distance = (a, b) => Math.hypot(a.x-b.x, a.y-b.y, a.z-b.z);
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);

test('irregular forward/reverse orbit input preserves radius and framing distance', () => {
  for (const delta of [1/120, 1/60, 1/30, .25]) {
    let state;
    for (const progress of [0,.05,.8,.1,.95,.5,1,0,.25,.75,1]) {
      const view = advanceCamera(state, position, target, progress, delta);
      state = view.state;
      close(Math.hypot(view.position.x,view.position.z),Math.hypot(position.x,position.z));
      close(distance(view.position,view.target),distance(position,target));
      close(view.position.y,position.y);
    }
  }
});

test('angle easing is frame-rate independent and returns the exact original orientation', () => {
  const results=[];
  for (const fps of [30,60,120]) {
    let view=advanceCamera(undefined,position,target,0,0);
    for(let i=0;i<fps/2;i++)view=advanceCamera(view.state,position,target,1,1/fps);
    results.push(view.state.progress);
    for(let i=0;i<fps*3;i++)view=advanceCamera(view.state,position,target,1,1/fps);
    assert.equal(view.state.progress,1);
    assert.deepEqual(view.position,position);
    assert.deepEqual(view.target,target);
  }
  results.forEach(value=>close(value,results[0]));
});

test('camera and target share damping during descent and initialization has no fly-in', () => {
  const submerged={x:6.45,y:-1.45,z:-12.7},look={x:2.8,y:-.8,z:0};
  let view=advanceCamera(undefined,submerged,look,1,0);
  assert.deepEqual(view.position,submerged);assert.deepEqual(view.target,look);
  view=advanceCamera(undefined,position,target,1,0);
  const alpha=1-Math.exp(-8/60);
  view=advanceCamera(view.state,submerged,look,1,1/60);
  for(const axis of ['x','y','z']){
    close(view.position[axis],position[axis]+(submerged[axis]-position[axis])*alpha);
    close(view.target[axis],target[axis]+(look[axis]-target[axis])*alpha);
  }
  for(let i=0;i<240;i++)view=advanceCamera(view.state,submerged,look,1,1/60);
  close(distance(view.position,submerged),0);close(distance(view.target,look),0);
});
