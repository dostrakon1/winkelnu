# Winkelnu Predictive Search & Intent Engine v1

M0.46 maakt Zoekkompas voorspellend zonder afhankelijkheid van een AI-model.

## Principes

- De centrale Winkelnu-taxonomy, feed-aliases, koopgidsen en collecties vormen de zoekkennis.
- Live suggesties draaien lokaal in de browser op een compacte, door de server samengestelde index.
- Er is geen Supabase-query, externe API-call of AI-call nodig per toetsaanslag.
- De server gebruikt dezelfde pure intent-engine wanneer een zoekopdracht wordt ingediend.
- Onzekere zoektermen worden niet automatisch naar een categorie geforceerd.

## Wat v1 begrijpt

- exacte en gedeeltelijke categorie- en productgroepnamen;
- bestaande NL/EN feed-aliases;
- beperkte typo-tolerantie via Damerau-Levenshtein op betekenisvolle tokens;
- context zoals studie, werk en handbagage;
- cadeau-intenties voor vader, moeder en kinderen;
- gelegenheden zoals verjaardag, Kerst en Valentijn;
- eenvoudige budgettaal zoals `onder 800 euro`.

## Query rewrite

Een natuurlijke vraag hoeft niet letterlijk een producttitel te zijn.

Voorbeeld:

```text
laptpo voor studie
       ↓
correctie: laptop
context: studie
productterm: laptop
       ↓
productcatalogus + relevante Zoekkompas-routes
```

Een puur navigerende vraag kan juist de productzoekactie overslaan:

```text
cadeau voor vader
       ↓
Cadeaus & feest
├── Cadeaus voor hem
└── Moederdag & Vaderdag
```

Zo voorkomt Winkelnu dat een productquery op de letterlijke woorden `cadeau voor vader` een misleidende nul-resultatenroute wordt.

## Veiligheidsgrenzen

- Geen generatieve antwoorden of verzonnen producteigenschappen.
- Geen fuzzy categorie-toewijzing aan geïmporteerde producten; feedmapping blijft een apart, conservatief proces.
- Korte of onbekende termen worden niet agressief gecorrigeerd.
- Budgetherkenning activeert nog geen prijsfilter zolang gecontroleerde prijsdata ontbreekt.
- De originele zoekopdracht blijft zichtbaar, ook wanneer de productterm intern wordt vereenvoudigd.

## Toekomstige AI-laag

Een eventuele semantische/AI-laag kan later bovenop deze basis komen voor complexere intenties. De deterministische laag blijft dan verantwoordelijk voor harde taxonomy-, URL-, filter- en compliancebeslissingen. AI mag suggesties verbeteren, maar niet de canonieke catalogusstructuur zelfstandig herschrijven.
