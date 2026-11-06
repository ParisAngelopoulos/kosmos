# Kosmos

Uitleg over het heelal, in gewone taal en in het Nederlands. Onderwerpen: **zwarte gaten**, **planeten** en **zonnestelsels**.

**Live:** https://parisangelopoulos.com/kosmos/

## Zwarte gaten

- **Een live simulatie bovenaan.** Elke pixel volgt een lichtstraal door de gekromde ruimte rond een zwart gat (Schwarzschild), stap voor stap. Je ziet hoe de schijf van heet gas óver het zwarte gat heen lijkt te buigen, de dunne ring van licht rond de schaduw, en sterren die erachter tot boogjes worden uitgerekt. Sleep om te draaien.
- **Een artikel in hoofdstukken**:
  - wat een zwart gat is
  - hoe het ontstaat
  - de vier soorten
  - hoe het eruitziet (met een doorsnede)
  - wat er gebeurt als je erin valt
  - hoe we weten dat ze bestaan (van John Michell in 1783 tot de foto's van de Event Horizon Telescope)
  - bekende zwarte gaten
  - mythes
- **Een rekenhulp.** Hoe groot zou de Aarde, de Zon of M87* zijn als zwart gat? (De Aarde: 1,8 centimeter.)
- **Een inhoudsopgave** die meeloopt met waar je bent.
- **Werkt op een telefoon.** Zonder WebGL krijg je een getekende afbeelding in plaats van de simulatie.

## Planeten

- **Zes echte exoplaneten in 3D bovenaan**, elk een ander soort wereld:
  - een hete Jupiter (51 Pegasi b)
  - een blauwe gasreus waar het glas regent (HD 189733 b)
  - een lavawereld (55 Cancri e)
  - de dichtstbijzijnde (Proxima Centauri b)
  - een aardachtige planeet (TRAPPIST-1 e)
  - een mini-Neptunus (K2-18 b)
- **De 3D-weergave**: één WebGL-shader (`js/planeet.js`) tekent de bol, het oppervlak uit ruis, de wolken, de lucht en de gloed van hete planeten. Het licht heeft de kleur van de eigen ster, dus bij een rode dwerg rozig. Het zijn artistieke weergaven, en dat staat erbij.
- **Een artikel in hoofdstukken**:
  - wat een planeet is
  - hoe planeten ontstaan
  - soorten planeten in drie groepen: waar ze van gemaakt zijn (superaardes, oceaan- en lavawerelden), extreem weer (stormplaneten met winden tot 33.000 km/u, ijzerregen) en leefbaar of niet (leefbare zone, twee zonnen, zwervers)
  - een top 10 van planeten die het meest op de Aarde lijken, te sorteren op score of afstand. De score (Earth Similarity Index) is berekend uit grootte en sterlicht, met gegevens van het NASA Exoplanet Archive
  - de geschiedenis van exoplaneten
  - hoe je ze vindt
  - of er leven kan zijn
  - dwergplaneten
  - mythes
- **Onze eigen acht planeten** staan niet op deze pagina, maar in het project [Zonnestelsel](https://github.com/ParisAngelopoulos/zonnestelsel). De pagina linkt ernaar.

## Zonnestelsels

- **Acht planetenstelsels bij andere sterren, bewegend in beeld.** De planeten draaien op hun echte snelheid ten opzichte van elkaar, en de leefbare zone is een groene band:
  - TRAPPIST-1: zeven planeten zo groot als de Aarde, allemaal binnen de baan van Mercurius
  - Kepler-90: acht planeten, net zoveel als bij ons
  - HD 110067: zes planeten in een vast ritme
  - 55 Cancri: met de lavawereld en een tweede ster ver weg
  - HR 8799: vier reuzen die echt op een foto staan
  - Kepler-16: een planeet met twee zonnen
  - Proxima Centauri en de Ster van Barnard: onze dichtstbijzijnde buren
- **Vergelijk met ons zonnestelsel.** De banen van onze planeten op dezelfde schaal eroverheen.
- **Laat het ritme horen.** Een toon telkens als een planeet rond is, zodat je het vaste ritme (de baanresonantie) van HD 110067 en TRAPPIST-1 hoort.
- **Een artikel in hoofdstukken**:
  - wat een zonnestelsel is
  - hoe anders stelsels kunnen zijn
  - planeten in de maat
  - twee of drie zonnen
  - de leefbare zone
  - of ons zonnestelsel bijzonder is
  - een tabel van de acht stelsels
  - mythes
- **Ons eigen zonnestelsel** staat niet op deze pagina, maar in het project [Zonnestelsel](https://github.com/ParisAngelopoulos/zonnestelsel). De pagina linkt ernaar.

## Een onderwerp toevoegen

1. Zet het onderwerp in `js/onderwerpen.js` en maak `klaar: true`.
2. Maak een map met dezelfde naam (zoals `zonnestelsels/`) met een `index.html`. Neem `zwarte-gaten/index.html` als voorbeeld.

Het menu en de kaarten op de beginpagina komen er dan vanzelf bij.

## Techniek

- Gewone HTML, CSS en JavaScript, zonder framework en zonder build-stap
- Beide 3D-weergaven zijn eigen WebGL-shaders (`js/blackhole.js`, `js/planeet.js`), zonder bibliotheek.
- De gegevens van de zes exoplaneten en de top 10 staan in `js/planeten-data.js`; de kiezer en de tabellen komen daaruit.
- De zonnestelsels tekent `js/stelsel.js` met canvas 2D, schuin van boven gezien, met de afstanden op een wortelschaal zodat planeten dicht bij hun ster zichtbaar blijven. De tonen komen uit de Web Audio API. De gegevens staan in `js/zonnestelsels-data.js`.
- Bij het zwarte gat worden lichtstralen met *leapfrog*-stappen door het zwaartekrachtveld gevolgd; op een trage telefoon tekent hij vanzelf minder pixels.
- Lettertype: Newsreader (SIL Open Font License), meegeleverd in `fonts/`

## Lokaal draaien

```bash
python3 -m http.server 8000
```

Open daarna http://localhost:8000.

## Bronnen

NASA (ook het NASA Exoplanet Archive, waar alle cijfers over exoplaneten en hun banen vandaan komen), ESA (ook Cheops), ESO, de IAU, de Event Horizon Telescope, LIGO, de James Webb-telescoop en de Nobelprijzen voor de Natuurkunde van 2019 en 2020. De grenzen van de leefbare zone volgen Kopparapu e.a. (2013). De links staan onderaan elke pagina.
