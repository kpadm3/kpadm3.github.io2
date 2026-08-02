(() => {
  "use strict";
  const all=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const header=document.querySelector('[data-header]');
  const progress=document.querySelector('[data-progress]');
  const coarse=matchMedia('(pointer:coarse)').matches;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;

  const onScroll=()=>{
    header?.classList.toggle('is-scrolled',scrollY>8);
    const available=document.documentElement.scrollHeight-innerHeight;
    if(progress) progress.style.width=`${available>0?Math.min(100,Math.max(0,scrollY/available*100)):0}%`;
  };
  onScroll();
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll);

  all('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  document.querySelector('[data-theme-toggle]')?.addEventListener('click',()=>document.body.classList.toggle('high-contrast'));

  const revealItems=all('.reveal');
  if(!reduced && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
    revealItems.forEach((item,index)=>{item.style.setProperty('--delay',`${Math.min(index*34,200)}ms`);observer.observe(item)});
  }else revealItems.forEach(item=>item.classList.add('visible'));

  const cards=all('.interactive');
  cards.forEach(card=>{
    if(!coarse){
      card.addEventListener('pointermove',event=>{
        const rect=card.getBoundingClientRect();
        const x=event.clientX-rect.left;
        const y=event.clientY-rect.top;
        card.style.setProperty('--mx',`${x}px`);
        card.style.setProperty('--my',`${y}px`);
        if(card.hasAttribute('data-tilt')){
          const rx=((y/rect.height)-.5)*-4;
          const ry=((x/rect.width)-.5)*5;
          card.style.transform=`perspective(850px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
        }
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    }
    card.addEventListener('click',event=>{
      if(event.target.closest('a,button'))return;
      card.classList.toggle('is-active');
    });
  });

  all('[data-counter]').forEach(counter=>{
    const target=Number(counter.dataset.counter||0);
    const suffix=counter.dataset.suffix||'';
    if(reduced){counter.textContent=`${target}${suffix}`;return}
    const observer=new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting)return;
      const start=performance.now();
      const duration=900;
      const tick=now=>{
        const p=Math.min(1,(now-start)/duration);
        const eased=1-Math.pow(1-p,3);
        counter.textContent=`${Math.round(target*eased)}${suffix}`;
        if(p<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    },{threshold:.65});
    observer.observe(counter);
  });

  const stage=document.querySelector('[data-parallax]');
  if(stage && !coarse && !reduced){
    stage.addEventListener('pointermove',event=>{
      const rect=stage.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      stage.style.transform=`translate3d(${x*10}px,${y*8}px,0)`;
    });
    stage.addEventListener('pointerleave',()=>stage.style.transform='');
  }
})();

// Phase 1 — Hero Sprint interactions
(() => {
  "use strict";

  const hero = document.querySelector("[data-hero]");
  const stage = document.querySelector("[data-parallax]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (hero && stage && !reduced && !coarse) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      stage.style.setProperty("--hero-x", x.toFixed(3));
      stage.style.setProperty("--hero-y", y.toFixed(3));
      stage.style.transform =
        `translate3d(${x * 14}px, ${y * 10}px, 0) rotateX(${y * -1.8}deg) rotateY(${x * 2.2}deg)`;
    });

    hero.addEventListener("pointerleave", () => {
      stage.style.transform = "";
    });
  }

  document.querySelectorAll(".magnetic").forEach((button) => {
    if (coarse || reduced) return;

    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform =
        `translate3d(${x * 0.05}px, ${y * 0.07}px, 0) translateY(-2px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
})();

