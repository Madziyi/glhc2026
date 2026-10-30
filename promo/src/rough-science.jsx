import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender,cancelRender} from 'remotion';
import {setup} from './rough-opening';
import {ramp} from './opening';
export function RoughScience(){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('rough science sensor reveal'));
 useLayoutEffect(()=>{let disposed=false;setup(canvas.current,true).then(w=>{if(disposed){w.dispose();return}world.current=w;w.draw(f);continueRender(handle)}).catch(cancelRender);return()=>{disposed=true;world.current?.dispose()}},[]);
 useLayoutEffect(()=>{world.current?.draw(f)},[f]);
 const title=1-ramp(f,0,20),out=ramp(f,243,272);
 return <AbsoluteFill style={{background:'#03131f',overflow:'hidden'}}>
 <style>{`@font-face{font-family:'Google Sans';src:url('${staticFile('google-sans-latin.woff2')}') format('woff2');font-weight:100 900}`}</style>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={405}/>
 <canvas ref={canvas} style={{width:1920,height:1080}}/>
 <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(0,20,35,.35),transparent 65%)',opacity:title}}/>
 <div style={{position:'absolute',left:100,top:300,fontFamily:'Google Sans, sans-serif',fontWeight:700,fontSize:100,lineHeight:.98,letterSpacing:'-.055em',color:'#f6f6ed',opacity:title}}>GREAT LAKES<br/>HACKATHON<br/><span style={{color:'#ffd450',fontStyle:'italic'}}>CHALLENGE</span></div>
 <AbsoluteFill style={{background:'#03131f',opacity:out}}/>
 </AbsoluteFill>
}
