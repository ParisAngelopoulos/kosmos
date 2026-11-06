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
  // Links like "bekijk in 3D" further down the page: show that planet at the top
  window.addEventListener('hashchange', () => {
    const w = WERELDEN.find(x => '#' + x.id === location.hash);
    if (!w) return;
    kies(w.id, true);
    document.querySelector('.planeet-held').scrollIntoView({ behavior: 'smooth' });
  });

  // The top 10 of planets most like the Earth, sortable by score or by distance
  const top = document.getElementById('top');
  const getal = (x, d = 1) => x.toLocaleString('nl-NL', { minimumFractionDigits: d, maximumFractionDigits: d });
  function toonTop(op) {
    const lijst = [...VERVANGERS].sort((a, b) => op === 'afstand' ? a.afstand - b.afstand : b.esi - a.esi);
    top.innerHTML = lijst.map(v => `
      <li>
        <div class="top-kop"><h3>${v.naam}</h3><span class="score">${getal(v.esi, 2)}</span></div>
        <div class="balk" aria-hidden="true"><span style="width:${v.esi * 100}%"></span></div>
        <p>${v.tekst}</p>
        <p class="cijfers">${getal(v.afstand, v.afstand < 100 ? 1 : 0)} lichtjaar · een jaar duurt ${getal(v.jaar)} dagen · ${getal(v.grootte, 2)} × de Aarde${v.gemeten ? '' : ' (geschat)'} · ontdekt ${v.ontdekt}</p>
      </li>`).join('');
    document.querySelectorAll('.sorteer button').forEach(b => b.setAttribute('aria-pressed', b.dataset.sort === op));
  }
  document.querySelector('.sorteer').addEventListener('click', e => { const b = e.target.closest('button'); if (b) toonTop(b.dataset.sort); });
  toonTop('esi');
})();
