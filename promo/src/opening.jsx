import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile} from 'remotion';
import lakes from './lakes.json';

const C={navy:'#052638',yellow:'#ffd450',aqua:'#89d3d0',white:'#f6f6ed'};
const ease=Easing.bezier(.16,1,.3,1);
const ramp=(f,a,b,x=0,y=1)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
const visible=(f,a,b)=>f>=a&&f<b;
function Word({children,at=0,f,size=145,color=C.white,style={}}){return <div style={{fontSize:size,fontWeight:700,lineHeight:.94,letterSpacing:'-.065em',color,overflow:'hidden',...style}}><div style={{transform:`translateY(${ramp(f,at,at+19,115,0)}%)`}}>{children}</div></div>}
function Micro({children,style={}}){return <div style={{fontSize:20,fontWeight:500,letterSpacing:4,textTransform:'uppercase',...style}}>{children}</div>}
function Lakes({f,style={}}){return <svg viewBox="0 0 1300 850" style={style} aria-label="Great Lakes geographic silhouette">{lakes.map((l,i)=><path key={l.name} d={l.d} fill={C.aqua} fillRule="evenodd" opacity={ramp(f,22+i*4,55+i*4,.08,1)} stroke={C.navy} strokeWidth="3"/>)}</svg>}
function Opening(){
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:C.navy,color:C.white,fontFamily:'Google Sans, sans-serif',overflow:'hidden'}}>
 <style>{`@font-face{font-family:'Google Sans';src:url('${staticFile('google-sans-latin.woff2')}') format('woff2');font-weight:100 900}*{box-sizing:border-box}`}</style>
 {/* A single pulse opens into geographically sourced lake silhouettes. */}
 {visible(f,0,125)&&<AbsoluteFill>
   <svg width="1920" height="1080" style={{position:'absolute',opacity:ramp(f,0,15)}}>
    {[0,1,2,3].map(i=>{const r=25+((f*6+i*110)%610);return <circle key={i} cx="1370" cy="540" r={r} fill="none" stroke={C.aqua} strokeWidth="2" opacity={(1-r/650)*.25}/>})}
    <circle cx="1370" cy="540" r={8+Math.sin(f/5)*2} fill={C.yellow}/>
   </svg>
   <Lakes f={f} style={{position:'absolute',width:1000,right:55,top:225,transform:`scale(${ramp(f,15,115,.88,1)})`,opacity:ramp(f,15,38)}}/>
   <div style={{position:'absolute',left:110,top:110,opacity:ramp(f,5,20)}}><Micro style={{color:C.aqua}}>Great Lakes Hackathon Challenge</Micro></div>
   <div style={{position:'absolute',left:105,top:315}}><Word f={f} at={8}>WHAT IF</Word><Word f={f} at={17}>YOU COULD</Word><Word f={f} at={26} color={C.yellow}>HEAR THE</Word><Word f={f} at={35} color={C.yellow}>LAKES?</Word></div>
   <div style={{position:'absolute',left:110,bottom:85,opacity:ramp(f,50,70)}}><Micro style={{fontSize:17}}>A creative challenge for students</Micro></div>
 </AbsoluteFill>}
 {/* Solid yellow wipe replaces the question with the creative proposition. */}
 {visible(f,112,138)&&<AbsoluteFill style={{background:C.yellow,transform:`translateX(${ramp(f,112,125,100,0)-ramp(f,125,138,0,100)}%)`}}/>}
 {visible(f,125,236)&&<AbsoluteFill>
   <Micro style={{position:'absolute',top:90,left:110,color:C.aqua}}>Science becomes something you can experience</Micro>
   <div style={{position:'absolute',left:105,top:240}}><Word f={f} at={128} size={180}>TURN DATA</Word><Word f={f} at={138} size={180} color={C.yellow}>INTO FEELING.</Word></div>
   <svg width="1920" height="1080" style={{position:'absolute',top:0,left:0}}>
    <line x1="110" y1="790" x2="1810" y2="790" stroke={C.aqua} opacity=".18"/>
    {Array.from({length:65},(_,i)=>{const x=120+i*26;const a=ramp(f,148,179);const wave=Math.sin(i*.41-f*.16)*Math.sin(i*.13+f*.04);const h=12+Math.abs(wave)*180*a;return <rect key={i} x={x} y={790-h/2} width="10" height={h} rx="5" fill={i%7===0?C.yellow:C.aqua} opacity={ramp(f,145+i*.35,165+i*.35,.1,1)}/>})}
   </svg>
   <Micro style={{position:'absolute',left:110,bottom:80}}>Water-quality data. Human imagination.</Micro>
 </AbsoluteFill>}
 {visible(f,225,250)&&<AbsoluteFill style={{background:C.aqua,transform:`translateY(${ramp(f,225,237,100,0)-ramp(f,237,250,0,100)}%)`}}/>}
 {visible(f,237,347)&&<AbsoluteFill style={{background:C.aqua,color:C.navy}}>
   <Micro style={{position:'absolute',left:110,top:85}}>What could you create?</Micro>
   <div style={{position:'absolute',left:105,top:230}}><Word f={f} at={240} color={C.navy} size={170}>LIGHT.</Word><Word f={f} at={250} color={C.navy} size={170}>SOUND.</Word><Word f={f} at={260} color={C.navy} size={170}>MOVEMENT.</Word></div>
   <svg width="1000" height="900" viewBox="0 0 1000 900" style={{position:'absolute',right:-30,top:90}}>
    <ellipse cx="500" cy="735" rx="300" ry="40" fill={C.navy} opacity=".12"/>
    {Array.from({length:9},(_,i)=>{const x=210+i*70;const h=180+Math.sin(i*.7+f*.055)*100;return <g key={i} transform={`translate(${x} ${690-h})`} opacity={ramp(f,248+i*3,270+i*3)}><path d={`M-15 0 L15 -15 L15 ${h} L-15 ${h+15}Z`} fill={C.navy}/><path d={`M-15 0 L15 -15 L15 ${h*.7} L-15 ${h*.7+15}Z`} fill={C.yellow}/><path d={`M-15 0 L15 -15 L0 -22 L-30 -7Z`} fill={C.white}/></g>})}
    {[0,1,2].map(i=><ellipse key={i} cx="480" cy="390" rx={130+i*95+Math.sin(f*.05)*15} ry={50+i*38} stroke={C.navy} strokeWidth="2" fill="none" opacity={.18-i*.04} transform={`rotate(-20 480 390)`}/>)}
   </svg>
   <Micro style={{position:'absolute',left:110,bottom:85,fontSize:17}}>Concept illustration · your idea can take any form</Micro>
 </AbsoluteFill>}
 {visible(f,335,361)&&<AbsoluteFill style={{background:C.yellow,transform:`translateX(${ramp(f,335,348,-100,0)+ramp(f,348,361,0,100)}%)`}}/>}
 {visible(f,348,450)&&<AbsoluteFill>
   <Lakes f={f} style={{position:'absolute',width:1150,right:-80,top:120,opacity:.08,transform:'rotate(-8deg)'}}/>
   <Micro style={{position:'absolute',left:110,top:90,color:C.aqua}}>Start with an idea.</Micro>
   <div style={{position:'absolute',left:105,top:265}}><Word f={f} at={350} size={162}>GREAT LAKES</Word><Word f={f} at={359} size={162}>HACKATHON</Word><Word f={f} at={368} size={162} color={C.yellow} style={{fontStyle:'italic'}}>CHALLENGE</Word></div>
   <div style={{position:'absolute',left:110,bottom:90,right:110,display:'flex',justifyContent:'space-between',alignItems:'center',opacity:ramp(f,389,407)}}><Micro style={{color:C.yellow,fontSize:25,letterSpacing:2}}>No experience needed.</Micro><Micro style={{fontSize:17}}>An invitation to create.</Micro></div>
 </AbsoluteFill>}
 </AbsoluteFill>;
}

export {Opening, C, ramp, Word, Micro, Lakes};
