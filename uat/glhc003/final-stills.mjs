import {createRequire} from 'node:module';import fs from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});const results=[];
await fs.mkdir('uat/glhc003/final',{recursive:true});
for(const [name,width,height] of [['narrow',320,650],['mobile',390,844],['tablet',768,1024],['desktop',1440,900]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 // Capture-only cadence cap avoids saturating this software-rendered host. It is not an FPS benchmark.
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});
 const states=[];
 for(const [state,id,f] of [['hero','invitation',0],['surface','surface',0],['waterline','crossing',.67],['sensors-paragraph-1','science',.06],['paragraph-2','science',.92],['challenge','challenge',0],['collage','collage',0],['how-it-works','how-it-works',0],['registration','registration',0]]){
  await page.evaluate(({id,f})=>{const e=document.getElementById(id)||document.querySelector('.'+id),top=e.getBoundingClientRect().top+scrollY;scrollTo({top:top+f*(id==='crossing'?e.offsetHeight:Math.max(0,e.offsetHeight-innerHeight))-(id==='collage'?80:0),behavior:'instant'})},{id,f});
  await page.waitForTimeout(1200);const s=await page.locator('#scene-readout').evaluate(e=>({...e.dataset,overflow:document.documentElement.scrollWidth>innerWidth}));states.push({state,...s});
  await page.screenshot({path:`uat/glhc003/final/${name}-${state}.png`,timeout:30000});
 }
 await page.evaluate(()=>{const e=document.querySelector('#science');scrollTo({top:e.getBoundingClientRect().top+scrollY+.92*(e.offsetHeight-innerHeight),behavior:'instant'})});
 await page.reload();await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});await page.waitForTimeout(800);
 const refresh=await page.locator('#scene-readout').evaluate(e=>({...e.dataset,scrollY}));
 results.push({name,captureCadenceFps:4,states,refresh,errors});await fs.writeFile('uat/glhc003/final-stills-results.json',JSON.stringify(results,null,2));console.log(name,JSON.stringify({refresh,errors}));await page.locator('#reduce-motion').check();await page.close();
}
await browser.close();
