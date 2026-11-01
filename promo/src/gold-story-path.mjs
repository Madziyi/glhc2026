import * as THREE from 'three';
import {shapePreservingCurve} from './production-opening-path.mjs';
import {productionSciencePath} from './production-science-path.mjs';
import {productionWaterfrontMotion} from './waterfront-motion.mjs';
const smooth=x=>{const p=Math.max(0,Math.min(1,x));return p*p*p*(p*(p*6-15)+10)};
function project(position,camera,target,fov){
 const c=new THREE.PerspectiveCamera(fov,1920/1080,.015,6000);c.position.set(...camera);c.lookAt(...target);c.updateMatrixWorld();const p=new THREE.Vector3(...position).project(c);return [(p.x+1)*960,(1-p.y)*540];
}
function bezier(a,b,c,d,t){const q=1-t;return a.map((_,i)=>q*q*q*a[i]+3*q*q*t*b[i]+3*q*t*t*c[i]+t*t*t*d[i])}
const initialWaterfront=productionWaterfrontMotion(0);
const displayHeight=project([0,5.5,-8.8],initialWaterfront.camera,initialWaterfront.target,40)[1];
export function aboveDisplay(_frame){return [960,displayHeight]}
export function revisedScienceView(frame){
 const pose=productionSciencePath(frame/30),pan=1.1*smooth((frame-145)/40)*(1-smooth((frame-195)/122));
 return {...pose,target:[pose.target[0]+pan,pose.target[1],pose.target[2]]};
}
export function scienceAnchor(frame,position){const p=revisedScienceView(frame);return project(position,p.camera,p.target,48)}
export function tvEntry(){const p=productionWaterfrontMotion(125);return project([40,3,-9.67],p.camera,p.target,40)}
function sciencePoint(frame){const p=revisedScienceView(frame);return project(p.pulse,p.camera,p.target,48)}
const forwardSwim=shapePreservingCurve([165,225,285,363],[0,.63,.85,1]);
export function goldStoryPoint(scene,frame){
 if(scene==='waterfront'&&frame<0)return goldStoryPoint('science',Math.max(165,364+frame));
 if(scene==='science'){
  // One continuous path from birth: a long straight swim, then the climb.
  const anchor=sciencePoint(185),start=[anchor[0]-80,anchor[1]],end=aboveDisplay(0);
  const forward=forwardSwim(frame),rise=smooth((frame-225)/60);
  return [start[0]+(end[0]-start[0])*forward,start[1]+(end[1]-start[1])*rise];
 }
 if(frame<=85)return aboveDisplay(frame);
 const a=aboveDisplay(85),d=tvEntry();return bezier(a,[a[0]+210,a[1]],[d[0]+210,d[1]],d,smooth((frame-85)/40));
}
export const TV_ENTRY_FRAME=125;
