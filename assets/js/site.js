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
    const duration = 1200;
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

  const metricSection =
    document.querySelector(".metric-strip") ||
    counters[0]?.closest("section");

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

  // Spring-driven magnetic pull: a critically-damped spring chases the
  // pointer target every frame, so the button overshoots slightly and
  // settles instead of snapping linearly to the cursor offset.
  document.querySelectorAll(".magnetic").forEach((button) => {
    if (coarse || reduced) return;

    const spring = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    const stiffness = 0.18;
    const damping = 0.72;
    let raf = null;
    let settled = true;

    const tick = () => {
      const ax = (spring.tx - spring.x) * stiffness;
      const ay = (spring.ty - spring.y) * stiffness;
      spring.vx = (spring.vx + ax) * damping;
      spring.vy = (spring.vy + ay) * damping;
      spring.x += spring.vx;
      spring.y += spring.vy;

      button.style.transform =
        `translate3d(${spring.x.toFixed(2)}px, ${spring.y.toFixed(2)}px, 0) translateY(-2px)`;

      const atRest =
        Math.abs(spring.tx - spring.x) < 0.05 &&
        Math.abs(spring.ty - spring.y) < 0.05 &&
        Math.abs(spring.vx) < 0.02 &&
        Math.abs(spring.vy) < 0.02;

      if (atRest && spring.tx === 0 && spring.ty === 0) {
        settled = true;
        button.style.transform = "";
        raf = null;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (raf === null) {
        settled = false;
        raf = requestAnimationFrame(tick);
      }
    };

    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      spring.tx = (event.clientX - rect.left - rect.width / 2) * 0.35;
      spring.ty = (event.clientY - rect.top - rect.height / 2) * 0.4;
      ensureRunning();
    });

    button.addEventListener("pointerleave", () => {
      spring.tx = 0;
      spring.ty = 0;
      ensureRunning();
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

  const applyFilter = (group) => {
    technologyCards.forEach(card => {
      card.hidden = group !== "all" && card.dataset.group !== group;
    });
  };

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const group = button.dataset.logoFilter;
      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      // View Transitions morph the grid (cards resize/reflow/fade) instead
      // of an instant show/hide, so switching categories reads as one
      // continuous layout change rather than a jump cut.
      if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.startViewTransition(() => applyFilter(group));
      } else {
        applyFilter(group);
      }
    });
  });

  document.querySelectorAll(".solution-card-v3,.technology-card-v3").forEach(card => {
    card.classList.add("visible");
  });
})();

// Headline word reveal: the emphasized line splits into words that rise
// from a soft blur into sharp focus, staggered left to right. Pure CSS
// animation with no JS-driven trigger (no IntersectionObserver, no
// requestAnimationFrame, nothing that can silently fail to fire) — the
// browser runs the keyframe animation unconditionally as soon as each
// span exists, so there is no failure mode that leaves it stuck invisible.
(() => {
  "use strict";

  const target = document.querySelector(".gradient-text");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!target || reduced) return;

  const words = target.textContent.trim().split(/\s+/);
  target.textContent = "";
  target.setAttribute("aria-label", words.join(" "));

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "word-reveal";
    span.style.animationDelay = `${index * 80}ms`;
    span.textContent = word;
    target.appendChild(span);
    target.appendChild(document.createTextNode(index < words.length - 1 ? " " : ""));
  });
})();

// Scroll-linked parallax depth: the two ambient glow layers drift at
// different fractions of scroll speed, so the page reads as several
// planes moving at different rates instead of one flat sheet. Uses the
// standalone `translate` CSS property so it composes with (rather than
// overwrites) each layer's existing drift/breathe keyframe animation.
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const layers = [
    { el: document.querySelector(".ambient-a"), factor: 0.10 },
    { el: document.querySelector(".ambient-b"), factor: -0.06 }
  ].filter((layer) => layer.el);

  if (!layers.length || reduced) return;

  let ticking = false;

  const apply = () => {
    ticking = false;
    layers.forEach(({ el, factor }) => {
      el.style.translate = `0 ${(scrollY * factor).toFixed(1)}px`;
    });
  };

  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  }, { passive: true });
})();
