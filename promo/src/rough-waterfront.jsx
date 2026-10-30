import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender,interpolate,Easing} from 'remotion';
import {setupInstallations} from './section2';
import {ramp} from './opening';
// Three scenic shots, mapped to the existing installation choreography.
const sceneFrame=f=>f<61?interpolate(f,[0,60],[0,123]):f<103?interpolate(f,[61,102],[124,241]):interpolate(f,[103,211],[242,359]);
export function RoughWaterfront(){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('three waterfront moments'));
 useLayoutEffect(()=>{world.current=setupInstallations(canvas.current,true,true);world.current.draw(sceneFrame(f),f+45);continueRender(handle);return()=>world.current?.dispose()},[]);
 useLayoutEffect(()=>{world.current?.draw(sceneFrame(f),f+45)},[f]);
 const sketch=ramp(f,198,211);
 return <AbsoluteFill style={{background:'#a5c4cc',overflow:'hidden'}}>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={723}/>
 <canvas ref={canvas} style={{width:1920,height:1080}}/>
 {f>197&&<AbsoluteFill style={{opacity:sketch,background:'#f1eee2'}}><svg viewBox="0 0 1920 1080"><path d="M-100 630 Q650 620 900 540 Q1000 440 1100 540 Q1200 620 1290 530" fill="none" stroke="#123544" strokeWidth="3" strokeDasharray="2200" strokeDashoffset={2200*(1-sketch)}/></svg></AbsoluteFill>}
 </AbsoluteFill>
}
