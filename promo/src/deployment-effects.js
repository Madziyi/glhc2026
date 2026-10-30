import * as THREE from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';

export function createDeploymentEffects(scene,renderer,environment,glider,boat,{extraRoots=[],particleCenter=-54,emission=true}={}){
 const clock={value:0};
 for(const root of [glider,boat,...extraRoots])root.traverse(o=>{
  if(!o.isMesh)return;
  for(const mat of Array.isArray(o.material)?o.material:[o.material]){
   if(!(mat.isMeshStandardMaterial||mat.isMeshPhysicalMaterial)||mat.userData.waterPatched)return;
   mat.userData.waterPatched=true;const previous=mat.onBeforeCompile,previousKey=mat.customProgramCacheKey();
   mat.onBeforeCompile=shader=>{
    previous.call(mat,shader);shader.uniforms.uWaterTime=clock;
    shader.vertexShader='varying vec3 vWaterWorld;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvWaterWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
    shader.fragmentShader='uniform float uWaterTime;varying vec3 vWaterWorld;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <tonemapping_fragment>',`
     float wet=1.-smoothstep(-.16,.03,vWaterWorld.y);
     vec2 p=vWaterWorld.xz;
     float cell=abs(sin(p.x*3.1+sin(p.y*2.3+uWaterTime*.6))*.65+sin(p.y*3.4-p.x*.6-uWaterTime*.7)*.35);
     float caustic=pow(max(0.,1.-cell),15.)*.10;
     vec3 absorption=exp(-max(-vWaterWorld.y,0.)*vec3(.22,.085,.055));
     gl_FragColor.rgb=mix(gl_FragColor.rgb,gl_FragColor.rgb*absorption*vec3(.8,.96,1.02)+vec3(.006,.017,.022)+caustic*vec3(.20,.44,.46),wet);
     #include <tonemapping_fragment>`);
   };
   mat.customProgramCacheKey=()=>`${previousKey}-deployment-water-v1`;mat.needsUpdate=true;
  }
 });
 const reflector=new Reflector(new THREE.PlaneGeometry(1,1),{textureWidth:1280,textureHeight:720,clipBias:.003,multisample:0});reflector.rotation.x=-Math.PI/2;reflector.visible=false;scene.add(reflector);
 environment.water.material.uniforms.uReflection.value=reflector.getRenderTarget().texture;
 environment.water.material.uniforms.uReflectionMatrix.value=reflector.material.uniforms.textureMatrix.value;
 const bubbleMat=new THREE.MeshPhysicalMaterial({color:'#b7e0df',metalness:0,roughness:.12,transparent:true,opacity:.18,clearcoat:1,depthWrite:false});
 const bubbles=[];
 for(let i=0;i<(emission?30:0);i++){const r=.008+(i%7)*.003;const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),bubbleMat);scene.add(m);bubbles.push(m)}
 const spray=[];
 for(let i=0;i<(emission?22:0);i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.009+(i%3)*.004,8,6),new THREE.MeshBasicMaterial({color:'#c5e3dd',transparent:true,opacity:0,depthWrite:false}));scene.add(m);spray.push(m)}
 const dustGeo=new THREE.BufferGeometry(),dustPositions=[];
 for(let i=0;i<150;i++)dustPositions.push(particleCenter-18+((Math.sin(i*12.7)*.5+.5)*36),-5+((Math.cos(i*7.1)*.5+.5)*5),-9+((Math.sin(i*3.7)*.5+.5)*18));
 dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dustPositions,3));
 const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:'#93b9be',size:.014,transparent:true,opacity:.15,depthWrite:false}));scene.add(dust);
 return {draw(t,camera,under){
  clock.value=t;dust.visible=under>.05;dust.position.y=Math.sin(t*.2)*.05;
  bubbles.forEach((m,i)=>{
   const born=2.12+(i%10)*.052,age=t-born;
   const life=1.25+(i%5)*.14;
   m.visible=age>0&&age<life;
   m.position.set(-67+Math.sin(i*2.4)*.12+age*.07,-.2-(i%6)*.035+age*.21,Math.cos(i*1.7)*1.15);
   m.scale.setScalar(1+Math.max(0,age)*.22);
   if(m.position.y>.015)m.visible=false;
  });
  spray.forEach((m,i)=>{
   const age=t-2.17-(i%5)*.04,life=.43;
   m.visible=age>0&&age<life;
   const angle=i*2.4,speed=.22+(i%4)*.07;
   m.position.set(-67+Math.cos(angle)*speed*age,.02+age*.55-age*age*1.9,Math.sin(angle)*(.3+speed*age));
   m.material.opacity=Math.max(0,1-age/life)*.3;
  });
  const reflectionFade=THREE.MathUtils.smoothstep(camera.position.y,.12,.6)*(1-under);
  environment.water.material.uniforms.uReflectionStrength.value=.75*reflectionFade;
  if(reflectionFade>.001&&camera.position.y>.05){
   scene.updateMatrixWorld(true);camera.updateMatrixWorld();environment.water.visible=false;
   reflector.onBeforeRender(renderer,scene,camera);reflector.visible=false;environment.water.visible=true;
  }
 },dispose(){reflector.dispose()}};
}
