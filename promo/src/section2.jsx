import React, {useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import * as THREE from 'three';
import {ramp} from './opening';
import {createWaterfront} from './waterfront-environment';

const mix=(a,b,t)=>a+(b-a)*t;
const cameraX=f=>ramp(f,82,124,0,9)+ramp(f,198,242,0,9);

export function setupInstallations(canvas,creative=false,waterfront=false){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setSize(1920,1080);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#03131f');scene.fog=new THREE.FogExp2('#03131f',.023);
 const camera=new THREE.PerspectiveCamera(40,1920/1080,.1,150);
 scene.add(new THREE.HemisphereLight('#9ce9f4','#020a16',2.8));
 const key=new THREE.DirectionalLight('#d9f7ff',5);key.position.set(5,9,6);scene.add(key);
 const rim=new THREE.DirectionalLight('#36a4fa',4);rim.position.set(-6,4,-8);scene.add(rim);
 const metal=new THREE.MeshStandardMaterial({color:'#1b3d4b',metalness:.8,roughness:.24});
 const silver=new THREE.MeshStandardMaterial({color:'#a2c0c7',metalness:.85,roughness:.22,side:THREE.DoubleSide});
 const dark=new THREE.MeshStandardMaterial({color:'#062c3c',metalness:.6,roughness:.18});
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,100),new THREE.MeshStandardMaterial({color:'#061e2b',metalness:.45,roughness:.28}));ground.rotation.x=-Math.PI/2;ground.position.y=-.12;scene.add(ground);
 const mesh=(geo,mat,parent=scene)=>{const m=new THREE.Mesh(geo,mat);parent.add(m);return m};
 const platform=x=>{const m=mesh(new THREE.CylinderGeometry(3.25,3.5,.15,96),metal);m.position.set(x,0,0)};
 [0,9,18].forEach(platform);
 const rods=[];
 for(let i=0;i<19;i++){
  const angle=i/19*Math.PI*2;const r=1.9+.2*Math.sin(i*1.8);const height=1.2+(Math.sin(i*.68)+1)*1.3;
  const group=new THREE.Group();group.position.set(Math.cos(angle)*r,.1,Math.sin(angle)*r);scene.add(group);
  const base=mesh(new THREE.CylinderGeometry(.11,.18,.23,16),metal,group);base.position.y=.11;
  const mat=new THREE.MeshStandardMaterial({color:'#94f6ed',emissive:'#40ded2',emissiveIntensity:2,metalness:.1,roughness:.3});
  const rod=mesh(new THREE.CylinderGeometry(.045,.045,height,12),mat,group);rod.position.y=height/2+.2;rods.push({rod,mat,height});
 }
 const light=new THREE.PointLight('#65f7ee',28,10,2);light.position.set(0,2,0);scene.add(light);
 // The sound station is a bowl of water over a speaker; rings are a visual metaphor.
 const speaker=mesh(new THREE.CylinderGeometry(1.65,1.5,.75,80),metal);speaker.position.set(9,.45,0);
 const bowl=mesh(new THREE.TorusGeometry(1.7,.16,18,96),silver);bowl.rotation.x=Math.PI/2;bowl.position.set(9,.95,0);
 const water=mesh(new THREE.CircleGeometry(1.7,96),dark);water.rotation.x=-Math.PI/2;water.position.set(9,.94,0);
 const rings=[];
 for(let i=0;i<12;i++){const mat=new THREE.MeshStandardMaterial({color:'#91f7e9',emissive:'#3cbfb5',emissiveIntensity:.7,transparent:true,opacity:.7});const m=mesh(new THREE.TorusGeometry(.12+i*.13,.009,6,100),mat);m.rotation.x=Math.PI/2;m.position.set(9,.96,0);rings.push(m)}
 const cone=mesh(new THREE.CylinderGeometry(.9,1.1,.09,64),dark);cone.position.set(9,1.0,0);
 // Typography belongs to the physical LED screen, not an overlay on the film.
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
 const chassis=mesh(new THREE.BoxGeometry(6.05,3.55,.23),metal);chassis.position.set(18,2.35,-.3);
 const display=mesh(new THREE.PlaneGeometry(5.82,3.28),displayMaterial);display.position.set(18,2.35,-.17);
 [-2.05,2.05].forEach(dx=>{const leg=mesh(new THREE.BoxGeometry(.13,.65,.18),metal);leg.position.set(18+dx,.43,-.3);const foot=mesh(new THREE.BoxGeometry(.8,.08,1.1),metal);foot.position.set(18+dx,.12,-.2)});
 const screenGlow=new THREE.PointLight('#22d6d5',8,7,2);screenGlow.position.set(18,1.3,1.0);scene.add(screenGlow);
 const shore=waterfront?createWaterfront(scene,ground):null;
 if(waterfront){camera.far=6000;camera.updateProjectionMatrix();renderer.toneMappingExposure=.85;key.intensity=2.4;rim.intensity=.8;}
 const particles=[];
 for(let i=0;i<32;i++){const m=mesh(new THREE.SphereGeometry(i===0?.075:.025,8,8),new THREE.MeshBasicMaterial({color:i===0?'#ffdf66':'#7ce3e8',transparent:true,opacity:1-i/40}));particles.push(m)}
 const pulseRings=[];
 if(creative){particles[0].material.color.set('#8ff4ef');for(let i=0;i<3;i++){const h=mesh(new THREE.TorusGeometry(.13,.009,8,64),new THREE.MeshBasicMaterial({color:'#8ff4ef',transparent:true,opacity:.4}));pulseRings.push(h)}}
 function draw(f,localFrame=f){
  const t=f/30,x=cameraX(f);const a=.36+Math.sin(t*.2)*.23;
  const zoom=ramp(f,265,334,0,1);const screenFocus=ramp(f,210,255);
  camera.position.set(x+Math.sin(a)*8.7*(1-zoom*.35),4.3-zoom*1.0,Math.cos(a)*8.7-zoom*2.5);
  camera.lookAt(x,1.2+screenFocus*.85,0);
  rods.forEach(({rod,mat,height},i)=>{rod.scale.y=.9+Math.sin(t*2.2+i*.5)*.1;mat.emissiveIntensity=.6+Math.pow((Math.sin(t*2.8-i*.4)+1)/2,3)*3;mat.color.setHSL(.46+Math.sin(i*.4+t)*.05,.7,.65)});
  rings.forEach((ring,i)=>{const pulse=(t*.9+i/12)%1;ring.scale.setScalar(.12+pulse*1.12);ring.position.y=.97+Math.sin(i*.8+t*9)*.012;ring.material.opacity=(1-pulse)*.8});
  paintText(f);displayMaterial.uniforms.uTime.value=t;screenGlow.intensity=7+Math.sin(t*1.5)*2;
  particles.forEach((p,i)=>{const lead=creative?x+ramp(localFrame,0,45,2.3,0):x-2.5+(f%110)/110*5;const px=lead-i*.055;p.position.set(px,1.4+Math.sin(px*1.1+t)*.6,Math.cos(px*.7+t)*.7);if(creative){p.material.color.set('#87e4e1');p.material.opacity=(1-i/32)*.7;p.visible=localFrame<204}});
  pulseRings.forEach((h,i)=>{const phase=(localFrame/30*1.3+i/3)%1;h.position.copy(particles[0].position);h.scale.setScalar(1+phase*3);h.material.opacity=(1-phase)*.5*(1-ramp(localFrame,175,204));h.lookAt(camera.position)});
  if(creative){const build=ramp(localFrame,7,58);rods.forEach(({rod})=>{rod.scale.y*=.05+.95*build});light.intensity=28*(.25+.75*build)}
  if(waterfront){
   const station=f<124?0:f<242?9:18;
   const phase=station===0?ramp(f,0,123):station===9?ramp(f,124,241):ramp(f,242,359);
   camera.position.set(station+5.8-phase*2.5,3.6-phase*.55,11.8-phase*1.7);camera.lookAt(station,1.4,-1.8);
   shore.draw(localFrame/30);
  }
  renderer.render(scene,camera);
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
