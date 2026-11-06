// The page about planets: the chooser with six worlds at the top and the table of those worlds.
// Everything comes from WERELDEN in planeten-data.js.
(function () {
  const kiezer = document.getElementById('kiezer');
  const feiten = document.getElementById('feiten');

  const stats = w => [
    ['Soort', w.soort], ['Afstand', w.afstand], ['Een jaar', w.jaar],
    ['Massa', w.massa], ['Temperatuur', w.temp], ['Ontdekt', w.ontdekt],
  ];

  function kies(id, vanZelf) {
    const w = WERELDEN.find(x => x.id === id);
    if (!w) return;
    Planeet.toon(id);
    kiezer.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === id));
    feiten.innerHTML = `
      <h2>${w.naam}</h2>
      <p>${w.kort}</p>
      <dl>${stats(w).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <p class="muted klein">Draait om ${w.ster}. Artistieke weergave: niemand heeft deze planeet van dichtbij gezien.</p>`;
    if (!vanZelf) history.replaceState(null, '', '#' + id);
  }

  kiezer.innerHTML = WERELDEN.map(w => `<button type="button" data-id="${w.id}">${w.naam}</button>`).join('');
  kiezer.addEventListener('click', e => { const b = e.target.closest('button'); if (b) kies(b.dataset.id); });
  const start = WERELDEN.find(w => '#' + w.id === location.hash);
  kies(start ? start.id : 'pegasi', true);

  // The table of the six worlds; a click on a row shows that planet at the top
  const tabel = document.getElementById('werelden');
  tabel.innerHTML = `
    <thead><tr><th>Planeet</th><th>Soort</th><th>Afstand</th><th>Een jaar</th><th>Ontdekt</th></tr></thead>
    <tbody>${WERELDEN.map(w => `<tr data-id="${w.id}"><td><button type="button" class="link">${w.naam}</button></td><td data-kop="Soort">${w.soort}</td><td class="getal" data-kop="Afstand">${w.afstand}</td><td class="getal" data-kop="Een jaar">${w.jaar}</td><td data-kop="Ontdekt">${w.ontdekt}</td></tr>`).join('')}</tbody>`;
  tabel.addEventListener('click', e => {
    const tr = e.target.closest('tr[data-id]');
    if (!tr) return;
    kies(tr.dataset.id);
    document.querySelector('.planeet-held').scrollIntoView({ behavior: 'smooth' });
  });
})();
