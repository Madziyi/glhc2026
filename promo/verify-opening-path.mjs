import * as THREE from 'three';
import {writeFileSync} from 'node:fs';
import {openingPath} from './src/rough-opening-path.mjs';
const camera=new THREE.PerspectiveCamera(48,1920/1080,.08,6000),box=new THREE.Box3(new THREE.Vector3(-1.4,-4.5,-1.4),new THREE.Vector3(1.4,-.2,1.4));
const bad=[];let minDistance=Infinity,lastUnder=0,firstAboveAfterDive=null;const samples=[];
for(let frame=0;frame<405;frame++){
 const t=frame/30,p=openingPath(t);camera.position.set(...p.camera);camera.lookAt(...p.target);camera.updateMatrixWorld();
 const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
 if(camera.position.y<.2){minDistance=Math.min(minDistance,Math.hypot(...[p.camera[0],p.camera[2]]));lastUnder=t;if(frustum.intersectsBox(box))bad.push({frame,t});}
 if(t>7&&p.camera[1]>.2&&firstAboveAfterDive===null)firstAboveAfterDive={t,distance:Math.hypot(p.camera[0],p.camera[2])};
 if([0,135,210,255,279,315,375].includes(frame))samples.push({frame,t,...p});
}
const report={underwater_sensor_frustum_intersections:bad,minimum_underwater_camera_distance:minDistance,last_underwater_time:lastUnder,first_above_water:firstAboveAfterDive,samples};
writeFileSync(new URL('./evidence/opening-flight-path.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify({underwater_sensor_frustum_intersections:bad.length,minimum_underwater_camera_distance:minDistance,firstAboveAfterDive}));
if(bad.length || minDistance<40 || firstAboveAfterDive.distance<40)process.exitCode=1;
