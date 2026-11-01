import * as THREE from 'three';
const random=n=>{const v=Math.sin(n*127.1+731.8)*43758.5453;return v-Math.floor(v)};
// Mixed perennial planting inspired by the organizer's flower-bed reference.
// Instancing keeps the small stems, broad leaves and individual petals efficient.
export function createFlowerBeds(scene,beds){
 const group=new THREE.Group();group.name='Mixed pink yellow and lavender flower beds';scene.add(group);
 const material=color=>new THREE.MeshStandardMaterial({color,roughness:.82});
 const make=(geo,mat,count,name)=>{const m=new THREE.InstancedMesh(geo,mat,count);m.name=name;m.receiveShadow=true;group.add(m);return m};
 const stems=make(new THREE.CylinderGeometry(1,1,1,5),material('#69834b'),800,'Flower stems');
 const leaves=make(new THREE.SphereGeometry(1,8,5),material('#ffffff'),3000,'Broad green leaves');
 const petals=make(new THREE.SphereGeometry(1,7,4),material('#ffffff'),3000,'Pink coneflower and yellow daisy petals');
 const centres=make(new THREE.SphereGeometry(1,10,7),material('#74452b'),200,'Raised brown flower centres');
 const purple=make(new THREE.SphereGeometry(1,6,4),material('#ffffff'),12000,'Lavender flower spikes');
 const foliage=make(new THREE.SphereGeometry(1,8,5),material('#ffffff'),1000,'Soft low foliage');
 const dummy=new THREE.Object3D(),color=new THREE.Color();const counts=new Map();
 function add(mesh,pos,scale,rotation=[0,0,0],tint=null){const i=counts.get(mesh)||0;if(i>=mesh.instanceMatrix.count)throw Error(`Flower instance capacity ${mesh.name}`);dummy.position.set(...pos);dummy.scale.set(...scale);dummy.rotation.set(...rotation);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);if(tint)mesh.setColorAt(i,color.set(tint));counts.set(mesh,i+1)}
 for(const [bi,bed] of beds.entries()){
  const seed=bi*1007;
  // The lowest layer fills soil gaps with rounded foliage, rather than spikes.
  for(let i=0;i<120;i++){
   const n=seed+i,x=bed.x+(random(n+1)-.5)*2.5,z=bed.z+(random(n+3)-.5)*1.1;
   add(foliage,[x,.23+random(n+5)*.22,z],[.13+random(n+6)*.09,.012,.045+random(n+9)*.035],[(random(n+8)-.5)*.9,random(n+4)*6.28,(random(n+7)-.5)*.7],i%2?'#638a47':'#7d9d5c');
  }
  for(let i=0;i<30;i++){
   const n=seed+i*17,pink=i%3===0;
   const x=bed.x+(random(n+1)-.5)*2.35,z=bed.z+(pink?-.08:.22)+(random(n+2)-.5)*.55;
   const h=(pink?.65:.38)+random(n+4)*(pink?.32:.24),y=.18+h;
   add(stems,[x,.18+h/2,z],[.008,h,.008]);
   for(let j=0;j<5;j++){
    const a=j*2.4+random(n+7)*6.28,r=.065;add(leaves,[x+Math.cos(a)*r,.25+h*(j/7),z+Math.sin(a)*r],[.045,.012,.14],[.2*Math.sin(a),a,Math.sin(j)*.2],j%2?'#67954e':'#7eaa5a');
   }
   const petalColor=pink?(i%2?'#cf76a7':'#df91be'):(i%2?'#f3ca36':'#eeb529');
   for(let j=0;j<12;j++){
    const a=j/12*Math.PI*2,r=pink?.067:.057;
    add(petals,[x+Math.cos(a)*r,y-(pink?.025:.006),z+Math.sin(a)*r],[pink?.022:.020,.008,pink?.080:.068],[pink?.23:0,Math.PI/2-a,0],petalColor);
   }
   add(centres,[x,y+(pink?.018:.008),z],[pink?.043:.032,pink?.052:.026,pink?.043:.032]);
  }
  // Fine branching lavender/salvia-like spires sit toward the back of each bed.
  for(let i=0;i<18;i++)for(let branch=0;branch<3;branch++){
   const n=seed+500+i*11+branch;
   const x=bed.x+(random(n+1)-.5)*2.4,z=bed.z-.32+(random(n+2)-.5)*.35;
   const h=.50+random(n+4)*.48,bend=(random(n+6)-.5)*.20;
   add(stems,[x,.18+h/2,z],[.004,h,.004],[0,0,bend]);
   for(let j=0;j<10;j++)for(let k=0;k<3;k++){
    const a=k*2.094+j*.4,r=.018+(1-j/10)*.016,y=.18+h*(.38+j*.061),dx=-Math.sin(bend)*h*(.38+j*.061);
    add(purple,[x+dx+Math.cos(a)*r,y,z+Math.sin(a)*r],[.017-j*.0006,.019-j*.0007,.016-j*.0005],[0,a,0],(i+j)%3?'#b29ccc':'#c6b2df');
   }
   for(let j=0;j<3;j++)add(leaves,[x,.22+j*.11,z],[.024,.009,.095],[.15,j*2.1,0],'#95aa84');
  }
 }
 for(const mesh of [stems,leaves,petals,centres,purple,foliage]){mesh.count=counts.get(mesh)||0;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();}
 return {group,counts:Object.fromEntries([...counts].map(([m,n])=>[m.name,n]))};
}
