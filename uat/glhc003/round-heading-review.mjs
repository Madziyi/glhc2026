import{createRequire}from'node:module';import fs from'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const dir='uat/glhc003/round-heading-review',results=[];await fs.mkdir(dir,{recursive:true});
for(const[name,width,height]of[['mobile',393,852],['desktop',1440,900]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});await page.locator('.hero-actions a[href="#challenge"]').click();await page.waitForFunction(()=>location.hash==='#challenge',{timeout:7000});
 const state=await page.evaluate(()=>({label:document.querySelector('#challenge-title').textContent,headings:[...document.querySelectorAll('.challenge-round h3')].map(e=>e.textContent),subtitles:[...document.querySelectorAll('.round-subtitle')].map(e=>e.textContent),extraKicker:!!document.querySelector('.rounds-kicker'),fontSize:parseFloat(getComputedStyle(document.querySelector('#challenge-title')).fontSize),overflow:document.documentElement.scrollWidth>innerWidth}));
 if(state.label!=='4/4: How it works'||state.headings.join('|')!=='Round 1 - Submit Your Idea|Round 2 - Bring Your Idea to Life'||state.subtitles.join('|')!=='Open To Everyone|Build & Showcase'||state.extraKicker||state.fontSize>12||state.overflow||errors.length)throw Error(JSON.stringify({state,errors}));
 await page.screenshot({path:`${dir}/${name}-round-one.png`});await page.locator('#challenge').screenshot({path:`${dir}/${name}-section.png`});
 await page.evaluate(()=>scrollTo({top:document.querySelector('.round-two').getBoundingClientRect().top+scrollY-100,behavior:'instant'}));await page.waitForTimeout(800);await page.screenshot({path:`${dir}/${name}-round-two.png`});
 results.push({name,state,errors});await page.locator('#reduce-motion').check();await context.close();console.log(name+' passed');
}await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));await browser.close();
