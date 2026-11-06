// The page about black holes: the size calculator

// ---------- How big would it be as a black hole? ----------
// The Schwarzschild radius: r = 2GM / c². For the mass of the Sun that is about 2.95 km.
(function () {
  const form = document.getElementById('reken');
  if (!form) return;
  const G = 6.674e-11, C = 299792458, ZON = 1.989e30, AARDE = 5.972e24;
  const VOORBEELDEN = {
    mens: { massa: 70, label: 'een mens (70 kg)' },
    aarde: { massa: AARDE, label: 'de Aarde' },
    zon: { massa: ZON, label: 'de Zon' },
    sgra: { massa: 4.3e6 * ZON, label: 'Sagittarius A*' },
    m87: { massa: 6.5e9 * ZON, label: 'M87*' },
  };
  // Things to compare the size (the diameter) with, from small to big, in metres
  const MAAT = [
    [1e-15, 'kleiner dan een atoomkern'], [1e-10, 'kleiner dan een atoom'], [1e-6, 'kleiner dan een bacterie'],
    [1e-3, 'kleiner dan een zandkorrel'], [0.03, 'ongeveer zo groot als een knikker'], [0.3, 'ongeveer zo groot als een voetbal'],
    [100, 'ongeveer zo groot als een flatgebouw'], [10000, 'ongeveer zo groot als een stad'], [1.3e7, 'kleiner dan de Aarde'],
    [1.4e9, 'kleiner dan de Zon'], [1.16e11, 'kleiner dan de baan van Mercurius om de Zon'], [3e11, 'kleiner dan de baan van de Aarde om de Zon'],
    [1.2e13, 'kleiner dan de baan van Pluto om de Zon'], [Infinity, 'groter dan ons hele zonnestelsel, tot voorbij Pluto'],
  ];
  const nl = n => n.toLocaleString('nl-NL', { maximumSignificantDigits: 3 });
  function afstand(m) {
    if (m < 1e-3) {
      const e = Math.floor(Math.log10(m));
      return `${nl(m / 10 ** e)} × 10<sup>${e}</sup> meter`;
    }
    if (m < 1) return `${nl(m * 1000)} millimeter`;
    if (m < 1000) return `${nl(m)} meter`;
    const km = m / 1000;
    if (km < 1e6) return `${nl(km)} kilometer`;
    if (km < 1e9) return `${nl(km / 1e6)} miljoen kilometer`;
    return `${nl(km / 1e9)} miljard kilometer`;
  }
  function toon(key) {
    const v = VOORBEELDEN[key];
    const r = 2 * G * v.massa / (C * C);
    const d = r * 2;
    form.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.voorbeeld === key));
    document.getElementById('reken-uitkomst').innerHTML =
      `<p>Als je ${v.label} samenperst tot een zwart gat, is de waarnemingshorizon <strong>${afstand(d)}</strong> breed (doorsnede).</p>
       <p class="muted">Dat is ${MAAT.find(([grens]) => d <= grens)[1]}.</p>`;
  }
  form.addEventListener('click', e => { const b = e.target.closest('button[data-voorbeeld]'); if (b) toon(b.dataset.voorbeeld); });
  toon('aarde');
})();
