import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
const dir = 'uat/glhc003/buoy-details', results = [];
await fs.mkdir(dir, { recursive: true });
for (const [name, width, height] of (process.argv.includes('--prototype') ? [] : [['narrow',320,650],['mobile',390,844],['tablet',768,1024],['desktop',1440,900]])) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  // Capture-only cadence cap for the software renderer; not performance evidence.
  await page.addInitScript(() => {
    window.requestAnimationFrame = fn => setTimeout(() => fn(performance.now()), 250);
    window.cancelAnimationFrame = clearTimeout;
  });
  await page.goto('http://127.0.0.1:4334');
  await page.waitForFunction(() => document.documentElement.classList.contains('scene-ready'), { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  const bounds = await page.evaluate(() => {
    const top = id => document.getElementById(id).getBoundingClientRect().top + scrollY;
    return { surface: top('surface'), crossing: top('crossing'), science: top('science'), scienceEnd: top('science') + document.getElementById('science').offsetHeight - innerHeight };
  });
  const invSmooth = v => { let a=0,b=1; for(let i=0;i<30;i++){const x=(a+b)/2;if(x*x*(3-2*x)<v)a=x;else b=x;}return(a+b)/2; };
  const states = [];
  const sample = async (label, y) => {
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(1500);
    const stats = await page.locator('#scene-readout').evaluate(e => ({ ...e.dataset, overflow: document.documentElement.scrollWidth > innerWidth }));
    if (stats.overflow) throw Error(name + ' overflow');
    await page.screenshot({ path: `${dir}/${name}-${label}.png` });
    states.push({label, ...stats});
  };
  for (const p of [0,.25,.75]) await sample('turn-'+p, bounds.surface+(bounds.crossing-bounds.surface)*(.22+.72*invSmooth(p)));
  await sample('sensors', bounds.science+.08*(bounds.scienceEnd-bounds.science));
  const sensor = states.at(-1), expected = width > 760 ? {cameraX:6.45,cameraZ:-12.7,targetY:-.8} : {cameraX:3.65,cameraZ:-11.8,targetY:-2.8};
  for (const [key,value] of Object.entries({...expected,cameraY:-1.45})) if (Math.abs(Number(sensor[key])-value)>.03) throw Error(name+' camera changed: '+key);
  if (errors.length) throw Error(errors.join('\n'));
  results.push({name,width,height,captureCadenceFps:4,states,errors});
  await fs.writeFile(`${dir}/results.json`, JSON.stringify(results,null,2));
  await page.locator('#reduce-motion').check();
  await context.close();
  console.log(name, JSON.stringify(sensor));
}
// Shared asset must also load through the isolated prototype route.
const context = await browser.newContext(), page = await context.newPage();
await page.addInitScript(() => {
  window.requestAnimationFrame = fn => setTimeout(() => fn(performance.now()), 250);
  window.cancelAnimationFrame = clearTimeout;
});
await page.goto('http://127.0.0.1:4334/prototype/glhc-002');
await page.waitForFunction(() => Number(document.querySelector('#scene-readout')?.dataset.triangles) > 0 && Number(document.querySelector('#scene-readout')?.dataset.modelLoadMs) > 0, { timeout: 30000 });
await fs.writeFile(`${dir}/prototype.json`, JSON.stringify(await page.locator('#scene-readout').evaluate(e => ({...e.dataset})), null, 2));
await page.locator('#reduce-motion').check();
await context.close();
await browser.close();
