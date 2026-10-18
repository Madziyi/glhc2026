(() => {
 const j=document.querySelector('.journey'), w=document.querySelector('.world'), scenes=[...document.querySelectorAll('[data-scene]')], counter=document.querySelector('#scene-number');
 const anchor=document.querySelector('#luma-registration'), url=(window.GLHC_CONFIG?.lumaUrl||'').trim();
 if(/^https:\/\/(?:[a-z0-9-]+\.)*(?:lu\.ma|luma\.com)\//i.test(url)){
   anchor.href=url;anchor.target='_blank';anchor.rel='noopener noreferrer';anchor.removeAttribute('aria-disabled');anchor.textContent='Register on Luma ↗';
 }else{anchor.addEventListener('click',e=>e.preventDefault());}
 const clamp=x=>Math.max(0,Math.min(1,x)), seg=(p,a,b)=>clamp((p-a)/(b-a));let pending=false,active=-1;
 function render(){pending=false;if(!j||!w||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   const p=clamp(-j.getBoundingClientRect().top/Math.max(1,j.offsetHeight-innerHeight)),n=p<.18?0:p<.34?1:p<.52?2:p<.77?3:4;
   w.style.setProperty('--waterline',(107-seg(p,.28,.54)*125)+'%');
   w.style.setProperty('--glider-x',(-145+seg(p,.5,1)*290)+'px');
   w.style.setProperty('--glider-y',(100-seg(p,.5,1)*235)+'px');
   w.style.setProperty('--glider-opacity',seg(p,.48,.65)*(1-seg(p,.92,1)));
   w.style.setProperty('--glider-scale',1.2-seg(p,.55,1)*.68);
   if(n!==active){active=n;scenes.forEach((s,i)=>s.classList.toggle('is-visible',i===n));if(counter)counter.textContent=String(n+1).padStart(2,'0');}
 }
 function update(){if(!pending){pending=true;requestAnimationFrame(render);}}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
 document.querySelector('#dive-cue')?.addEventListener('click',()=>scrollTo({top:j.offsetTop+j.offsetHeight*.22,behavior:'smooth'}));
})();