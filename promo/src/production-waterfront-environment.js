import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {createOpeningEnvironment} from './opening-environment.js';

const random=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
function terrain(color,scale=4){
 const m=new THREE.MeshStandardMaterial({color,roughness:.88});
 m.onBeforeCompile=s=>{
  s.vertexShader='varying vec3 vTerrain;\n'+s.vertexShader;
  s.vertexShader=s.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvTerrain=(modelMatrix*vec4(transformed,1.)).xyz;');
  s.fragmentShader='varying vec3 vTerrain;\n'+s.fragmentShader;
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float grit=fract(sin(dot(floor(vTerrain.xz*${scale.toFixed(1)}),vec2(127.1,311.7)))*43758.5453);
   float variation=sin(vTerrain.x*.7+sin(vTerrain.z*.9))*.04;
   diffuseColor.rgb*=.91+grit*.14+variation;`);
 };m.customProgramCacheKey=()=>`waterfront-terrain-${scale}`;return m;
}
export function createProductionWaterfront(scene,ground){
 const environment=createOpeningEnvironment(scene,{production:true,waterCenterX:48});environment.water.position.y=-.75;
 scene.environment=environment.environment;scene.environmentIntensity=.7;scene.fog=new THREE.FogExp2('#9fbdc4',.0017);
 const grass=terrain('#657349',6),concrete=terrain('#b5b6a9',32),sand=terrain('#c1ae87',18);
 const wood=terrain('#76593d',14),metal=new THREE.MeshStandardMaterial({color:'#263a3d',metalness:.7,roughness:.4});
 const mesh=(geo,mat,name='')=>{const m=new THREE.Mesh(geo,mat);m.name=name;m.castShadow=true;m.receiveShadow=true;scene.add(m);return m};
 const box=(w,h,d,mat,x,y,z,name='')=>{const m=mesh(new RoundedBoxGeometry(w,h,d,1,Math.min(.035,h/4)),mat,name);m.position.set(x,y,z);return m};
 ground.geometry.dispose();ground.geometry=new THREE.PlaneGeometry(310,7);ground.position.set(48,-.13,-1.5);ground.material.dispose();ground.material=grass;ground.receiveShadow=true;
 box(310,.18,9,concrete,48,-.12,-9.5,'Seamless sculpture terrace');
 box(310,.12,2,sand,48,-.25,-15,'Shore sand');
 box(310,.25,.22,terrain('#cac4ad',20),48,-.12,-14.1,'Waterfront edge');
 box(310,.10,5,terrain('#7d8782',15),48,-.17,4.5,'Pavement mortar bed');
 const pavers=new THREE.InstancedMesh(new RoundedBoxGeometry(2.15,.065,.94,1,.017),concrete,710);pavers.castShadow=true;pavers.receiveShadow=true;
 const matrix=new THREE.Matrix4(),color=new THREE.Color();let count=0;
 for(let row=0;row<5;row++)for(let x=-106+(row%2)*1.1;x<203;x+=2.2){matrix.makeTranslation(x,-.065,2.55+row);pavers.setMatrixAt(count,matrix);color.set('#a9afa5').multiplyScalar(.92+random(count)*.15);pavers.setColorAt(count,color);count++}
 pavers.count=count;scene.add(pavers);
 const grassGeometry=new THREE.BufferGeometry();grassGeometry.setAttribute('position',new THREE.Float32BufferAttribute([-.025,0,0,.025,0,0,.018,.38,0,0,.66,.025,-.025,0,0,.018,.38,0,0,.66,.025,-.016,.32,.02],3));grassGeometry.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);grassGeometry.computeVertexNormals();
 const bladeMaterial=new THREE.MeshStandardMaterial({color:'#677b4c',roughness:.85,side:THREE.DoubleSide});
 const planted=new THREE.InstancedMesh(grassGeometry,bladeMaterial,900);planted.castShadow=true;planted.receiveShadow=true;
 const dummy=new THREE.Object3D();let blade=0;
 for(const centre of [0,48,96])for(const offset of [-5.5,5.5]){
  const x=centre+offset,z=offset<0?-.7:1.1;
  for(let i=0;i<6;i++)box(2.4,.08,.105,wood,x,.48,z-.3+i*.12,'Bench seat slat');
  for(let i=0;i<4;i++)box(2.4,.12,.08,wood,x,.72+i*.15,z+.32,'Bench back slat');
  for(const dx of [-.85,.85]){box(.095,.54,.50,metal,x+dx,.20,z,'Bench leg');box(.35,.06,.60,metal,x+dx,-.04,z,'Bench foot');box(.07,.83,.07,metal,x+dx,.69,z+.31,'Bench back support')}
  box(2.8,.29,1.4,concrete,x-2,.015,-1,'Planted island rim');
  box(2.64,.02,1.25,terrain('#3b4430',10),x-2,.17,-1,'Planting soil');
  for(let i=0;i<150;i++){
   const n=blade;dummy.position.set(x-2+(random(n+1)-.5)*2.5,.18,-1+(random(n+77)-.5)*1.1);dummy.rotation.set((random(n+3)-.5)*.18,random(n+8)*Math.PI*2,(random(n+4)-.5)*.2);dummy.scale.setScalar(.45+random(n+9)*.85);dummy.updateMatrix();planted.setMatrixAt(blade,dummy.matrix);color.set('#617444').multiplyScalar(.72+random(n+33)*.6);planted.setColorAt(blade,color);blade++;
  }
 }
 scene.add(planted);
 const trees=[];
 for(const [i,x] of [-13,35,83,110].entries()){
  const tree=new THREE.Group();tree.position.set(x,0,2);scene.add(tree);trees.push(tree);
  const bark=terrain('#5b4a37',9);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.10,.18,3.9,14),bark);trunk.position.y=1.85;trunk.castShadow=true;tree.add(trunk);
  const leaves=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.24,1),new THREE.MeshStandardMaterial({color:'#46694a',roughness:.9}),320);leaves.castShadow=true;leaves.receiveShadow=true;
  for(let j=0;j<320;j++){
   const n=j+i*997,a=random(n+1)*Math.PI*2,r=Math.sqrt(random(n+2))*1.6;
   dummy.position.set(Math.cos(a)*r,3.8+(random(n+3)-.5)*2.6,Math.sin(a)*r*.85);dummy.scale.set(.9+random(n+4)*.8,.6+random(n+5)*.8,.9+random(n+6)*.8);dummy.rotation.set(random(n+7),random(n+8),random(n+9));dummy.updateMatrix();leaves.setMatrixAt(j,dummy.matrix);color.set('#486a46').multiplyScalar(.7+random(n+10)*.5);leaves.setColorAt(j,color);
  }tree.add(leaves);
 }
 for(let i=0;i<4;i++){const hill=mesh(new THREE.SphereGeometry(1,40,14),terrain('#4f756d',2),'Distant wooded shore');hill.position.set(-140+i*125,-3,-320-i%2*30);hill.scale.set(125,7+i%2*2,32)}
 const reflector=new Reflector(new THREE.PlaneGeometry(1,1),{textureWidth:1280,textureHeight:720,clipBias:.003,multisample:0});reflector.rotation.x=-Math.PI/2;reflector.position.y=-.75;reflector.visible=false;scene.add(reflector);
 environment.water.material.uniforms.uReflection.value=reflector.getRenderTarget().texture;environment.water.material.uniforms.uReflectionMatrix.value=reflector.material.uniforms.textureMatrix.value;
 return {
  draw(t){environment.water.material.uniforms.uTime.value=(24.1+t)*1.25;environment.sky.material.uniforms.uTime.value=24.1+t;trees.forEach((tree,i)=>tree.rotation.z=Math.sin(t*.6+i)*.003);planted.rotation.x=Math.sin(t*.9)*.002},
  reflect(renderer,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld();environment.water.visible=false;reflector.onBeforeRender(renderer,scene,camera);reflector.visible=false;environment.water.visible=true;environment.water.material.uniforms.uReflectionStrength.value=.6},
  dispose(){reflector.dispose();environment.environment.dispose()}
 };
}

