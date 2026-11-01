import * as THREE from 'three';
import {productionSciencePath} from './production-science-path.mjs';
import {productionWaterfrontMotion} from './waterfront-motion.mjs';
const smooth=x=>{const p=Math.max(0,Math.min(1,x));return p*p*p*(p*(p*6-15)+10)};
function project(position,camera,target,fov){
 const c=new THREE.PerspectiveCamera(fov,1920/1080,.015,6000);c.position.set(...camera);c.lookAt(...target);c.updateMatrixWorld();const p=new THREE.Vector3(...position).project(c);return [(p.x+1)*960,(1-p.y)*540];
}
function bezier(a,b,c,d,t){const q=1-t;return a.map((_,i)=>q*q*q*a[i]+3*q*q*t*b[i]+3*q*t*t*c[i]+t*t*t*d[i])}
export const DISPLAY_LEAD_PIXELS=320;
export function aboveDisplay(frame){const p=productionWaterfrontMotion(frame);const point=project([p.centre,5.5+Math.sin(frame/60)*.15,Math.cos(frame/75)*.7-9.5],p.camera,p.target,40);return [point[0]+DISPLAY_LEAD_PIXELS,point[1]]}
export function tvEntry(){const p=productionWaterfrontMotion(125);return project([40,3,-9.67],p.camera,p.target,40)}
function sciencePoint(frame){const p=productionSciencePath(frame/30);return project(p.pulse,p.camera,p.target,48)}
export function goldStoryPoint(scene,frame){
 if(scene==='waterfront'&&frame<0)return goldStoryPoint('science',Math.max(165,318+frame));
 if(scene==='science'){
  if(frame<=195)return sciencePoint(frame);
  const start=sciencePoint(195),end=aboveDisplay(0);
  // Long forward swim with a flat start, sigmoid climb and level finish.
  const forward=smooth((frame-195)/100),rise=smooth(forward);
  return [start[0]+(end[0]-start[0])*forward,start[1]+(end[1]-start[1])*rise];
 }
 if(frame<=85)return aboveDisplay(frame);
 const a=aboveDisplay(85),d=tvEntry();return bezier(a,[a[0],a[1]+60],[d[0],d[1]-90],d,smooth((frame-85)/40));
}
export const TV_ENTRY_FRAME=125;
