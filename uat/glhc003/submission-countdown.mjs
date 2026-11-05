import{createRequire}from'node:module';import fs from'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const target=Date.parse('2026-11-05T17:30:00-05:00'),dir='uat/glhc003/submission-countdown',results=[];await fs.mkdir(dir,{recursive:true});
for(const[name,width,height,timezoneId]of[['small',320,568,'America/New_York'],['mobile',393,852,'America/Los_Angeles'],['tablet',768,1024,'UTC'],['desktop',1440,900,'Asia/Tokyo'],['landscape',568,320,'America/New_York']]){
 const context=await browser.newContext({viewport:{width,height},timezoneId}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(({now})=>{window.__realNow=Date.now.bind(Date);window.__offset=now-window.__realNow();Date.now=()=>window.__realNow()+window.__offset;window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout},{now:target-(5*3600+39*60+23)*1000});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.querySelector('#intro-preloader').hidden,{timeout:15000});
 const initial=await page.locator('#submission-opening').textContent();await page.waitForTimeout(1300);const ticking=await page.locator('#submission-opening').textContent();
 const layout=await page.evaluate(()=>{const r=document.querySelector('#invitation').getBoundingClientRect(),a=document.querySelector('.hero-actions').getBoundingClientRect(),c=document.querySelector('.scroll-cue').getBoundingClientRect();return{heroHeight:r.height,actionsBottom:a.bottom,cueTop:c.top,overflow:document.documentElement.scrollWidth>innerWidth,close:document.querySelector('.hero-dates>span:last-child').textContent,iso:document.querySelector('#submission-opening').dataset.opensAt}});
 if(initial===ticking||!/^5:39:\d\d until submissions open at 5:30 pm ET on 5 Nov\.$/.test(ticking)||layout.iso!=='2026-11-05T17:30:00-05:00'||layout.close!=='Idea Submissions CLOSE: Dec 3rd.'||layout.overflow||layout.heroHeight>height+1||layout.actionsBottom>=layout.cueTop)throw Error(name+' countdown/layout '+JSON.stringify({initial,ticking,layout}));
 await page.screenshot({path:`${dir}/${name}-countdown.png`});
 // Jump the simulated wall clock ahead, like resuming a sleeping tab.
 await page.evaluate(target=>{window.__offset=target-2000-window.__realNow();document.dispatchEvent(new Event('visibilitychange'))},target);
 await page.waitForFunction(()=>document.querySelector('#submission-opening').textContent==='Idea Submissions are OPEN.',{timeout:5000});const opened=await page.locator('#submission-opening').textContent();
 if(name==='mobile'){
  await page.locator('.header-register').click();await page.waitForFunction(()=>document.querySelector('#info-session-dialog').open);
  const choices=await page.locator('#info-session-dialog a').evaluateAll(els=>els.map(e=>e.href));if(choices.join('|')!=='https://luma.com/pz0iw2m7|https://luma.com/zrbvt2az')throw Error('Chooser destinations changed');await page.keyboard.press('Escape');
 }
 if(errors.length)throw Error(errors.join('\n'));results.push({name,width,height,timezoneId,initial,ticking,layout,opened,errors});await page.locator('#reduce-motion').check();await context.close();await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));console.log(name+' passed');
}
const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}}),page=await context.newPage();await page.goto('http://127.0.0.1:4334');const fallback=await page.locator('#submission-opening').textContent();if(fallback!=='Idea Submissions OPEN: Nov 5th at 5:30 pm ET.')throw Error('No-JS schedule');results.push({name:'no-js',fallback});await context.close();await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));await browser.close();
