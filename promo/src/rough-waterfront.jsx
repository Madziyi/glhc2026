import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender,interpolate,Easing} from 'remotion';
import {setupInstallations} from './section2';
import {ramp} from './opening';
// Three scenic shots, mapped to the existing installation choreography.
const sceneFrame=f=>f<61?interpolate(f,[0,60],[0,123]):f<103?interpolate(f,[61,102],[124,241]):interpolate(f,[103,211],[242,359]);
export function RoughWaterfront({production=false}){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('three waterfront moments'));
 useLayoutEffect(()=>{world.current=setupInstallations(canvas.current,true,true,false,false,production);world.current.draw(sceneFrame(f),f+45);continueRender(handle);return()=>world.current?.dispose()},[]);
 useLayoutEffect(()=>{world.current?.draw(sceneFrame(f),f+45)},[f]);
 const sketch=ramp(f,198,211);
 return <AbsoluteFill style={{background:'#a5c4cc',overflow:'hidden'}}>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={723}/>
 <canvas ref={canvas} style={{width:1920,height:1080}}/>
 {production&&f<20&&<AbsoluteFill style={{background:"#03131f",opacity:1-ramp(f,0,20)}}><svg viewBox="0 0 1920 1080"><circle cx="960" cy="540" r="16" fill="#8ff4ef"/>{[0,1,2].map(i=><circle key={i} cx="960" cy="540" r={24+((f/30*1.3+i/3)%1)*100} stroke="#8ff4ef" strokeWidth="1.5" fill="none" opacity=".35"/>)}</svg></AbsoluteFill>}
 {f>197&&<AbsoluteFill style={{opacity:sketch,background:'#f1eee2'}}><svg viewBox="0 0 1920 1080"><path d="M-100 630 Q650 620 900 540 Q1000 440 1100 540 Q1200 620 1290 530" fill="none" stroke="#123544" strokeWidth="3" strokeDasharray="2200" strokeDashoffset={2200*(1-sketch)}/></svg></AbsoluteFill>}
 </AbsoluteFill>
}
