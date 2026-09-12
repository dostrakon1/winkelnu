# M0.50 — Smart Comparison Engine & Winkelnu Vergelijkkompas v1

## Doel

De productvergelijker wordt een uitlegbare keuzehulp zonder AI-model. Winkelnu toont niet alleen een platte specificatietabel, maar begrijpt eerst welk producttype wordt vergeleken en welke eigenschappen voor dat type relevant zijn.

## Principes

1. **Geen algemene winnaar.** Er bestaat geen verborgen totaalscore en Winkelnu claimt niet dat één product universeel het beste is.
2. **Alleen bekende gegevens.** Ontbrekende specificaties tellen nooit als nadeel.
3. **Niet vermeld is niet hetzelfde als niet van toepassing.** Die twee toestanden blijven expliciet gescheiden.
4. **Feed-onafhankelijke normalisatie.** Verschillende labels voor dezelfde eigenschap worden canoniek samengevoegd, terwijl de originele waarde zichtbaar blijft.
5. **Alleen objectief vergelijkbare sterke punten.** Een highlight verschijnt uitsluitend als alle geselecteerde producten voor dezelfde meetbare eigenschap een parseerbare waarde hebben en die waarden daadwerkelijk verschillen.
6. **Producttype bepaalt relevantie.** Laptops krijgen andere kernverschillen dan airfryers, stofzuigers of tenten.
7. **Geen automatische commerciële beïnvloeding.** Commissies, affiliate-netwerk of merchant hebben geen rol in de vergelijking van productspecificaties.

## Flow

```text
selectie van 2–4 producten
        ↓
zelfde comparison group?
        ↓
producttype-profiel
        ↓
label- en aliasnormalisatie
        ↓
kernspecificaties eerst
        ↓
meetbare waarden veilig vergelijken
        ↓
grootste verschillen + objectieve sterke punten
        ↓
volledige specificatietabel
```

## Voorbeelden van normalisatie

```text
RAM / werkgeheugen / basisgeheugen → Geheugen
SSD / basisopslag / opslagcapaciteit → Opslag
Display / beeldscherm / scherm → Scherm
Totale capaciteit / capaciteit / inhoud → Capaciteit
Functies / kookfuncties / programma's → Kookfuncties
```

De engine normaliseert het **attribuut**, niet de gepresenteerde bronwaarde. `16 GB centraal geheugen` blijft dus zichtbaar als `16 GB centraal geheugen`.

## Eenheden v1

Voor objectieve highlights begrijpt v1 een beperkte set veilige meeteenheden, waaronder:

- GB en TB;
- gram en kilogram;
- minuten en uren;
- milliliter en liter;
- mAh;
- lumen;
- rpm/toeren;
- DPI;
- eenvoudige aantallen.

Als een waarde niet betrouwbaar kan worden geïnterpreteerd, wordt hij wel getoond maar niet gebruikt om een sterk-punt-badge toe te kennen.

## Vergelijkkompas UI

De pagina `/vergelijken` bestaat in v1 uit:

- producttype-specifieke focuschips;
- blok **Grootste verschillen**;
- maximaal drie uitlegbare highlights per product;
- laagste bekende totaalprijs alleen als alle geselecteerde producten een bekende vergelijkbare prijs hebben;
- kernspecificaties bovenaan de tabel;
- overige bekende eigenschappen daarna;
- transparante uitleg over de beslisregels.

## Veiligheidsgrens

`meer` of `minder` is niet automatisch `beter`. Daarom krijgen eigenschappen zoals wattage of pompdruk in v1 geen voordeel-label alleen omdat het getal hoger is. Alleen eigenschappen waarbij de richting in de context voldoende objectief is, zoals lager gewicht, langere bekende accuduur of grotere opslag, kunnen een highlight krijgen.

## Relatie met Zoekkompas

Search en Compare blijven verschillende verantwoordelijkheden houden:

```text
Zoekkompas
→ begrijpt wat de bezoeker probeert te vinden

Vergelijkkompas
→ helpt verschillen tussen gekozen kandidaten begrijpen
```

Een latere versie kan zoekintentie gecontroleerd doorgeven aan Vergelijkkompas, maar v1 bewaart geen bezoekersprofiel en gebruikt geen querycontext om productscores automatisch te wijzigen.
