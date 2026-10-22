import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const base=process.env.UAT_URL || 'http://127.0.0.1:4334';
const out='uat/glhc003';
await fs.mkdir(out,{recursive:true});
const results=[];
const sizes=[['narrow',320,650],['mobile',390,844],['tablet',768,1024],['desktop',1440,900]];
for(const [name,width,height] of sizes.filter(s=>!process.env.UAT_SIZE||s[0]===process.env.UAT_SIZE)) {
 const record=['mobile','desktop'].includes(name)&&!process.env.NO_VIDEO;
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,...(record?{recordVideo:{dir:out,size:{width,height}}}:{})});
 const page=await context.newPage(),errors=[],warnings=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text())});
 await page.goto(base);
 await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready')||document.querySelector('#stage').classList.contains('webgl-failed'),{timeout:30000});
 await page.keyboard.press('Tab');
 const keyboard=await page.evaluate(()=>document.activeElement.textContent.trim());
 await page.evaluate(()=>document.activeElement.blur());
 const hero=await page.evaluate(()=>{
  const r=e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom}};
  return {heading:r(document.querySelector('h1')),photo:r(document.querySelector('#invitation img')),badge:r(document.querySelector('.prize-burst')||document.querySelector('[class*=prize]')),links:[...document.querySelectorAll('[data-register]')].map(a=>({href:a.href,target:a.target,rel:a.rel}))};
 });
 const frames=await page.evaluate(()=>new Promise(resolve=>{let start,prev;const intervals=[];function sample(t){start??=t;if(prev)intervals.push(t-prev);prev=t;if(t-start<3000)requestAnimationFrame(sample);else resolve(intervals)}requestAnimationFrame(sample)}));
 const stats=await page.locator('#scene-readout').evaluate(e=>({...e.dataset,paints:performance.getEntriesByType('paint').map(p=>({name:p.name,ms:p.startTime})),navigation:performance.getEntriesByType('navigation').map(n=>({responseEnd:n.responseEnd,domContentLoaded:n.domContentLoadedEventEnd})),renderer:(()=>{const gl=document.querySelector('canvas').getContext('webgl2');const ext=gl?.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null})()}));
 const states=[];
 const steps=[['hero','invitation',0],['surface','surface',0],['waterline','crossing',.5],['sensors-paragraph-1','science',.06],['paragraph-2','science',.92],['challenge','challenge',0],['collage','collage',0],['how-it-works','how-it-works',0],['registration','registration',0],['reverse-sensors','science',.06],['reverse-hero','invitation',0]];
 for(const [state,id,fraction] of steps){
  await page.evaluate(({id,fraction})=>{const e=document.getElementById(id)||document.querySelector('.'+id);window.scrollTo({top:e.getBoundingClientRect().top+scrollY+fraction*Math.max(0,e.offsetHeight-innerHeight)-(id==='collage'?80:id==='how-it-works'?25:0),behavior:'instant'})},{id,fraction});
  await page.waitForTimeout(1100);
  states.push({state,...await page.evaluate(()=>({scrollY,overflow:document.documentElement.scrollWidth>innerWidth,readout:{...document.querySelector('#scene-readout').dataset},panels:[...document.querySelectorAll('.science-panel')].map(e=>({heading:e.querySelector('h2')?.textContent,aria:e.getAttribute('aria-hidden'),rect:{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y}}))}))});
  await page.screenshot({path:`${out}/${name}-${state}.png`,timeout:60000});
 }
 await page.setViewportSize({width:height,height:width});await page.waitForTimeout(500);
 const landscape=await page.evaluate(()=>({width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.screenshot({path:`${out}/${name}-landscape.png`,timeout:60000});
 await page.setViewportSize({width,height});
 // Follow the actual CTA popup without registering or submitting any information.
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 const popupPromise=context.waitForEvent('page',{timeout:60000});
 await page.locator('[data-register]').first().click();
 const popup=await popupPromise;
 let destinationError=null;await popup.waitForLoadState('domcontentloaded',{timeout:20000}).catch(e=>destinationError=e.message);
 const registration={url:popup.url(),opener:await popup.evaluate(()=>!!window.opener).catch(()=>null),title:await popup.title().catch(()=>null),destinationError};
 await popup.screenshot({path:`${out}/${name}-luma.png`,timeout:30000}).catch(()=>{});await popup.close();
 await page.locator('#reduce-motion').check();
 const reduced=await page.evaluate(()=>({static:document.documentElement.classList.contains('static-motion'),overflow:document.documentElement.scrollWidth>innerWidth,panels:[...document.querySelectorAll('.science-panel')].map(e=>({hidden:e.getAttribute('aria-hidden'),height:e.getBoundingClientRect().height}))}));
 await page.locator('#science').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${name}-reduced-science.png`,timeout:60000});
 const sorted=frames.slice().sort((a,b)=>a-b);
 const result={name,width,height,keyboard,hero,stats,states,landscape,registration,reduced,errors,warnings,frameIntervals:{count:sorted.length,median:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)]}};
 results.push(result);await fs.writeFile(`${out}/${name}-results.json`,JSON.stringify(result,null,2));
 const video=page.video();await context.close();if(video)await video.saveAs(`${out}/${name}-walkthrough.webm`);
 console.log(JSON.stringify(result));
}
await browser.close();
