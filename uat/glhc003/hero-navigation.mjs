import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(import.meta.url), {chromium}=require(process.env.PLAYWRIGHT_MODULE);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const dir='uat/glhc003/hero-navigation',results=[];
await fs.mkdir(dir,{recursive:true});
for(const [name,width,height] of [['narrow',320,650],['mobile',390,844],['tablet',768,1024],['desktop',1440,900]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');
 await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});
 await page.evaluate(()=>document.fonts.ready);
 const appearance=await page.evaluate(()=>({font:getComputedStyle(document.body).fontFamily,radius:getComputedStyle(document.querySelector('.hero-photo img')).borderTopLeftRadius,overflow:document.documentElement.scrollWidth>innerWidth,removedCopy:!!document.querySelector('.hero-intro,.hero-welcome')}));
 if(appearance.overflow||appearance.removedCopy||parseFloat(appearance.radius)<14)throw Error(name+' composition failed');
 await page.locator('#invitation').screenshot({path:`${dir}/${name}-hero.png`});
 const jumps=[];
 for(const target of ['surface','how-it-works']){
  const link=page.locator(`.hero-actions a[href="#${target}"]`);
  await link.scrollIntoViewIfNeeded();await page.waitForTimeout(500);
  await page.evaluate(()=>{window.heroScrollSamples=[];window.heroScrollListener=()=>window.heroScrollSamples.push(scrollY);addEventListener('scroll',window.heroScrollListener)});
  await link.click();await page.waitForTimeout(2200);
  const result=await page.evaluate(id=>{removeEventListener('scroll',window.heroScrollListener);const target=document.getElementById(id),heading=target.querySelector('.eyebrow');return{target:id,hash:location.hash,scrollY,targetTop:target.getBoundingClientRect().top,headingTop:heading.getBoundingClientRect().top,heading:heading.textContent,focus:document.activeElement.id,samples:window.heroScrollSamples,overflow:document.documentElement.scrollWidth>innerWidth}},target);
  if(result.hash!=='#'+target||Math.abs(result.targetTop-80)>3||result.headingTop<64||result.headingTop>height-20||result.samples.length<3||result.overflow)throw Error(name+' navigation failed '+JSON.stringify(result));
  await page.screenshot({path:`${dir}/${name}-${target}.png`});jumps.push(result);
 }
 results.push({name,captureCadenceFps:4,appearance,jumps,errors});
 if(errors.length)throw Error(errors.join('\n'));
 await page.locator('#reduce-motion').check();await context.close();
 await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));console.log(name+' passed');
}
for(const mode of ['reduced','no-js']){
 const context=await browser.newContext({viewport:{width:390,height:844},...(mode==='reduced'?{reducedMotion:'reduce'}:{javaScriptEnabled:false})}),page=await context.newPage();
 await page.goto('http://127.0.0.1:4334');const jumps=[];
 for(const target of ['surface','how-it-works']){
  await page.locator(`.hero-actions a[href="#${target}"]`).click();
  const result=await page.evaluate(id=>({hash:location.hash,top:document.getElementById(id).getBoundingClientRect().top,behavior:getComputedStyle(document.documentElement).scrollBehavior,overflow:document.documentElement.scrollWidth>innerWidth}),target);
  if(result.hash!=='#'+target||Math.abs(result.top-80)>3||result.behavior!=='auto'||result.overflow)throw Error(mode+' failed '+JSON.stringify(result));jumps.push(result);
 }
 results.push({name:mode,jumps});await context.close();
}
await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));await browser.close();
