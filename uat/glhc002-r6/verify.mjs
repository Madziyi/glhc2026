import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const results=[];
await fs.mkdir('uat/glhc002-r6/final',{recursive:true});
const base=process.env.UAT_URL || 'http://127.0.0.1:4330';
for(const [name,width,height] of [['narrow',320,650],['mobile',390,844],['tablet',768,1024],['desktop',1440,900]]) {
 const record=['mobile','desktop'].includes(name);
 const context=await browser.newContext({viewport:{width,height},...(record?{recordVideo:{dir:'uat/glhc002-r6/final',size:{width,height}}}:{})});
 const page=await context.newPage(); const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'||m.type()==='warning') errors.push(m.text())});
 await page.goto(base+'/prototype/glhc-002');
 await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});
 await page.keyboard.press('Tab');
 const keyboard=await page.evaluate(()=>document.activeElement.textContent);
 await page.evaluate(()=>document.activeElement.blur());
 const intervals=await page.evaluate(()=>new Promise(resolve=>{const list=[];let start,prev;function sample(t){start??=t;if(prev)list.push(t-prev);prev=t;if(t-start<15000)requestAnimationFrame(sample);else resolve(list)}requestAnimationFrame(sample)}));
 const stats=await page.locator('#scene-readout').evaluate(e=>({...e.dataset}));
 const overflow=[];
 for(const [state,progress] of [['surface',0],['halfway',.335],['underwater',.40],['sensors',.46],['paragraph-b',.81],['descent',1],['reverse-surface',0]]){
  await page.evaluate(p=>{const t=document.querySelector('#buoy-story'),s=document.querySelector('#stage');window.scrollTo({top:p*(t.offsetHeight-s.offsetHeight),behavior:'instant'})},progress);
  await page.waitForTimeout(800);
  overflow.push([state,await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)]);
  await page.screenshot({path:`uat/glhc002-r6/final/r6-${name}-${state}.png`});
 }
 await page.locator('#reduce-motion').check();
 const reduced=await page.evaluate(()=>({static:document.documentElement.classList.contains('static-motion'),panels:[...document.querySelectorAll('.science-panel')].map(e=>e.getAttribute('aria-hidden')),overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.screenshot({path:`uat/glhc002-r6/final/r6-${name}-reduced.png`,fullPage:true});
 await page.locator('#reduce-motion').uncheck();await page.waitForTimeout(500);
 await page.goto(base+'/prototype/glhc-002?fallback=1');
 await page.waitForFunction(()=>document.querySelector('#stage').classList.contains('webgl-failed'));
 const fallback=await page.evaluate(()=>({static:document.documentElement.classList.contains('static-motion'),panels:[...document.querySelectorAll('.science-panel')].map(e=>e.getAttribute('aria-hidden')),overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.screenshot({path:`uat/glhc002-r6/final/r6-${name}-fallback.png`,fullPage:true});
 const sorted=intervals.slice().sort((a,b)=>a-b);
 results.push({name,width,height,stats,keyboard,overflow,reduced,fallback,errors,frames:intervals.length,intervals:{median:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],max:sorted.at(-1)}});
 await fs.writeFile('uat/glhc002-r6/final/results.json',JSON.stringify(results,null,2));
 const video=page.video();await context.close();if(video) await video.saveAs(`uat/glhc002-r6/final/r6-${name}.webm`);
}
await browser.close();await fs.writeFile('uat/glhc002-r6/final/results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
