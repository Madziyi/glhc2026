import{createRequire}from'node:module';import fs from'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const dir='uat/glhc003/slow-scroll',results=[];await fs.mkdir(dir,{recursive:true});
for(const[name,width,height]of[['mobile',393,852],['desktop',1440,900]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});
 const start=async()=>page.evaluate(()=>{window.scrollSamples=[];window.scrollStarted=performance.now();window.scrollListener=()=>window.scrollSamples.push({t:performance.now()-window.scrollStarted,y:scrollY});addEventListener('scroll',window.scrollListener)});
 const read=async()=>page.evaluate(()=>{removeEventListener('scroll',window.scrollListener);return{samples:window.scrollSamples,elapsed:window.scrollSamples.at(-1)?.t,hash:location.hash,focus:document.activeElement.id}});
 await start();await page.evaluate(()=>{const a=document.createElement('a');a.href='#how-it-works';document.body.append(a);a.click();a.remove()});await page.waitForTimeout(2000);const native=await read();
 const jumps=[];
 for(const[selector,target]of[['.hero-actions a[href="#surface"]','surface'],['.hero-actions a[href="#how-it-works"]','how-it-works'],['.invitation .scroll-cue','surface']]){
  await page.evaluate(()=>{history.replaceState(null,'',location.pathname);scrollTo({top:0,behavior:'instant'})});await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(400);await start();
  await page.locator(selector).click();await page.waitForFunction(id=>location.hash==='#'+id,target,{timeout:7000});
  const jump=await read(),top=await page.locator('#'+target).evaluate(e=>e.getBoundingClientRect().top);
  if(jump.elapsed<3000||jump.elapsed/native.elapsed<2||Math.abs(top-80)>3||jump.focus!==target)throw Error(name+' slow jump failed '+JSON.stringify({jump,native,top}));
  jumps.push({selector,target,...jump,top,ratio:jump.elapsed/native.elapsed});
 }
 await page.evaluate(()=>{history.replaceState(null,'',location.pathname);scrollTo({top:0,behavior:'instant'})});await page.locator('.hero-actions a[href="#how-it-works"]').click();await page.waitForTimeout(800);await page.mouse.wheel(0,50);await page.waitForTimeout(400);const cancelledY=await page.evaluate(()=>scrollY);await page.waitForTimeout(800);const cancel={before:cancelledY,after:await page.evaluate(()=>scrollY),hash:await page.evaluate(()=>location.hash)};if(Math.abs(cancel.before-cancel.after)>2||cancel.hash)throw Error('Cancellation failed');
 results.push({name,native,jumps,cancel,errors,captureCadenceFps:4});if(errors.length)throw Error(errors.join('\n'));await page.locator('#reduce-motion').check();await context.close();console.log(name+' passed');
}
for(const mode of['reduced','no-js']){
 const context=await browser.newContext({viewport:{width:393,height:852},...(mode==='reduced'?{reducedMotion:'reduce'}:{javaScriptEnabled:false})}),page=await context.newPage();await page.goto('http://127.0.0.1:4334');await page.locator('.hero-actions a[href="#how-it-works"]').click();const state=await page.evaluate(()=>({hash:location.hash,top:document.getElementById('how-it-works').getBoundingClientRect().top,behavior:getComputedStyle(document.documentElement).scrollBehavior}));if(state.hash!=='#how-it-works'||Math.abs(state.top-80)>3||state.behavior!=='auto')throw Error(mode+' failed');results.push({name:mode,...state});await context.close();
}
await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));await browser.close();
