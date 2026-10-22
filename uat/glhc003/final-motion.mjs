import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const out='uat/glhc003',base=process.env.UAT_URL||'http://127.0.0.1:4334';
const results=[];
for(const [name,width,height] of [['narrow',320,650],['mobile',390,844],['tablet',768,1024],['desktop',1440,900]]) {
 const record=['mobile','desktop'].includes(name);
 const context=await browser.newContext({viewport:{width,height},...(record?{recordVideo:{dir:out,size:{width,height}}}:{})});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(base);await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});
 const move=async(id,f=0,duration=1700)=>{await page.evaluate(({id,f})=>{const e=document.getElementById(id)||document.querySelector('.'+id);let y=e.getBoundingClientRect().top+scrollY;
 if(id==='science')y+=f*Math.max(0,e.offsetHeight-innerHeight);
 else if(id==='crossing')y+=f*e.offsetHeight;
 else if(id==='collage')y-=80;
 window.scrollTo({top:y,behavior:'smooth'});},{id,f});await page.waitForTimeout(duration)};
 await page.waitForTimeout(1000);await page.screenshot({path:`${out}/${name}-hero.png`,timeout:60000});await move('surface');
 await page.screenshot({path:`${out}/${name}-surface.png`,timeout:60000});
 await move('crossing',.55);
 await page.screenshot({path:`${out}/${name}-waterline.png`,timeout:60000});
 const crossing=await page.locator('#scene-readout').evaluate(e=>({...e.dataset}));
 {
  await move('science',.06,2500);await page.screenshot({path:`${out}/${name}-sensors-paragraph-1.png`,timeout:60000});await move('science',.46,2000);await move('science',.92,2500);await page.screenshot({path:`${out}/${name}-paragraph-2.png`,timeout:60000});
  await move('challenge');await page.screenshot({path:`${out}/${name}-challenge.png`,timeout:60000});await move('collage');await page.screenshot({path:`${out}/${name}-collage.png`,timeout:60000});await move('how-it-works');await page.screenshot({path:`${out}/${name}-how-it-works.png`,timeout:60000});
  await page.evaluate(()=>{const e=document.querySelector('.participation');scrollTo({top:e.getBoundingClientRect().top+scrollY+e.offsetHeight-innerHeight+70,behavior:'smooth'})});await page.waitForTimeout(1800);
  await page.screenshot({path:`${out}/${name}-participation.png`,timeout:60000});
  await move('registration',0,2500);await page.screenshot({path:`${out}/${name}-registration.png`,timeout:60000});
  await move('science',.92);await move('science',.06);await move('crossing',.55);await move('surface');await move('invitation');
 }
 // Resize inside the science hold and return to that chapter. Refresh at its second paragraph.
 await move('science',.92);
 await page.setViewportSize({width:height,height:width});await move('science',.92);
 const landscape=await page.locator('#scene-readout').evaluate(e=>({...e.dataset,overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.screenshot({path:`${out}/${name}-science-landscape.png`,timeout:60000});
 await page.setViewportSize({width,height});await move('science',.92);
 await page.reload();await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});await page.waitForTimeout(1000);
 const refresh=await page.locator('#scene-readout').evaluate(e=>({...e.dataset,scrollY,overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.screenshot({path:`${out}/${name}-refresh-science.png`,timeout:60000});
 const result={name,crossing,landscape,refresh,errors};results.push(result);await fs.writeFile(`${out}/final-motion-results.json`,JSON.stringify(results,null,2));
 const video=page.video();await page.locator('#reduce-motion').check();await context.close();if(video)await video.saveAs(`${out}/${name}-continuous-walkthrough.webm`);
 console.log(name,JSON.stringify(result));
}
await browser.close();
