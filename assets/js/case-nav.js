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

  const current = window.location.pathname.split('/').pop();
  const idx = pages.indexOf(current);
  if (idx === -1) return;

  const prev = pages[(idx - 1 + pages.length) % pages.length];
  const next = pages[(idx + 1) % pages.length];
  const prevLabel = labels[(idx - 1 + pages.length) % pages.length];
  const nextLabel = labels[(idx + 1) % pages.length];

  const prevBtn = document.createElement('a');
  prevBtn.href = prev;
  prevBtn.className = 'cpn-prev-btn';
  prevBtn.setAttribute('aria-label', 'Previous: ' + prevLabel);
  prevBtn.setAttribute('title', prevLabel);
  prevBtn.innerHTML = '<i class="ti ti-chevron-left" aria-hidden="true"></i>';

  const nextBtn = document.createElement('a');
  nextBtn.href = next;
  nextBtn.className = 'cpn-next-btn';
  nextBtn.setAttribute('aria-label', 'Next: ' + nextLabel);
  nextBtn.setAttribute('title', nextLabel);
  nextBtn.innerHTML = '<i class="ti ti-chevron-right" aria-hidden="true"></i>';

  const closeBtn = document.createElement('a');
  closeBtn.href = '../index.html';
  closeBtn.className = 'cpn-close-btn';
  closeBtn.setAttribute('aria-label', 'Back to home');
  closeBtn.setAttribute('title', 'Back to home');
  closeBtn.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';

  document.body.appendChild(prevBtn);
  document.body.appendChild(nextBtn);
  document.body.appendChild(closeBtn);

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') window.location.href = prev;
    if (e.key === 'ArrowRight') window.location.href = next;
    if (e.key === 'Escape') window.location.href = '../index.html';
  });
})();
