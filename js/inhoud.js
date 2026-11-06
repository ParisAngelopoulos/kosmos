// The table of contents next to an article: shows which chapter you are reading
(function () {
  const links = [...document.querySelectorAll('.inhoud a')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
  const seen = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => seen.set(e.target.id, e.isIntersecting));
    const current = [...seen].filter(([, v]) => v).map(([id]) => id)[0];
    if (!current) return;
    links.forEach(a => a.classList.toggle('nu', a === byId[current]));
  }, { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('article section[id]').forEach(s => observer.observe(s));
})();
