import React,{useRef,useLayoutEffect,useState} from 'react';
import {AbsoluteFill,useCurrentFrame,delayRender,continueRender} from 'remotion';
import * as THREE from 'three';
import {createProductionGlider} from './production-glider.js';
import {createProductionBoat} from './production-boat.js';

function setup(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setSize(1920,1080);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#07151e');scene.fog=new THREE.Fog('#07151e',24,65);
 const camera=new THREE.PerspectiveCamera(34,1920/1080,.05,100);
 scene.add(new THREE.HemisphereLight('#d9e9f0','#27323c',1.1));
 const key=new THREE.DirectionalLight('#fff4df',3.2);key.position.set(-7,13,8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;key.shadow.bias=-.00015;scene.add(key);
 const rim=new THREE.DirectionalLight('#94c8f0',2);rim.position.set(2,2,-3);scene.add(rim);
 const fill=new THREE.DirectionalLight('#e4f5ff',.8);fill.position.set(3,.3,4);scene.add(fill);
 // A generated studio reflection map supplies broad softbox highlights.
 const w=512,h=256,data=new Float32Array(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const u=x/w,v=y/h;let val=.07+.12*Math.sin(v*Math.PI);
  for(const c of [.13,.56,.83])val+=Math.exp(-Math.pow((u-c)/.035,8)-Math.pow((v-.42)/.28,8))*2.3;
  const i=(y*w+x)*4;data[i]=val*.94;data[i+1]=val;data[i+2]=val*1.06;data[i+3]=1;
 }
 const env=new THREE.DataTexture(data,w,h,THREE.RGBAFormat,THREE.FloatType);env.mapping=THREE.EquirectangularReflectionMapping;env.needsUpdate=true;
 const pmrem=new THREE.PMREMGenerator(renderer),baked=pmrem.fromEquirectangular(env);scene.environment=baked.texture;scene.environmentIntensity=.65;pmrem.dispose();env.dispose();
 const built=createProductionBoat();scene.add(built.root);
 const glider=createProductionGlider();glider.position.set(3,1.72,-.1);scene.add(glider);
 const hub=new THREE.Vector3(3,2.3,-.1),points=[built.hookPoint.position,hub,hub,new THREE.Vector3(3,1.9,.38),hub,new THREE.Vector3(3,1.9,-.72)];const cableGeometry=new THREE.BufferGeometry().setFromPoints(points);scene.add(new THREE.LineSegments(cableGeometry,new THREE.LineBasicMaterial({color:'#758184'})));
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#03121c',roughness:.8,metalness:.05}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.22;floor.receiveShadow=true;scene.add(floor);
 function draw(f){
  const p=f/359,angle=-Math.PI*.40+p*Math.PI*1.65;
  camera.position.set(Math.sin(angle)*14.8,7.2+Math.sin(p*Math.PI)*2.8,Math.cos(angle)*14.8);camera.lookAt(.3,1.1,.3);
  renderer.render(scene,camera);
 }
 return {draw,dispose(){scene.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.map?.dispose();m.roughnessMap?.dispose();m.dispose()})});baked.dispose();renderer.dispose()}};
}
export function BoatReview(){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('detailed research launch boat'));
 useLayoutEffect(()=>{world.current=setup(canvas.current);world.current.draw(f);continueRender(handle);return()=>world.current?.dispose()},[]);
 useLayoutEffect(()=>{world.current?.draw(f)},[f]);
 return <AbsoluteFill style={{background:'#07151e'}}><canvas ref={canvas} style={{width:1920,height:1080}}/></AbsoluteFill>;
}
