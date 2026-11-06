# Kosmos

Uitleg over het heelal, in gewone taal en in het Nederlands. Onderwerpen: **zwarte gaten** en **planeten**; zonnestelsels volgen later.

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
  - soorten planeten, ook die wij niet hebben, zoals superaardes en zwervende planeten
  - de geschiedenis van exoplaneten
  - hoe je ze vindt
  - of er leven kan zijn
  - dwergplaneten
  - mythes
- **Onze eigen acht planeten** staan niet op deze pagina, maar in het project [Zonnestelsel](https://github.com/ParisAngelopoulos/zonnestelsel). De pagina linkt ernaar.

## Een onderwerp toevoegen

1. Zet het onderwerp in `js/onderwerpen.js` en maak `klaar: true`.
2. Maak een map met dezelfde naam (zoals `planeten/`) met een `index.html`. Neem `zwarte-gaten/index.html` als voorbeeld.

Het menu en de kaarten op de beginpagina komen er dan vanzelf bij.

## Techniek

- Gewone HTML, CSS en JavaScript, zonder framework en zonder build-stap
- Beide 3D-weergaven zijn eigen WebGL-shaders (`js/blackhole.js`, `js/planeet.js`), zonder bibliotheek.
- De gegevens van de zes exoplaneten staan in `js/planeten-data.js`; de kiezer en de tabel komen daaruit.
- Bij het zwarte gat worden lichtstralen met *leapfrog*-stappen door het zwaartekrachtveld gevolgd; op een trage telefoon tekent hij vanzelf minder pixels.
- Lettertype: Newsreader (SIL Open Font License), meegeleverd in `fonts/`

## Lokaal draaien

```bash
python3 -m http.server 8000
```

Open daarna http://localhost:8000.

## Bronnen

NASA (ook het NASA Exoplanet Archive), ESA, ESO, de IAU, de Event Horizon Telescope, LIGO, de James Webb-telescoop en de Nobelprijzen voor de Natuurkunde van 2019 en 2020. De links staan onderaan elke pagina.
