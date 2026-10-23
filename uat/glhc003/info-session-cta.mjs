import{createRequire}from'node:module';import fs from'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const dir='uat/glhc003/info-session-cta',results=[];await fs.mkdir(dir,{recursive:true});
for(const[name,width,height]of[['narrow',320,568],['mobile',393,852],['desktop',1440,900]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.querySelector('#intro-preloader').hidden,{timeout:15000});await page.evaluate(()=>document.fonts.ready);
 const links=await page.locator('[data-register]').evaluateAll(els=>els.map(e=>({label:e.childNodes[0].textContent.trim(),href:e.href,target:e.target,rel:e.rel})));
 if(links.length!==2||links.some(e=>e.label!=='Attend the info session'||e.href!=='https://luma.com/pz0iw2m7'||e.target!=='_blank'||!e.rel.includes('noopener')))throw Error('CTA contract');
 const states=[];
 for(const[selector,label]of[['.header-register','header'],['.registration .button','ending']]){
  await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(500);
  const state=await page.locator(selector).evaluate(e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,width:r.width,clipped:e.scrollWidth>e.clientWidth,overflow:document.documentElement.scrollWidth>innerWidth}});
  if(state.left<0||state.right>width||state.clipped||state.overflow)throw Error(name+' label overflow');states.push({label,...state});
  if(name!=='narrow')await page.screenshot({path:`${dir}/${name}-${label}.png`});
 }
 if(errors.length)throw Error(errors.join('\n'));results.push({name,links,states,errors});await page.locator('#reduce-motion').check();await context.close();console.log(name+' passed');
}
await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));await browser.close();
