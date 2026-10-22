import{createRequire}from'node:module';import fs from'node:fs/promises';const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});const results=[];await fs.mkdir('uat/glhc003/orbit',{recursive:true});
for(const[name,width,height]of[['narrow',320,650],['mobile',390,844],['tablet',768,1024],['desktop',1440,900]]){
 const record=['mobile','desktop'].includes(name),context=await browser.newContext({viewport:{width,height},...(record?{recordVideo:{dir:'uat/glhc003/orbit',size:{width,height}}}:{})}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});await page.evaluate(()=>document.fonts.ready);
 const bounds=await page.evaluate(()=>{const top=id=>{const e=document.getElementById(id);return e.getBoundingClientRect().top+scrollY};const s=document.querySelector('#science');return{surface:top('surface'),crossing:top('crossing'),science:top('science'),scienceEnd:top('science')+s.offsetHeight-innerHeight}});
 const sample=async(label,y,shot=true)=>{await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(1500);const stats=await page.locator('#scene-readout').evaluate(e=>({...e.dataset,overflow:document.documentElement.scrollWidth>innerWidth}));if(stats.overflow)throw Error(name+' overflow');if(shot)await page.screenshot({path:`uat/glhc003/orbit/${name}-${label}.png`,timeout:30000});return{label,...stats}};
 const invSmooth=v=>{let a=0,b=1;for(let i=0;i<30;i++){const x=(a+b)/2;if(x*x*(3-2*x)<v)a=x;else b=x}return(a+b)/2};
 const orbitY=p=>bounds.surface+(bounds.crossing-bounds.surface)*(.22+.72*invSmooth(p));
 const states=[];for(const p of[0,.25,.5,.75,1])states.push(await sample('turn-'+p,orbitY(p)));
 states.push(await sample('waterline',bounds.crossing+(bounds.science-bounds.crossing)*.67));
 const sensorY=bounds.science+.08*(bounds.scienceEnd-bounds.science);states.push(await sample('sensors',sensorY));
 const sensor=states.at(-1),expected=width>760?{x:6.45,z:-12.7,targetY:-.8}:{x:3.65,z:-11.8,targetY:-2.8};
 for(const[field,value]of Object.entries({cameraX:expected.x,cameraY:-1.45,cameraZ:expected.z,targetY:expected.targetY}))if(Math.abs(Number(sensor[field])-value)>.03)throw Error(name+' altered approved sensor '+field);
 states.push(await sample('reverse-half-turn',orbitY(.5)));states.push(await sample('reverse-start',orbitY(0)));
 // A continuous native-scroll pass records the orbit, return, descent and reversal.
 if(record){for(const y of[orbitY(0),orbitY(.25),orbitY(.5),orbitY(.75),orbitY(1),sensorY,orbitY(1),orbitY(.75),orbitY(.5),orbitY(.25),orbitY(0)]){await page.evaluate(y=>scrollTo({top:y,behavior:'smooth'}),y);await page.waitForTimeout(1200)}}
 await page.locator('#reduce-motion').check();const reduced=await page.evaluate(()=>({static:document.documentElement.classList.contains('static-motion'),overflow:document.documentElement.scrollWidth>innerWidth}));
 results.push({name,captureCadenceFps:4,bounds,states,reduced,errors});await fs.writeFile('uat/glhc003/orbit/results.json',JSON.stringify(results,null,2));const video=page.video();await context.close();if(video)await video.saveAs(`uat/glhc003/orbit/${name}-orbit.webm`);console.log(name,JSON.stringify({sensor,errors,reduced}));
}await browser.close();
