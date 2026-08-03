(() => {
  "use strict";
  const all = (s, c = document) => Array.from(c.querySelectorAll(s));
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-progress]');
  const coarse = matchMedia('(pointer:coarse)').matches;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;

  const onScroll = () => {
    header?.classList.toggle('is-scrolled', scrollY > 8);
    const available = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${available > 0 ? Math.min(100, Math.max(0, scrollY / available * 100)) : 0}%`;
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  const revealItems = all('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }), { threshold: .08, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach((item, index) => { item.style.setProperty('--delay', `${Math.min(index * 34, 200)}ms`); observer.observe(item); });
  } else revealItems.forEach(item => item.classList.add('visible'));

  const cards = all('.interactive');
  cards.forEach(card => {
    if (!coarse) {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        if (card.hasAttribute('data-tilt')) {
          const rx = ((y / rect.height) - .5) * -4;
          const ry = ((x / rect.width) - .5) * 5;
          card.style.transform = `perspective(850px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
        }
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    }
    card.addEventListener('click', event => {
      if (event.target.closest('a,button')) return;
      card.classList.toggle('is-active');
    });
  });
})();

// Magnetic buttons
(() => {
  const coarse = matchMedia('(pointer:coarse)').matches;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (coarse || reduced) return;
  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate3d(${x * 0.05}px, ${y * 0.07}px, 0) translateY(-2px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
})();

// Solution card interactions
(() => {
  "use strict";
  const cards = Array.from(document.querySelectorAll('.solution-card-v3'));
  const coarse = matchMedia('(pointer:coarse)').matches;
  cards.forEach(card => {
    if (!coarse) {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    }
    card.addEventListener('click', e => {
      if (e.target.closest('a,button')) return;
      card.classList.toggle('is-active');
    });
  });

  cards.forEach(card => card.classList.add('visible'));

  const solutionCards = [...document.querySelectorAll('.solution-card-v3')];
  solutionCards.forEach(card => {
    card.addEventListener('pointerenter', () => {
      solutionCards.forEach(item => { if (item !== card) item.style.opacity = '0.76'; });
    });
    card.addEventListener('pointerleave', () => {
      solutionCards.forEach(item => { item.style.opacity = ''; });
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
