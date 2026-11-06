// Eight planetary systems around other stars. Planet data from the NASA Exoplanet Archive
// (November 2026): a = distance to the star in AU (Earth–Sun = 1), p = orbital period in days,
// r = radius in Earth radii (estimated from the mass where the planet was never seen passing its
// star), t = temperature in kelvin. Orbits are drawn as circles.
// hz: the habitable zone in AU, from the brightness (lum, Sun = 1) and temperature of the star,
// with the conservative limits of Kopparapu et al. (2013).
// sterren: extra stars that are drawn (Kepler-16); verre: companions too far away to draw.
const STELSELS = [
  {
    id: 'trappist', naam: 'TRAPPIST-1', afstand: '40 lichtjaar', ster: 'Ultrakoele rode dwerg', sterKleur: '#ff8a55', teff: 2566, lum: 0.00055,
    ontdekt: '2016–2017', hz: [0.025, 0.050],
    kort: 'Zeven planeten zo groot als de Aarde, rond een ster die nauwelijks groter is dan Jupiter. Het hele stelsel past ruim binnen de baan van Mercurius, en drie of vier planeten staan in de leefbare zone.',
    planeten: [
      { n: 'b', a: 0.01154, p: 1.511, r: 1.12, t: 398 }, { n: 'c', a: 0.0158, p: 2.422, r: 1.10, t: 340 },
      { n: 'd', a: 0.02227, p: 4.049, r: 0.79, t: 286 }, { n: 'e', a: 0.02925, p: 6.101, r: 0.92, t: 250 },
      { n: 'f', a: 0.03849, p: 9.208, r: 1.05, t: 218 }, { n: 'g', a: 0.04683, p: 12.352, r: 1.13, t: 197 },
      { n: 'h', a: 0.06189, p: 18.773, r: 0.76, t: 172 },
    ],
  },
  {
    id: 'kepler90', naam: 'Kepler-90', afstand: '2.770 lichtjaar', ster: 'Ster als de Zon, iets heter', sterKleur: '#fff4e6', teff: 6080, lum: 1.77,
    ontdekt: '2013–2017', hz: [1.28, 2.19],
    kort: 'Acht planeten, net zoveel als bij ons, en ook hier de kleine binnen en de grote buiten. Maar alles draait binnen de afstand van de Aarde tot de Zon. De achtste werd in 2017 gevonden door een computerprogramma van Google dat oude metingen van Kepler doorzocht.',
    planeten: [
      { n: 'b', a: 0.074, p: 7.008, r: 1.31, t: 1062 }, { n: 'c', a: 0.089, p: 8.719, r: 1.19, t: 987 },
      { n: 'i', a: 0.120, p: 14.449, r: 1.32, t: 709 }, { n: 'd', a: 0.32, p: 59.737, r: 2.87, t: 520 },
      { n: 'e', a: 0.42, p: 91.939, r: 2.66, t: 450 }, { n: 'f', a: 0.48, p: 124.914, r: 2.88, t: 407 },
      { n: 'g', a: 0.717, p: 210.735, r: 7.72, t: 342 }, { n: 'h', a: 0.971, p: 331.603, r: 11.25, t: 294 },
    ],
  },
  {
    id: 'hd110067', naam: 'HD 110067', afstand: '105 lichtjaar', ster: 'Oranje dwerg', sterKleur: '#ffd9a8', teff: 5266, lum: 0.43,
    ontdekt: '2023', hz: [0.66, 1.16], ritme: true,
    kort: 'Zes planeten in een volmaakt ritme. Elke keer dat de binnenste planeet drie rondjes maakt, maakt de volgende er precies twee, en verder naar buiten loopt het ritme door. Zo’n ritme overleeft alleen als het stelsel sinds zijn ontstaan nooit is verstoord.',
    planeten: [
      { n: 'b', a: 0.0793, p: 9.114, r: 2.20, t: 800 }, { n: 'c', a: 0.1039, p: 13.674, r: 2.39, t: 699 },
      { n: 'd', a: 0.1362, p: 20.520, r: 2.85, t: 602 }, { n: 'e', a: 0.1785, p: 30.793, r: 1.94, t: 533 },
      { n: 'f', a: 0.2163, p: 41.059, r: 2.60, t: 489 }, { n: 'g', a: 0.2621, p: 54.770, r: 2.61, t: 440 },
    ],
  },
  {
    id: 'cancri', naam: '55 Cancri', afstand: '41 lichtjaar', ster: 'Gele dwerg, iets koeler dan de Zon', sterKleur: '#ffe9c8', teff: 5172, lum: 0.57,
    ontdekt: '1996–2007', hz: [0.77, 1.34], verre: 'Een tweede ster, een rode dwerg, staat zo’n 1.000 keer zo ver als de Aarde van de Zon.',
    kort: 'Vijf planeten, waaronder de lavawereld 55 Cancri e, die in achttien uur rond zijn ster gaat. Planeet f draait in de leefbare zone, maar is een gasreus. Ver weg staat nog een tweede ster.',
    planeten: [
      { n: 'e', a: 0.0154, p: 0.737, r: 1.88, t: 1958 }, { n: 'b', a: 0.118, p: 14.652, r: 13.9, t: 700 },
      { n: 'c', a: 0.247, p: 44.394, r: 8.51, t: 499 }, { n: 'f', a: 0.802, p: 260.58, r: 7.59, t: 277 },
      { n: 'd', a: 5.6, p: 4799, r: 13.0, t: 105 },
    ],
  },
  {
    id: 'hr8799', naam: 'HR 8799', afstand: '134 lichtjaar', ster: 'Jonge witte ster, heter dan de Zon', sterKleur: '#dfe8ff', teff: 7400, lum: 5,
    ontdekt: '2008–2010', hz: [2.03, 3.42],
    kort: 'Het eerste stelsel waarvan de planeten echt op een foto staan. Vier reuzen, elk vijf tot tien keer zo zwaar als Jupiter, op enorme afstanden. Het stelsel is pas zo’n 30 miljoen jaar oud: de planeten zijn nog zo warm van hun ontstaan dat ze zelf gloeien.',
    planeten: [
      { n: 'e', a: 16.4, p: 20816, r: 13.1, t: 1150 }, { n: 'd', a: 24, p: 37000, r: 13, t: 1300 },
      { n: 'c', a: 38, p: 69000, r: 13, t: 1200 }, { n: 'b', a: 68, p: 170000, r: 13, t: 1200 },
    ],
  },
  {
    id: 'kepler16', naam: 'Kepler-16', afstand: '245 lichtjaar', ster: 'Twee sterren: een oranje en een rode dwerg', sterKleur: '#ffc890', teff: 4450, lum: 0.15,
    ontdekt: '2011', hz: [0.41, 0.73],
    sterren: { a: 0.224, p: 41.08, verhouding: 0.226, kleur2: '#ff8a5a' },
    kort: 'Een planeet met twee zonnen. De twee sterren draaien in 41 dagen om elkaar heen; de planeet, zo groot als Saturnus, draait in 229 dagen om ze allebei. Hij draait aan de koude rand van de leefbare zone, maar is een gasreus zonder bodem.',
    planeten: [{ n: 'b', a: 0.705, p: 228.78, r: 8.45, t: 206 }],
  },
  {
    id: 'proxima', naam: 'Proxima Centauri', afstand: '4,2 lichtjaar', ster: 'Rode dwerg', sterKleur: '#ff9a6a', teff: 2900, lum: 0.0013,
    ontdekt: '2016 en 2022', hz: [0.039, 0.075], verre: 'Proxima hoort bij een drietal: de sterren Alpha Centauri A en B staan zo’n 13.000 keer zo ver als de Aarde van de Zon.',
    kort: 'De dichtstbijzijnde ster na de Zon, met twee bevestigde planeten. Proxima b staat in de leefbare zone. Proxima d is een van de lichtste planeten die ooit zijn gevonden: een kwart van de Aarde.',
    planeten: [{ n: 'd', a: 0.0288, p: 5.123, r: 0.69, t: 282 }, { n: 'b', a: 0.0485, p: 11.185, r: 1.02, t: 218 }],
  },
  {
    id: 'barnard', naam: 'Ster van Barnard', afstand: '6 lichtjaar', ster: 'Rode dwerg', sterKleur: '#ff9a6a', teff: 3195, lum: 0.0032,
    ontdekt: '2024–2025', hz: [0.061, 0.116],
    kort: 'De dichtstbijzijnde ster die alleen staat. In 2024 en 2025 werden er vier kleine planeten gevonden, alle vier lichter dan de Aarde. Ze staan zo dicht bij hun ster dat er geen vloeibaar water kan zijn.',
    planeten: [
      { n: 'd', a: 0.0188, p: 2.340, r: 0.69, t: 483 }, { n: 'b', a: 0.0229, p: 3.154, r: 0.72, t: 438 },
      { n: 'c', a: 0.0274, p: 4.124, r: 0.74, t: 400 }, { n: 'e', a: 0.0381, p: 6.739, r: 0.64, t: 340 },
    ],
  },
];

// Our own inner planets and the giants, to compare at the same scale
const ONS = [
  { n: 'Mercurius', a: 0.387 }, { n: 'Venus', a: 0.723 }, { n: 'Aarde', a: 1 }, { n: 'Mars', a: 1.524 },
  { n: 'Jupiter', a: 5.2 }, { n: 'Saturnus', a: 9.58 }, { n: 'Uranus', a: 19.2 }, { n: 'Neptunus', a: 30.1 },
];
