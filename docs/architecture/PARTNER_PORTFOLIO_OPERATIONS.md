# Partner Portfolio Operations

M0.30 voegt één operationele portfolio-laag toe bovenop de bestaande integration registry, partner acceptance gates en feed health-classificatie.

## Doel

Zodra Winkelnu meerdere affiliatepartners heeft, is een losse adapterstatus niet meer genoeg. Per partner moet zichtbaar zijn:

- integration kind (`network`, `marketplace`, `direct`)
- acceptance status (`blocked`, `repository_ready`, `production_approved`)
- feed health (`healthy`, `delayed`, `failing`, `attention_required`, of `not_running`)
- hoeveel productievereisten bewezen zijn
- welke vereisten nog ontbreken
- de eerstvolgende concrete blocker/actie
- of de partner operationeel daadwerkelijk klaar is voor productie

## Belangrijk onderscheid

`production_approved` is een acceptance-status. Het betekent dat de partner door de formele partnergate is gekomen.

`readyForProduction` is strenger en vereist tegelijkertijd:

1. `activationStatus === production_approved`
2. alle voor productie verplichte evidence is geverifieerd
3. de live feed health is `healthy`

Een partner met een geslaagde acceptance maar een falende feed is dus niet operationeel production-ready.

## Evidence

Evidence wordt expliciet opgeslagen/ingevoerd als afzonderlijke controlepunten met:

- stabiele key
- menselijke omschrijving
- verified ja/nee
- requiredForProduction ja/nee

Dit maakt het model uitbreidbaar voor toekomstige partners zonder de portfolio-engine per netwerk te herschrijven.

Voorbeelden:

### Daisycon
- echte gesanitiseerde feed sample
- mapping geverifieerd
- real credential/feed access
- live preview
- Supabase production readiness

### bol
- correct Winkelnu Site_ID
- echte feed access
- huidige echte header/mappingvalidatie
- live preview
- bronvermelding/freshness/cleanup contract

## Feed health

M0.30 hergebruikt de bestaande M0.21 `FeedHealth`-classificatie. Er ontstaat dus geen tweede healthmodel.

- `healthy`: geen operationele blocker
- `delayed`: blocker
- `failing`: blocker
- `attention_required`: blocker
- geen live health beschikbaar: `not_running`, eveneens blocker voor daadwerkelijke production readiness

## Portfolio summary

`buildPartnerPortfolio()` geeft zowel partnerregels als totaaltellingen terug:

- totalPartners
- productionApproved
- repositoryReady
- blocked
- attentionRequired

Dit model is geschikt als basis voor een toekomstige interne operations-pagina/API zonder de application layer aan een specifieke UI te koppelen.

## Invariant

De portfolio-laag mag nooit ontbrekende live evidence of onbekende feedhealth als succes interpreteren. Onbekend is niet groen.
