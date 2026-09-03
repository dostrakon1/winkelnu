# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, Daisycon-readiness, gecontroleerde onboarding, persistence-backed orchestration, due-feed batch execution, health-classificatie, production composition, beveiligde scheduler-trigger, lease-heartbeats, end-to-end importcorrelatie, bounded feed-traversal, storefront freshnessbeleid, een schaalbaar Supabase ranking read model, production security/go-live readiness en een formele first-partner production acceptance gate.

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

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Keten
`authenticated scheduler trigger → correlation id → due feed discovery → atomic renewable lease → integration registry → partner adapter → bounded pagination → validation/matching/import → correlated import run → scalable freshness-aware catalog read model → affiliate redirect/storefront`

M0.24 begrenst feed traversal en offerfreshness. M0.25 verplaatst ranking/filtering/pagination voor Supabase naar het database read model. M0.26 zet daar een production-securitylaag omheen: alle 13 gevoelige public-schema tabellen krijgen RLS, zonder anon/authenticated policies. Server-side service-role code blijft de enige catalogus/operations-toegang totdat later bewust een smaller publiek contract nodig is.

M0.27 voegt een fail-closed partneracceptatiepoort toe. De drie mogelijke toestanden zijn `blocked`, `repository_ready` en `production_approved`. Mapping, previewkwaliteit (minimaal 95% acceptance en nul match-reviews), cataloguszichtbaarheid, ranking/freshness en affiliate redirect moeten allemaal slagen. `production_approved` vereist daarnaast een gesanitiseerd monster van de echte partnerfeed, echte partnertoegang, live Supabase-readiness en een geslaagde preview tegen de echte feed.

Daisycon is de eerste kandidaat voor deze gate. De repository kan de volledige acceptatielogica bewijzen, maar Daisycon wordt niet als live/production-approved beschouwd zolang geen echte Daisycon-feedcredential/sample en live Supabase-projectverbinding zijn aangeleverd.

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

Zie [`docs/architecture/FIRST_PARTNER_PRODUCTION_ACCEPTANCE_GATE.md`](docs/architecture/FIRST_PARTNER_PRODUCTION_ACCEPTANCE_GATE.md), [`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`](docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md) en [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Volgende technische fase
**M0.28 — bol.com Partner Integration Readiness & Acceptance Profile**: eerst de actuele officiële bol.com Partnerprogramma-techniek verifiëren, daarna een bol.com-adapter/readinessprofiel toevoegen bovenop dezelfde registry-, worker-, catalogus- en acceptance-gatearchitectuur.
