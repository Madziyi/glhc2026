import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,interpolate,Easing} from 'remotion';
import {ramp} from './opening';

const paper='#f1eee2',ink='#183c47',yellow='#dfbd42';
const smooth=Easing.bezier(.45,0,.2,1);
const travel=(f,values)=>interpolate(f,[0,22,65,110,155,200,235,288,299],values,{easing:smooth,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
function Stroke({d,f,at=0,duration=25,color=ink,width=4,opacity=1,...rest}){const p=ramp(f,at,at+duration);return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p} opacity={opacity} {...rest}/>}
function LightSketch({f}){return <g>
 <Stroke f={f} at={22} duration={20} d="M500 710Q750 610 1000 710Q780 835 500 710Z"/>
 <Stroke f={f} at={27} d="M500 710L502 735Q780 860 1000 732L1000 710" opacity={.35}/>
 {Array.from({length:11},(_,i)=>{const x=550+i*39,y=700+Math.sin(i*.58)*25,h=110+(Math.sin(i*.7)+1)*115;return <g key={i}><Stroke f={f} at={31+i*3} duration={17} d={`M${x} ${y}L${x-2} ${y-h}L${x+8} ${y-h-3}L${x+9} ${y}Z`} width={3}/><Stroke f={f} at={56+i*2} duration={25} d={`M${x+3} ${y-5}L${x+2} ${y-h+5}`} color={yellow} width={5}/></g>})}
 <Stroke f={f} at={58} d="M530 755Q720 815 977 750" opacity={.25} width={2}/>
 </g>}
function SoundSketch({f}){return <g>
 <Stroke f={f} at={76} duration={20} d="M1120 600C1120 500 1530 500 1530 600C1530 700 1120 700 1120 600Z"/>
 <Stroke f={f} at={81} duration={20} d="M1120 600L1160 748Q1320 815 1490 748L1530 600"/>
 <Stroke f={f} at={85} d="M1160 748L1175 775Q1320 835 1475 775L1490 748" opacity={.5}/>
 {[0,1,2,3].map(i=><g key={i} transform={`translate(1325 600) scale(${1+Math.sin(f*.08+i)*.025})`}><Stroke f={f} at={90+i*5} duration={18} d={`M${-160+i*35} 0A${160-i*35} ${55-i*10} 0 1 0 ${160-i*35} 0A${160-i*35} ${55-i*10} 0 1 0 ${-160+i*35} 0`} color={i%2?ink:yellow} width={3}/></g>)}
 <Stroke f={f} at={110} d="M1310 515Q1285 490 1315 465Q1340 440 1315 415M1360 510Q1335 485 1365 460Q1390 435 1365 410" opacity={.35} width={2}/>
 </g>}
function ScreenSketch({f}){return <g>
 <Stroke f={f} at={125} duration={25} d="M1680 400L2150 450L2140 755L1670 705Z"/>
 <Stroke f={f} at={132} d="M1695 420L2130 467L2122 733L1688 688Z" width={2}/>
 <Stroke f={f} at={142} d="M1775 718L1773 790L1735 802L1815 810M2025 745L2022 817L1988 828L2067 837"/>
 {[0,1,2,3,4].map(i=><Stroke key={i} f={f} at={144+i*3} d={`M1710 ${480+i*42}Q1830 ${440+i*42+Math.sin(f*.06+i)*20} 1920 ${520+i*32}T2110 ${510+i*42}`} color={i%2?yellow:ink} width={3} opacity={.75}/>)}
 </g>}
export function Section3Sketch(){
 const f=useCurrentFrame();
 const cx=travel(f,[960,960,760,1325,1900,1340,1340,1320,1320]);
 const cy=travel(f,[540,540,570,580,580,1100,1100,730,730]);
 const scale=travel(f,[1,1,1.25,1.25,1.1,1.55,1.55,.8,.8]);
 const angle=travel(f,[0,0,-2,1,-1,-3,-3,0,0]);
 const photo=ramp(f,164,186);const returnToIdea=ramp(f,240,284);
 return <AbsoluteFill style={{background:paper,overflow:'hidden'}}>
 <svg width="1920" height="1080" viewBox="0 0 1920 1080">
 <defs><pattern id="paper-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#164454" strokeWidth=".5" opacity=".06"/></pattern><filter id="photo-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="6" dy="10" stdDeviation="10" floodColor="#223a40" floodOpacity=".16"/></filter><clipPath id="idea-reveal"><rect x="1015" y="240" width={ramp(f,250,286,0,580)} height="130"/></clipPath></defs>
 <g transform={`translate(960 540) scale(${scale}) rotate(${angle}) translate(${-cx} ${-cy})`}>
 <rect x="-2000" y="-1500" width="7000" height="5000" fill="url(#paper-grid)" opacity={ramp(f,18,60)}/>
 {/* Exact handoff line from Section2's warm-paper ending. */}
 <path d="M-100 630Q650 620 900 540Q1000 440 1100 540Q1200 620 1290 530" fill="none" stroke="#123544" strokeWidth="3" opacity={1-ramp(f,24,56,0,.85)}/>
 <Stroke f={f} at={14} duration={48} d="M1290 530Q1235 300 1020 350Q800 375 750 550Q710 665 500 710" color={yellow} width={3}/>
 <LightSketch f={f}/><SoundSketch f={f}/><ScreenSketch f={f}/>
 <Stroke f={f} at={67} duration={24} d="M1000 710Q1050 630 1120 600" color={yellow} width={3}/>
 <Stroke f={f} at={117} duration={24} d="M1530 600Q1610 515 1680 530" color={yellow} width={3}/>
 <Stroke f={f} at={160} duration={30} d="M1930 805Q1915 1010 1700 1100Q1600 1140 1550 1100" color={yellow} width={3}/>
 <g opacity={photo*(1-returnToIdea*.18)} transform={`translate(1020 ${890+ramp(f,164,190,65,0)}) rotate(-3 320 240)`}>
 <rect x="-14" y="-14" width="666" height="508" fill="#fffdf7" filter="url(#photo-shadow)"/>
 <image href={staticFile('section3-team.webp')} x="0" y="0" width="638" height="480" preserveAspectRatio="xMidYMid meet"/>
 <path d="M245-32L400-27L400 16L248 12Z" fill="#e7d495" opacity=".7"/>
 </g>
 <g clipPath="url(#idea-reveal)"><text x="1040" y="335" fontFamily="'Segoe Print', 'Comic Sans MS', cursive" fontSize="80" fontStyle="italic" fill={ink}>YOUR IDEA</text></g>
 <Stroke f={f} at={270} duration={20} d="M1050 365Q1320 390 1560 350" color={yellow} width={7}/>
 {/* Unfinished construction marks leave room for the next section's proposal. */}
 <Stroke f={f} at={250} duration={30} d="M440 375L440 835M420 820L1025 820M1640 370L2170 420M2168 420L2160 850" width={2} opacity={.18}/>
 </g>
 </svg>
 </AbsoluteFill>
}
