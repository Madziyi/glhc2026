import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {ramp} from './opening';
import {LightSketch} from './section3';
const paper='#f1eee2',ink='#183c47',gold='#dfbd42';
function Draw({d,f,start=0,duration=30,color=ink,width=4,...rest}){return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,start,start+duration)} {...rest}/>}
export function RoughRoundOne(){
 const f=useCurrentFrame();
 const enter=ramp(f,0,22),submit=ramp(f,342,385);
 const pageX=submit*540,pageY=submit*-60,pageScale=1-submit*.67;
 const sketchTime=20+Math.max(0,f-12)*.25;
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
 <g transform="translate(0 -55) scale(1.2)"><LightSketch f={sketchTime}/></g>
 <g opacity={ramp(f,164,183)}>
 <Draw f={f} start={164} d="M560 870L1290 870M590 890L1140 890" width={2} opacity=".25"/>
 <Draw f={f} start={186} d="M540 825L540 410M530 425L550 425M530 810L550 810" width={2} opacity=".4"/>
 </g>
 <g transform={`translate(980 320) rotate(${-10+ramp(f,196,210,0,4)}) scale(${ramp(f,196,208,1.6,1)})`} opacity={ramp(f,196,205)}>
 <rect x="-240" y="-38" width="480" height="72" rx="7" fill="none" stroke={ink} strokeWidth="4"/>
 <text x="0" y="10" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="30" fontWeight="700" fill={ink}>Just submit your idea</text>
 </g>
 </g>
 {/* A desk calendar carries the deadline, rather than another title card. */}
 <g transform={`translate(${1530+submit*500} ${240+ramp(f,44,64,50,0)}) rotate(5)`} opacity={ramp(f,44,62)}>
 <text x="115" y="-75" textAnchor="middle" fontFamily="Arial" fontSize="30" fill={ink}>Idea Submissions</text>
 <text x="115" y="-37" textAnchor="middle" fontFamily="Arial" fontSize="30" fill={ink}>Deadline</text>
 <rect x="0" y="0" width="230" height="255" rx="12" fill="#fffdf6" filter="url(#paper-shadow)"/>
 <path d="M0 60V12Q0 0 12 0H218Q230 0 230 12V60Z" fill={ink}/>
 <text x="115" y="43" textAnchor="middle" fontFamily="Arial" fontSize="28" fill={paper}>DECEMBER</text>
 <text x="115" y="183" textAnchor="middle" fontFamily="Arial" fontSize="120" fontWeight="700" fill={ink}>3</text>
 <Draw f={f} start={70} duration={20} d="M45 202Q115 226 195 196" color={gold} width={7}/>
 </g>
 <g opacity={ramp(f,26,47)*(1-ramp(f,342,367))} transform="translate(65 460)">
 <text y="0" fontFamily="Arial,sans-serif" fontSize="27" fill={ink}>Idea Submissions</text>
 <text y="42" fontFamily="Arial,sans-serif" fontSize="27" fill={ink}>Open</text>
 <text y="111" fontFamily="Arial,sans-serif" fontSize="46" fontWeight="700" fill={ink}>Nov 5th</text>
 <Draw f={f} start={45} duration={30} d="M0 135Q105 149 222 130" color={gold} width={5}/>
 </g>
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
