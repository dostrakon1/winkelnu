# M0.51 — Intent-Aware Comparison Context v1

## Doel

Zoekkompas en Vergelijkkompas vormen samen één deterministische beslislaag. Een zoekvraag mag de vergelijking context geven, maar mag nooit een verborgen winnaar, persoonlijke profilering of niet-onderbouwde aanbeveling veroorzaken.

## Flow

`zoekvraag → PredictiveSearchAnalysis → productselectie → q meenemen → vergelijking opnieuw analyseren → producttype-specifieke contextregels → relevante rijen vooraan → uitlegbare sterke punten`

De oorspronkelijke zoekvraag blijft de bron van waarheid. We serialiseren geen afgeleide scores of intentgewichten in de URL.

## URL-contract

Vanuit `/zoeken` wordt de actuele `q` maximaal 160 tekens meegenomen naar:

`/vergelijken?producten=<slug,slug>&q=<oorspronkelijke zoekvraag>`

De selectiecomponent kan een expliciete `comparisonQuery` krijgen en gebruikt op `/zoeken` daarnaast de actuele `q` uit de browser als veilige fallback op het moment dat Vergelijkkompas wordt geopend. Hierdoor blijft de koppeling correct wanneer filters of navigatie de zoekpagina hebben aangepast zonder dat categoriepagina's onbedoeld zoekcontext krijgen.

Vanuit categoriepagina's kan Vergelijkkompas zonder `q` blijven functioneren.

## Contextadapter

`src/application/comparison/intent-aware-comparison.ts` vertaalt zoekintentie naar vergelijkprioriteiten. De domeinlaag voor productspecificaties hoeft daardoor geen kennis te hebben van Search.

Voorbeeld laptops:

- studie → gewicht, accuduur, geheugen, opslag, scherm
- werk → geheugen, accuduur, aansluitingen, scherm, gewicht

Voor andere productgroepen gelden alleen expliciet vastgelegde regels. Een cadeau-intentie verandert bijvoorbeeld niet automatisch technische vergelijkcriteria.

## Budget

Budget blijft een commerciële randvoorwaarde, geen technische score.

- bekende prijs binnen budget → `Binnen genoemd budget`
- bekende prijs boven budget → `Boven genoemd budget`
- ontbrekende prijs → `Budget nog niet te beoordelen`

Een ontbrekende prijs telt nooit als nadeel.

## Geen totaalscore

M0.51 maakt bewust geen `match percentage`, `beste keuze voor jou` of geheime gewogen totaalscore.

Context kan:

1. relevante specificatierijen naar voren halen;
2. relevante verschillen eerder tonen;
3. bestaande objectief meetbare sterke punten eerder tonen;
4. budgetstatus bij bekende prijzen uitleggen.

De bezoeker blijft zelf kiezen.

## Privacy

De context is de bestaande zoekquery in de URL. M0.51 voegt geen visitor-ID, sessie-ID, cookie, fingerprint of persoonlijke profielopslag toe.

## Uitbreidbaarheid

Nieuwe intenties of producttypen krijgen pas invloed als een expliciete mapping bestaat. Bijvoorbeeld een toekomstige koffergroep kan `hand-luggage` koppelen aan afmetingen, gewicht en inhoud zonder de zoekengine of vergelijking opnieuw te ontwerpen.

## Later leren

Een latere learningstap kan geaggregeerd meten welke contexten vaak tot vergelijkingen leiden. Eventuele wijzigingen aan prioriteitsregels blijven via voorstel → tests → CI → goedkeuring lopen; er is geen autonome productieranking.
