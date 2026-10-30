import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import {setupInstallations} from './section2';
import {LightSketch} from './section3';
import {ramp} from './opening';
const ink='#183c47',paper='#f1eee2',gold='#dfbd42';
function Envelope({x,y,scale=1,opacity=1}){return <g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-130 50L0-45L130 50V210H-130Z" fill="#d4cfb9"/><path d="M-130 50L0 140L130 50V210H-130Z" fill="#e7dfc7" stroke={ink} strokeWidth="2"/><path d="M-130 210L0 115L130 210" fill="none" stroke={ink} strokeWidth="2"/><circle cy="142" r="15" fill="#69bfb9"/></g>}
function Resource({index,f}){const a=ramp(f,64+index*19,78+index*19),converge=ramp(f,136,173),x=[450,960,1470][index];return <g opacity={a*(1-ramp(f,165,182))} transform={`translate(${x+(960-x)*converge} ${790-converge*220}) scale(${1-converge*.65})`}>
 <circle r="105" fill="#fffcf1" stroke="#9aaea7" strokeWidth="2"/>
 {index===0?<g fill={gold} stroke={ink} strokeWidth="3">{[0,1,2].map(i=><g key={i} transform={`translate(${i*22-25} ${-i*18+25})`}><path d="M-45-14V10C-45 32 45 32 45 10V-14Z"/><ellipse cy="-14" rx="45" ry="20"/></g>)}</g>:index===1?<g fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round"><path d="M-48 45L38-42M22-56L55-23M-56-36L42 55"/><path d="M-62-40Q-68-68-43-66L-35-48L-18-63Q4-40-21-25" fill={gold}/></g>:<g fill="none" stroke={ink} strokeWidth="4"><path d="M-62-55H48Q65-55 65-38V10Q65 28 45 28H-8L-38 58V28H-62Z"/><path d="M-31-13L-8 10L33-29" stroke="#67aaa5" strokeWidth="8"/></g>}
 </g>}
export function RoughRoundTwo(){
 const f=useCurrentFrame(),canvas=useRef(null),world=useRef(null);const [handle]=useState(()=>delayRender('Round2 building and showcase'));
 useLayoutEffect(()=>{world.current=setupInstallations(canvas.current,true,true,true);world.current.draw(Math.min(123,f*.28),f+45);continueRender(handle);return()=>world.current?.dispose()},[]);
 useLayoutEffect(()=>{world.current?.draw(Math.min(123,f*.28),f+45)},[f]);
 const fan=ramp(f,7,38),select=ramp(f,46,65),paperOut=ramp(f,154,191),cash=ramp(f,303,321)*(1-ramp(f,343,361));
 return <AbsoluteFill style={{background:paper,overflow:'hidden'}}>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={1330}/>
 <canvas ref={canvas} style={{width:1920,height:1080}}/>
 <AbsoluteFill style={{background:paper,opacity:1-paperOut}}/>
 <svg width="1920" height="1080" style={{position:'absolute',inset:0}} viewBox="0 0 1920 1080">
 <g opacity={1-paperOut}>
 {Array.from({length:10},(_,i)=>{const tx=370+(i%5)*295,ty=210+Math.floor(i/5)*230;return <Envelope key={i} x={1500+(tx-1500)*fan} y={430+(ty-430)*fan} scale={1-fan*.46} opacity={i===0?1:fan}/>})}
 <g opacity={ramp(f,28,43)*(1-select)}><circle cx="960" cy="135" r="87" fill={ink}/><text x="960" y="160" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="64" fontWeight="700" fill={paper}>10</text></g>
 <rect x="0" y="0" width="1920" height="1080" fill={paper} opacity={select}/>
 <g opacity={select} transform={`translate(960 410) scale(${.38+ramp(f,48,78,0,.24)}) translate(-750 -550)`}>
 <rect x="320" y="170" width="860" height="720" rx="8" fill="#fffdf5" stroke="#cad2c2" strokeWidth="3"/>
 <LightSketch f={125}/>
 </g>
 {[0,1,2].map(i=><Resource key={i} index={i} f={f}/>)}
 {[0,1,2].map(i=><path key={i} d={`M${[450,960,1470][i]} 680Q960 650 960 510`} fill="none" stroke="#6fb9b0" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,104+i*9,150+i*5)} opacity={1-ramp(f,160,182)}/>)}
 </g>
 <g opacity={cash} transform={`translate(280 ${790+(1-cash)*100}) rotate(-6)`}>
 <path d="M-80-30L-115 100L0 60L115 100L80-30Z" fill={ink}/><circle r="112" fill={gold}/><circle r="91" fill="none" stroke="#fff2b1" strokeWidth="4"/>
 <text y="-8" textAnchor="middle" fontFamily="Arial" fontSize="29" fontWeight="700" fill={ink}>CASH</text><text y="35" textAnchor="middle" fontFamily="Arial" fontSize="29" fontWeight="700" fill={ink}>PRIZES</text>
 </g>
 </svg>
 </AbsoluteFill>
}
