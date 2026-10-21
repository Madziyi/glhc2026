import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
setTimeout(()=>{console.error('Still capture timed out; saved artifacts preserved');process.exit(2)},120000).unref();
const page=await browser.newPage({viewport:{width:320,height:650}});
const results=[],errors=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://127.0.0.1:4332/prototype/glhc-002');
await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'));
for(const [name,width,height] of [['narrow',320,650],['tablet',768,1024]]){
  await page.setViewportSize({width,height});
  for(const [state,p] of [['surface',0],['crossing',.335],['sensors',.46]]){
    await page.evaluate(p=>{const t=document.querySelector('#buoy-story'),s=document.querySelector('#stage');scrollTo({top:p*(t.offsetHeight-s.offsetHeight),behavior:'instant'})},p);
    await page.waitForTimeout(800);
    await page.screenshot({path:`uat/glhc002-r6/handoff/${name}-${state}.png`});
    results.push({name,state,...await page.evaluate(()=>({width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,stats:{...document.querySelector('#scene-readout').dataset}}))});
    await fs.writeFile('uat/glhc002-r6/handoff/stills.json',JSON.stringify({results,errors},null,2));
  }
}
try{
  await page.goto('http://127.0.0.1:4330/prototype/glhc-002?compare=1');
  await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'),{timeout:15000});
  const speeds=[];
  for(const speed of ['1','1.25']){
    await page.getByLabel('Water and buoy motion speed').selectOption(speed);
    await page.waitForTimeout(500);
    speeds.push(await page.evaluate(()=>document.querySelector('#scene-readout').dataset.motionSpeed));
  }
  results.push({developmentSpeedControl:speeds});
}catch(error){results.push({developmentControlLimitation:String(error)})}
await fs.writeFile('uat/glhc002-r6/handoff/stills.json',JSON.stringify({results,errors},null,2));
await browser.close();
console.log(JSON.stringify({results,errors},null,2));
