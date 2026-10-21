// One coefficient table generates both CPU buoyancy and GPU displacement.
export const MOTION_SPEED = 1.25;
export const WAVES = [
  [.045,.035,.24,.16],[-.028,.061,-.19,.09],
  [.16,.11,.34,.081],[-.09,.21,-.23,.0432],
  [.55,-.43,.48,.0144],[.85,.7,-.31,.0072],
  [.22,-.19,.16,.006],[-.31,-.12,-.21,.004],
  [.34,-.17,.82,.012],[-.28,-.43,-.67,.008],
];
export function rippleHeight(x, z, time, slopeX = 0, slopeZ = 0) {
  const radius = Math.hypot(x, z);
  const angle = Math.atan2(z, x);
  const r = radius * (1 + Math.sin(angle * 3 + time * .29) * .035
    + Math.sin(angle * 5 - time * .21) * .018);
  // Starts outside the hull; wave-following attitude biases its outgoing wake.
  const fade = Math.max(0, Math.min(1, (radius - 1.12) / .45));
  const envelope = fade * fade * (3 - 2 * fade) * Math.exp(-Math.max(radius - 1.5, 0) * .43);
  return (Math.sin(r * 4.8 - time * 2.55 + Math.sin(time * .82) * .16) * .032
    + Math.sin(r * 7.1 - time * 1.82) * .012) * envelope
    * (1 + Math.tanh((x * slopeX + z * slopeZ) * 4) * .25);
}
export function surfaceHeightAt(x, z, time) {
  return WAVES.reduce((height, [kx,kz,speed,amplitude]) =>
    height + Math.sin(x*kx + z*kz + time*speed)*amplitude, 0);
}
const gl = n => Number.isInteger(n) ? `${n}.0` : String(n);
export const waveGLSL = `
float baseHeight(vec2 p,float time){return ${WAVES.map(([x,z,t,a]) =>
  `sin(p.x*${gl(x)}+p.y*${gl(z)}+time*${gl(t)})*${gl(a)}`).join('+')};}
vec2 baseGradient(vec2 p,float time){return ${WAVES.map(([x,z,t,a]) =>
  `cos(p.x*${gl(x)}+p.y*${gl(z)}+time*${gl(t)})*${gl(a)}*vec2(${gl(x)},${gl(z)})`).join('+')};}
float rippleHeight(vec2 p,float time,vec2 slope){
  float radius=length(p);
  float angle=radius>.0001?atan(p.y,p.x):0.;
  float r=radius*(1.+sin(angle*3.+time*.29)*.035+sin(angle*5.-time*.21)*.018);
  float envelope=smoothstep(1.12,1.57,radius)*exp(-max(radius-1.5,0.)*.43);
  return (sin(r*4.8-time*2.55+sin(time*.82)*.16)*.032+sin(r*7.1-time*1.82)*.012)
    *envelope*(1.+tanh(dot(p,slope)*4.)*.25);
}
`;
