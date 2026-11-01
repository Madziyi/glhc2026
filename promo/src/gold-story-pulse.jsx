import React from 'react';
import {goldStoryPoint,TV_ENTRY_FRAME} from './gold-story-path.mjs';
const gold='#ffd450';
export function GoldStoryPulse({scene,f}){
 if(scene==='science'&&f<165)return null;
 if(scene==='waterfront'&&f>141)return null;
 const point=goldStoryPoint(scene,f),time=(scene==='science'?f/30:10.6+f/30),hit=scene==='waterfront'?Math.max(0,Math.min(1,(f-TV_ENTRY_FRAME)/13)):0;
 const fade=scene==='waterfront'?1-Math.max(0,Math.min(1,(f-125)/4)):1;
 const ringScale=scene==='waterfront'?.5:1-.5*Math.max(0,Math.min(1,(f-280)/37));
 const trail=Array.from({length:60},(_,i)=>goldStoryPoint(scene,Math.max(scene==='science'?165:-153,f-i*.9)));
 return <svg width="1920" height="1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
 <defs><radialGradient id={`gold-aura-${scene}`}><stop stopColor={gold} stopOpacity=".45"/><stop offset=".3" stopColor={gold} stopOpacity=".12"/><stop offset="1" stopColor={gold} stopOpacity="0"/></radialGradient></defs>
 <g opacity={fade}>
 <polyline points={trail.map(p=>p.join(',')).join(' ')} stroke={gold} strokeWidth="1.5" opacity=".75" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
 <circle cx={point[0]} cy={point[1]} r="55" fill={`url(#gold-aura-${scene})`}/>
 <circle cx={point[0]} cy={point[1]} r={(scene==='science'?14:14)*(1+Math.sin(time*8)*.13)} fill={gold}/>
 {[0,1,2].map(i=>{const phase=((time*1.3+i/3)%1+1)%1;return <circle key={i} cx={point[0]} cy={point[1]} r={ringScale*(20+phase*50)} fill="none" stroke={gold} strokeWidth="1.5" opacity={(1-phase)*.6}/>})}
 </g>
 {hit>0&&<circle cx={point[0]} cy={point[1]} r={8+hit*65} stroke={gold} strokeWidth={2*(1-hit)} fill={gold} fillOpacity={.1*(1-hit)} opacity={1-hit}/>}
 </svg>;
}
