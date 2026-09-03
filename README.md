# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, Daisycon-readiness, gecontroleerde onboarding, persistence-backed orchestration, due-feed batch execution, health-classificatie, production composition, beveiligde scheduler-trigger, lease-heartbeats, end-to-end importcorrelatie en bounded feed-traversal met storefront freshnessbeleid.

Afgerond / geïmplementeerd:
- M0.1 t/m M0.17 — fundering, catalogus, persistence, search, affiliate-attributie en partner-adapterarchitectuur
- M0.18 — First Real Partner Integration Readiness — Daisycon
- M0.19 — Partner Onboarding & Import Orchestration
- M0.20 — Import Scheduling, Concurrency Lease & Failure Recovery
- M0.21 — Due Feed Discovery, Worker Batch Execution & Operational Health
- M0.22 — Production Import Composition & Authenticated Operations Trigger
- M0.23 — Scheduler Deployment Contract, Heartbeats & Import Run Correlation
- M0.24 — Feed Traversal Safety, Runtime Budgets & Stale Data Policy

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Keten
`authenticated scheduler trigger → correlation id → due feed discovery → atomic renewable lease → integration registry → partner adapter → bounded pagination → validation/matching/import → correlated import run → freshness-aware catalog service → storefront`

M0.18 kiest Daisycon als eerste echte readiness-target. M0.19–M0.21 voegen onboarding, leases, retry/backoff, due discovery, bounded batches en feed-health toe. M0.22 verbindt deze onderdelen in één production composition zonder providerlogica naar de worker te lekken. M0.23 maakt die worker scheduler-compatible en veilig voor lange feeds: pagination-progress kan de lease begrensd verlengen en iedere trigger krijgt één correlation ID die op de bijbehorende production `import_runs` wordt opgeslagen.

M0.24 begrenst nu ook de feed zelf. Een import faalt gesloten bij een herhaalde cursor, na standaard 10.000 pagina’s of na een standaard wall-clock budget van 30 minuten. Een traversal-failure voert nooit stale-offer cleanup uit. Voor publieke offers geldt als baseline: `fresh` tot 24 uur na laatste verificatie, `stale` daarna tot en met 72 uur, en `expired` daarboven. Stale offers blijven zichtbaar met freshnessmetadata; expired offers worden door `CatalogService` uit ranking, detail en search geweerd zonder historische databasegegevens te verwijderen.

De server-only trigger ondersteunt `GET` en `POST` op `/api/ops/catalog-import` en vereist een Bearer-secret. Voor Vercel Cron is `CRON_SECRET` de voorkeursconfiguratie; voor een externe/manual scheduler kan `WINKELNU_IMPORT_TRIGGER_SECRET` worden gebruikt. Het request kan geen feed-URL, partnercredential, adapterkey of merchantselectie aanleveren. De production factory weigert bovendien te draaien tenzij `CATALOG_PERSISTENCE=supabase`.

Er wordt bewust nog geen high-frequency `vercel.json` cron vastgelegd: schedulerfrequentie blijft deploymentbeleid en moet passen bij het gekozen Vercel-plan en de gewenste feedfreshness.

De eerste geregistreerde productieadapter is `daisycon:json`. Bol.com en latere partners kunnen via hetzelfde `PartnerFeedAdapterRegistry`-contract worden toegevoegd zonder de workerarchitectuur opnieuw te ontwerpen.

PostgreSQL UUIDs blijven interne relationele sleutels; duurzame Winkelnu-identiteiten gebruiken `external_key`. Partnercredentials blijven server-only en registryrecords bevatten uitsluitend `env:` secret references.

## Kwaliteitscontrole
```bash
npm install
npm run check
```

Zie [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md) voor de live activation gates.

## Volgende technische fase
**M0.25 — Catalog Scale Query Pushdown & Ranking Read Model**: de bootstrap N+1 product-detail reads en 240-product application search cap vervangen door een persistence read model waarin filtering, freshness, ranking en pagination database-side kunnen schalen zonder publieke routes te veranderen.
