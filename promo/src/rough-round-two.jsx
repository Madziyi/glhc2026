import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import {setupInstallations} from './section2';
import {LightSketch} from './section3';
import {ProductionLightSketch} from './production-light-sketch';
import {ramp} from './opening';
const ink='#183c47',paper='#f1eee2',gold='#dfbd42';
function Envelope({x,y,scale=1,opacity=1,sealed=false}){return <g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale})`}><path d={sealed?"M-130 50H130V210H-130Z":"M-130 50L0-45L130 50V210H-130Z"} fill={sealed?"#c4bca6":"#d4cfb9"}/><path d="M-130 50L0 140L130 50V210H-130Z" fill="#e7dfc7" stroke={ink} strokeWidth="2"/><path d="M-130 210L0 115L130 210" fill="none" stroke={ink} strokeWidth="2"/>{sealed&&<path d="M-130 50L0 145L130 50Z" fill="#ded5bc" stroke="#8d9387" strokeWidth="1.3"/>}<circle cy="142" r="15" fill="#69bfb9"/></g>}
function Resource({index,f}){const a=ramp(f,64+index*19,78+index*19),converge=ramp(f,136,173),x=[450,960,1470][index];return <g opacity={a*(1-ramp(f,165,182))} transform={`translate(${x+(960-x)*converge} ${790-converge*220}) scale(${1-converge*.65})`}>
 <circle r="105" fill="#fffcf1" stroke="#9aaea7" strokeWidth="2"/>
 {index===0?<g fill={gold} stroke={ink} strokeWidth="3">{[0,1,2].map(i=><g key={i} transform={`translate(${i*22-25} ${-i*18+25})`}><path d="M-45-14V10C-45 32 45 32 45 10V-14Z"/><ellipse cy="-14" rx="45" ry="20"/></g>)}</g>:index===1?<g stroke={ink} strokeWidth="4" strokeLinejoin="round">
 <g transform="translate(-23 0) rotate(18)"><path d="M-18-66L-12-41L7-32L24-47L20-68C48-49 43-20 19-10L11 53Q10 67-4 68Q-19 67-18 52L-11-13C-40-26-39-51-18-66Z" fill="#bdcbc8"/><circle cx="-3" cy="52" r="5" fill="#fffcf1" strokeWidth="3"/></g>
 <g transform="translate(43 0) rotate(-15)"><path d="M-6-62L-9-46L-5-38V13H5V-38L9-46L6-62Z" fill="#b8c8c7"/><rect x="-16" y="9" width="32" height="57" rx="11" fill={gold}/><path d="M-5 22V52M5 22V52" fill="none" strokeWidth="3"/></g>
 </g>:<g fill="none" stroke={ink} strokeWidth="4"><path d="M-62-55H48Q65-55 65-38V10Q65 28 45 28H-8L-38 58V28H-62Z"/><path d="M-31-13L-8 10L33-29" stroke="#67aaa5" strokeWidth="8"/></g>}
 </g>}
export function RoughRoundTwo({production=false}){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('Round2 building and showcase'));
 useLayoutEffect(()=>{world.current=setupInstallations(canvas.current,true,true,true,false,production);world.current.draw(Math.min(123,f*.28),f+45);continueRender(handle);return()=>world.current?.dispose()},[]);
 useLayoutEffect(()=>{world.current?.draw(Math.min(123,f*.28),f+45)},[f]);
 const fan=ramp(f,7,38),select=ramp(f,46,65),paperOut=ramp(f,154,191);
 return <AbsoluteFill style={{background:paper,overflow:'hidden'}}>
 <style>{`@font-face{font-family:'Google Sans';src:url('${staticFile('google-sans-latin.woff2')}') format('woff2');font-weight:100 900}`}</style>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={1330}/>
 <canvas ref={canvas} style={{width:1920,height:1080}}/>
 <AbsoluteFill style={{background:paper,opacity:1-paperOut}}/>
 <svg width="1920" height="1080" style={{position:'absolute',inset:0}} viewBox="0 0 1920 1080">
 <defs><filter id="round2-soft-shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="3" dy="7" stdDeviation="8" floodColor="#183c47" floodOpacity=".12"/></filter></defs>
 <g opacity={1-paperOut}>
 {Array.from({length:10},(_,i)=>{const tx=370+(i%5)*295,ty=210+Math.floor(i/5)*230;return <Envelope sealed={production} key={i} x={1500+(tx-1500)*fan} y={430+(ty-430)*fan} scale={1-fan*.46} opacity={i===0?1:fan}/>})}
 <g opacity={ramp(f,28,43)*(1-select)}><circle cx="960" cy="135" r="87" fill={ink}/>{production&&<text x="960" y="101" textAnchor="middle" fontFamily="Google Sans,Arial" fontSize="22" letterSpacing="3" fill={paper}>TOP</text>}<text x="960" y={production?"175":"160"} textAnchor="middle" fontFamily={production?"Google Sans,Arial,sans-serif":"Arial,sans-serif"} fontSize="64" fontWeight="700" fill={paper}>10</text></g>
 <rect x="0" y="0" width="1920" height="1080" fill={paper} opacity={select}/>
 <g opacity={select} transform={`translate(960 410) scale(${.38+ramp(f,48,78,0,.24)}) translate(-750 -550)`}>
 <rect filter={production?"url(#round2-soft-shadow)":undefined} x="320" y="170" width="860" height="720" rx="8" fill="#fffdf5" stroke="#cad2c2" strokeWidth="3"/>
 {production?<ProductionLightSketch f={300}/>:<LightSketch f={125}/>}
 </g>
 {[0,1,2].map(i=><Resource key={i} index={i} f={f}/>)}
 {[0,1,2].map(i=><path key={i} d={`M${[450,960,1470][i]} 680Q960 650 960 510`} fill="none" stroke="#6fb9b0" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,104+i*9,150+i*5)} opacity={1-ramp(f,160,182)}/>)}
 {production&&[0,1,2].map(i=>{const p=ramp(f,116+i*9,155+i*5),q=1-p,x=q*q*[450,960,1470][i]+2*q*p*960+p*p*960,y=q*q*680+2*q*p*650+p*p*510;return <g key={i} opacity={ramp(f,116+i*9,122+i*9)*(1-ramp(f,158,178))}><circle cx={x} cy={y} r="12" fill="#83c9bd" opacity=".18"/><circle cx={x} cy={y} r="4" fill="#5bafa5"/></g>})}

 </g>

 </svg>
 </AbsoluteFill>
}
