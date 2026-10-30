import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender,cancelRender} from 'remotion';
import {setup} from './rough-opening';
import {ramp} from './opening';
import * as THREE from 'three';
import {productionSciencePath} from './production-science-path.mjs';
import {productionWaterHeight} from './production-water-height.mjs';
export function RoughScience({assembled=false,production=false}){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null),annotations=useRef(null);
 const sceneFrame=assembled&&!production&&f>201?201+(f-201)*72/117:f;const [handle]=useState(()=>delayRender('rough science sensor reveal'));
 useLayoutEffect(()=>{let disposed=false;setup(canvas.current,true,annotations.current,production).then(w=>{if(disposed){w.dispose();return}world.current=w;w.draw(sceneFrame);continueRender(handle)}).catch(cancelRender);return()=>{disposed=true;world.current?.dispose()}},[]);
 useLayoutEffect(()=>{world.current?.draw(sceneFrame)},[f]);
 const pose=productionSciencePath(f/30).camera,height=pose[1]-productionWaterHeight(pose[0],pose[2],13.5+f/30),under=production?1-THREE.MathUtils.smoothstep(height,-.12,.14):0;
 const bridge=production?ramp(f,301,317):0;
 const title=1-ramp(f,0,20),out=assembled?ramp(f,303,317):ramp(f,243,272);
 return <AbsoluteFill style={{background:'#03131f',overflow:'hidden'}}>
 <style>{`@font-face{font-family:'Google Sans';src:url('${staticFile('google-sans-latin.woff2')}') format('woff2');font-weight:100 900}`}</style>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={405}/>
 <canvas ref={canvas} style={{width:1920,height:1080,filter:production?`blur(${Math.exp(-height*height/.0225)*.7}px)`:'none'}}/>
 {production&&<AbsoluteFill style={{background:'radial-gradient(ellipse at 52% 34%,transparent 25%,rgba(0,13,27,.27) 100%)',opacity:under}}/>}
 <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(0,20,35,.35),transparent 65%)',opacity:title}}/>
 <div style={{position:'absolute',left:100,top:300,fontFamily:'Google Sans, sans-serif',fontWeight:700,fontSize:100,lineHeight:.98,letterSpacing:'-.055em',color:'#f6f6ed',opacity:title}}>GREAT LAKES<br/>HACKATHON<br/><span style={{color:'#ffd450',fontStyle:'italic'}}>CHALLENGE</span></div>
 <canvas ref={annotations} width={1920} height={1080} style={{position:'absolute',inset:0,width:1920,height:1080}}/>
 <AbsoluteFill style={{background:'#03131f',opacity:out}}/>
 {production&&<svg width="1920" height="1080" style={{position:'absolute',inset:0,opacity:bridge}}><circle cx="960" cy="540" r="8" fill="#8ff4ef"/>{[0,1,2].map(i=>{const phase=(f/30*1.3+i/3)%1;return <circle key={i} cx="960" cy="540" r={15+phase*26} fill="none" stroke="#87e4e1" strokeWidth="1.5" opacity={(1-phase)*.4}/>})}</svg>}
 </AbsoluteFill>
}
