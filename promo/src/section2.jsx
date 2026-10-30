import React, {useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import * as THREE from 'three';
import {ramp} from './opening';
import {createWaterfront} from './waterfront-environment';
import {createProductionWaterfront} from './production-waterfront-environment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {waterfrontMotion,productionWaterfrontMotion} from './waterfront-motion.mjs';

const mix=(a,b,t)=>a+(b-a)*t;
const cameraX=f=>ramp(f,82,124,0,9)+ramp(f,198,242,0,9);

export function setupInstallations(canvas,creative=false,waterfront=false,roundTwo=false,closing=false,production=false){
 const motionAt=production?productionWaterfrontMotion:waterfrontMotion;
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setSize(1920,1080);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#03131f');scene.fog=new THREE.FogExp2('#03131f',.023);
 const camera=new THREE.PerspectiveCamera(40,1920/1080,.1,150);
 scene.add(new THREE.HemisphereLight(production?'#e4eff4':'#9ce9f4',production?'#535447':'#020a16',production?1.6:2.8));
 const key=new THREE.DirectionalLight('#d9f7ff',5);key.position.set(5,9,6);scene.add(key);
 const rim=new THREE.DirectionalLight('#36a4fa',4);rim.position.set(-6,4,-8);scene.add(rim);
 const metal=new THREE.MeshStandardMaterial({color:'#1b3d4b',metalness:.8,roughness:.24});
 const silver=new THREE.MeshStandardMaterial({color:'#a2c0c7',metalness:.85,roughness:.22,side:THREE.DoubleSide});
 const dark=new THREE.MeshStandardMaterial({color:'#062c3c',metalness:.6,roughness:.18});
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,100),new THREE.MeshStandardMaterial({color:'#061e2b',metalness:.45,roughness:.28}));ground.rotation.x=-Math.PI/2;ground.position.y=-.12;scene.add(ground);
 const stations=[new THREE.Group(),new THREE.Group(),new THREE.Group()];stations.forEach(g=>scene.add(g));let activeStation=stations[0];
 const mesh=(geo,mat,parent=activeStation)=>{const m=new THREE.Mesh(geo,mat);m.castShadow=production;m.receiveShadow=production;parent.add(m);return m};
 const platform=x=>{const m=mesh(new THREE.CylinderGeometry(3.25,3.5,.15,96),metal);m.position.set(x,0,0)};
 [0,9,18].forEach((x,i)=>{activeStation=stations[i];platform(x)});activeStation=stations[0];
 const rods=[];
 for(let i=0;i<19;i++){
  const angle=i/19*Math.PI*2;const r=1.9+.2*Math.sin(i*1.8);const height=1.2+(Math.sin(i*.68)+1)*1.3;
  const group=new THREE.Group();group.position.set(Math.cos(angle)*r,.1,Math.sin(angle)*r);stations[0].add(group);
  const base=mesh(new THREE.CylinderGeometry(.11,.18,.23,16),metal,group);base.position.y=.11;
  const mat=new THREE.MeshStandardMaterial({color:'#94f6ed',emissive:'#40ded2',emissiveIntensity:2,metalness:.1,roughness:.3});
  if(waterfront){mat.dispose();}
  const tubeMaterial=waterfront?new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uIndex:{value:i}},toneMapped:false,
   vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uIndex;
   void main(){float cycle=mod(uTime,2.);float travel=fract(uTime*.65-uIndex*.035);float band=exp(-pow((vUv.y-travel)/.22,2.));vec3 green=vec3(.08,.95,.22),yellow=vec3(1.,.8,.04);vec3 light=mix(green,yellow,smoothstep(.85,1.15,cycle)*(1.-smoothstep(1.8,2.,cycle)));vec3 shell=vec3(.30,.43,.40);gl_FragColor=vec4(mix(shell,light,band*.95)+light*band*.25,1.);}`
  }):mat;
  const rod=mesh(new THREE.CylinderGeometry(.045,.045,height,production?32:12),tubeMaterial,group);rod.position.y=height/2+.2;rods.push({rod,mat:tubeMaterial,height});
  if(production){for(const y of [.22,height+.19]){const cap=mesh(new THREE.CylinderGeometry(.061,.061,.065,24),silver,group);cap.position.y=y}for(const a of [0,2.1,4.2]){const bolt=mesh(new THREE.CylinderGeometry(.022,.022,.035,6),silver,group);bolt.position.set(Math.cos(a)*.12,.032,Math.sin(a)*.12)}}
 }
 const light=new THREE.PointLight('#65f7ee',28,10,2);light.position.set(0,2,0);stations[0].add(light);
 // The sound station is a bowl of water over a speaker; rings are a visual metaphor.
 activeStation=stations[1];
 const speaker=mesh(new THREE.CylinderGeometry(1.65,1.5,.75,80),metal);speaker.position.set(9,.45,0);
 const bowl=mesh(new THREE.TorusGeometry(1.7,.16,18,96),silver);bowl.rotation.x=Math.PI/2;bowl.position.set(9,.95,0);
 const water=mesh(new THREE.CircleGeometry(1.7,96),dark);water.rotation.x=-Math.PI/2;water.position.set(9,.94,0);
 const rings=[];
 for(let i=0;i<12;i++){const mat=new THREE.MeshStandardMaterial({color:'#91f7e9',emissive:'#3cbfb5',emissiveIntensity:.7,transparent:true,opacity:.7});const m=mesh(new THREE.TorusGeometry(.12+i*.13,.009,6,100),mat);m.rotation.x=Math.PI/2;m.position.set(9,.96,0);rings.push(m)}
 const cone=mesh(new THREE.CylinderGeometry(.9,1.1,.09,64),dark);cone.position.set(9,production?.65:1.0,0);
 if(production){water.material=new THREE.MeshPhysicalMaterial({color:"#1b5659",metalness:.3,roughness:.12,clearcoat:1});}
 // Typography belongs to the physical LED screen, not an overlay on the film.
 activeStation=stations[2];
 const maskCanvas=document.createElement('canvas');maskCanvas.width=1536;maskCanvas.height=864;
 const ctx=maskCanvas.getContext('2d');
 const textMask=new THREE.CanvasTexture(maskCanvas);textMask.minFilter=THREE.LinearFilter;
 function paintText(f){
  ctx.fillStyle='black';ctx.fillRect(0,0,1536,864);ctx.fillStyle='white';
  const line=(text,font,y,start,delay)=>{
   ctx.font=`900 ${font}px Arial, sans-serif`;ctx.textBaseline='alphabetic';
   const widths=[...text].map(ch=>ctx.measureText(ch).width);const gap=font*.025;
   let x=(1536-widths.reduce((a,b)=>a+b,0)-gap*(text.length-1))/2;
   ctx.save();ctx.beginPath();ctx.rect(0,y-font*1.05,1536,font*1.2);ctx.clip();
   [...text].forEach((ch,i)=>{const enter=ramp(f,start+i*delay,start+i*delay+18);ctx.globalAlpha=enter;ctx.fillText(ch,x,y+(1-enter)*font*.9);x+=widths[i]+gap});
   ctx.restore();ctx.globalAlpha=1;
  };
  line('BE',250,355,230,6);line('CREATIVE',180,610,246,4);
  textMask.needsUpdate=true;
 }
 paintText(0);
 const displayMaterial=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uMask:{value:textMask}},toneMapped:false,
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`
 precision highp float; varying vec2 vUv; uniform float uTime;uniform sampler2D uMask;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
 void main(){
  vec2 uv=vUv;float t=uTime;vec2 mp=uv;
  float mask=texture2D(uMask,mp).r;
  if(mp.x<0.||mp.x>1.||mp.y<0.||mp.y>1.)mask=0.;
  float n=noise(uv*5.+vec2(t*.15,-t*.09));
  float flow=sin(uv.x*15.+uv.y*10.-t*1.6+n*5.);
  float stream=pow(.5+.5*sin(uv.y*48.+sin(uv.x*8.-t)*3.+t*1.8),9.);
  vec3 deep=vec3(.015,.13,.25),aqua=vec3(.05,.76,.80),blue=vec3(.12,.35,.95),gold=vec3(.98,.73,.20);
  vec3 water=mix(deep,aqua,.5+.5*flow);water=mix(water,blue,.22+.22*sin(uv.x*6.-t*.55));
  water+=stream*vec3(.26,.7,.6)*.7;
  float bloom=exp(-length((uv-vec2(.5+.25*sin(t*.5),.5+.15*cos(t*.6)))*vec2(2.,3.))*5.);
  water=mix(water,gold,.65+.2*sin(t*.8));
  float edge=abs(mask-texture2D(uMask,mp+vec2(.002,0.)).r)+abs(mask-texture2D(uMask,mp+vec2(0.,.002)).r);
  vec3 bg=vec3(.006,.025,.055)+vec3(.015,.065,.09)*(.5+.5*sin(uv.x*10.+uv.y*8.+t));
  float ribbon=pow(.5+.5*sin(uv.y*16.+sin(uv.x*5.+t*.5)*1.6-t*.4),22.);
  bg+=ribbon*vec3(.01,.12,.16);
  vec3 col=mix(bg,water,mask);col+=edge*vec3(.22,.62,.65)*.6;
  // A subtle pixel texture reads as an LED surface up close.
  vec2 pixel=fract(uv*vec2(360.,202.));float grid=smoothstep(.04,.13,pixel.x)*smoothstep(.04,.13,pixel.y);
  col*=.86+.14*grid;gl_FragColor=vec4(col,1.);
 }`});
 if(production){displayMaterial.fragmentShader=`
 precision highp float;varying vec2 vUv;uniform float uTime;uniform sampler2D uMask;
 void main(){vec2 cells=vec2(112.,64.);vec2 cell=floor(vUv*cells);vec2 centre=(cell+.5)/cells;
 float letter=texture2D(uMask,centre).r;vec2 p=fract(vUv*cells)-.5;
 float bulb=1.-smoothstep(.23,.40,length(p));float halo=exp(-dot(p,p)*10.);
 vec3 lamp=mix(vec3(.12,.85,.77),vec3(1.,.68,.16),.7+.15*sin(centre.x*5.-uTime));
 vec3 col=vec3(.007,.012,.014)+vec3(.023,.031,.032)*bulb;
 col+=letter*lamp*(bulb*.93+halo*.15);gl_FragColor=vec4(col,1.);}`;displayMaterial.needsUpdate=true;}
 const chassis=mesh(production?new RoundedBoxGeometry(6.05,3.55,.23,3,.065):new THREE.BoxGeometry(6.05,3.55,.23),metal);chassis.position.set(18,2.35,-.3);
 const display=mesh(new THREE.PlaneGeometry(5.82,3.28),displayMaterial);display.position.set(18,2.35,-.17);
 if(waterfront){
  chassis.position.y=production?3.0:3.5;display.position.y=production?3.0:3.5;
  if(production){chassis.scale.set(.64,.64,.8);display.scale.set(.64,.64,1);}

  const column=mesh(new THREE.CylinderGeometry(production?.065:.25,production?.065:.32,production?2.15:1.8,32),production?silver:metal);column.position.set(18,production?1.15:.98,-.3);
  const collar=mesh(new THREE.CylinderGeometry(.26,.26,.45,32),metal);collar.position.set(18,1.9,-.3);if(production){collar.visible=false;}
  const foot=mesh(production?new RoundedBoxGeometry(2.7,.16,1.7,3,.055):new THREE.BoxGeometry(2.7,.16,1.7),production?silver:metal);foot.position.set(18,production?.10:.17,-.15);if(production)foot.scale.set(.65,.3,1);
 }else [-2.05,2.05].forEach(dx=>{const leg=mesh(new THREE.BoxGeometry(.13,.65,.18),metal);leg.position.set(18+dx,.43,-.3);const foot=mesh(new THREE.BoxGeometry(.8,.08,1.1),metal);foot.position.set(18+dx,.12,-.2)});
 const screenGlow=new THREE.PointLight('#22d6d5',8,7,2);screenGlow.position.set(18,1.3,1.0);stations[2].add(screenGlow);
 if(waterfront){stations.forEach((g,i)=>g.position.set(i*(production?20:48)-i*9,0,-9.5));}
 if(roundTwo){stations[1].visible=false;stations[2].visible=false;}
 activeStation=scene;
 const shore=waterfront?(production?createProductionWaterfront(scene,ground):createWaterfront(scene,ground)):null;
 if(production){renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-17,right:17,top:17,bottom:-17,near:.1,far:60});key.shadow.normalBias=.025;scene.add(key.target);key.color.set("#fff0d5");}
 if(waterfront){camera.far=6000;camera.updateProjectionMatrix();renderer.toneMappingExposure=.85;key.intensity=2.4;rim.intensity=.8;}
 const particles=[];
 for(let i=0;i<32;i++){const m=mesh(new THREE.SphereGeometry(i===0?(production?.15:.075):(production?.05:.025),8,8),new THREE.MeshBasicMaterial({color:i===0?'#ffdf66':'#7ce3e8',transparent:true,opacity:1-i/40}));particles.push(m)}
 const pulseRings=[];
 if(creative){particles[0].material.color.set('#8ff4ef');for(let i=0;i<3;i++){const h=mesh(new THREE.TorusGeometry(.13,.009,8,64),new THREE.MeshBasicMaterial({color:'#8ff4ef',transparent:true,opacity:.4}));pulseRings.push(h)}}
 function draw(f,localFrame=f){
  const t=waterfront?(localFrame-45)/30:f/30,x=cameraX(f);const a=.36+Math.sin(t*.2)*.23;
  const zoom=ramp(f,265,334,0,1);const screenFocus=ramp(f,210,255);
  camera.position.set(x+Math.sin(a)*8.7*(1-zoom*.35),4.3-zoom*1.0,Math.cos(a)*8.7-zoom*2.5);
  camera.lookAt(x,1.2+screenFocus*.85,0);
  rods.forEach(({rod,mat,height},i)=>{if(waterfront){rod.scale.y=1;mat.uniforms.uTime.value=(localFrame-45)/30;if(roundTwo){const built=ramp(localFrame-45,177+i*2.2,210+i*2.2);rod.position.y=height/2+.2+(1-built)*3;rod.visible=built>0;}return}rod.scale.y=.9+Math.sin(t*2.2+i*.5)*.1;mat.emissiveIntensity=.6+Math.pow((Math.sin(t*2.8-i*.4)+1)/2,3)*3;mat.color.setHSL(.46+Math.sin(i*.4+t)*.05,.7,.65)});
  rings.forEach((ring,i)=>{const pulse=(t*.9+i/12)%1;ring.scale.setScalar(.12+pulse*1.12);ring.position.y=.97+Math.sin(i*.8+t*9)*.012;ring.material.opacity=(1-pulse)*(production?.3:.8)});
  paintText(production?(localFrame-45<125?220:localFrame-45<150?230+(localFrame-170)*16/25:246+(localFrame-195)*1.6):f);displayMaterial.uniforms.uTime.value=t;screenGlow.intensity=7+Math.sin(t*1.5)*2;
  particles.forEach((p,i)=>{const lead=waterfront?motionAt(localFrame-45).centre:creative?x+ramp(localFrame,0,45,2.3,0):x-2.5+(f%110)/110*5;const px=lead-i*(production?.11:.055);p.position.set(px,1.4+Math.sin((production?t*.5:px*1.1+t))*.6,Math.cos(production?t*.4:px*.7+t)*.7-(waterfront?9.5:0));if(creative){p.material.color.set('#87e4e1');p.material.opacity=(1-i/32)*(production?1:.7);p.visible=localFrame<204}});
  pulseRings.forEach((h,i)=>{const phase=(localFrame/30*1.3+i/3)%1;h.position.copy(particles[0].position);h.scale.setScalar((production?2:1)*(1+phase*3));h.material.opacity=(1-phase)*.5*(1-ramp(localFrame,175,204));h.lookAt(camera.position)});
  if(creative&&!waterfront){const build=ramp(localFrame,7,58);rods.forEach(({rod})=>{rod.scale.y*=.05+.95*build});light.intensity=28*(.25+.75*build)}
  if(waterfront){
   const motion=motionAt(localFrame-45);
   camera.position.set(...motion.camera);camera.lookAt(...motion.target);
   if(roundTwo){const frame=localFrame-45,p=ramp(frame,170,436);camera.position.set(6.5-p*3,3.8-p*.4,10.5-p*1.4);camera.lookAt(0,1.15,-9.5);particles.forEach(o=>o.visible=false);pulseRings.forEach(o=>o.visible=false);}
   if(closing){const depart=ramp(localFrame-45-437,0,135);camera.position.set(3.5,3.4+depart*3.6,9.1+depart*11);camera.lookAt(0,1.15-depart,-9.5-depart*18);}
   shore.draw(production?(localFrame-45)/30:localFrame/30);
   if(production){key.position.set(motion.centre-12,18,4);key.target.position.set(motion.centre,0,-9.5);key.target.updateMatrixWorld();}
  }
  if(production){renderer.render(scene,camera);renderer.shadowMap.autoUpdate=false;shore.reflect(renderer,camera);}
  renderer.render(scene,camera);if(production)renderer.shadowMap.autoUpdate=true;
 }
 return {draw,dispose:()=>{scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}});textMask.dispose();shore?.dispose();renderer.dispose()}};
}

export function Section2Concept(){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('3D installation frame'));
 useLayoutEffect(()=>{world.current=setupInstallations(canvas.current);world.current.draw(f);continueRender(handle);return()=>world.current?.dispose()},[]);
 useLayoutEffect(()=>{world.current?.draw(f)},[f]);
 const sketch=ramp(f,335,359);
 return <AbsoluteFill style={{background:'#03131f',overflow:'hidden'}}><canvas ref={canvas} style={{width:1920,height:1080}}/>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(0,8,18,.45))',pointerEvents:'none'}}/>
 {f>334&&<AbsoluteFill style={{opacity:sketch,background:'#f1eee2'}}><svg viewBox="0 0 1920 1080"><path d="M-100 630 Q650 620 900 540 Q1000 440 1100 540 Q1200 620 1290 530" fill="none" stroke="#123544" strokeWidth="3" strokeDasharray="2200" strokeDashoffset={2200*(1-sketch)}/></svg></AbsoluteFill>}
 </AbsoluteFill>
}

const photoPath=['pool-light.jpg','ripple-effect.png','clams.jpg'];
function Photograph({index,f,opacity=1}){
 const start=[0,112,224][index],local=f-start;const z=ramp(local,0,110,1.1,1.24);const dx=ramp(local,0,110,20,-35);const dy=ramp(local,0,110,10,-16);
 return <AbsoluteFill style={{opacity,overflow:'hidden'}}><Img src={staticFile(`section2/${photoPath[index]}`)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:index===1?'50% 52%':'50% 55%',transform:`translate(${dx}px,${dy}px) scale(${z})`}}/><AbsoluteFill style={{background:'linear-gradient(180deg,rgba(0,12,25,.15),transparent 50%,rgba(0,12,25,.35))'}}/></AbsoluteFill>
}
export function Section2Photos(){
 const f=useCurrentFrame();const reveal1=ramp(f,100,127),reveal2=ramp(f,212,239);const end=ramp(f,335,359);
 return <AbsoluteFill style={{background:'#03131f',overflow:'hidden'}}>
 <Photograph index={0} f={f}/>
 {f>=100&&<AbsoluteFill style={{clipPath:`circle(${reveal1*130}% at 50% 56%)`}}><Photograph index={1} f={f}/></AbsoluteFill>}
 {f>=212&&<AbsoluteFill style={{clipPath:`ellipse(${reveal2*130}% ${reveal2*160}% at 50% 60%)`}}><Photograph index={2} f={f}/></AbsoluteFill>}
 {/* A single luminous trace links all three photographs and becomes a sketch. */}
 <svg width="1920" height="1080" style={{position:'absolute',inset:0,mixBlendMode:'screen',opacity:1-end}}><defs><filter id="glow"><feGaussianBlur stdDeviation="6"/></filter></defs>
 {[true,false].map(blur=><g key={String(blur)} filter={blur?'url(#glow)':undefined} opacity={blur?.6:.85}><path d={`M-100 820 Q350 ${620+Math.sin(f*.04)*120} 740 620 T1430 490 T2020 460`} stroke="#90efe3" strokeWidth={blur?7:2} fill="none" pathLength="1" strokeDasharray=".16 .84" strokeDashoffset={-f/210}/><circle cx={((f*11)%2250)-150} cy={660-Math.sin(f*.025)*120} r="5" fill="#ffe16a"/></g>)}
 {f>96&&f<132&&[0,1,2].map(i=><circle key={i} cx="960" cy="605" r={Math.max(0,f-96)*45+i*45} fill="none" stroke="#b8fff4" strokeWidth="2" opacity={.3*(1-reveal1)}/>)}
 </svg>
 {f>334&&<AbsoluteFill style={{opacity:end,background:'#f1eee2'}}><svg viewBox="0 0 1920 1080"><path d="M-100 630Q650 620 900 540Q1000 440 1100 540Q1200 620 1290 530" fill="none" stroke="#123544" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-end}/></svg></AbsoluteFill>}
 </AbsoluteFill>
}
