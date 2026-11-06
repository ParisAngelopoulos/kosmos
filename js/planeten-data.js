// Six real planets around other stars (exoplanets), each a different kind of world.
// The facts come from the NASA Exoplanet Archive and NASA's exoplanet pages; the 3D view is an
// artist's impression: nobody has seen these planets up close.
// type: the surface the shader draws (0 rock, 2 ocean, 3 desert rock, 4 bands, 6 smooth bands,
// 7 deep bands, 8 lava); kleuren: three colours; lucht: glow of the atmosphere; licht: colour of the
// starlight; gloed: light the planet gives off itself (hot planets); kanteling and draai: axis and spin.
const WERELDEN = [
  {
    id: 'pegasi', naam: '51 Pegasi b', soort: 'Hete Jupiter', ontdekt: 1995, afstand: '50 lichtjaar',
    jaar: '4,2 dagen', massa: 'ongeveer half zo zwaar als Jupiter', temp: 'ongeveer 1.000 °C', ster: 'een ster zoals de Zon',
    kort: 'De eerste planeet die ooit rond een ster zoals de Zon werd gevonden. Een gasreus zo dicht bij zijn ster dat hij in vier dagen rond is: dichter dan Mercurius bij onze Zon.',
    type: 4, kleuren: ['#e0a070', '#6e2414', '#c2582a'], lucht: '#ff9a5a', licht: '#fff4e0', gloed: '#ff5a1a', kanteling: 0, draai: 0.12,
  },
  {
    id: 'hd189733', naam: 'HD 189733 b', soort: 'Blauwe gasreus', ontdekt: 2005, afstand: '64 lichtjaar',
    jaar: '2,2 dagen', massa: 'iets zwaarder dan Jupiter', temp: 'ongeveer 1.000 °C', ster: 'een oranje ster, iets kleiner dan de Zon',
    kort: 'De Hubble-telescoop zag dat deze planeet diepblauw is. Er waaien stormen van ongeveer 8.700 km per uur, en waarschijnlijk regent het er zijwaarts glas.',
    type: 7, kleuren: ['#4f7ae0', '#0c1c5e', '#2c4fb8'], lucht: '#6f9bff', licht: '#ffe8c8', gloed: '', kanteling: 0, draai: 0.2,
  },
  {
    id: 'cancri', naam: '55 Cancri e', soort: 'Lavawereld', ontdekt: 2004, afstand: '41 lichtjaar',
    jaar: '18 uur', massa: 'ongeveer 8 keer de Aarde', temp: 'aan de dagkant ruim 1.500 °C', ster: 'een ster iets kleiner dan de Zon',
    kort: 'Een rotsplaneet die zo dicht bij zijn ster draait dat een jaar er maar 18 uur duurt. Het oppervlak is waarschijnlijk deels gesmolten: een oceaan van lava.',
    type: 8, kleuren: ['#2a1d18', '#120b09', '#4a332a'], lucht: '#ff7a3a', licht: '#fff0d8', gloed: '#ff5a10', kanteling: 0, draai: 0.05,
  },
  {
    id: 'proxima', naam: 'Proxima Centauri b', soort: 'Rotsplaneet', ontdekt: 2016, afstand: '4,2 lichtjaar',
    jaar: '11,2 dagen', massa: 'minstens even zwaar als de Aarde', temp: 'onbekend, misschien rond het vriespunt', ster: 'een rode dwerg, veel kleiner en koeler dan de Zon',
    kort: 'De planeet rond de ster die het dichtst bij de Zon staat. Hij draait in de zone waar water vloeibaar kan zijn, maar zijn ster schiet vaak felle uitbarstingen op hem af.',
    type: 3, kleuren: ['#8a6a58', '#3e2f2a', '#b39a86'], lucht: '#c48a7a', licht: '#ffb08a', gloed: '', kanteling: 0, draai: 0.08,
  },
  {
    id: 'trappist', naam: 'TRAPPIST-1 e', soort: 'Aardachtige planeet', ontdekt: 2017, afstand: '40 lichtjaar',
    jaar: '6,1 dagen', massa: 'ongeveer 0,7 keer de Aarde', temp: 'misschien gematigd', ster: 'een kleine rode dwerg met zeven planeten',
    kort: 'Een van zeven planeten rond de kleine ster TRAPPIST-1, bijna zo groot als de Aarde. Hij draait in de leefbare zone en zou water kunnen hebben, misschien onder een laag ijs.',
    type: 2, kleuren: ['#123a5a', '#cfd8dc', '#8a9aa0'], lucht: '#9ac0ff', licht: '#ffa070', gloed: '', kanteling: 0, draai: 0.1,
  },
  {
    id: 'k218', naam: 'K2-18 b', soort: 'Mini-Neptunus', ontdekt: 2015, afstand: '124 lichtjaar',
    jaar: '33 dagen', massa: 'ongeveer 8,6 keer de Aarde', temp: 'misschien gematigd', ster: 'een rode dwerg',
    kort: 'Groter dan de Aarde en kleiner dan Neptunus, in de leefbare zone. De James Webb-telescoop vond in 2023 methaan en koolstofdioxide in zijn lucht. Of er leven kan zijn, is nog volop in discussie.',
    type: 6, kleuren: ['#9ad0d0', '#4f8f9a', '#c8e8e4'], lucht: '#a8f0f0', licht: '#ffb894', gloed: '', kanteling: 17, draai: 0.15,
  },
];
