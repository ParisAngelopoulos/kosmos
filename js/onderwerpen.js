// The topics of Kosmos. A new topic: add it here and give it its own folder with an index.html,
// like zwarte-gaten/. Topics without "klaar" are shown as "binnenkort".
const ONDERWERPEN = [
  { slug: 'zwarte-gaten', naam: 'Zwarte gaten', kort: 'Waar zelfs licht niet meer uit kan ontsnappen', klaar: true },
  { slug: 'planeten', naam: 'Planeten', kort: 'Werelden bij andere sterren, van lavaoceanen tot een tweede Aarde', klaar: true },
  { slug: 'zonnestelsels', naam: 'Zonnestelsels', kort: 'Andere sterren met hun planeten, in beweging', klaar: true },
];

// The menu at the top of every page; `data-root` on <body> is the way back to the home page
(function () {
  const nav = document.getElementById('onderwerpen');
  if (!nav) return;
  const root = document.body.dataset.root || '';
  const here = document.body.dataset.onderwerp;
  nav.innerHTML = ONDERWERPEN.map(o => (o.klaar
    ? `<a href="${root}${o.slug}/"${o.slug === here ? ' aria-current="page"' : ''}>${o.naam}</a>`
    : `<span class="binnenkort" title="Binnenkort">${o.naam}</span>`)).join('');
})();
