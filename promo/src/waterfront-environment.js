import * as THREE from 'three';
import {createOpeningEnvironment} from './opening-environment.js';
// Conceptual landscaped lakeshore, not a depiction of an existing site.
export function createWaterfront(scene,ground){
 const environment=createOpeningEnvironment(scene);environment.water.position.y=-.75;
 scene.environment=environment.environment;scene.fog=new THREE.FogExp2('#9fbdc4',.0025);
 const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
 const sand=mat('#cbbf98'),paving=mat('#a9b7b1'),grass=mat('#526f53'),wood=mat('#72553d'),steel=mat('#314b50');
 ground.geometry.dispose();ground.geometry=new THREE.PlaneGeometry(180,40);ground.position.set(10,-.13,15);ground.material.dispose();ground.material=grass;
 const box=(w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);scene.add(o);return o};
 box(180,.18,8,paving,10,-.12,.5);box(180,.12,8,sand,10,-.25,-7);
 box(180,.25,.22,mat('#e0d9bd'),10,-.12,-3.7);
 for(let x=-30;x<55;x+=4){box(.035,.012,7.8,mat('#899e99'),x,-.02,.5)}
 // Benches and planted islands frame the installations without people.
 for(const x of [-5,5,14,24]){
  box(2.4,.16,.7,wood,x,.48,4);box(2.4,.65,.12,wood,x,.85,4.32);
  for(const dx of [-.85,.85])box(.12,.52,.5,steel,x+dx,.2,4);
  box(2.8,.45,1.4,mat('#96a28b'),x,.12,6.2);
  for(let i=0;i<16;i++){
   const blade=new THREE.Mesh(new THREE.ConeGeometry(.05,.65+(i%4)*.13,4),grass);blade.position.set(x+Math.sin(i*2.4)*1.2,.65,6.2+Math.cos(i*1.7)*.5);blade.rotation.z=Math.sin(i)*.15;scene.add(blade);
  }
 }
 for(const x of [-14,-7,29,35]){
  box(.22,3.3,.22,wood,x,1.5,4.5);
  const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.8,1),mat('#456d53'));crown.position.set(x,4,4.5);crown.scale.set(1,1.3,1);scene.add(crown);
 }
 // Low distant shore leaves a broad lake horizon behind each design.
 const distant=new THREE.Mesh(new THREE.SphereGeometry(1,32,12),mat('#587d79'));distant.position.set(-70,-2,-220);distant.scale.set(180,8,35);scene.add(distant);
 return {draw(t){environment.water.material.uniforms.uTime.value=t*.8;environment.sky.material.uniforms.uTime.value=t;},dispose(){environment.environment.dispose()}};
}
