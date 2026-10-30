// Rough spatial blocking. The camera surfaces far from the buoy before its fly-in.
export const LAUNCH_BOAT_X = -70;
export const LAUNCH_GLIDER_X = -67;
const smooth = p => p * p * (3 - 2 * p);
function key(t, times, values) {
  if (t <= times[0]) return values[0];
  for (let i = 1; i < times.length; i++) {
    if (t <= times[i]) {
      const p = smooth((t - times[i - 1]) / (times[i] - times[i - 1]));
      return values[i - 1] + (values[i] - values[i - 1]) * p;
    }
  }
  return values.at(-1);
}
const cameraTimes = [0, 2.2, 4, 6.2, 7.8, 8.5, 9, 10.1, 11.4, 12.8, 13.5];
export function openingPath(t) {
  const gx = key(t,[0,3.3,4.4,6.2,7.8,9.5,13.5],[-67,-67,-65,-58,-53,-49,-43]);
  const gy = key(t,[0,2.3,3.3,4.8,6.3,7.8,10,13.5],[2.25,.2,-.75,-2,-2.8,-1.9,-2.5,-2.5]);
  const gz = key(t,[0,3.3,4.4,6.2,7.8,9.5,13.5],[0,0,2,4,-1.5,2.5,6]);
  return {
    glider:[gx,gy,gz],
    camera:[key(t,cameraTimes,[-63.1,-63.5,-63,-55,-49,-46,-43,-31,-18,-6,-5.5]),
      key(t,cameraTimes,[3.2,1.2,-1.1,-1.3,-1.5,-.7,1.8,3.5,3,2.8,2.8]),
      key(t,cameraTimes,[6.8,5.7,5.1,8.5,9,10,10,9,8,7.5,7.5])],
    target:[key(t,cameraTimes,[-67,-67,-66,-58,-53,-50,-33,-8,0,0,0]),
      key(t,cameraTimes,[1,.1,-1.5,-2.1,-1.7,-.6,.7,.9,.8,.7,.7]),
      key(t,cameraTimes,[0,0,0,4,-1.5,0,0,0,0,0,0])],
  };
}
