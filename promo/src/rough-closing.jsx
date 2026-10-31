import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import {setupInstallations} from './section2';
import {ramp,Lakes} from './opening';
export function RoughClosing({production=false}){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('closing waterfront and invitation'));
 useLayoutEffect(()=>{world.current=setupInstallations(canvas.current,true,true,true,true,production);world.current.draw(123,437+f+45);continueRender(handle);return()=>world.current?.dispose()},[]);
 useLayoutEffect(()=>{world.current?.draw(123,437+f+45)},[f]);
 const night=ramp(f,89,132),title=ramp(f,146,177),url=ramp(f,183,211);
 const raw=Math.max(0,Math.min(1,(f-64)/143));const p=production?raw*raw*raw*(raw*(raw*6-15)+10):ramp(f,64,207),q=1-p;
 const x=q*q*q*850+3*q*q*p*1450+3*q*p*p*1720+p*p*p*(production?1010:1090);
 const y=q*q*q*500+3*q*q*p*150+3*q*p*p*850+p*p*p*(production?907:865);
 return <AbsoluteFill style={{background:'#052638',overflow:'hidden',fontFamily:'Google Sans,sans-serif'}}>
 <style>{`@font-face{font-family:'Google Sans';src:url('${staticFile('google-sans-latin.woff2')}') format('woff2');font-weight:100 900}`}</style>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={1767}/>
 <canvas ref={canvas} style={{width:1920,height:1080}}/>
 <AbsoluteFill style={{background:production?'radial-gradient(ellipse at 72% 40%,#0b3a49 0%,#052638 48%,#031923 100%)':'#052638',opacity:night}}/>
 <Lakes f={f-78} style={{position:'absolute',right:10,top:180,width:1050,opacity:ramp(f,100,151)*(1-title*.78),transform:`scale(${ramp(f,100,180,.88,1)})`}}/>
 <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
 <defs><filter id="closing-dot-glow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="9"/></filter></defs>
 <path d={production?"M850 500C1450 150 1720 850 1010 907":"M850 500C1450 150 1720 850 1090 865"} fill="none" stroke="#87e4e1" strokeWidth={production?3:1.5} pathLength="1" strokeDasharray=".12 .88" strokeDashoffset={-p} opacity={ramp(f,62,82)*(1-url)}/>
 <g opacity={ramp(f,8,23)*(production?1-ramp(f,218,245):1)}>{production&&<circle cx={x} cy={y} r="23" fill="#8ff4ef" opacity=".4" filter="url(#closing-dot-glow)"/>}<circle cx={x} cy={y} r={production?16:8} fill="#8ff4ef"/>{[0,1,2].map(i=>{const phase=(f/30*1.3+i/3)%1;return <circle key={i} cx={x} cy={y} r={(production?2:1)*(16+phase*38)} fill="none" stroke="#87e4e1" strokeWidth="1.5" opacity={(1-phase)*.45}/>})}</g>
 <path d="M110 907H1010" fill="none" stroke="#87e4e1" strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,201,234)}/>
 </svg>
 {production?<div style={{position:'absolute',left:110,top:255,color:'#f6f6ed',fontWeight:700,fontSize:105,lineHeight:.99,letterSpacing:'-.055em'}}>{['GREAT LAKES','HACKATHON','CHALLENGE'].map((text,i)=>{const a=ramp(f,146+i*6,165+i*6);return <div key={text} style={{overflow:'hidden',paddingBottom:5}}><div style={{opacity:a,transform:`translateY(${(1-a)*80}px)`,color:i===2?'#ffd450':undefined,fontStyle:i===2?'italic':undefined}}>{text}</div></div>})}</div>:<> <div style={{position:'absolute',left:110,top:255,color:'#f6f6ed',fontWeight:700,fontSize:105,lineHeight:.99,letterSpacing:'-.055em',opacity:title,transform:`translateY(${(1-title)*24}px)`}}>GREAT LAKES<br/>HACKATHON<br/><span style={{color:'#ffd450',fontStyle:'italic'}}>CHALLENGE</span></div></>}

 <div style={{position:'absolute',left:110,top:800,color:'#ffd450',fontSize:82,fontWeight:600,letterSpacing:'-.035em',opacity:url,transform:`translateY(${(1-url)*18}px)`}}>raeonhacks.com</div>
 </AbsoluteFill>
}
