// The page about planetary systems: the chooser and buttons at the top, and the table further down.
// Everything comes from STELSELS in zonnestelsels-data.js.
(function () {
  const kiezer = document.getElementById('kiezer');
  const feiten = document.getElementById('feiten');
  const tijd = document.getElementById('tijd');
  Stelsel.opTijd(t => { tijd.textContent = t; });

  const inZone = s => s.planeten.filter(p => p.a >= s.hz[0] && p.a <= s.hz[1]).map(p => p.n);
  const stats = s => {
    const zone = inZone(s);
    return [
      ['Afstand', s.afstand], ['Ster', s.ster],
      ['Planeten', s.planeten.length], ['Ontdekt', s.ontdekt],
      ['In de leefbare zone', zone.length ? zone.join(', ') : 'geen'],
      ['Snelste jaar', jaar(s.planeten[0].p)],
    ];
  };
  function jaar(d) {
    if (d < 1) return `${Math.round(d * 24)} uur`;
    if (d < 730) return `${d.toLocaleString('nl-NL', { maximumFractionDigits: d < 10 ? 1 : 0 })} dagen`;
    return `${Math.round(d / 365.25)} jaar`;
  }

  function kies(id, vanZelf) {
    const s = STELSELS.find(x => x.id === id);
    if (!s) return;
    Stelsel.toon(id);
    kiezer.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === id));
    feiten.innerHTML = `
      <h2>${s.naam}</h2>
      <p>${s.kort}</p>
      <dl>${stats(s).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      ${s.verre ? `<p class="muted klein">${s.verre}</p>` : ''}`;
    if (!vanZelf) history.replaceState(null, '', '#' + id);
  }

  kiezer.innerHTML = STELSELS.map(s => `<button type="button" data-id="${s.id}">${s.naam}</button>`).join('');
  kiezer.addEventListener('click', e => { const b = e.target.closest('button'); if (b) kies(b.dataset.id); });

  // The switches: compare with our solar system, hear the rhythm, pause
  document.querySelectorAll('.schakel').forEach(b => b.addEventListener('click', () => {
    const aan = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', aan);
    Stelsel[b.dataset.doe](aan);
  }));

  const vanHash = () => STELSELS.find(s => '#' + s.id === location.hash);
  const start = vanHash();
  kies(start ? start.id : 'trappist', true);
  window.addEventListener('hashchange', () => {
    const s = vanHash();
    if (!s) return;
    kies(s.id, true);
    document.querySelector('.planeet-held').scrollIntoView({ behavior: 'smooth' });
  });

  // The table of the eight systems; a click on a row shows that system at the top
  const tabel = document.getElementById('stelsels');
  tabel.innerHTML = `
    <thead><tr><th>Stelsel</th><th>Afstand</th><th>Planeten</th><th>Ster</th><th>Leefbare zone</th></tr></thead>
    <tbody>${STELSELS.map(s => { const z = inZone(s); return `<tr data-id="${s.id}"><td><button type="button" class="link">${s.naam}</button></td><td class="getal" data-kop="Afstand">${s.afstand}</td><td data-kop="Planeten">${s.planeten.length}</td><td data-kop="Ster">${s.ster}</td><td data-kop="Leefbare zone">${z.length ? z.length + ' (' + z.join(', ') + ')' : 'geen'}</td></tr>`; }).join('')}</tbody>`;
  tabel.addEventListener('click', e => {
    const tr = e.target.closest('tr[data-id]');
    if (!tr) return;
    kies(tr.dataset.id);
    document.querySelector('.planeet-held').scrollIntoView({ behavior: 'smooth' });
  });
})();
