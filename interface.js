(() => {
  const menu=document.getElementById('mobileMenu'), toggle=document.getElementById('hambBtn');
  if(toggle&&menu){new MutationObserver(()=>{toggle.setAttribute('aria-expanded',String(menu.classList.contains('open')));toggle.setAttribute('aria-label',menu.classList.contains('open')?'Fechar menu':'Abrir menu');}).observe(menu,{attributes:true,attributeFilter:['class']});}
  let trigger=null;
  const originalOpen=window.openModal, originalClose=window.closeModal;
  window.openModal=(id)=>{trigger=document.activeElement;originalOpen(id);const modal=document.getElementById('modal-'+id);modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label',modal.querySelector('h2')?.textContent||'Ajuda');modal.querySelector('button')?.focus();};
  window.closeModal=(id)=>{originalClose(id);trigger?.focus();};
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&typeof cmOpen!=='undefined'&&cmOpen){cmToggleChat();document.getElementById('cm-girl-btn').focus();}
    if(e.key!=='Tab')return;
    const modal=document.querySelector('.modal-overlay.open');if(!modal)return;
    const els=[...modal.querySelectorAll('a[href],button,input,[tabindex="0"]')].filter(el=>el.getClientRects().length);
    if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}
    if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}
  });
})();

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  const ease = 'cubic-bezier(.16,1,.3,1)';
  const seen = new WeakSet();
  const observer = new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting || seen.has(entry.target)) continue;
      seen.add(entry.target); observer.unobserve(entry.target);
      if(reduce.matches) continue;
      const parent=entry.target;
      const items=parent.matches('.reveal-stagger')?[...parent.children]:[parent];
      items.forEach((el,i)=>el.animate([
        {opacity:0,transform:'translateY(38px)'},
        {opacity:1,transform:'translateY(0)'}
      ],{duration:1000,delay:Math.min(i,6)*95,easing:ease,fill:'backwards'}));
    }
  },{threshold:.08});
  document.querySelectorAll('section:not(#home) .reveal, .reveal-stagger, .denuncie-images, .trajetoria-item, .gal-grid, .corrida-img-wrap, #doacao .sec-title, .footer-grid').forEach(el=>observer.observe(el));
  const progress=document.createElement('div');progress.className='scroll-progress';document.body.append(progress);
  let queued=false;
  function update(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max>0?scrollY/max:0)+')';queued=false;}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});update();
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const p=document.getElementById(btn.dataset.target);
    if(p&&!reduce.matches)p.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:ease});
  }));
})();

(() => {
  const section=document.getElementById('midia'), group=document.getElementById('midiaTabs');if(!section||!group)return;
  section.classList.add('news-enhanced');group.setAttribute('role','tablist');
  const tabs=[...group.querySelectorAll('.tab-btn')];
  function sync(){tabs.forEach(btn=>{const on=btn.classList.contains('active');btn.setAttribute('role','tab');btn.setAttribute('aria-controls',btn.dataset.target);btn.setAttribute('aria-selected',String(on));btn.tabIndex=on?0:-1;const panel=document.getElementById(btn.dataset.target);panel?.setAttribute('role','tabpanel');});}
  tabs.forEach((btn,i)=>{btn.addEventListener('click',sync);btn.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();tabs[n].click();tabs[n].focus();});});sync();
})();
