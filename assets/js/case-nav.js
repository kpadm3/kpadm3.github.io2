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

  const dots = pages.map((_, i) =>
    '<span class="cpn-dot' + (i === idx ? ' active' : '') + '"></span>'
  ).join('');

  const nav = document.createElement('div');
  nav.className = 'case-prog-nav';
  nav.innerHTML =
    '<a href="' + prev + '" class="cpn-side cpn-prev" aria-label="Previous: ' + prevLabel + '">' +
      '<span class="cpn-arr"><i class="ti ti-chevron-left" aria-hidden="true"></i></span>' +
      '<span class="cpn-meta">' +
        '<span class="cpn-dir">Previous</span>' +
        '<span class="cpn-name">' + prevLabel + '</span>' +
      '</span>' +
    '</a>' +
    '<div class="cpn-center">' +
      '<span class="cpn-counter">' + (idx + 1) + ' of ' + pages.length + '</span>' +
      '<div class="cpn-dots">' + dots + '</div>' +
      '<a href="../index.html" class="cpn-home">Back to home</a>' +
    '</div>' +
    '<a href="' + next + '" class="cpn-side cpn-next" aria-label="Next: ' + nextLabel + '">' +
      '<span class="cpn-meta">' +
        '<span class="cpn-dir">Next</span>' +
        '<span class="cpn-name">' + nextLabel + '</span>' +
      '</span>' +
      '<span class="cpn-arr"><i class="ti ti-chevron-right" aria-hidden="true"></i></span>' +
    '</a>';

  document.body.appendChild(nav);

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') window.location.href = prev;
    if (e.key === 'ArrowRight') window.location.href = next;
    if (e.key === 'Escape') window.location.href = '../index.html';
  });
})();
