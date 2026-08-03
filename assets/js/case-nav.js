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

  const nav = document.createElement('div');
  nav.className = 'case-prog-nav';
  nav.innerHTML =
    '<a href="' + prev + '" class="cpn-btn" aria-label="Previous: ' + prevLabel + '" title="' + prevLabel + '">' +
      '<i class="ti ti-chevron-left" aria-hidden="true"></i>' +
    '</a>' +
    '<div class="cpn-info">' +
      '<span class="cpn-num">' + (idx + 1) + ' of ' + pages.length + '</span>' +
      '<span class="cpn-label">' + labels[idx] + '</span>' +
    '</div>' +
    '<div class="cpn-divider" aria-hidden="true"></div>' +
    '<a href="../index.html" class="cpn-btn" aria-label="Back to home">' +
      '<i class="ti ti-x" aria-hidden="true"></i>' +
    '</a>' +
    '<div class="cpn-divider" aria-hidden="true"></div>' +
    '<a href="' + next + '" class="cpn-btn" aria-label="Next: ' + nextLabel + '" title="' + nextLabel + '">' +
      '<i class="ti ti-chevron-right" aria-hidden="true"></i>' +
    '</a>';

  document.body.appendChild(nav);

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') window.location.href = prev;
    if (e.key === 'ArrowRight') window.location.href = next;
    if (e.key === 'Escape') window.location.href = '../index.html';
  });
})();
