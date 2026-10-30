import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender,interpolate,Easing} from 'remotion';
import {setupInstallations} from './section2';
import {ramp} from './opening';
const sceneFrame=f=>interpolate(f,[0,81,100,124,145,200,239,256],[0,78,124,198,250,310,334,359],{easing:Easing.bezier(.4,0,.3,1),extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export function RoughCreative(){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('creative installation rough'));
 useLayoutEffect(()=>{world.current=setupInstallations(canvas.current,true);world.current.draw(sceneFrame(f),f);continueRender(handle);return()=>world.current?.dispose()},[]);
 useLayoutEffect(()=>{world.current?.draw(sceneFrame(f),f)},[f]);
 const enter=1-ramp(f,0,13),sketch=ramp(f,239,256);
 return <AbsoluteFill style={{background:'#03131f',overflow:'hidden'}}>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={678}/>
 <canvas ref={canvas} style={{width:1920,height:1080}}/>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(0,8,18,.45))'}}/>
 <AbsoluteFill style={{background:'#03131f',opacity:enter}}/>
 {f>238&&<AbsoluteFill style={{opacity:sketch,background:'#f1eee2'}}><svg viewBox="0 0 1920 1080"><path d="M-100 630 Q650 620 900 540 Q1000 440 1100 540 Q1200 620 1290 530" fill="none" stroke="#123544" strokeWidth="3" strokeDasharray="2200" strokeDashoffset={2200*(1-sketch)}/></svg></AbsoluteFill>}
 </AbsoluteFill>
}
