# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, Daisycon-readiness, gecontroleerde onboarding, persistence-backed orchestration, due-feed batch execution, health-classificatie, production composition, beveiligde scheduler-trigger, lease-heartbeats, end-to-end importcorrelatie, bounded feed-traversal, storefront freshnessbeleid, een schaalbaar Supabase ranking read model, production security/go-live readiness, een formele first-partner production acceptance gate, een bol Affiliate readiness-profiel, een header-driven bol productfeed transport/mappingcontract en een partner portfolio operations-model.

Afgerond / geïmplementeerd:
- M0.1 t/m M0.17 — fundering, catalogus, persistence, search, affiliate-attributie en partner-adapterarchitectuur
- M0.18 — First Real Partner Integration Readiness — Daisycon
- M0.19 — Partner Onboarding & Import Orchestration
- M0.20 — Import Scheduling, Concurrency Lease & Failure Recovery
- M0.21 — Due Feed Discovery, Worker Batch Execution & Operational Health
- M0.22 — Production Import Composition & Authenticated Operations Trigger
- M0.23 — Scheduler Deployment Contract, Heartbeats & Import Run Correlation
- M0.24 — Feed Traversal Safety, Runtime Budgets & Stale Data Policy
- M0.25 — Catalog Scale Query Pushdown & Ranking Read Model
- M0.26 — Production Catalog Activation, Security & Go-Live Readiness
- M0.27 — First Production Partner Activation & Live Catalog Acceptance Gate
- M0.28 — bol Affiliate Integration Readiness & Acceptance Profile
- M0.29 — bol Product Feed Transport & Real Mapping Validation
- M0.30 — Partner Portfolio Operations & Activation Registry

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Keten
`authenticated scheduler trigger → correlation id → due feed discovery → atomic renewable lease → integration registry → partner adapter → bounded pagination → validation/matching/import → correlated import run → scalable freshness-aware catalog read model → affiliate redirect/storefront`

M0.24 begrenst feed traversal en offerfreshness. M0.25 verplaatst ranking/filtering/pagination voor Supabase naar het database read model. M0.26 zet daar een production-securitylaag omheen. M0.27 voegt een fail-closed partneracceptatiepoort toe met de toestanden `blocked`, `repository_ready` en `production_approved`.

Daisycon blijft de eerste kandidaat voor een volledige live acceptance run. M0.28 voegt bol als tweede first-class affiliatepartner toe op readinessniveau. Voor bol wordt de bulkroute productfeed-first: de officiële affiliate productfeeds zijn categoriebreed, worden ongeveer twee-uurlijks bijgewerkt en bevatten gewone bol-productlinks die Winkelnu zelf omzet naar trackinglinks met het juiste `Site_ID`.

M0.29 maakt de productfeedkant repository-ready zonder accountdetails te verzinnen. `BolProductFeedTransport` definieert een streaming transportboundary; `.csv.gz` feedbestanden worden herkend, de officiële `|`-gescheiden eerste headerregel wordt schema-inspecteerbaar gemaakt en `BolProductFeedMappingProfile` bindt Winkelnu-velden uitsluitend aan headers die in een echt feedmonster zijn aangetroffen. `validateBolProductFeedSample()` voert daarna schema-, row-, tracking- en kandidaatvalidatie uit met standaard minimaal 95% acceptance.

De tests gebruiken synthetische headernamen om de mappingengine te bewijzen; dit is nadrukkelijk geen claim over de actuele officiële bol-kolomnamen. De live FTP-client wordt pas gebouwd/geactiveerd wanneer de huidige account-specifieke connection instructions, IPv4-whitelist, credentials en een echte huidige feedheader beschikbaar zijn.

M0.30 brengt Daisycon, bol en toekomstige partners in één operationeel portfolio samen. `buildPartnerPortfolio()` combineert activation status, vereiste evidence en bestaande `FeedHealth` tot expliciete blockers en een `nextAction`. `production_approved` blijft een acceptance-status; daadwerkelijke `readyForProduction` vereist daarnaast complete productie-evidence én een gezonde live feed. Ontbrekende feedhealth wordt bewust `not_running`, nooit impliciet groen.

`buildBolAffiliateTrackingUrl()` vormt de trackingboundary. `assessBolAffiliateReadiness()` voegt bovenop de generieke M0.27-gate bol-specifieke eisen toe voor exact Site_ID, bronvermelding, Nederlandse ervaring, freshness van prijs/beschikbaarheid/levertijd en verwijdering van bol-content wanneer toegang eindigt.

Bol is nadrukkelijk nog niet `production_approved`: echte productfeed/FTP-toegang, een gesanitiseerd actueel feedmonster, de definitieve veldmapping en een live preview zijn externe gates. De seller Retailer API wordt niet als affiliatebulkbron gebruikt alleen omdat die ook product/offer-concepten bevat.

Migration `0009_production_security_and_readiness.sql` voegt de service-role-only `winkelnu_production_readiness()` RPC toe. `npm run verify:production-readiness` controleert op een live project dat alle 13 tabellen RLS hebben en dat de ranking-RPC uitvoerbaar is. `supabase/seed.sql` bevat alleen idempotente categorie-bootstrapdata; echte merchants worden pas na partneronboarding geregistreerd.

De server-only trigger ondersteunt `GET` en `POST` op `/api/ops/catalog-import` en vereist een Bearer-secret. De production factory weigert te draaien tenzij `CATALOG_PERSISTENCE=supabase`.

PostgreSQL UUIDs blijven interne relationele sleutels; duurzame Winkelnu-identiteiten gebruiken `external_key`. Partnercredentials blijven server-only en registryrecords bevatten uitsluitend `env:` secret references.

## Kwaliteitscontrole
```bash
npm install
npm run check
```

Voor live activation:
```bash
npm run verify:supabase
npm run verify:production-readiness
```

Zie [`docs/architecture/FIRST_PARTNER_PRODUCTION_ACCEPTANCE_GATE.md`](docs/architecture/FIRST_PARTNER_PRODUCTION_ACCEPTANCE_GATE.md), [`docs/architecture/BOL_AFFILIATE_INTEGRATION_READINESS.md`](docs/architecture/BOL_AFFILIATE_INTEGRATION_READINESS.md), [`docs/architecture/BOL_PRODUCT_FEED_TRANSPORT_AND_MAPPING.md`](docs/architecture/BOL_PRODUCT_FEED_TRANSPORT_AND_MAPPING.md), [`docs/architecture/PARTNER_PORTFOLIO_OPERATIONS.md`](docs/architecture/PARTNER_PORTFOLIO_OPERATIONS.md), [`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`](docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md) en [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Volgende technische fase
**M0.31 — Internal Partner Operations Read Model & Secure Ops Surface**: het portfolio-model koppelen aan echte registry/orchestrationdata en via een server-only interne read surface beschikbaar maken, zonder publieke adminroute of browser-databaseaccess.
