# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, Daisycon-readiness, gecontroleerde onboarding, persistence-backed orchestration, due-feed batch execution, health-classificatie, production composition, beveiligde scheduler-trigger, lease-heartbeats, end-to-end importcorrelatie, bounded feed-traversal, storefront freshnessbeleid, een schaalbaar Supabase ranking read model en production security/go-live readiness.

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

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Keten
`authenticated scheduler trigger → correlation id → due feed discovery → atomic renewable lease → integration registry → partner adapter → bounded pagination → validation/matching/import → correlated import run → scalable freshness-aware catalog read model → storefront`

M0.24 begrenst feed traversal en offerfreshness. M0.25 verplaatst ranking/filtering/pagination voor Supabase naar het database read model. M0.26 zet daar een production-securitylaag omheen: alle 13 gevoelige public-schema tabellen krijgen RLS, zonder anon/authenticated policies. Server-side service-role code blijft de enige catalogus/operations-toegang totdat later bewust een smaller publiek contract nodig is.

Migration `0009_production_security_and_readiness.sql` voegt daarnaast de service-role-only `winkelnu_production_readiness()` RPC toe. `npm run verify:production-readiness` controleert op een live project dat alle 13 tabellen RLS hebben en dat de ranking-RPC uitvoerbaar is. `supabase/seed.sql` bevat alleen idempotente categorie-bootstrapdata; echte merchants worden niet fictief geseed maar pas na partneronboarding geregistreerd.

De server-only trigger ondersteunt `GET` en `POST` op `/api/ops/catalog-import` en vereist een Bearer-secret. De production factory weigert te draaien tenzij `CATALOG_PERSISTENCE=supabase`.

De eerste geregistreerde productieadapter is `daisycon:json`. Bol.com en latere partners kunnen via hetzelfde `PartnerFeedAdapterRegistry`-contract worden toegevoegd zonder de workerarchitectuur opnieuw te ontwerpen.

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

Zie [`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`](docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md) en [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Volgende technische fase
**M0.27 — First Production Partner Activation & Live Catalog Acceptance Gate**: één echt goedgekeurd partner/feedcontract in preview end-to-end valideren (mapping → import → ranking → click), en pas daarna productieactivering toestaan.
