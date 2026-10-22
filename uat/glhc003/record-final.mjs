import{createRequire}from'node:module';import fs from'node:fs/promises';const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});await fs.mkdir('uat/glhc003/final',{recursive:true});
for(const[name,width,height]of[['mobile',390,844],['desktop',1440,900]]){
 const context=await browser.newContext({viewport:{width,height},recordVideo:{dir:'uat/glhc003/final',size:{width,height}}}),page=await context.newPage();
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});await page.waitForTimeout(1500);
 for(const[id,f]of[['surface',0],['crossing',.67],['science',.08],['science',.46],['science',.92],['challenge',0],['collage',0],['how-it-works',0],['participation',.95],['registration',0],['science',.92],['science',.08],['surface',0],['invitation',0]]){
  await page.evaluate(({id,f})=>{const e=document.getElementById(id)||document.querySelector('.'+id);scrollTo({top:e.getBoundingClientRect().top+scrollY+f*(id==='crossing'?e.offsetHeight:Math.max(0,e.offsetHeight-innerHeight))-(id==='collage'?80:0),behavior:'smooth'})},{id,f});await page.waitForTimeout(id==='science'?2200:1600);
 }
 await page.locator('#reduce-motion').check();const video=page.video();await context.close();await video.saveAs(`uat/glhc003/final/${name}-walkthrough.webm`);console.log(name,'final video saved');
}
await browser.close();
