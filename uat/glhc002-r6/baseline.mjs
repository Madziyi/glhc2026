import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
for (const [name,width,height] of [['mobile',390,844],['desktop',1440,900]]) {
 const context=await browser.newContext({viewport:{width,height},recordVideo:{dir:'uat/glhc002-r6',size:{width,height}}});
 const page=await context.newPage();
 await page.goto((process.env.R5_URL || 'http://127.0.0.1:4333')+'/prototype/glhc-002');
 await page.waitForFunction(()=>document.documentElement.classList.contains('scene-ready'));
 await page.waitForTimeout(15000);
 await page.screenshot({path:`uat/glhc002-r6/r5-${name}-surface.png`});
 const video=page.video(); await context.close(); await video.saveAs(`uat/glhc002-r6/r5-${name}.webm`);
}
await browser.close();
