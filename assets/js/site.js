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

// Theme toggle
(() => {
  const THEME_KEY = 'kp-theme';
  const root = document.documentElement;
  const host = document.querySelector('.theme-header-host');
  if (!host) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nav-soc-btn theme-toggle-btn';
  button.innerHTML = '<i class="ti ti-sun" aria-hidden="true"></i>';
  host.appendChild(button);

  function isVisuallyLight() {
    const explicit = root.getAttribute('data-theme');
    if (explicit === 'light') return true;
    if (explicit === 'dark') return false;
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function updateButton() {
    const light = isVisuallyLight();
    button.querySelector('i').className = light ? 'ti ti-moon-stars' : 'ti ti-sun';
    button.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = light ? '#f0f5fb' : '#050b14';
  }

  button.addEventListener('click', () => {
    const next = isVisuallyLight() ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateButton();
  });

  updateButton();
})();
