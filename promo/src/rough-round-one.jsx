import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {ramp} from './opening';
import {LightSketch,SoundSketch} from './section3';
const paper='#f1eee2',ink='#183c47',gold='#dfbd42';
function Draw({d,f,start=0,duration=30,color=ink,width=4,...rest}){return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,start,start+duration)} {...rest}/>}
function Pencil({x,y,angle=-35,opacity=1}){return <g opacity={opacity} transform={`translate(${x} ${y}) rotate(${angle})`}><path d="M0 0L18-25H145V-5H18Z" fill={gold}/><path d="M0 0L18-25L18-5Z" fill="#c5a77c"/><path d="M0 0L6-9L9-2Z" fill={ink}/><path d="M142-25H160V-5H142Z" fill="#ca8f81"/><path d="M20-20H140" stroke="#fff4c3" strokeWidth="3"/></g>}
export function RoughRoundOne(){
 const f=useCurrentFrame();
 const enter=ramp(f,0,22),submit=ramp(f,342,385),team=ramp(f,310,330);
 const pageX=ramp(f,0,28,0,-140)+submit*690,pageY=submit*-60,pageScale=1-submit*.67;
 const sketchTime=Math.min(180,Math.max(0,f-9));
 return <AbsoluteFill style={{background:paper,overflow:'hidden'}}>
 <Audio src={staticFile('audio/ashley-reference.mp3')} trimBefore={935}/>
 <svg width="1920" height="1080" viewBox="0 0 1920 1080">
 <defs><filter id="paper-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="8" dy="14" stdDeviation="15" floodColor="#243c45" floodOpacity=".13"/></filter><pattern id="round-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" stroke={ink} strokeWidth=".5" opacity=".07" fill="none"/></pattern></defs>
 <path d="M-100 630 Q650 620 900 540 Q1000 440 1100 540 Q1200 620 1290 530" fill="none" stroke="#123544" strokeWidth="3" opacity={1-ramp(f,8,30)}/>
 <g transform={`translate(${pageX} ${pageY}) translate(960 540) scale(${pageScale}) rotate(${-2+submit*12}) translate(-960 -540)`} opacity={enter*(1-ramp(f,378,394))}>
 <rect x="340" y="180" width="1180" height="740" rx="5" fill="#fffcf1" filter="url(#paper-shadow)"/>
 <rect x="340" y="180" width="1180" height="740" fill="url(#round-grid)"/>
 <text x="400" y="255" fontFamily="Arial,sans-serif" fontSize="23" letterSpacing="5" fill={ink} opacity=".65">ROUND 1</text>
 <Draw f={f} start={12} duration={32} d="M410 292Q750 275 1070 292" color={gold} width={5}/>
 <g transform="translate(80 170) scale(.58)"><LightSketch f={sketchTime}/></g>
 <g transform="translate(100 160) scale(.58)"><SoundSketch f={sketchTime}/></g>
 <g transform="translate(1120 440)">
 <Draw f={f} start={115} duration={28} d="M0 0L310 20L305 220L-5 200Z"/>
 <Draw f={f} start={132} d="M145 210V310H95V320H205V310H155V212"/>
 {[0,1,2,3].map(i=><Draw key={i} f={f} start={137+i*6} duration={22} d={`M20 ${45+i*36}Q110 ${15+i*37} 180 ${65+i*29}T280 ${58+i*35}`} color={i%2?gold:ink} width={3}/>)}
 </g>
 <g opacity={ramp(f,164,183)}>
 <Draw f={f} start={164} d="M420 790L1310 790M460 810L1160 810" width={2} opacity=".25"/>
 <Draw f={f} start={186} d="M440 730L440 370M430 385L450 385M430 715L450 715" width={2} opacity=".4"/>
 </g>
 <g transform={`translate(980 320) rotate(${-10+ramp(f,196,210,0,4)}) scale(${ramp(f,196,208,1.6,1)})`} opacity={ramp(f,196,205)}>
 <rect x="-155" y="-38" width="310" height="72" rx="7" fill="none" stroke={ink} strokeWidth="4"/>
 <text x="0" y="10" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="30" fontWeight="700" fill={ink}>JUST AN IDEA</text>
 </g>
 </g>
 {/* A desk calendar carries the deadline, rather than another title card. */}
 <g transform={`translate(${1530+submit*500} ${240+ramp(f,44,64,50,0)}) rotate(5)`} opacity={ramp(f,44,62)}>
 <rect x="0" y="0" width="230" height="255" rx="12" fill="#fffdf6" filter="url(#paper-shadow)"/>
 <path d="M0 60V12Q0 0 12 0H218Q230 0 230 12V60Z" fill={ink}/>
 <text x="115" y="43" textAnchor="middle" fontFamily="Arial" fontSize="28" fill={paper}>DECEMBER</text>
 <text x="115" y="183" textAnchor="middle" fontFamily="Arial" fontSize="120" fontWeight="700" fill={ink}>3</text>
 <Draw f={f} start={70} duration={20} d="M45 202Q115 226 195 196" color={gold} width={7}/>
 </g>
 {/* One pencil becomes a small group: solo or team, still one shared idea. */}
 <Pencil x={ramp(f,15,160,530,1420)} y={610+Math.sin(f*.08)*30} opacity={ramp(f,12,25)*(1-ramp(f,167,185))}/>
 <Pencil x={ramp(f,273,330,600,740)} y={870-ramp(f,325,350,0,130)} angle={-35} opacity={ramp(f,271,281)*(1-submit)}/>
 <Pencil x={ramp(f,310,340,1180,1040)} y={ramp(f,310,340,1000,890)} angle={-145} opacity={team*(1-submit)}/>
 <Pencil x={ramp(f,317,346,1500,1250)} y={ramp(f,317,346,1050,850)} angle={-130} opacity={team*(1-submit)}/>
 <Draw f={f} start={327} duration={40} d="M750 740Q960 660 1190 750Q1390 810 1530 540" color={gold} width={4} opacity={1-ramp(f,365,393)}/>
 <g opacity={ramp(f,348,379)} transform={`translate(${1500+ramp(f,348,389,70,0)} 430)`}>
 <path d="M-130 50L0-45L130 50V210H-130Z" fill="#d4cfb9"/>
 <path d="M-130 50L0 140L130 50V210H-130Z" fill="#e7dfc7" stroke={ink} strokeWidth="2"/>
 <path d="M-130 210L0 115L130 210" fill="none" stroke={ink} strokeWidth="2"/>
 <circle cx="0" cy="142" r={ramp(f,375,394,0,15)} fill="#69bfb9"/>
 </g>
 </svg>
 </AbsoluteFill>
}
