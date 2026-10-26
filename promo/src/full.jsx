import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, staticFile} from 'remotion';
import {Opening,C,ramp,Word,Micro,Lakes} from './opening';

export const scenes=[
 {id:'invitation',from:450,to:690,label:'Your invitation'},
 {id:'idea',from:690,to:930,label:'Round 1 / Submit your idea'},
 {id:'selection',from:930,to:1140,label:'10 ideas advance'},
 {id:'support',from:1140,to:1410,label:'Round 2 / Supported building'},
 {id:'build',from:1410,to:1650,label:'Build and showcase'},
 {id:'prizes',from:1650,to:1830,label:'Cash prizes'},
 {id:'display',from:1830,to:2040,label:'Winners on public display'},
 {id:'cta',from:2040,to:2250,label:'Submit your idea'},
];
const caption={position:'absolute',left:110,bottom:85,fontSize:30,letterSpacing:0,textTransform:'none',lineHeight:1.4};
function People({f,solo=false}){return <g>{(solo?[0]:[-1,0,1]).map((i)=><g key={i} transform={`translate(${i*170} ${ramp(f,12+i*3,40+i*3,80,0)})`} opacity={ramp(f,10+i*3,32+i*3)}><circle cx="0" cy="-140" r="46" fill={i===0?C.yellow:C.aqua}/><path d="M-85 80V-30Q-85-86 0-86Q85-86 85-30V80Z" fill={i===0?C.yellow:C.aqua}/><path d="M-45 95V230M45 95V230" stroke={C.aqua} strokeWidth="34"/></g>)}</g>}
function Pencil({f}){return <g transform={`translate(${Math.sin(f*.06)*12} ${Math.sin(f*.045)*8}) rotate(-28 500 400)`}><path d="M390 165H510V595L450 695L390 595Z" fill={C.yellow}/><path d="M390 595L450 695L510 595Z" fill={C.white}/><path d="M433 665L450 695L467 665Z" fill={C.navy}/><path d="M420 190V580M480 190V580" stroke={C.navy} strokeWidth="6" opacity=".45"/><path d="M390 165V120Q450 65 510 120V165Z" fill={C.aqua}/></g>}
function Installation({f,publicScene=false}){return <g>
 <ellipse cx="600" cy="710" rx="440" ry="65" fill={C.aqua} opacity=".08"/>
 <path d="M135 710L610 555L1050 710L575 875Z" fill={C.aqua} opacity=".12"/>
 {Array.from({length:10},(_,i)=>{const h=150+Math.sin(i*.65+f*.045)*75;return <g key={i} transform={`translate(${280+i*62} ${660-h})`} opacity={ramp(f,i*3,22+i*3)}><path d={`M-13 0L13-12V${h}L-13 ${h+12}Z`} fill={C.aqua}/><path d={`M-13 0L13-12V${h*.75}L-13 ${h*.75+12}Z`} fill={C.yellow}/><path d="M-13 0L13-12L0-19L-26-7Z" fill={C.white}/></g>})}
 {publicScene&&[[-20,680,.45],[930,780,.55],[220,860,.4]].map(([x,y,s],i)=><g key={i} transform={`translate(${x} ${y}) scale(${s})`}><People f={f} solo/></g>)}
 </g>}
function Trophy({f}){return <g transform={`translate(500 400) scale(${ramp(f,5,40,.6,1)})`}>
 <path d="M-155-180H155L130 30Q110 160 0 165Q-110 160-130 30Z" fill={C.navy}/>
 <path d="M-155-140H-230V-65Q-230 75-120 75M155-140H230V-65Q230 75 120 75" stroke={C.aqua} fill="none" strokeWidth="28"/>
 <path d="M-25 150V255H25V150M-110 260H110V295H-110Z" fill={C.navy}/>
 <path d="M0-95L20-40L78-40L33-4L50 53L0 18L-50 53L-33-4L-78-40L-20-40Z" fill={C.yellow}/>
 </g>}
