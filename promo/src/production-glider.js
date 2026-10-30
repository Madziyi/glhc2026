import * as THREE from 'three';

// Reference-proportioned visual reconstruction from the organizer's photographs.
// +Z is the bow, +Y is up. Scene units are for film staging, not a dimensional spec.
export function createProductionGlider(){
 const root=new THREE.Group();root.name='Reference glider — detailed film model';
 const textureCanvas=document.createElement('canvas');textureCanvas.width=512;textureCanvas.height=512;
 const ctx=textureCanvas.getContext('2d'),pixels=ctx.createImageData(512,512);let seed=87123;
 for(let i=0;i<pixels.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=170+(seed>>>27);pixels.data.set([v,v,v,255],i)}
 ctx.putImageData(pixels,0,0);const finish=new THREE.CanvasTexture(textureCanvas);finish.wrapS=finish.wrapT=THREE.RepeatWrapping;finish.repeat.set(5,3);
 const yellow=new THREE.MeshPhysicalMaterial({color:'#e5b916',metalness:.03,roughness:.34,clearcoat:.28,clearcoatRoughness:.28,roughnessMap:finish});
 const charcoal=new THREE.MeshPhysicalMaterial({color:'#22242d',metalness:.08,roughness:.44,clearcoat:.10,roughnessMap:finish});
 const rubber=new THREE.MeshStandardMaterial({color:'#10151a',roughness:.79});
 const alloy=new THREE.MeshStandardMaterial({color:'#aab6ba',metalness:.85,roughness:.26});
 const darkAlloy=new THREE.MeshStandardMaterial({color:'#353d42',metalness:.75,roughness:.32});
 const portGlass=new THREE.MeshPhysicalMaterial({color:'#a14d27',metalness:.12,roughness:.16,clearcoat:.8});
 const mesh=(geometry,material,parent=root,name='')=>{const o=new THREE.Mesh(geometry,material);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o};
 const box=(w,h,d,mat,x,y,z,name='')=>{const o=mesh(new THREE.BoxGeometry(w,h,d),mat,root,name);o.position.set(x,y,z);return o};
 const rod=(a,b,r,mat,name='')=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b);const o=mesh(new THREE.CylinderGeometry(r,r,av.distanceTo(bv),24),mat,root,name);o.position.copy(av).add(bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),bv.sub(av).normalize());return o};
 function revolved(profile,mat,name){
  const curve=new THREE.CatmullRomCurve3(profile.map(([radius,z])=>new THREE.Vector3(radius,z,0)),false,'centripetal');
  const points=curve.getPoints(180).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y));
  const geometry=new THREE.LatheGeometry(points,128);geometry.rotateX(Math.PI/2);
  return mesh(geometry,mat,root,name);
 }
 revolved([[0,-1.60],[.036,-1.57],[.078,-1.44],[.127,-1.19],[.161,-.98],[.174,-.77],[.175,-.55],[.175,.8],[.175,1.17]],yellow,'Smooth tapered yellow pressure hull');
 revolved([[.175,1.17],[.173,1.25],[.158,1.38],[.128,1.50],[.085,1.59],[.034,1.65],[0,1.66]],charcoal,'Rounded charcoal nose fairing');
 const ring=(z,r=.1758,t=.003,mat=rubber)=>{const o=mesh(new THREE.TorusGeometry(r,t,8,128),mat);o.position.z=z;return o};
 ring(1.17,.1756,.0025);ring(.28,.176,.0012,darkAlloy);ring(-.81,.173,.002);ring(-1.02,.157,.0025);
 // Central wing saddle with upper/lower clamping rails and visible screw heads.
 revolved([[.176,-.38],[.182,-.37],[.182,.06],[.176,.07]],charcoal,'Central wing saddle');
 for(const x of [-.128,.128])for(const y of [-.127,.127]){
  const rail=box(.033,.028,.49,charcoal,x,y,-.155,'Saddle clamping rail');
  for(const z of [-.345,-.21,-.07]){
   const screw=mesh(new THREE.CylinderGeometry(.009,.009,.004,12),alloy);screw.position.set(x,y+Math.sign(y)*.017,z);
   if(y<0)screw.rotation.z=Math.PI;
   box(.010,.0018,.0017,rubber,x,y+Math.sign(y)*.020,z,'Fastener recess');
  }
 }
 // Symmetric foil section gives the wings real thickness and a fine trailing edge.
 function wing(sign){
  const positions=[],indices=[],spanSteps=30,chordSteps=40;
  for(let side=0;side<2;side++)for(let j=0;j<=spanSteps;j++){
   const s=j/spanSteps,chord=.325-.12*s,sweep=.095*s;
   for(let i=0;i<=chordSteps;i++){
    const u=i/chordSteps,thickness=5*.10*chord*(.2969*Math.sqrt(u)-.126*u-.3516*u*u+.2843*u*u*u-.1036*u*u*u*u);
    positions.push(sign*(.166+s*.74),(side?1:-1)*thickness,.075-sweep-u*chord);
   }
  }
  const count=(spanSteps+1)*(chordSteps+1);
  for(let side=0;side<2;side++)for(let j=0;j<spanSteps;j++)for(let i=0;i<chordSteps;i++){
   const a=side*count+j*(chordSteps+1)+i,b=a+chordSteps+1;
   const flip=(sign>0)!==Boolean(side);indices.push(...(flip?[a,a+1,b,a+1,b+1,b]:[a,b,a+1,a+1,b,b+1]));
  }
  for(let i=0;i<chordSteps;i++){
   const a=spanSteps*(chordSteps+1)+i,b=a+count;indices.push(a,b,a+1,a+1,b,b+1);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const foilMaterial=yellow.clone();foilMaterial.side=THREE.DoubleSide;
  return mesh(geometry,foilMaterial,root,sign>0?'Starboard foil wing':'Port foil wing');
 }
 wing(-1);wing(1);
 for(const sign of [-1,1]){
  box(.055,.026,.34,darkAlloy,sign*.18,0,-.13,'Wing root shoe');
  for(const z of [-.24,-.05]){const fastener=mesh(new THREE.CylinderGeometry(.008,.008,.008,12),alloy);fastener.position.set(sign*.19,.019,z)}
 }
 // Rear upright rudder and its exposed metallic support/hinge.
 const finShape=new THREE.Shape();finShape.moveTo(-1.48,.13);finShape.lineTo(-1.48,.65);finShape.quadraticCurveTo(-1.46,.685,-1.42,.685);finShape.lineTo(-1.22,.665);finShape.lineTo(-1.07,.18);finShape.closePath();
 const finGeometry=new THREE.ExtrudeGeometry(finShape,{depth:.016,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:3,steps:1});finGeometry.translate(0,0,-.008);finGeometry.rotateY(-Math.PI/2);
 mesh(finGeometry,yellow,root,'Tall rear yellow rudder');
 rod([0,.17,-1.12],[0,.22,-1.50],.018,alloy,'Rudder support spindle');
 rod([0,.20,-1.45],[0,.65,-1.45],.008,darkAlloy,'Rudder hinge');
 box(.028,.027,.25,charcoal,0,.677,-1.355,'Rudder cap');
 ring(-.87,.170,.012,rubber);
 const rearMount=box(.072,.038,.29,charcoal,0,.174,-1.02,'Rear instrumentation mount');rearMount.rotation.x=-.12;
 rod([0,.19,-.86],[0,.30,-1.31],.010,alloy,'Rear instrument support');
 rod([0,0,-1.57],[0,0,-1.68],.030,alloy,'Tail connector');
 for(const sign of [-1,1]){
  rod([sign*.022,0,-1.66],[sign*.038,-.005,-1.92],.006,darkAlloy,'Paired rear probe');
  rod([sign*.022,0,-1.66],[sign*.040,-.065,-1.84],.0045,darkAlloy,'Probe guard');
 }
 // Side sensor ports and small nose vents visible in the reference closeups.
 for(const sign of [-1,1]){
  const bezel=mesh(new THREE.CylinderGeometry(.046,.046,.009,48),rubber);bezel.rotation.z=Math.PI/2;bezel.position.set(sign*.175,-.025,.205);
  const glass=mesh(new THREE.CylinderGeometry(.038,.038,.010,48),portGlass);glass.rotation.z=Math.PI/2;glass.position.set(sign*.181,-.025,.205);
  for(const [z,y] of [[1.29,-.040],[1.43,.018],[1.52,-.022]]){
   const vent=mesh(new THREE.SphereGeometry(.0065,12,8),rubber);vent.scale.set(.3,1,1);vent.position.set(sign*(z>1.5?.114:.16),y,z);
  }
 }
 for(const z of [-.32,.015])for(let i=0;i<8;i++){
  const angle=i*Math.PI/4,bolt=mesh(new THREE.SphereGeometry(.0045,8,6),darkAlloy);bolt.position.set(Math.cos(angle)*.183,Math.sin(angle)*.183,z);
 }
 // Curved hull lettering follows the shell rather than floating above it.
 const labelCanvas=document.createElement('canvas');labelCanvas.width=2048;labelCanvas.height=512;
 const label=labelCanvas.getContext('2d');label.clearRect(0,0,2048,512);label.fillStyle='#284879';label.font='400 315px Arial';label.fillText('G3',20,380);label.font='400 140px Arial';label.fillText('SLOCUM',480,235);label.fillStyle='#222a32';label.fillText('GLIDER',480,385);
 const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;labelTexture.anisotropy=8;
 const labelMaterial=new THREE.MeshStandardMaterial({map:labelTexture,transparent:true,depthWrite:false,roughness:.5,polygonOffset:true,polygonOffsetFactor:-1});
 for(const sign of [-1,1]){
  const pos=[],uv=[],idx=[];
  for(let j=0;j<=12;j++)for(let i=0;i<=40;i++){
   const u=i/40,v=j/12,theta=(v-.5)*.78;
   pos.push(sign*.1762*Math.cos(theta),.1762*Math.sin(theta),1.095-u*.72);uv.push(sign>0?u:1-u,v);
  }
  for(let j=0;j<12;j++)for(let i=0;i<40;i++){const a=j*41+i;idx.push(a,a+1,a+41,a+1,a+42,a+41)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
  const m=labelMaterial.clone();m.side=THREE.DoubleSide;mesh(geo,m,root,'Curved G3 hull marking');
 }
 root.userData.referenceNotes='Organizer photographs; visual reconstruction, not manufacturer CAD';
 root.userData.axis='bow +Z, up +Y';
 return root;
}
