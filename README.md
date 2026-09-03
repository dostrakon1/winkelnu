# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, Daisycon-readiness, gecontroleerde onboarding, persistence-backed orchestration, due-feed batch execution, health-classificatie, production composition, beveiligde scheduler-trigger, lease-heartbeats, end-to-end importcorrelatie, bounded feed-traversal, storefront freshnessbeleid, een schaalbaar Supabase ranking read model, production security/go-live readiness, een formele first-partner production acceptance gate, een bol Affiliate readiness-profiel, een header-driven bol productfeed transport/mappingcontract, een partner portfolio operations-model, een beveiligde interne partner operations read surface, een read-only incidentprioriteringslaag en een server-rendered interne operatorinterface.

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
- M0.31 — Internal Partner Operations Read Model & Secure Ops Surface
- M0.32 — Internal Operations Dashboard Contract & Incident Prioritization
- M0.33 — Internal Operator UI Shell & Read-Only Dashboard

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Keten
`authenticated scheduler trigger → correlation id → due feed discovery → atomic renewable lease → integration registry → partner adapter → bounded pagination → validation/matching/import → correlated import run → scalable freshness-aware catalog read model → affiliate redirect/storefront`

M0.24 begrenst feed traversal en offerfreshness. M0.25 verplaatst ranking/filtering/pagination voor Supabase naar het database read model. M0.26 zet daar een production-securitylaag omheen. M0.27 voegt een fail-closed partneracceptatiepoort toe met de toestanden `blocked`, `repository_ready` en `production_approved`.

Daisycon blijft de eerste kandidaat voor een volledige live acceptance run. M0.28 voegt bol als tweede first-class affiliatepartner toe op readinessniveau. Voor bol wordt de bulkroute productfeed-first. M0.29 maakt de feedmapping header-driven zodat echte veldnamen pas na een actueel feedmonster worden vastgelegd.

M0.30 brengt Daisycon, bol en toekomstige partners in één operationeel portfolio samen. `buildPartnerPortfolio()` combineert activation status, vereiste evidence en bestaande `FeedHealth` tot expliciete blockers en een `nextAction`. `production_approved` blijft een acceptance-status; daadwerkelijke `readyForProduction` vereist daarnaast complete productie-evidence én een gezonde live feed.

M0.31 koppelt operations aan echte Supabase registry/orchestrationdata. `PartnerOperationsReadService` + `SupabasePartnerOperationsReadRepository` leveren integration-, merchant-, feed- en healthmetadata zonder credentialwaarden. `GET /api/ops/partner-portfolio` is bearer-authenticated, server-only, `no-store` en vereist Supabase persistence. De response bevat hoogstens `hasSecretReference`; secret refs, trackingconfig en secretwaarden worden niet geëxposeerd.

M0.32 vertaalt die read surface naar operatorprioriteit. `buildOperationsDashboard()` classificeert incidenten als `critical`, `high`, `medium` of `low`. Een actieve integration zonder credential reference en feeds met `attention_required` zijn kritisch; falende of nooit-geobserveerde actieve feeds zijn high; delayed feeds en pending integrations zijn medium. `GET /api/ops/dashboard` gebruikt dezelfde bearer-auth en blijft volledig read-only.

M0.33 voegt `/intern/operations` toe als server-rendered operatorpagina. De pagina is `noindex`, gebruikt server-side authorization, retourneert 404 bij ontbrekende/onjuiste toegang en exposeert geen ops-secret, Supabase service-role, secret refs of trackingconfig aan browsercode. De UI toont kernmetrics, incidentprioriteit, merchant/feedcontext en de eerstvolgende operatoractie, zonder mutations of beheerknoppen.

Migration `0009_production_security_and_readiness.sql` voegt de service-role-only `winkelnu_production_readiness()` RPC toe. `npm run verify:production-readiness` controleert op een live project dat alle 13 tabellen RLS hebben en dat de ranking-RPC uitvoerbaar is. `supabase/seed.sql` bevat alleen idempotente categorie-bootstrapdata; echte merchants worden pas na partneronboarding geregistreerd.

De server-only importtrigger ondersteunt `GET` en `POST` op `/api/ops/catalog-import` en vereist een Bearer-secret. De production factory weigert te draaien tenzij `CATALOG_PERSISTENCE=supabase`.

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

Zie [`docs/architecture/FIRST_PARTNER_PRODUCTION_ACCEPTANCE_GATE.md`](docs/architecture/FIRST_PARTNER_PRODUCTION_ACCEPTANCE_GATE.md), [`docs/architecture/BOL_AFFILIATE_INTEGRATION_READINESS.md`](docs/architecture/BOL_AFFILIATE_INTEGRATION_READINESS.md), [`docs/architecture/BOL_PRODUCT_FEED_TRANSPORT_AND_MAPPING.md`](docs/architecture/BOL_PRODUCT_FEED_TRANSPORT_AND_MAPPING.md), [`docs/architecture/PARTNER_PORTFOLIO_OPERATIONS.md`](docs/architecture/PARTNER_PORTFOLIO_OPERATIONS.md), [`docs/architecture/INTERNAL_PARTNER_OPERATIONS_READ_MODEL.md`](docs/architecture/INTERNAL_PARTNER_OPERATIONS_READ_MODEL.md), [`docs/architecture/INTERNAL_OPERATIONS_DASHBOARD_AND_INCIDENT_PRIORITIZATION.md`](docs/architecture/INTERNAL_OPERATIONS_DASHBOARD_AND_INCIDENT_PRIORITIZATION.md), [`docs/architecture/INTERNAL_OPERATOR_UI_SHELL.md`](docs/architecture/INTERNAL_OPERATOR_UI_SHELL.md), [`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`](docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md) en [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Volgende technische fase
**M0.34 — Human Operator Authentication & Session Boundary**: een echte server-side menselijke login/sessionlaag ontwerpen zodat `/intern/operations` veilig via normale browsernavigatie gebruikt kan worden zonder Bearer-secret in de browser te beheren.
