import{createRequire}from'node:module';import fs from'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const dir='uat/glhc003/preloader',results=[];await fs.mkdir(dir,{recursive:true});
for(const[name,width,height]of[['narrow',320,568],['mobile',393,852],['tablet',768,1024],['desktop',1440,900],['reduced',393,852],['blocked-module',393,852],['delayed-model',393,852],['no-js',393,852]]){
 const context=await browser.newContext({viewport:{width,height},...(name==='reduced'?{reducedMotion:'reduce'}:{}),...(name==='no-js'?{javaScriptEnabled:false}:{})}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{
  window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout;
  window.introEvents=[];let shown=false,fading=false,hidden=false;
  new MutationObserver(()=>{const e=document.getElementById('intro-preloader');if(!e)return;if(!e.hidden&&!shown){shown=true;window.introEvents.push({type:'show',t:performance.now()})}if(e.classList.contains('is-leaving')&&!fading){fading=true;window.introEvents.push({type:'fade',t:performance.now()})}if(e.hidden&&shown&&!hidden){hidden=true;window.introEvents.push({type:'hide',t:performance.now()})}}).observe(document,{subtree:true,attributes:true,childList:true,attributeFilter:['hidden','class']});
 });
 if(name==='blocked-module')await page.route(/\/_astro\/index\..*\.js$/,route=>route.abort());
 if(name==='delayed-model')await page.route('**/models/glhc002-buoy.glb',async route=>{await new Promise(r=>setTimeout(r,8000));await route.continue().catch(()=>{})});
 await page.goto('http://127.0.0.1:4334');
 if(name==='no-js'){
  const state=await page.evaluate(()=>({hidden:document.querySelector('#intro-preloader').hidden,locked:document.documentElement.classList.contains('intro-active'),inert:document.querySelector('main').inert}));if(!state.hidden||state.locked||state.inert)throw Error('no-JS blocked');results.push({name,state});await context.close();continue;
 }
 const initial=await page.evaluate(()=>({opacity:Number(getComputedStyle(document.querySelector('#intro-preloader p')).opacity),visible:!document.querySelector('#intro-preloader').hidden,inert:document.querySelector('main').inert}));
 if(!initial.visible||!initial.inert)throw Error(name+' initial state');
 await page.waitForTimeout(1400);
 const visible=await page.evaluate(()=>{const e=document.querySelector('#intro-preloader'),p=e.querySelector('p'),r=p.getBoundingClientRect();return{text:p.textContent,opacity:Number(getComputedStyle(p).opacity),overlayOpacity:Number(getComputedStyle(e).opacity),fits:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,sceneReady:document.documentElement.classList.contains('scene-ready')}});
 if(visible.text!=='Into art, science, technology, or just curious? This event is for you.'||visible.opacity<.99||!visible.fits)throw Error(name+' message');
 if(['narrow','mobile','desktop'].includes(name))await page.screenshot({path:`${dir}/${name}-intro.png`});
 await page.waitForFunction(()=>document.querySelector('#intro-preloader').hidden,{timeout:8500});
 const final=await page.evaluate(()=>({events:window.introEvents,locked:document.documentElement.classList.contains('intro-active'),inert:document.querySelector('main').inert,sceneReady:document.documentElement.classList.contains('scene-ready'),overflow:document.documentElement.scrollWidth>innerWidth}));
 const show=final.events.find(e=>e.type==='show').t,fade=final.events.find(e=>e.type==='fade').t,hide=final.events.find(e=>e.type==='hide').t;
 if(fade-show<5900||fade-show>6500||hide-fade<(name==='reduced'?0:650)||final.locked||final.inert||final.overflow)throw Error(name+' timing/cleanup '+JSON.stringify(final));
 if(['mobile','desktop'].includes(name))await page.screenshot({path:`${dir}/${name}-revealed.png`});
 if(name==='mobile'){await page.locator('.hero-actions a[href="#surface"]').click();await page.waitForFunction(()=>location.hash==='#surface',{timeout:7000})}
 results.push({name,initial,visible,final,holdMs:fade-show,fadeMs:hide-fade,errors});if(errors.length)throw Error(errors.join('\n'));
 if(!['reduced','blocked-module'].includes(name))await page.locator('#reduce-motion').check();await context.close();await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));console.log(name+' passed '+Math.round(fade-show)+'ms hold');
}
await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));await browser.close();
