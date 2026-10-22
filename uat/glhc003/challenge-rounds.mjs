import{createRequire}from'node:module';import fs from'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const dir='uat/glhc003/challenge-rounds',results=[];await fs.mkdir(dir,{recursive:true});
for(const[name,width,height]of[['narrow',320,650],['mobile',393,852],['tablet',768,1024],['desktop',1440,900],['landscape',667,375]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});await page.evaluate(()=>document.fonts.ready);
 await page.locator('.hero-actions a[href="#challenge"]').click();await page.waitForFunction(()=>location.hash==='#challenge',{timeout:7000});
 const layout=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,right:r.right}};return{section:rect('#challenge'),one:rect('.round-one'),image:rect('.collage'),two:rect('.round-two'),labels:[...document.querySelectorAll('main .eyebrow')].map(e=>e.textContent),focus:document.activeElement.id,overflow:document.documentElement.scrollWidth>innerWidth}});
 if(Math.abs(layout.section.top-80)>3||layout.focus!=='challenge'||layout.overflow)throw Error(name+' navigation/layout');
 if(width<=600&&!(layout.image.top>=layout.one.bottom&&layout.two.top>=layout.image.bottom))throw Error('Mobile inspiration order');
 if(layout.labels.filter(s=>/^\d\/4:/.test(s)).length!==4)throw Error('Numbering');
 await page.locator('#challenge').screenshot({path:`${dir}/${name}-challenge.png`});
 const bounds=await page.evaluate(()=>{const s=document.querySelector('#science'),start=s.getBoundingClientRect().top+scrollY;return{start,end:start+s.offsetHeight-innerHeight,height:s.offsetHeight}}),states=[];
 for(const[p,label]of[[.22,'one'],[.42,'half'],[.62,'two'],[.42,'reverse-half'],[.22,'reverse-one']]){
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),bounds.start+(bounds.end-bounds.start)*p);await page.waitForTimeout(1100);
  const state=await page.locator('#scene-readout').evaluate(e=>({...e.dataset}));if(state.cameraParked!=='true'||Math.abs(Number(state.panelProgress)-(p===.22?0:p===.42?.5:1))>.005)throw Error(name+' panel '+label);states.push({label,...state});
  if(['one','two'].includes(label))await page.screenshot({path:`${dir}/${name}-science-${label}.png`});
 }
 const travel=(bounds.end-bounds.start)*.4,prior=(height*(height<550&&width>height?3.5:2.8)-height)*.5;
 if(travel/prior>.55)throw Error('Insufficient shortening');
 results.push({name,width,height,layout,bounds,travel,prior,ratio:travel/prior,states,errors});if(errors.length)throw Error(errors.join('\n'));
 await page.locator('#reduce-motion').check();await context.close();await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));console.log(name+' passed, reveal '+Math.round(travel)+'px vs '+Math.round(prior)+'px');
}
for(const mode of['reduced','no-js']){
 const context=await browser.newContext({viewport:{width:393,height:852},...(mode==='reduced'?{reducedMotion:'reduce'}:{javaScriptEnabled:false})}),page=await context.newPage();await page.goto('http://127.0.0.1:4334');await page.locator('.hero-actions a[href="#challenge"]').click();
 const state=await page.evaluate(()=>({hash:location.hash,top:document.querySelector('#challenge').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth,panels:[...document.querySelectorAll('.science-panel')].map(e=>getComputedStyle(e).display),rounds:document.querySelectorAll('.challenge-round').length}));if(state.hash!=='#challenge'||Math.abs(state.top-80)>3||state.overflow||state.rounds!==2)throw Error(mode+' failed');results.push({name:mode,state});await context.close();
}
await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));await browser.close();
