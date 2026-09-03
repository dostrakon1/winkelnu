# Import Scheduling, Concurrency Lease & Failure Recovery

## Doel
Terugkerende partnerimports mogen nooit afhankelijk zijn van storefrontverkeer en dezelfde feed mag nooit gelijktijdig door meerdere workers worden gemuteerd.

## Orchestration state
Per `feed_source` bewaart `feed_import_orchestration`:
- `next_run_at`;
- `failure_count`;
- `last_error`;
- `last_started_at`;
- `last_succeeded_at`;
- `lease_owner`;
- `lease_token`;
- `lease_expires_at`.

## Lease invariant
Een worker mag alleen starten wanneer:
1. de feed due is (`next_run_at` ontbreekt of ligt in het verleden);
2. er geen actieve lease is, of de oude lease verlopen is.

Lease-acquisitie gebeurt atomair in PostgreSQL via `try_acquire_feed_import_lease`. Twee gelijktijdige workers kunnen daardoor niet allebei eigenaar worden.

Een completion/update vereist dezelfde `lease_token`. Een oude worker kan na lease-overname dus niet alsnog een nieuwere run overschrijven.

## Crash recovery
Leases verlopen standaard na 15 minuten in de application service. Als een worker sterft zonder completion blijft de feed tijdelijk beschermd, waarna een volgende worker de verlopen lease mag overnemen.

De leaseperiode is configureerbaar per execution call. Voor grote feeds moet de runtime later lease-renewal/heartbeat toevoegen voordat de maximale importduur boven de leaseperiode komt.

## Scheduling
Na een succesvolle run wordt standaard één uur later opnieuw gepland. Dit is een bootstrapdefault, geen commercieel beleid. Partner-specifieke cadence kan later vanuit feedconfiguratie worden geleverd.

De database blokkeert te vroege execution ook wanneer een externe scheduler vaker vuurt dan nodig.

## Failure recovery
Mislukkingen gebruiken exponentiële backoff:
- failure 1: 5 minuten;
- failure 2: 10 minuten;
- failure 3: 20 minuten;
- enzovoort;
- maximum: 6 uur.

Succes reset `failure_count` en `last_error`.

## Storefront isolation
Een mislukte import verandert de beschikbaarheid van de storefront zelf niet. De laatst succesvol opgeslagen catalogus blijft leesbaar. Stale-offer cleanup blijft onderdeel van een succesvol volledig doorlopen productie-import, niet van de scheduler.

## Runtime boundary
M0.20 implementeert orchestration state en leasing, maar kiest nog geen schedulerprovider. Mogelijke uitvoerders zijn Vercel Cron, GitHub Actions, een dedicated Node worker of een queue. Ze moeten allemaal dezelfde `ImportOrchestrationService` gebruiken.

## Volgende aandachtspunten
- lease heartbeat/renewal voor langdurige imports;
- selectie van due feed sources in batches;
- worker identity/observability;
- dead-letter/escalatie na herhaalde failures;
- partner-specifieke cadence.
