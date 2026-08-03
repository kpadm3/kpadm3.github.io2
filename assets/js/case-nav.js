(() => {
  const pages = [
    'enterprise-product-configuration.html',
    'product-data-integration.html',
    'requirements-to-release.html',
    'automated-business-reporting.html',
    'technical-issue-analysis.html',
    'enterprise-data-migration.html'
  ];

  const labels = [
    'Enterprise Configuration',
    'Data Integration',
    'Requirements to Release',
    'Business Reporting',
    'Issue Analysis',
    'Data Migration'
  ];

  const shortLabels = [
    'Enterprise Config',
    'Data Integration',
    'Req. to Release',
    'Business Reporting',
    'Issue Analysis',
    'Data Migration'
  ];

  const current = window.location.pathname.split('/').pop();
  const idx = pages.indexOf(current);
  if (idx === -1) return;

  const prev = pages[(idx - 1 + pages.length) % pages.length];
  const next = pages[(idx + 1) % pages.length];
  const prevLabel = labels[(idx - 1 + pages.length) % pages.length];
  const nextLabel = labels[(idx + 1) % pages.length];
  const prevShort = shortLabels[(idx - 1 + pages.length) % pages.length];
  const nextShort = shortLabels[(idx + 1) % pages.length];

  function makeIcon(cls) {
    const i = document.createElement('i');
    i.className = 'ti ' + cls;
    i.setAttribute('aria-hidden', 'true');
    i.style.flexShrink = '0';
    return i;
  }

  function makeLabel(text) {
    const s = document.createElement('span');
    s.className = 'cpn-hint-lbl';
    s.textContent = text;
    return s;
  }

  const prevBtn = document.createElement('a');
  prevBtn.href = prev;
  prevBtn.className = 'cpn-prev-btn';
  prevBtn.setAttribute('aria-label', 'Previous: ' + prevLabel);
  prevBtn.setAttribute('title', prevLabel);
  const prevLbl = makeLabel(prevShort);
  prevBtn.appendChild(makeIcon('ti-chevron-left'));
  prevBtn.appendChild(prevLbl);

  const nextBtn = document.createElement('a');
  nextBtn.href = next;
  nextBtn.className = 'cpn-next-btn';
  nextBtn.setAttribute('aria-label', 'Next: ' + nextLabel);
  nextBtn.setAttribute('title', nextLabel);
  const nextLbl = makeLabel(nextShort);
  nextBtn.appendChild(nextLbl);
  nextBtn.appendChild(makeIcon('ti-chevron-right'));

  const closeBtn = document.createElement('a');
  closeBtn.href = '../index.html';
  closeBtn.className = 'cpn-close-btn';
  closeBtn.setAttribute('aria-label', 'Back to home');
  closeBtn.setAttribute('title', 'Back to home');
  closeBtn.appendChild(makeIcon('ti-x'));

  document.body.appendChild(prevBtn);
  document.body.appendChild(nextBtn);
  document.body.appendChild(closeBtn);

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') window.location.href = prev;
    if (e.key === 'ArrowRight') window.location.href = next;
    if (e.key === 'Escape') window.location.href = '../index.html';
  });

  if (!sessionStorage.getItem('cpn-hint')) {
    sessionStorage.setItem('cpn-hint', '1');

    setTimeout(() => {
      // Phase 1: ripple pulse on both circles
      prevBtn.classList.add('cpn-pulsing');
      nextBtn.classList.add('cpn-pulsing');

      setTimeout(() => {
        // Phase 2: stop ripple, expand into pills
        prevBtn.classList.remove('cpn-pulsing');
        nextBtn.classList.remove('cpn-pulsing');

        prevBtn.style.width = '152px';
        prevBtn.style.borderRadius = '26px';
        prevBtn.style.borderColor = 'rgba(53,212,241,.5)';
        prevBtn.style.color = '#35d4f1';
        prevBtn.style.justifyContent = 'flex-start';
        prevBtn.style.paddingLeft = '13px';

        nextBtn.style.width = '152px';
        nextBtn.style.borderRadius = '26px';
        nextBtn.style.borderColor = 'rgba(53,212,241,.5)';
        nextBtn.style.color = '#35d4f1';
        nextBtn.style.justifyContent = 'flex-end';
        nextBtn.style.paddingRight = '13px';

        // Fade labels in after the pill has expanded
        setTimeout(() => {
          prevLbl.style.opacity = '1';
          nextLbl.style.opacity = '1';
        }, 360);

        // Phase 3: retract back to circles
        setTimeout(() => {
          prevLbl.style.opacity = '0';
          nextLbl.style.opacity = '0';

          prevBtn.style.width = '52px';
          prevBtn.style.borderRadius = '50%';
          prevBtn.style.borderColor = '';
          prevBtn.style.color = '';
          prevBtn.style.justifyContent = '';
          prevBtn.style.paddingLeft = '';

          nextBtn.style.width = '52px';
          nextBtn.style.borderRadius = '50%';
          nextBtn.style.borderColor = '';
          nextBtn.style.color = '';
          nextBtn.style.justifyContent = '';
          nextBtn.style.paddingRight = '';
        }, 2900);

      }, 900);

    }, 500);
  }
})();
