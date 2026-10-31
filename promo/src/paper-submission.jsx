import React from 'react';
import {ramp} from './opening';

export function FoldedProposal({f}){
 const horizontal=ramp(f,310,334),vertical=ramp(f,335,352),travel=ramp(f,352,370),insert=ramp(f,371,383);
 const cy=Math.cos(horizontal*Math.PI),cx=Math.cos(vertical*Math.PI);
 const scale=1-travel*.67,x=travel*865,y=travel*-280+insert*120;
 const lower=<g><use href="#proposal-art" clipPath="url(#proposal-bottom)"/>{horizontal>0&&<g transform={`translate(0 550) scale(1 ${cy}) translate(0 -550)`}>{cy>=0?<use href="#proposal-art" clipPath="url(#proposal-top)"/>:<rect x="340" y="180" width="1180" height="370" fill="#f7f3e7" stroke="#d2cdbd" strokeWidth="1.5"/>}</g>}<path d="M340 550H1520" stroke="#b5b0a1" strokeWidth="1" opacity={horizontal*.45}/></g>;
 return <g opacity={f<384?1:0} transform={`translate(${x} ${y}) translate(635 735) scale(${scale}) rotate(${-2*(1-travel)}) translate(-635 -735)`}>
 <defs><clipPath id="proposal-top"><rect x="340" y="180" width="1180" height="370"/></clipPath><clipPath id="proposal-bottom"><rect x="340" y="550" width="1180" height="370"/></clipPath><clipPath id="proposal-left"><rect x="340" y="550" width="590" height="370"/></clipPath><clipPath id="proposal-right"><rect x="930" y="550" width="590" height="370"/></clipPath></defs>
 {horizontal===0?<use href="#proposal-art"/>:vertical===0?lower:<g>
 <g clipPath="url(#proposal-left)">{lower}</g>
 <g transform={`translate(930 0) scale(${cx} 1) translate(-930 0)`}>{cx>=0?<g clipPath="url(#proposal-right)">{lower}</g>:<rect x="930" y="550" width="590" height="370" fill="#fffcf1" stroke="#cec8b7" strokeWidth="1.5"/>}</g>
 <path d="M930 550V920" stroke="#b5b0a1" strokeWidth="1" opacity=".35"/>
 </g>}
 </g>;
}

export function SubmissionEnvelope({f,front=false}){
 const a=ramp(f,340,352),close=ramp(f,383,392),tip=50-95*Math.cos(close*Math.PI),seal=ramp(f,390,394);
 return <g transform="translate(1500 430)" opacity={a}>
 {!front?<g><path d="M-130 50H130V210H-130Z" fill="#c4bca6"/>{close===0&&<path d="M-130 50L0-45L130 50Z" fill="#d4cfb9" stroke="#a9a38e" strokeWidth="1"/>}</g>:<g>
 <path d="M-130 50L0 140L130 50V210H-130Z" fill="#e7dfc7" stroke="#183c47" strokeWidth="2"/>
 <path d="M-130 210L0 115L130 210" fill="none" stroke="#183c47" strokeWidth="2"/>
 {close>0&&<path d={`M-130 50L0 ${tip}L130 50Z`} fill={close<.5?'#d4cfb9':'#ded5bc'} stroke="#8d9387" strokeWidth="1.3"/>}
 <circle cy="142" r={seal*15} fill="#69bfb9"/>
 </g>}
 </g>;
}

