import React from 'react';
import {ramp} from './opening';

const ink='#28464b';
function Line({d,f,start,duration=35,width=1.8,color=ink,opacity=1}){
 const p=ramp(f,start,start+duration);
 return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p} opacity={opacity}/>;
}
// Fixed installation geometry; only ink and subtle colour are revealed over time.
export function ProductionLightSketch({f}){
 const tubes=Array.from({length:19},(_,i)=>{const a=i/19*Math.PI*2;return {i,x:750+Math.cos(a)*210,y:702+Math.sin(a)*62,h:110+(Math.sin(i*.68)+1)*104};}).sort((a,b)=>a.y-b.y);
 return <g>
  <g opacity={ramp(f,15,48)*.16} stroke={ink} strokeWidth=".8" fill="none">
   <ellipse cx="750" cy="710" rx="263" ry="91" strokeDasharray="8 8"/>
   <path d="M455 710H1045M750 602V823" strokeDasharray="10 7"/>
  </g>
  <Line f={f} start={18} duration={48} d="M500 710C500 600 1000 600 1000 710C1000 820 500 820 500 710Z" width={2.3}/>
  <Line f={f} start={30} duration={44} d="M500 710V731C570 835 930 835 1000 731V710" width={1.8}/>
  {Array.from({length:25},(_,i)=>{const x=520+i*18;return <Line key={i} f={f} start={60+i*1.5} duration={28} d={`M${x} ${744+Math.sin(i/24*Math.PI)*49}l10 -8`} width={.9} opacity={.22}/>})}
  {tubes.map(({i,x,y,h},j)=>{
   const start=42+j*7.2;
   return <g key={i}>
    <Line f={f} start={start} duration={42} d={`M${x-5} ${y-4}L${x-4} ${y-h}Q${x} ${y-h-4} ${x+4} ${y-h}L${x+5} ${y-4}`} width={1.8}/>
    <Line f={f} start={start+20} duration={28} d={`M${x-4} ${y-h+5}Q${x} ${y-h+8} ${x+4} ${y-h+5}`} width={1} opacity={.55}/>
    <Line f={f} start={start+25} duration={27} d={`M${x-7} ${y-8}L${x-11} ${y+8}Q${x} ${y+13} ${x+11} ${y+8}L${x+7} ${y-8}Z`} width={1.5}/>
    <Line f={f} start={start+47} duration={56} d={`M${x} ${y-13}L${x} ${y-h+11}`} width={3.2} color={i%3===0?'#b9a345':'#7d9f69'} opacity={.68}/>
    <Line f={f} start={start+32} duration={42} d={`M${x+7} ${y-14}L${x+6} ${y-h+4}`} width={.7} opacity={.19}/>
   </g>;
  })}
  <Line f={f} start={203} duration={48} d="M505 742Q744 849 1005 740" width={.8} opacity={.26}/>
  <g opacity={ramp(f,220,264)*.3} stroke={ink} strokeWidth=".8" fill="none">
   <path d="M480 812H1020M492 802V822M1008 802V822M1050 410V754M1041 418H1059M1041 744H1059"/>
   <path d="M498 808L492 812L498 816M1002 808L1008 812L1002 816M1046 424L1050 418L1054 424M1046 738L1050 744L1054 738"/>
  </g>
 </g>;
}
