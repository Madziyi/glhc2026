import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
const results=[],dir='uat/glhc003/submission-ctas';await fs.mkdir(dir,{recursive:true});
for(const [width,height] of [[320,568],[1440,900]]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:4337');await page.waitForFunction(()=>document.querySelector('#intro-preloader').hidden);
 const triggers=page.locator('[data-submission-trigger]');assert.equal(await triggers.count(),3);
 for(let i=0;i<3;i++){
  const trigger=triggers.nth(i);await trigger.click();
  assert.equal(await page.locator('#submission-dialog').evaluate(e=>e.open),true);
  assert.equal(await trigger.getAttribute('aria-controls'),'submission-dialog');
  await page.keyboard.press('Escape');assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
 }
 assert.match(await page.locator('.header-register').textContent(),/^Submit An Idea/);
 assert.match(await page.locator('.registration .button').textContent(),/^Submit An Idea/);
 assert.equal(await page.locator('#info-session-options').isVisible(),false);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('.header-register').click();await page.screenshot({path:`${dir}/${width}-modal.png`});
 await page.locator('[data-submission-close]').click();assert.equal(await page.locator('.header-register').evaluate(e=>e===document.activeElement),true);
 assert.equal(errors.length,0);results.push({width,height,threeTriggersOpenSharedModal:true,focusReturnsToEachOpener:true,errors});await context.close();
}
const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:568}}),page=await context.newPage();await page.goto('http://127.0.0.1:4337');
assert.equal(await page.locator('.submission-fallback').isVisible(),true);
assert.deepEqual(await page.locator('[data-submission-trigger]').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),Array(3).fill('#submission-options'));
await page.locator('.header-register').click();assert.equal(new URL(page.url()).hash,'#submission-options');
results.push({noJS:'all three links target visible submission instructions'});
await context.close();await browser.close();await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));console.log('Submission CTA browser checks passed');
