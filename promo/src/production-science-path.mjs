import {shapePreservingCurve as curve} from './production-opening-path.mjs';
const times=[0,1.65,3.8,5.65,6.7,8.4,10.6];
const camera=[curve(times,[-5.5,-4,-2.8,.9,1.9,4.2,6]),curve(times,[2.8,1.7,-1.4,-2,-1.9,-1.8,-1.8]),curve(times,[7.5,5.4,3.9,3.85,3.9,4,4])];
const target=[curve(times,[0,0,0,0,.5,3.2,6]),curve(times,[.7,.15,-1.4,-1.55,-1.5,-1.5,-1.5]),()=>0];
const pulse=[curve([0,5.5,6.5,8.4,10.6],[0,0,.2,3.2,6]),curve([0,5.5,6.5,8.4,10.6],[-1.7,-1.7,-1.7,-1.5,-1.5]),curve([0,5.5,6.5,8.4,10.6],[0,0,.15,.35,0])];
export function productionSciencePath(t){return {camera:camera.map(f=>f(t)),target:target.map(f=>f(t)),pulse:pulse.map(f=>f(t))};}
