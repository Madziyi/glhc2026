import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
const results = [];
for (const [name, width, height] of [['mobile',390,844],['desktop',1440,900]]) {
  for (const [version, port] of [['R5',4333],['R6',4332]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`http://127.0.0.1:${port}/prototype/glhc-002?compare=1`);
    await page.waitForFunction(() => document.documentElement.classList.contains('scene-ready'));
    await page.waitForTimeout(1000);
    const sample = await page.evaluate(() => new Promise(resolve => {
      const intervals = []; let start, previous;
      const tick = time => {
        start ??= time;
        if (previous) intervals.push(time - previous);
        previous = time;
        if (time - start < 15000) requestAnimationFrame(tick);
        else {
          intervals.sort((a,b) => a-b);
          const canvas = document.querySelector('canvas');
          const gl = canvas.getContext('webgl2');
          const debug = gl.getExtension('WEBGL_debug_renderer_info');
          resolve({ frames: intervals.length, median: intervals[Math.floor(intervals.length*.5)],
            p95: intervals[Math.floor(intervals.length*.95)], max: intervals.at(-1),
            renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'unavailable',
            stats: {...document.querySelector('#scene-readout').dataset} });
        }
      };
      requestAnimationFrame(tick);
    }));
    const speedComparison = version === "R6" ? "production intentionally omits the selector" : "R5 reference";
    results.push({ name, version, ...sample, speedComparison, errors });
    await fs.writeFile('uat/glhc002-r6/comparison.json', JSON.stringify(results,null,2));
    await context.close();
  }
}
for (const mode of ['reduce', 'no-js']) {
  const context = await browser.newContext({viewport:{width:390,height:844},
    ...(mode === 'reduce' ? {reducedMotion:'reduce'} : {javaScriptEnabled:false})});
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4332/prototype/glhc-002');
  results.push({ mode, static: await page.locator('html').getAttribute('class'),
    panelsVisible: await page.locator('#panel-one').isVisible() && await page.locator('#panel-two').isVisible() });
  await page.screenshot({path:`uat/glhc002-r6/final/${mode}-initial.png`,fullPage:true});
  await context.close();
}
await browser.close();
await fs.writeFile('uat/glhc002-r6/comparison.json', JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
