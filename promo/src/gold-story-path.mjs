import * as THREE from 'three';
import {productionSciencePath} from './production-science-path.mjs';
import {productionWaterfrontMotion} from './waterfront-motion.mjs';
const smooth=x=>{const p=Math.max(0,Math.min(1,x));return p*p*p*(p*(p*6-15)+10)};
function project(position,camera,target,fov){
 const c=new THREE.PerspectiveCamera(fov,1920/1080,.015,6000);c.position.set(...camera);c.lookAt(...target);c.updateMatrixWorld();const p=new THREE.Vector3(...position).project(c);return [(p.x+1)*960,(1-p.y)*540];
}
function bezier(a,b,c,d,t){const q=1-t;return a.map((_,i)=>q*q*q*a[i]+3*q*q*t*b[i]+3*q*t*t*c[i]+t*t*t*d[i])}
export function aboveDisplay(frame){const p=productionWaterfrontMotion(frame);return project([p.centre,5.5+Math.sin(frame/60)*.15,Math.cos(frame/75)*.7-9.5],p.camera,p.target,40)}
export function tvEntry(){const p=productionWaterfrontMotion(125);return project([40,3,-9.67],p.camera,p.target,40)}
function sciencePoint(frame){const p=productionSciencePath(frame/30);return project(p.pulse,p.camera,p.target,48)}
export function goldStoryPoint(scene,frame){
 if(scene==='waterfront'&&frame<0)return goldStoryPoint('science',Math.max(165,318+frame));
 if(scene==='science'){
  if(frame<=195)return sciencePoint(frame);
  const start=sciencePoint(195),end=aboveDisplay(0),t=smooth((frame-195)/122);
  return bezier(start,[start[0]+310,start[1]-25],[end[0]+160,end[1]],end,t);
 }
 if(frame<=100)return aboveDisplay(frame);
 const a=aboveDisplay(100),d=tvEntry();return bezier(a,[a[0]+55,a[1]-25],[d[0]+100,d[1]-110],d,smooth((frame-100)/25));
}
export const TV_ENTRY_FRAME=125;
