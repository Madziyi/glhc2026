from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',8767),partial(SimpleHTTPRequestHandler,directory=str(root/'public')))
Thread(target=server.serve_forever,daemon=True).start()
out=root/'uat';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name,w,h in [('mobile',390,844),('smallmobile',320,650),('desktop',1440,900)]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda exc: errors.append(str(exc)))
  page.goto((root/'public/index.html').as_uri(),wait_until='load')
  page.wait_for_timeout(500)
  page.screenshot(path=str(out/f'{name}-surface.png'))
  for frac,suffix in [(0.42,'waterline'),(.72,'underwater')]:
   page.evaluate('(fraction)=>{let j=document.querySelector(".journey"); window.scrollTo(0,j.offsetHeight* fraction)}',frac)
   page.wait_for_timeout(420)
   page.screenshot(path=str(out/f'{name}-{suffix}.png'))
  page.locator('#register').scroll_into_view_if_needed()
  page.screenshot(path=str(out/f'{name}-register.png'))
  states=page.evaluate('''() => ({registrDisabled:document.getElementById('luma-registration').getAttribute('aria-disabled'), horizOverflow:document.documentElement.scrollWidth>innerWidth, scenes:document.querySelectorAll('[data-scene]').length})''')
  print(name,states,'errors',errors)
  page.close()
 browser.close()
server.shutdown()
