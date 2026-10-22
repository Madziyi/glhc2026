import{createRequire}from'node:module';import fs from'node:fs/promises';const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});const results=[];await fs.mkdir('uat/glhc003/font-review',{recursive:true});
for(const[name,width,height]of[['narrow',320,650],['mobile',390,844],['tablet',768,1024],['desktop',1440,900]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});await page.evaluate(()=>document.fonts.ready);
 const font=await page.evaluate(()=>({family:getComputedStyle(document.body).fontFamily,loaded:document.fonts.check('16px "Google Sans"'),faces:[...document.fonts].map(f=>({family:f.family,status:f.status})),heroButtonBottom:document.querySelector('.header-register').getBoundingClientRect().bottom,viewportHeight:innerHeight}));
 const states=[];for(const[state,id,f]of[['hero','invitation',0],['science-one','science',.06],['science-two','science',.92]]){
  await page.evaluate(({id,f})=>{const e=document.getElementById(id);scrollTo({top:e.getBoundingClientRect().top+scrollY+f*Math.max(0,e.offsetHeight-innerHeight),behavior:'instant'})},{id,f});await page.waitForTimeout(800);
  states.push({state,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,panelBottom:document.querySelector('.panel-window').getBoundingClientRect().bottom,readout:{...document.querySelector('#scene-readout').dataset}}))});await page.screenshot({path:`uat/glhc003/font-review/${name}-${state}.png`,timeout:30000});
 }
 results.push({name,font,states,errors});await fs.writeFile('uat/glhc003/font-review/results.json',JSON.stringify(results,null,2));await page.locator('#reduce-motion').check();await page.close();console.log(name,JSON.stringify(font));
}await browser.close();
