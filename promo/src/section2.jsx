import React, {useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import * as THREE from 'three';
import {ramp} from './opening';

const mix=(a,b,t)=>a+(b-a)*t;
const cameraX=f=>ramp(f,82,124,0,9)+ramp(f,198,242,0,9);

function setup(canvas){
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
 // Three original shell-like objects, inspired by the possibility of kinetic art.
 const shells=[];
 [[17.9,0,.2],[19.7,0,-1.3],[16.4,0,-1.7]].forEach(([x,y,z],i)=>{
  const root=new THREE.Group();root.position.set(x,.55,z);root.rotation.y=i*.65;scene.add(root);
  const top=new THREE.Group();top.position.z=-.9;root.add(top);
  const geo=new THREE.SphereGeometry(1.15,56,24,0,Math.PI*2,0,Math.PI/2);geo.scale(1,.36,1);geo.translate(0,0,.9);
  mesh(geo,silver,top);const bottom=mesh(geo.clone(),metal,root);bottom.rotation.x=Math.PI;bottom.position.z=-.9;
  const glow=mesh(new THREE.CircleGeometry(.86,64),new THREE.MeshStandardMaterial({color:'#ffd657',emissive:'#ffbe29',emissiveIntensity:2,side:THREE.DoubleSide}));glow.rotation.x=-Math.PI/2;glow.position.set(x,.53,z);
  for(let k=0;k<13;k++){const a=k/13*Math.PI*2;const points=[];for(let j=0;j<=24;j++){const t=j/24*Math.PI/2;points.push(new THREE.Vector3(Math.sin(t)*Math.cos(a)*1.16,Math.cos(t)*.425,Math.sin(t)*Math.sin(a)*1.16+.9))}const curve=new THREE.CatmullRomCurve3(points);mesh(new THREE.TubeGeometry(curve,24,.008,4,false),dark,top)}
  shells.push(top);
 });
 const particles=[];
 for(let i=0;i<32;i++){const m=mesh(new THREE.SphereGeometry(i===0?.075:.025,8,8),new THREE.MeshBasicMaterial({color:i===0?'#ffdf66':'#7ce3e8',transparent:true,opacity:1-i/40}));particles.push(m)}
 function draw(f){
  const t=f/30,x=cameraX(f);const a=.36+Math.sin(t*.2)*.23;
  const zoom=ramp(f,300,350,0,1);camera.position.set(x+Math.sin(a)*8.7,4.3-zoom*.9,Math.cos(a)*8.7-zoom*.8);camera.lookAt(x,1.2,0);
  rods.forEach(({rod,mat,height},i)=>{rod.scale.y=.9+Math.sin(t*2.2+i*.5)*.1;mat.emissiveIntensity=.6+Math.pow((Math.sin(t*2.8-i*.4)+1)/2,3)*3;mat.color.setHSL(.46+Math.sin(i*.4+t)*.05,.7,.65)});
  rings.forEach((ring,i)=>{const pulse=(t*.9+i/12)%1;ring.scale.setScalar(.12+pulse*1.12);ring.position.y=.97+Math.sin(i*.8+t*9)*.012;ring.material.opacity=(1-pulse)*.8});
  shells.forEach((top,i)=>{top.rotation.x=-.12-(Math.sin(t*2+i*.7)+1)*.3});
  particles.forEach((p,i)=>{const lead=x-2.5+(f%110)/110*5;const px=lead-i*.055;p.position.set(px,1.4+Math.sin(px*1.1+t)*.6,Math.cos(px*.7+t)*.7)});
  renderer.render(scene,camera);
 }
 return {draw,dispose:()=>{scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}});renderer.dispose()}};
}

export function Section2Concept(){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('3D installation frame'));
 useLayoutEffect(()=>{world.current=setup(canvas.current);world.current.draw(f);continueRender(handle);return()=>world.current?.dispose()},[]);
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
