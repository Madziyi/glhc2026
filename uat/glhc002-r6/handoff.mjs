import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const dir='uat/glhc002-r6/handoff'; await fs.mkdir(dir,{recursive:true});
const results=[];
setTimeout(()=>{console.error('Capture exceeded 240 seconds; partial artifacts preserved.');process.exit(2)},240000).unref();
for(const [name,width,height] of [['mobile',390,844],['desktop',1440,900],['narrow',320,650],['tablet',768,1024]]){
  console.log('Starting',name);
  const record=['mobile','desktop'].includes(name);
  const context=await browser.newContext({viewport:{width,height},...(record?{recordVideo:{dir,size:{width,height}}}:{})});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errors.push(m.text())});
  await page.goto('http://127.0.0.1:4332/prototype/glhc-002');
  await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'));
  console.log('Ready',name);
  await page.waitForTimeout(record?15000:1000);
  await page.screenshot({path:`${dir}/${name}-surface.png`});
  results.push({name,width,height,errors,stats:await page.evaluate(()=>({...document.querySelector('#scene-readout').dataset}))});
  for(const [state,progress] of [['crossing',.335],['sensors',.46]]){
    await page.evaluate(p=>{const track=document.querySelector('#buoy-story'),stage=document.querySelector('#stage');scrollTo({top:p*(track.offsetHeight-stage.offsetHeight),behavior:'instant'})},progress);
    await page.waitForTimeout(800);
    await page.screenshot({path:`${dir}/${name}-${state}.png`});
  }
  await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));
  const video=page.video();
  // Stop GPU work before finalizing the video.
  await page.evaluate(()=>document.querySelector('#reduce-motion').click());
  await page.close();
  await context.close();
  console.log('Closed',name);
  if(video) await video.saveAs(`${dir}/${name}-surface.webm`);
  await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));
}
// Test the development-only shared speed control independently of production.
const page=await browser.newPage();
await page.goto('http://127.0.0.1:4330/prototype/glhc-002?compare=1');
await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'));
const speeds=[];
for(const speed of ['1','1.25']){
  await page.getByLabel('Water and buoy motion speed').selectOption(speed);
  await page.waitForTimeout(500);
  speeds.push(await page.locator('#scene-readout').getAttribute('data-motion-speed'));
}
results.push({developmentSpeedControl:speeds});
await browser.close();await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
