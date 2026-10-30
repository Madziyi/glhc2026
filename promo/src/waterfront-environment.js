import * as THREE from 'three';
import {createOpeningEnvironment} from './opening-environment.js';
// Conceptual landscaped lakeshore, not a depiction of an existing site.
export function createWaterfront(scene,ground){
 const environment=createOpeningEnvironment(scene);environment.water.position.y=-.75;
 scene.environment=environment.environment;scene.fog=new THREE.FogExp2('#9fbdc4',.0025);
 const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
 const sand=mat('#cbbf98'),paving=mat('#a9b7b1'),grass=mat('#526f53'),wood=mat('#72553d'),steel=mat('#314b50');
 ground.geometry.dispose();ground.geometry=new THREE.PlaneGeometry(310,7);ground.position.set(48,-.13,-1.5);ground.material.dispose();ground.material=grass;
 const box=(w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);scene.add(o);return o};
 // Camera -> partial path -> green seating strip -> broad paved terrace -> lake.
 box(310,.18,5,paving,48,-.12,4.5);
 box(310,.18,9,paving,48,-.12,-9.5);
 box(310,.12,2,sand,48,-.25,-15);
 box(310,.25,.22,mat('#e0d9bd'),48,-.12,-14.1);
 // Brick bonds belong only to the foreground pedestrian walkway.
 const mortar=mat('#7d918e');
 for(let row=0;row<5;row++){
  const z=2.05+row;
  box(310,.012,.035,mortar,48,-.02,z);
  for(let x=-106+(row%2)*1.1;x<203;x+=2.2)box(.035,.012,.97,mortar,x,-.02,z+.5);
 }
 // Seating stays on the green strip, clear of each installation terrace.
 for(const centre of [0,48,96])for(const offset of [-5.5,5.5]){
  const x=centre+offset,z=offset<0?-.7:1.1;
  box(2.4,.16,.7,wood,x,.48,z);box(2.4,.65,.12,wood,x,.85,z+.32);
  for(const dx of [-.85,.85])box(.12,.52,.5,steel,x+dx,.2,z);
  box(2.8,.3,1.4,mat('#96a28b'),x-2,.05,-1);
  for(let i=0;i<16;i++){
   const blade=new THREE.Mesh(new THREE.ConeGeometry(.05,.65+(i%4)*.13,4),grass);blade.position.set(x-2+Math.sin(i*2.4)*1.2,.55,-1+Math.cos(i*1.7)*.5);blade.rotation.z=Math.sin(i)*.15;scene.add(blade);
  }
 }
 for(const x of [-13,35,83,110]){
  box(.22,3.3,.22,wood,x,1.5,2);
  const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.8,1),mat('#456d53'));crown.position.set(x,4,2);crown.scale.set(1,1.3,1);scene.add(crown);
 }
 // Low distant shore leaves a broad lake horizon behind each design.
 const distant=new THREE.Mesh(new THREE.SphereGeometry(1,32,12),mat('#587d79'));distant.position.set(-70,-2,-220);distant.scale.set(180,8,35);scene.add(distant);
 return {draw(t){environment.water.material.uniforms.uTime.value=t*.8;environment.sky.material.uniforms.uTime.value=t;},dispose(){environment.environment.dispose()}};
}