function Scene({id}){
 const f=useCurrentFrame();const light=id==='selection'||id==='prizes';const bg=light?C.yellow:C.navy;const ink=light?C.navy:C.white;
 return <AbsoluteFill style={{background:bg,color:ink,overflow:'hidden'}}>
 <Micro style={{position:'absolute',left:110,top:90,color:light?C.navy:C.aqua}}>Great Lakes Hackathon Challenge</Micro>
 {id==='invitation'&&<>
 <div style={{position:'absolute',left:105,top:240}}><Word f={f} at={3} size={150}>YOUR IDEAS.</Word><Word f={f} at={13} size={150} color={C.yellow}>YOUR LAKES.</Word></div>
 <svg viewBox="0 0 1000 900" style={{position:'absolute',width:850,right:-15,top:210}}><g transform="translate(500 380)"><People f={f}/></g></svg>
 <div style={{position:'absolute',left:110,top:615,opacity:ramp(f,35,55)}}><Micro style={{fontSize:30,letterSpacing:0,textTransform:'none'}}>High school & university students</Micro><p style={{fontSize:37,color:C.aqua,marginTop:24}}>Enter solo or as a team.</p></div>
 <Micro style={{...caption,color:C.yellow,opacity:ramp(f,65,85)}}>Art, science, technology — or simply curious.</Micro>
 </>}
 {id==='idea'&&<>
 <div style={{position:'absolute',left:100,top:170,color:C.aqua,fontSize:140,fontWeight:700,letterSpacing:'-.08em',opacity:ramp(f,0,25)}}>01</div>
 <div style={{position:'absolute',left:105,top:375}}><Word f={f} at={8} size={150}>SUBMIT</Word><Word f={f} at={18} size={150} color={C.yellow}>YOUR IDEA.</Word></div>
 <svg viewBox="0 0 900 900" style={{position:'absolute',width:820,right:20,top:130}}>
 <g transform={`translate(50 ${ramp(f,0,30,100,0)})`}><path d="M190 145H620L710 235V760H190Z" fill="none" stroke={C.aqua} strokeWidth="5"/><path d="M620 145V235H710" fill="none" stroke={C.aqua} strokeWidth="5"/>{[370,420,470,520].map((y,i)=><path key={i} d={`M245 ${y}H${520-i*25}`} stroke={C.aqua} strokeWidth="5" opacity={ramp(f,35+i*6,55+i*6)*.5}/>)}</g><Pencil f={f}/></svg>
 <Micro style={{...caption,opacity:ramp(f,45,70)}}>A sketch. A concept. No working prototype required.</Micro>
 </>}
 {id==='selection'&&<>
 <div style={{position:'absolute',left:100,top:175,display:'flex',alignItems:'baseline',gap:55}}><Word f={f} at={0} size={430} color={C.navy}>10</Word><div><Word f={f} at={12} size={125} color={C.navy}>IDEAS</Word><Word f={f} at={20} size={125} color={C.navy}>ADVANCE.</Word></div></div>
 <svg width="1920" height="1080">{Array.from({length:10},(_,i)=><g key={i} transform={`translate(${155+i*166} ${815-ramp(f,32+i*3,65+i*3,0,70)})`} opacity={ramp(f,20+i*3,45+i*3)}><path d="M0 0H112V110H0Z" fill="none" stroke={C.navy} strokeWidth="3"/><path d="M28 55L48 75L87 32" fill="none" stroke={C.navy} strokeWidth="9"/></g>)}</svg>
 <Micro style={{...caption,color:C.navy}}>Selected concepts move into the supported building stage.</Micro>
 </>}
 {id==='support'&&<>
 <div style={{position:'absolute',left:105,top:175,color:C.aqua,fontSize:130,fontWeight:700}}>02</div>
 <div style={{position:'absolute',left:105,top:355}}><Word f={f} at={8} size={140}>BRING IT</Word><Word f={f} at={18} size={140} color={C.yellow}>TO LIFE.</Word></div>
 <div style={{position:'absolute',left:1110,top:300,width:650}}>{['PROJECT BUDGET','EQUIPMENT','TECHNICAL SUPPORT','MENTOR GUIDANCE'].map((text,i)=><div key={text} style={{display:'flex',gap:28,alignItems:'center',marginBottom:55,opacity:ramp(f,25+i*18,45+i*18),transform:`translateX(${ramp(f,25+i*18,50+i*18,90,0)}px)`}}><span style={{color:C.yellow,fontSize:40}}>↗</span><span style={{fontSize:37,fontWeight:700,letterSpacing:'-.02em'}}>{text}</span></div>)}</div>
 <Micro style={{...caption,opacity:ramp(f,100,125)}}>You bring the imagination. We help you build.</Micro>
 </>}
 {id==='build'&&<>
 <div style={{position:'absolute',left:105,top:240}}><Word f={f} at={3} size={145}>BUILD.</Word><Word f={f} at={14} size={145}>TEST.</Word><Word f={f} at={25} size={145} color={C.yellow}>SHOWCASE.</Word></div>
 <svg viewBox="0 0 1200 1000" style={{position:'absolute',width:1050,right:-15,top:70}}><Installation f={f}/></svg>
 <Micro style={{...caption,opacity:ramp(f,50,75)}}>Help people understand Great Lakes water quality.</Micro>
 </>}
 {id==='prizes'&&<>
 <div style={{position:'absolute',left:105,top:300}}><Word f={f} at={3} size={175} color={C.navy}>COMPETE FOR</Word><Word f={f} at={14} size={175} color={C.navy}>CASH PRIZES.</Word></div>
 <svg viewBox="0 0 1000 900" style={{position:'absolute',width:650,right:45,top:210,opacity:.9}}><Trophy f={f}/></svg>
 <Micro style={{...caption,color:C.navy}}>Outstanding projects earn recognition.</Micro>
 </>}
 {id==='display'&&<>
 <div style={{position:'absolute',left:105,top:200}}><Word f={f} at={0} size={120}>TOP WINNERS.</Word><Word f={f} at={10} size={120} color={C.yellow}>REAL PUBLIC</Word><Word f={f} at={20} size={120} color={C.yellow}>DISPLAYS.</Word></div>
 <svg viewBox="0 0 1200 1100" style={{position:'absolute',width:960,right:-20,top:70}}><Installation f={f} publicScene/></svg>
 <div style={{...caption,fontSize:35,maxWidth:1600,opacity:ramp(f,35,60)}}>Top winners will have their designs displayed<br/>at tourist attractions.</div>
 </>}
 {id==='cta'&&<>
 <Lakes f={f+80} style={{position:'absolute',width:1000,right:20,top:160,opacity:.07}}/>
 <div style={{position:'absolute',left:105,top:195}}><Word f={f} at={2} size={138}>START WITH</Word><Word f={f} at={12} size={138} color={C.yellow}>AN IDEA.</Word></div>
 <div style={{position:'absolute',left:110,top:535,opacity:ramp(f,25,45)}}><div style={{fontSize:42}}>Submissions: November 5–December 3, 2026</div><div style={{fontSize:30,color:C.aqua,marginTop:17}}>Deadline: December 3 · 11:59 PM Eastern Time</div></div>
 <div style={{position:'absolute',left:110,top:740,fontSize:67,fontWeight:700,letterSpacing:'-.035em',color:C.yellow,opacity:ramp(f,40,58)}}>raeonhacks.com/project ↗</div>
 <Micro style={{...caption,fontSize:23,opacity:ramp(f,55,75)}}>Organized by RAEON</Micro>
 </>}
 {/* The wipe reveals the scene instead of replacing it with a blank gap. */}
 {f<15&&<AbsoluteFill style={{background:light?C.aqua:C.yellow,transform:`translateX(${ramp(f,0,15,0,100)}%)`}}/>}
 </AbsoluteFill>
}
export function FullPromo(){return <AbsoluteFill style={{background:C.navy,color:C.white,fontFamily:'Google Sans, sans-serif',overflow:'hidden'}}>
 <style>{`@font-face{font-family:'Google Sans';src:url('${staticFile('google-sans-latin.woff2')}') format('woff2');font-weight:100 900}*{box-sizing:border-box}`}</style>
 <Sequence durationInFrames={450}><Opening/></Sequence>
 {scenes.map(s=><Sequence key={s.id} from={s.from} durationInFrames={s.to-s.from}><Scene id={s.id}/></Sequence>)}
 </AbsoluteFill>}
