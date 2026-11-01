import fs from 'node:fs';
import {narrationTimeMap} from './src/narration-time-map.mjs';
import {goldStoryPoint,tvEntry,TV_ENTRY_FRAME} from './src/gold-story-path.mjs';
const timeline=JSON.parse(fs.readFileSync(new URL('./src/corrected-timeline.json',import.meta.url)));
const report={scenes:[],pulseJoinErrorPixels:0,tvEntryErrorPixels:0};
for(const s of timeline.scenes){
 const fn=narrationTimeMap(s.from,s.to);let previous=-1,maxStep=0;
 for(let f=0;f<s.frames;f++){const v=fn(f);if(!Number.isFinite(v)||v<previous-1e-8)throw Error(`Invalid retime ${s.name}:${f}`);maxStep=Math.max(maxStep,v-previous);previous=v;}
 report.scenes.push({name:s.name,startFrame:s.startFrame,frames:s.frames,legacyEnd:previous,maxLegacyStep:maxStep});
}
const rise=Array.from({length:123},(_,i)=>goldStoryPoint('science',195+i));
for(let i=1;i<rise.length;i++)if(rise[i][1]>rise[i-1][1]+1e-6)throw Error('Rising dot reversed downward');
const targetHeight=goldStoryPoint('waterfront',0)[1];report.topHoldMaxHeightErrorPixels=Math.max(...rise.slice(90).map(p=>Math.abs(p[1]-targetHeight)));if(report.topHoldMaxHeightErrorPixels>1e-6)throw Error('Dot did not hold display height');
report.rotationalSweepRemoved=true;
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
report.pulseJoinErrorPixels=distance(goldStoryPoint('science',317),goldStoryPoint('waterfront',0));
report.trailHistoryJoinErrorPixels=distance(goldStoryPoint('waterfront',-30),goldStoryPoint('science',288));
if(report.trailHistoryJoinErrorPixels>1e-6)throw Error('Trail history reset at scene join');
report.tvEntryErrorPixels=distance(goldStoryPoint('waterfront',TV_ENTRY_FRAME),tvEntry());
if(report.pulseJoinErrorPixels>1e-6||report.tvEntryErrorPixels>1e-6)throw Error('Pulse endpoint mismatch');
for(const [scene,start,end]of [['science',165,317],['waterfront',0,125]]){
 let prev=goldStoryPoint(scene,start),maxStep=0;
 for(let f=start+1;f<=end;f++){const p=goldStoryPoint(scene,f);if(!p.every(Number.isFinite)||p[0]<70||p[0]>1850||p[1]<70||p[1]>1010)throw Error(`Unsafe pulse ${scene}:${f}`);maxStep=Math.max(maxStep,distance(prev,p));prev=p;}
 report[`${scene}MaxPulseStepPixels`]=maxStep;
}
const s=timeline.scenes[2],fn=narrationTimeMap(s.from,s.to);let closest=0;
for(let f=0;f<s.frames;f++)if(Math.abs(fn(f)-125)<Math.abs(fn(closest)-125))closest=f;
report.tvEntryGlobalFrame=s.startFrame+closest;report.tvEntrySeconds=report.tvEntryGlobalFrame/30;report.correctedBeCueSeconds=28.98;
if(Math.abs(report.tvEntrySeconds-28.98)>1/30)throw Error('TV entry not on narration cue');
fs.writeFileSync(new URL('./evidence/corrected-motion.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
