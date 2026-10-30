import * as THREE from 'three';
// Brief, deliberately low-detail fish silhouettes behind the glider.
export function createOpeningFish(scene){
 const school=new THREE.Group();scene.add(school);
 const mat=new THREE.MeshBasicMaterial({color:'#00141d',transparent:true,opacity:.58,fog:false});
 const fish=[];
 for(let i=0;i<18;i++){
  const group=new THREE.Group(),size=.45+(i%5)*.08;group.scale.setScalar(size);school.add(group);
  const body=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),mat);body.scale.set(.20,.065,.035);group.add(body);
  const tail=new THREE.Group();tail.position.x=-.17;group.add(tail);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-.15,.09,0,-.11,0,0,0,0,0,-.11,0,0,-.15,-.09,0],3));g.computeVertexNormals();
  const tm=mat.clone();tm.side=THREE.DoubleSide;tail.add(new THREE.Mesh(g,tm));fish.push({group,tail});
 }
 return {draw(t){school.visible=t>3.25&&t<5.65;school.position.set(-70.1+(t-3.25)*1.0,-1.1,-5.5);fish.forEach(({group,tail},i)=>{group.position.set(Math.sin(i*2.4)*1.25+Math.cos(i*.7)*.3,Math.cos(i*2.1)*.55+Math.sin(t*.6+i)*.04,-(i%5)*.3);tail.rotation.y=Math.sin(t*4+i)*.25;group.rotation.y=.18+Math.sin(t*.5+i)*.05})}};
}
