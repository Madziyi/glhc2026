import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const base=process.env.UAT_URL || 'http://127.0.0.1:4334';
const out='uat/glhc003';await fs.mkdir(out,{recursive:true});
const results=[];
for(const mode of ['no-js','os-reduced','forced-fallback','blocked-webgl','slow-model']) {
 const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='os-reduced'?'reduce':'no-preference'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 if(mode==='blocked-webgl')await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args)}});
 if(mode==='slow-model')await page.route('**/models/glhc002-buoy.glb',async route=>{await new Promise(r=>setTimeout(r,12000));await route.continue().catch(()=>{})});
 await page.goto(base+(mode==='forced-fallback'?'?fallback=1':''));
 if(mode==='slow-model')await page.waitForFunction(()=>document.documentElement.classList.contains('scene-timeout'),{timeout:18000});
 else if(mode==='forced-fallback'||mode==='blocked-webgl')await page.waitForFunction(()=>document.querySelector('#stage').classList.contains('webgl-failed'),{timeout:15000});
 const details=await page.evaluate(()=>({static:document.documentElement.classList.contains('static-motion'),timeout:document.documentElement.classList.contains('scene-timeout'),overflow:document.documentElement.scrollWidth>innerWidth,canvasVisible:getComputedStyle(document.querySelector('#buoy-canvas')).display,panels:[...document.querySelectorAll('.science-panel')].map(e=>({heading:e.querySelector('h2')?.textContent,aria:e.getAttribute('aria-hidden'),height:e.getBoundingClientRect().height})),links:[...document.querySelectorAll('[data-register]')].map(e=>({url:e.href,target:e.target,rel:e.rel})),loading:document.querySelector('#loading-label').textContent}));
 await page.locator('#science').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${mode}-science.png`,timeout:60000});
 await page.locator('#registration').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${mode}-registration.png`,timeout:60000});
 if(mode==='slow-model'){
  await page.unroute('**/models/glhc002-buoy.glb');
  await page.locator('#scene-retry').click();
  await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready')&&!document.documentElement.classList.contains('static-motion'),{timeout:20000});
  details.retry=await page.locator('#scene-readout').evaluate(e=>({...e.dataset}));
 }
 results.push({mode,...details,errors});await fs.writeFile(`${out}/fallback-results.json`,JSON.stringify(results,null,2));
 if (mode==='slow-model') await page.locator('#reduce-motion').check();
 await context.close();console.log(mode,JSON.stringify(details));
}
// Regression reference is retained and still initializes at the approved surface camera.
const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(base+'/prototype/glhc-002');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});
const prototype=await page.locator('#scene-readout').evaluate(e=>({...e.dataset}));await fs.writeFile(`${out}/prototype-regression.json`,JSON.stringify(prototype,null,2));
await page.screenshot({path:`${out}/prototype-regression.png`,timeout:60000});
await page.locator('#reduce-motion').check();await browser.close();
