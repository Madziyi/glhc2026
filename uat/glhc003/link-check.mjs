import { createRequire } from 'node:module';import fs from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage();
await page.goto('http://127.0.0.1:4334');const results=[];
for(let i=0;i<await page.locator('[data-register]').count();i++){
 const link=page.locator('[data-register]').nth(i),properties=await link.evaluate(e=>({href:e.href,target:e.target,rel:e.rel,label:e.textContent.trim()}));
 const promise=context.waitForEvent('page',{timeout:60000});await link.click({timeout:15000});const popup=await promise;
 let loadError=null;await popup.waitForLoadState('domcontentloaded',{timeout:20000}).catch(e=>loadError=e.message);
 const result={index:i,...properties,url:popup.url(),title:await popup.title().catch(()=>null),opener:await popup.evaluate(()=>!!window.opener).catch(()=>null),loadError};
 results.push(result);if(i===0)await popup.screenshot({path:'uat/glhc003/luma-destination.png',timeout:30000}).catch(()=>{});await popup.close();
}
await fs.writeFile('uat/glhc003/registration-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();
