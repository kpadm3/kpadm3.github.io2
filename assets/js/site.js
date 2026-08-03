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

  // Reliable animated counters.
  // Starts once when the metric area enters the viewport and has a timed fallback.
  const counters = all("[data-counter]");
  let countersStarted = false;

  const animateCounter = (counter) => {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const target = Number(counter.dataset.counter || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 2400;
    const startTime = performance.now();

    counter.textContent = `0${suffix}`;

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(target * eased);

      counter.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  const startCounters = () => {
    if (countersStarted || counters.length === 0) return;
    countersStarted = true;
    counters.forEach(animateCounter);
  };

  const metricSection = counters[0]?.closest("section") || document.querySelector(".hero");

  if (metricSection && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      startCounters();
      counterObserver.disconnect();
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -5% 0px"
    });

    counterObserver.observe(metricSection);
  } else {
    startCounters();
  }

  // Fallback for browser caching, unusual viewport sizes, or observer delays.
  window.setTimeout(startCounters, 900);

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

// Phase 2 — Technology and solution interactions
(() => {
  "use strict";

  const cards = Array.from(
    document.querySelectorAll(".technology-card, .solution-card-v2")
  );
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  cards.forEach((card) => {
    if (!coarse && !reduced) {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      });
    }

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      card.classList.toggle("is-active");
    });
  });

  const filterButtons = Array.from(
    document.querySelectorAll("[data-tech-filter]")
  );
  const technologyCards = Array.from(
    document.querySelectorAll(".technology-card")
  );

  const categories = [
    "enterprise", "enterprise", "delivery", "enterprise", "delivery", "enterprise",
    "analysis", "analysis", "analysis", "integration", "integration", "integration",
    "delivery", "delivery", "delivery", "ai", "ai", "ai"
  ];

  technologyCards.forEach((card, index) => {
    card.dataset.group = categories[index] || "all";
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.techFilter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      technologyCards.forEach((card) => {
        const visible = group === "all" || card.dataset.group === group;
        card.hidden = !visible;
      });
    });
  });
})();



// Phase 2 fixed interactions
(() => {
  "use strict";
  const cards = Array.from(document.querySelectorAll(".technology-card-v3,.solution-card-v3"));
  const coarse = matchMedia("(pointer:coarse)").matches;
  cards.forEach(card => {
    if(!coarse){
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX-r.left}px`);
        card.style.setProperty("--my", `${e.clientY-r.top}px`);
      });
    }
    card.addEventListener("click", e => {
      if(e.target.closest("a,button")) return;
      card.classList.toggle("is-active");
    });
  });

  const filterButtons = Array.from(document.querySelectorAll("[data-logo-filter]"));
  const technologyCards = Array.from(document.querySelectorAll(".technology-card-v3"));
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const group = button.dataset.logoFilter;
      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      technologyCards.forEach(card => {
        card.hidden = group !== "all" && card.dataset.group !== group;
      });
    });
  });

  document.querySelectorAll(".solution-card-v3,.technology-card-v3").forEach(card => {
    card.classList.add("visible");
  });
})();

// V3 Build 02 — subtle section depth and active solution feedback
(() => {
  "use strict";

  const solutionCards = [...document.querySelectorAll(".solution-card-v3")];

  solutionCards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
      solutionCards.forEach((item) => {
        if (item !== card) item.style.opacity = "0.76";
      });
    });

    card.addEventListener("pointerleave", () => {
      solutionCards.forEach((item) => {
        item.style.opacity = "";
      });
    });
  });
})();

// Custom cursor with lagging ring
(() => {
  if (matchMedia('(pointer:coarse)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cr-dot';
  const ring = document.createElement('div');
  ring.className = 'cr-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    document.body.classList.add('cr-active');
  });

  document.addEventListener('pointerleave', () => document.body.classList.remove('cr-active'));

  (function loop() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('pointerover', e => {
    ring.classList.toggle('cr-hover', !!e.target.closest('a,button,.solution-card-v3,.effect-card,.interactive'));
  });
})();

// Page fade transitions
(() => {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const ov = document.createElement('div');
  ov.className = 'pt-overlay';
  document.body.prepend(ov);

  const reveal = () => { ov.style.transition = 'opacity .38s ease'; ov.classList.remove('pt-show'); };
  requestAnimationFrame(() => requestAnimationFrame(reveal));
  window.addEventListener('pageshow', reveal);

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
    e.preventDefault();
    ov.style.transition = 'opacity .28s ease';
    ov.classList.add('pt-show');
    setTimeout(() => { window.location.href = href; }, 300);
  });
})();

