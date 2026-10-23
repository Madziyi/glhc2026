import{createRequire}from'node:module';import fs from'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const dir='uat/glhc003/orbit-smoothing-final',results=[];await fs.mkdir(dir,{recursive:true});
for(const[name,width,height]of[['narrow',320,650],['mobile',393,852],['tablet',768,1024],['desktop',1440,900]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);window.cancelAnimationFrame=clearTimeout});
 await page.goto('http://127.0.0.1:4334');await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:30000});
 const bounds=await page.evaluate(()=>{const top=id=>document.getElementById(id).getBoundingClientRect().top+scrollY;return{surface:top('surface'),crossing:top('crossing'),science:top('science'),scienceEnd:top('science')+document.getElementById('science').offsetHeight-innerHeight}});
 const inv=v=>{let a=0,b=1;for(let i=0;i<30;i++){const x=(a+b)/2;if(x*x*(3-2*x)<v)a=x;else b=x}return(a+b)/2};const y=p=>bounds.surface+(bounds.crossing-bounds.surface)*(.22+.72*inv(p));
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y(0));await page.waitForTimeout(1800);
 const read=()=>page.locator('#scene-readout').evaluate(e=>({...e.dataset}));const initial=await read(),radius=Number(initial.orbitRadius),samples=[];
 // Keep every transient sample, including abrupt reversals, rather than only
 // screenshots after the camera has already settled back onto its circle.
 for(const p of[.1,.9,.2,.95,.4,.75,1,0]){
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y(p));
  const part=await page.evaluate(async()=>{const rows=[];for(let i=0;i<8;i++){await new Promise(r=>setTimeout(r,65));rows.push({...document.querySelector('#scene-readout').dataset})}return rows});
  for(const s of part)if(Math.abs(Number(s.orbitRadius)-radius)>.0001)throw Error(name+' radial pumping '+s.orbitRadius+' vs '+radius);samples.push({requested:p,frames:part});
 }
 await page.screenshot({path:`${dir}/${name}-reverse-return.png`});
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y(1));
 await page.waitForFunction(initial=>{const s=document.querySelector('#scene-readout').dataset;return Number(s.orbitRendered)>.999999&&Math.abs(Number(s.cameraX)-Number(initial.cameraX))<.01&&Math.abs(Number(s.cameraZ)-Number(initial.cameraZ))<.01},initial,{timeout:7000});const completed=await read();
 const sensorY=bounds.science+.08*(bounds.scienceEnd-bounds.science);await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),sensorY);await page.waitForTimeout(2400);const sensor=await read(),expected=width>760?{cameraX:6.45,cameraZ:-12.7,lookY:-.8}:{cameraX:3.65,cameraZ:-11.8,lookY:-2.8};
 for(const[k,v]of Object.entries({...expected,cameraY:-1.45}))if(Math.abs(Number(sensor[k])-v)>.01)throw Error(name+' changed sensor '+k);
 await page.screenshot({path:`${dir}/${name}-sensors.png`});if(errors.length)throw Error(errors.join('\n'));
 results.push({name,captureCadenceFps:4,radius,initial,samples,completed,sensor,errors});await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));await page.locator('#reduce-motion').check();await context.close();console.log(name+' fixed radius '+radius);
}
await browser.close();
