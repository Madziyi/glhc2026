import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender,cancelRender,interpolate,Easing} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {createOpeningEnvironment} from './opening-environment';
import {ramp} from './opening';
import {openingPath,LAUNCH_BOAT_X,LAUNCH_GLIDER_X} from './rough-opening-path.mjs';
import {productionOpeningPath} from './production-opening-path.mjs';
import {createProductionGlider} from './production-glider.js';
import {createOpeningFish} from './opening-fish.js';
import {createProductionBoat} from './production-boat.js';
import {createDeploymentEffects} from './deployment-effects.js';
import {productionWaterHeight} from './production-water-height.mjs';

const smooth=Easing.bezier(.4,0,.3,1);
const at=(t,keys,values)=>interpolate(t,keys,values,{easing:smooth,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export async function setup(canvas,science=false,annotationCanvas=null,production=false){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setSize(1920,1080);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1920/1080,production ? .015 : .08,6000);
 const environment=createOpeningEnvironment(scene,{production});scene.fog=new THREE.FogExp2('#aec5ce',.006);
 scene.add(new THREE.HemisphereLight('#d6f0ff','#143f48',2));const sun=new THREE.DirectionalLight('#fff1d6',3);sun.position.set(-5,9,8);scene.add(sun);
 const fill=new THREE.DirectionalLight('#6bb7d5',1.5);fill.position.set(4,-4,6);scene.add(fill);
 const material=(color,metalness=.05,roughness=.45)=>new THREE.MeshStandardMaterial({color,metalness,roughness,side:THREE.DoubleSide});
 const white=material('#e4e8df'),steel=material('#8399a0',.7,.3),navy=material('#102f42'),yellow=material('#ffc928',.08,.36),black=material('#121c24'),orange=material('#d25824');
 const mesh=(geo,mat,parent)=>{const m=new THREE.Mesh(geo,mat);parent.add(m);return m};
 const box=(w,h,d,mat,pos,parent)=>{const m=mesh(new THREE.BoxGeometry(w,h,d),mat,parent);m.position.set(...pos);return m};
 const rod=(a,b,r,mat,parent)=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b);const m=mesh(new THREE.CylinderGeometry(r,r,av.distanceTo(bv),10),mat,parent);m.position.copy(av).add(bv).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),bv.sub(av).normalize());return m};
 let boat,boatHook;
 if(production){const built=createProductionBoat();boat=built.root;boatHook=built.hookPoint;boat.position.set(LAUNCH_BOAT_X,.55,-.2);scene.add(boat);}else{
 // Rough boat/blocking model: proportions and camera action are review targets.
 boat=new THREE.Group();boat.position.set(LAUNCH_BOAT_X,.55,-.2);scene.add(boat);
 const hullShape=new THREE.Shape();hullShape.moveTo(-1.9,-4.3);hullShape.lineTo(1.9,-4.3);hullShape.lineTo(2,2.7);hullShape.quadraticCurveTo(1.7,4.4,0,5.5);hullShape.quadraticCurveTo(-1.7,4.4,-2,2.7);hullShape.closePath();
 const hull=mesh(new THREE.ExtrudeGeometry(hullShape,{depth:1,bevelEnabled:true,bevelSize:.15,bevelThickness:.15,bevelSegments:2,steps:1}),white,boat);hull.rotation.x=-Math.PI/2;hull.position.y=-.8;

 box(3.7,.18,7.1,navy,[0,.28,-.6],boat);box(2.9,1.8,2.9,white,[0,1.25,1.6],boat);box(2.5,.72,2.93,material('#1f536b',.35,.2),[0,1.65,1.6],boat);box(3.2,.16,3.2,white,[0,2.22,1.6],boat);
 for(const x of [-1.8,1.8]){rod([x,.5,-4],[x,1.35,-4],.045,steel,boat);rod([x,.5,-1.7],[x,1.35,-1.7],.045,steel,boat);rod([x,1.35,-4],[x,1.35,-1.7],.04,steel,boat)}
 rod([0,2.3,1.5],[0,4.1,1.5],.035,steel,boat);box(.75,.08,.08,white,[0,3.6,1.5],boat);
 rod([1.3,.5,-2.5],[1.3,3.9,-2.5],.15,orange,boat);rod([1.3,3.9,-2.5],[3,4.15,-.1],.13,orange,boat);
 }
 const cablePoints=new Float32Array(production?18:6);const cableGeo=new THREE.BufferGeometry();cableGeo.setAttribute('position',new THREE.BufferAttribute(cablePoints,3));const cable=production?new THREE.LineSegments(cableGeo,new THREE.LineBasicMaterial({color:'#4b5b62'})):new THREE.Line(cableGeo,new THREE.LineBasicMaterial({color:'#25323a'}));scene.add(cable);
 let glider;
 if(production){glider=createProductionGlider();scene.add(glider);}else{
 // Concept glider: streamlined yellow body, dark nose, swept wings, rear fin.
 glider=new THREE.Group();scene.add(glider);
 const body=mesh(new THREE.CylinderGeometry(.22,.22,2.65,32),yellow,glider);body.rotation.x=Math.PI/2;
 const nose=mesh(new THREE.SphereGeometry(.225,28,16),black,glider);nose.scale.z=1.6;nose.position.z=1.35;
 const tail=mesh(new THREE.ConeGeometry(.22,.6,24),yellow,glider);tail.rotation.x=-Math.PI/2;tail.position.z=-1.58;
 for(const z of [-.95,.9]){const band=mesh(new THREE.CylinderGeometry(.225,.225,.2,32),black,glider);band.rotation.x=Math.PI/2;band.position.z=z}
 const wing=(sign)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([sign*.16,0,.3,sign*1.3,0,-.28,sign*1.1,0,-.52,sign*.16,0,.3,sign*1.1,0,-.52,sign*.16,0,-.2],3));g.computeVertexNormals();return mesh(g,yellow,glider)};wing(-1);wing(1);
 const finGeo=new THREE.BufferGeometry();finGeo.setAttribute('position',new THREE.Float32BufferAttribute([0,.05,-.9,0,.6,-1.5,0,.05,-1.65],3));finGeo.computeVertexNormals();mesh(finGeo,yellow,glider);rod([0,.4,-1.45],[0,.95,-1.48],.014,black,glider);
 }
 const fish=production?createOpeningFish(scene):null;
 const deployment=production?createDeploymentEffects(scene,renderer,environment,glider,boat):null;
 const loader=new GLTFLoader();loader.setMeshoptDecoder(MeshoptDecoder);const gltf=await loader.loadAsync(staticFile('models/glhc002-buoy.glb'));const buoy=gltf.scene;scene.add(buoy);
 buoy.traverse(o=>{if(o.isMesh){o.material.side=THREE.DoubleSide;if(o.material.name==='Powder-coated charcoal frame'){o.material.color.set('#8fa6ae');o.material.metalness=.65;o.material.roughness=.3}}});
 const bubbles=[];for(let i=0;i<28;i++){const b=mesh(new THREE.SphereGeometry(.035+(i%4)*.012,8,8),new THREE.MeshBasicMaterial({color:'#b7f1ef',transparent:true,opacity:.24}),scene);bubbles.push(b)}
 const splash=[];for(let i=0;i<3;i++){const m=mesh(new THREE.TorusGeometry(.45,.012,5,64),new THREE.MeshBasicMaterial({color:'#c5e8e3',transparent:true,opacity:.2}),scene);m.rotation.x=Math.PI/2;splash.push(m)}
 const signal=new THREE.Group();scene.add(signal);signal.visible=false;
 const glow=new THREE.MeshBasicMaterial({color:'#8ff4ef',transparent:true,opacity:1});
 const core=mesh(new THREE.SphereGeometry(.075,20,16),glow,signal);
 const halos=[];for(let i=0;i<3;i++){const h=mesh(new THREE.TorusGeometry(.13,.009,8,64),glow.clone(),signal);halos.push(h)}
 const trailGeo=new THREE.BufferGeometry();trailGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(60*3),3));
 const trail=new THREE.Line(trailGeo,new THREE.LineBasicMaterial({color:'#87e4e1',transparent:true,opacity:.7}));scene.add(trail);trail.visible=false;
 const annotation=annotationCanvas?.getContext('2d');
 const underwater=new THREE.Color('#073b4d'),air=new THREE.Color('#aec5ce');
 function draw(f){
  const local=f/30;const t=local+(science?13.5:0);
  const samplePath=production?productionOpeningPath:openingPath;const path=samplePath(t);const [x,y,z]=path.glider;
  const ahead=samplePath(t+.035).glider,behind=samplePath(Math.max(0,t-.035)).glider;
  const release=ramp(f,99,132);const heading=Math.atan2(ahead[0]-behind[0],ahead[2]-behind[2]);
  glider.position.set(x,y,z);glider.rotation.y=heading*release;glider.rotation.x=at(t,[0,3,5,7.8,10],[0,.12,.08,-.08,0]);glider.rotation.z=Math.sin(t*1.2)*.075*release;
  if(production){
   const direction=new THREE.Vector3(...samplePath(Math.min(13.49,t+.05)).glider).sub(new THREE.Vector3(...samplePath(Math.max(0,t-.05)).glider));
   if(direction.lengthSq()>1e-8){const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),direction.normalize());glider.quaternion.slerpQuaternions(new THREE.Quaternion(),q,THREE.MathUtils.smootherstep(t,3.25,4.7));glider.rotateZ(Math.sin(t*.85)*.018);}
   fish.draw(t);
  }
  boat.position.y=.55+Math.sin(t*1.1)*.04;boat.rotation.z=Math.sin(t*.8)*.007;
  cablePoints.set([LAUNCH_GLIDER_X,4.7,-.3,LAUNCH_GLIDER_X,t<3.5?y+.35:at(t,[3.5,5],[y+.35,4.2]),0]);cableGeo.attributes.position.needsUpdate=true;cableGeo.computeBoundingSphere();cable.visible=t<5;
  if(production){
   boat.updateMatrixWorld(true);glider.updateMatrixWorld(true);
   const top=boatHook.getWorldPosition(new THREE.Vector3()),hub=new THREE.Vector3(x,t<3.4?y+.58:at(t,[3.4,5],[y+.58,4.18]),z-.10);
   const front=glider.localToWorld(new THREE.Vector3(0,.18,.48)),back=glider.localToWorld(new THREE.Vector3(0,.18,-.62));
   if(t>=3.4){front.copy(hub);back.copy(hub)}
   cablePoints.set([...top,...hub,...hub,...front,...hub,...back]);cableGeo.attributes.position.needsUpdate=true;cableGeo.computeBoundingSphere();
  }

  // The buoy stays fixed. Only the camera leaves the underwater path and rises.
  buoy.position.set(0,0,0);buoy.rotation.set(0,0,0);
  camera.position.set(...path.camera);camera.lookAt(...path.target);
  if(science){
   const times=[0,1.65,3.8,5.65,6.7,8,9.1];
   camera.position.set(at(local,times,[-5.5,-4,-2.8,.9,1.9,3.5,5]),at(local,times,[2.8,1.7,-1.4,-2,-1.9,-1.8,-1.8]),at(local,times,[7.5,5.4,3.4,3.1,3.4,4,4]));
   camera.lookAt(at(local,times,[0,0,0,0,.5,2.4,5]),at(local,times,[.7,.15,-1.5,-1.7,-1.6,-1.5,-1.5]),0);
   const pulsePosition=(v)=>new THREE.Vector3(at(v,[5.5,6.3,7.3,9.1],[0,.2,2.3,6]),at(v,[5.5,6.3,7.3,9.1],[-1.7,-1.7,-1.4,-1.5]),at(v,[5.5,6.3,7.3,9.1],[0,.2,.4,0]));
   signal.visible=local>=5.5;signal.position.copy(pulsePosition(local));
   core.scale.setScalar(1+Math.sin(local*8)*.13);
   halos.forEach((h,i)=>{const phase=(local*1.3+i/3)%1;h.scale.setScalar(1+phase*3);h.material.opacity=(1-phase)*.6;h.lookAt(camera.position)});
   trail.visible=local>=6.3;const points=trailGeo.attributes.position;for(let i=0;i<60;i++){const pt=pulsePosition(Math.max(5.5,local-i*.018));points.setXYZ(i,pt.x,pt.y,pt.z)}points.needsUpdate=true;trailGeo.computeBoundingSphere();
  }
  const waterLevel=production?productionWaterHeight(camera.position.x,camera.position.z,t):0;
  const under=1-THREE.MathUtils.smoothstep(camera.position.y-waterLevel,production?-.12:-.25,production ? .14 : .2);scene.fog.color.copy(air).lerp(underwater,under);scene.fog.density=.006+under*.035;environment.sky.material.uniforms.uUnder.value=under;environment.sky.material.uniforms.uTime.value=t;environment.water.material.uniforms.uTime.value=t*1.25;environment.water.material.uniforms.uUnder.value=under;
  bubbles.forEach((b,i)=>{const p=(t*.6+i/28)%1;b.visible=!production&&t>2.3&&t<6.7;b.position.set(LAUNCH_GLIDER_X+Math.sin(i*2.1)*.45,-1.7+p*2.2,Math.cos(i*1.4)*.4)});
  splash.forEach((m,i)=>{const p=(t-2.1-i*.15)/1.7;m.visible=!production&&p>0&&p<1;m.position.set(LAUNCH_GLIDER_X,.03+Math.sin(t)*.025,0);m.scale.setScalar(1+Math.max(0,p)*4);m.material.opacity=Math.max(0,1-p)*.25});
  deployment?.draw(t,camera,under);
  renderer.render(scene,camera);
  if(annotation){
   annotation.clearRect(0,0,1920,1080);
   // Leaders track model anchors in screen space while the camera moves.
   const callout=(anchor,label,end,start,endTime)=>{
    const show=ramp(f,start,start+12)*(1-ramp(f,endTime,endTime+13));if(show<=0)return;
    const point=new THREE.Vector3(...anchor).project(camera);if(point.z>1)return;
    const x=(point.x+1)*960,y=(1-point.y)*540,elbow=[end[0]+(end[0]<960?290:-55),end[1]];
    const progress=ramp(f,start+3,start+22);
    annotation.save();annotation.globalAlpha=show;annotation.strokeStyle='#87e4e1';annotation.fillStyle='#8ff4ef';annotation.lineWidth=1.5;
    const segments=[[x,y],elbow,end],lengths=[Math.hypot(elbow[0]-x,elbow[1]-y),Math.hypot(end[0]-elbow[0],end[1]-elbow[1])];let remaining=(lengths[0]+lengths[1])*progress;
    annotation.beginPath();annotation.moveTo(x,y);for(let j=0;j<2;j++){const a=segments[j],b=segments[j+1],p=Math.min(1,remaining/Math.max(.001,lengths[j]));annotation.lineTo(a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p);remaining-=lengths[j];if(remaining<=0)break}annotation.stroke();
    annotation.beginPath();annotation.arc(x,y,8,0,Math.PI*2);annotation.fill();
    for(let i=0;i<2;i++){const phase=(local*1.3+i/2)%1;annotation.globalAlpha=show*(1-phase)*.55;annotation.beginPath();annotation.arc(x,y,15+phase*26,0,Math.PI*2);annotation.stroke()}
    annotation.globalAlpha=show*ramp(f,start+15,start+25);annotation.font='500 32px "Google Sans", sans-serif';annotation.textAlign='left';annotation.fillText(label,end[0],end[1]-17);annotation.restore();
   };
   callout([.65,-.35,.3],'Water-quality buoy',[130,480],91,191);
   callout([-.12,-1.5,.22],'Sensors',[1420,720],111,201);
  }
 }
 return {draw,dispose:()=>{deployment?.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){const list=Array.isArray(o.material)?o.material:[o.material];list.forEach(m=>m.dispose())}});environment.environment.dispose();renderer.dispose()}};
}
export function RoughOpening({production=false}){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('rough glider scene and reviewed buoy'));
 useLayoutEffect(()=>{let disposed=false;setup(canvas.current,false,null,production).then(w=>{if(disposed){w.dispose();return}world.current=w;w.draw(f);continueRender(handle)}).catch(cancelRender);return()=>{disposed=true;world.current?.dispose()}},[]);
 useLayoutEffect(()=>{world.current?.draw(f)},[f]);
 const cameraPose=production?productionOpeningPath(f/30).camera:[0,1,0];
 const cameraY=cameraPose[1]-(production?productionWaterHeight(cameraPose[0],cameraPose[2],f/30):0);
 const crossing=production?Math.exp(-cameraY*cameraY/.0225):0;
 const submersion=production?1-THREE.MathUtils.smoothstep(cameraY,-.25,.2):0;
 const featured=production?ramp(f,201,217)*(1-ramp(f,286,302)):0;
 const title=ramp(f,315,335);const prize=ramp(f,136,148)*(1-ramp(f,185,196));
 return <AbsoluteFill style={{background:'#0a3d50',overflow:'hidden'}}>
 <style>{`@font-face{font-family:'Google Sans';src:url('${staticFile('google-sans-latin.woff2')}') format('woff2');font-weight:100 900}`}</style>
 <Audio src={staticFile('audio/ashley-reference.mp3')}/>
 <canvas ref={canvas} style={{width:1920,height:1080,filter:crossing>.01?`blur(${crossing*.7}px)`:'none'}}/>
 {production&&<AbsoluteFill style={{background:'radial-gradient(ellipse at 52% 34%,transparent 25%,rgba(0,13,27,.27) 100%)',opacity:submersion}}/>}
 <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(0,20,35,.35),transparent 65%)',opacity:Math.max(title,prize,featured)}}/>
 <div style={{position:'absolute',left:100,bottom:115,fontFamily:'Google Sans, sans-serif',fontWeight:700,fontSize:70,color:'#ffd450',opacity:prize,transform:`translateY(${(1-prize)*30}px)`}}>CASH PRIZES</div>
 {production&&<div style={{position:'absolute',left:100,bottom:115,fontFamily:'Google Sans, sans-serif',fontWeight:700,fontSize:62,lineHeight:1.08,color:'#f6f6ed',opacity:featured,transform:`translateY(${(1-featured)*22}px)`}}>GET FEATURED AT<br/><span style={{color:'#ffd450'}}>TOURIST SPOTS</span></div>}
 <div style={{position:'absolute',left:100,top:300,fontFamily:'Google Sans, sans-serif',fontWeight:700,fontSize:100,lineHeight:.98,letterSpacing:'-.055em',color:'#f6f6ed',opacity:title,transform:`translateY(${(1-title)*30}px)`}}>GREAT LAKES<br/>HACKATHON<br/><span style={{color:'#ffd450',fontStyle:'italic'}}>CHALLENGE</span></div>
 </AbsoluteFill>
}
