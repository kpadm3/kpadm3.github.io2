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

  const isFirst = idx === 0;
  const isLast  = idx === pages.length - 1;

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

  let prevBtn = null, prevLbl = null;
  if (!isFirst) {
    const prev = pages[idx - 1];
    prevBtn = document.createElement('a');
    prevBtn.href = prev;
    prevBtn.className = 'cpn-prev-btn';
    prevBtn.setAttribute('aria-label', 'Previous: ' + labels[idx - 1]);
    prevBtn.setAttribute('title', labels[idx - 1]);
    prevLbl = makeLabel(shortLabels[idx - 1]);
    prevBtn.appendChild(makeIcon('ti-chevron-left'));
    prevBtn.appendChild(prevLbl);
    document.body.appendChild(prevBtn);
  }

  let nextBtn = null, nextLbl = null;
  if (!isLast) {
    const next = pages[idx + 1];
    nextBtn = document.createElement('a');
    nextBtn.href = next;
    nextBtn.className = 'cpn-next-btn';
    nextBtn.setAttribute('aria-label', 'Next: ' + labels[idx + 1]);
    nextBtn.setAttribute('title', labels[idx + 1]);
    nextLbl = makeLabel(shortLabels[idx + 1]);
    nextBtn.appendChild(nextLbl);
    nextBtn.appendChild(makeIcon('ti-chevron-right'));
    document.body.appendChild(nextBtn);
  }

  const closeBtn = document.createElement('a');
  closeBtn.href = '../index.html';
  closeBtn.className = 'cpn-close-btn';
  closeBtn.setAttribute('aria-label', 'Back to home');
  closeBtn.setAttribute('title', 'Back to home');
  closeBtn.appendChild(makeIcon('ti-x'));
  document.body.appendChild(closeBtn);

  // Smooth page fade-in
  const ptOv = document.querySelector('.pt-overlay');
  if (ptOv && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    ptOv.style.transition = 'none';
    ptOv.classList.add('pt-show');
  }

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft'  && prevBtn) window.location.href = prevBtn.href;
    if (e.key === 'ArrowRight' && nextBtn) window.location.href = nextBtn.href;
    if (e.key === 'Escape') window.location.href = '../index.html';
  });

  // Hint: ripple + pill expand — plays on every page load
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (!reduced && (prevBtn || nextBtn)) {
    setTimeout(() => {
      if (prevBtn) prevBtn.classList.add('cpn-pulsing');
      if (nextBtn) nextBtn.classList.add('cpn-pulsing');

      setTimeout(() => {
        if (prevBtn) prevBtn.classList.remove('cpn-pulsing');
        if (nextBtn) nextBtn.classList.remove('cpn-pulsing');

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const hintColor = isLight ? '#0891b2' : '#35d4f1';
        const hintBorder = isLight ? 'rgba(8,145,178,.5)' : 'rgba(53,212,241,.5)';

        if (prevBtn) {
          prevBtn.style.width = '152px';
          prevBtn.style.borderRadius = '26px';
          prevBtn.style.borderColor = hintBorder;
          prevBtn.style.color = hintColor;
          prevBtn.style.justifyContent = 'flex-start';
          prevBtn.style.paddingLeft = '13px';
        }
        if (nextBtn) {
          nextBtn.style.width = '152px';
          nextBtn.style.borderRadius = '26px';
          nextBtn.style.borderColor = hintBorder;
          nextBtn.style.color = hintColor;
          nextBtn.style.justifyContent = 'flex-end';
          nextBtn.style.paddingRight = '13px';
        }

        setTimeout(() => {
          if (prevLbl) { prevLbl.style.maxWidth = '140px'; prevLbl.style.opacity = '1'; }
          if (nextLbl) { nextLbl.style.maxWidth = '140px'; nextLbl.style.opacity = '1'; }
        }, 360);

        setTimeout(() => {
          // Collapse labels first (they still take layout space even at opacity 0)
          if (prevLbl) { prevLbl.style.opacity = '0'; prevLbl.style.maxWidth = '0'; }
          if (nextLbl) { nextLbl.style.opacity = '0'; nextLbl.style.maxWidth = '0'; }

          if (prevBtn) {
            prevBtn.style.width = '52px';
            prevBtn.style.borderRadius = '50%';
            prevBtn.style.borderColor = '';
            prevBtn.style.color = '';
            prevBtn.style.justifyContent = '';
            prevBtn.style.paddingLeft = '';
          }
          if (nextBtn) {
            nextBtn.style.width = '52px';
            nextBtn.style.borderRadius = '50%';
            nextBtn.style.borderColor = '';
            nextBtn.style.color = '';
            nextBtn.style.justifyContent = '';
            nextBtn.style.paddingRight = '';
          }
        }, 2900);

      }, 900);
    }, 600);
  }
})();
