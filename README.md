# Kosmos

Uitleg over het heelal, in gewone taal en in het Nederlands. Het eerste onderwerp is **zwarte gaten**; planeten en zonnestelsels volgen later.

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

## Een onderwerp toevoegen

1. Zet het onderwerp in `js/onderwerpen.js` en maak `klaar: true`.
2. Maak een map met dezelfde naam (zoals `planeten/`) met een `index.html`. Neem `zwarte-gaten/index.html` als voorbeeld.

Het menu en de kaarten op de beginpagina komen er dan vanzelf bij.

## Techniek

- Gewone HTML, CSS en JavaScript, zonder framework en zonder build-stap
- De simulatie is een eigen WebGL-shader (`js/blackhole.js`), zonder bibliotheek. Lichtstralen worden met *leapfrog*-stappen door het zwaartekrachtveld gevolgd; op een trage telefoon tekent hij vanzelf minder pixels.
- Lettertype: Newsreader (SIL Open Font License), meegeleverd in `fonts/`

## Lokaal draaien

```bash
python3 -m http.server 8000
```

Open daarna http://localhost:8000.

## Bronnen

NASA, ESA, ESO, de Event Horizon Telescope, LIGO en de Nobelprijs voor de Natuurkunde 2020. De links staan onderaan de pagina over zwarte gaten.
