import {createRequire} from 'node:module';import fs from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const landscapeOnly=process.argv.includes('--landscape');
const dir=landscapeOnly?'uat/glhc003/hero-balanced-landscape':'uat/glhc003/hero-balanced',results=[];await fs.mkdir(dir,{recursive:true});
const sizes=[['iphone-se',375,667],['iphone-16',393,852],['small-phone',320,568],['android',360,640],['wide-phone',430,932],['tablet',768,1024],['short-tablet',768,600],['laptop',1366,768],['desktop',1440,900],['landscape',667,375],['small-landscape',568,320]];
for(const[name,width,height]of sizes.filter(([,w,h])=>!landscapeOnly||w>h&&h<550)){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});await page.evaluate(()=>document.fonts.ready);
 const layout=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height}};return{viewport:innerHeight,hero:rect('#invitation'),title:rect('#invitation-title'),photo:rect('.hero-photo'),description:rect('.hero-description'),actions:rect('.hero-actions'),cue:rect('.scroll-cue'),header:rect('.site-header'),overflow:document.documentElement.scrollWidth>innerWidth}});
 await page.screenshot({path:`${dir}/${name}.png`});
 const fit=layout.hero.height<=height+1&&layout.actions.bottom<layout.cue.top&&layout.cue.bottom<=height+1&&layout.title.top>=layout.header.bottom-1&&!layout.overflow;
 results.push({name,width,height,fit,layout,errors});await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));console.log(name,fit,Math.round(layout.hero.height),Math.round(layout.actions.bottom),Math.round(layout.cue.top));
 await page.locator('#reduce-motion').check();await context.close();
}
await browser.close();if(results.some(r=>!r.fit||r.errors.length))process.exitCode=1;
