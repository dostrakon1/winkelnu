# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, Daisycon-readiness, gecontroleerde onboarding, persistence-backed orchestration, due-feed batch execution, health-classificatie en production import composition met een beveiligde operations trigger.

Afgerond / geïmplementeerd:
- M0.1 t/m M0.17 — fundering, catalogus, persistence, search, affiliate-attributie en partner-adapterarchitectuur
- M0.18 — First Real Partner Integration Readiness — Daisycon
- M0.19 — Partner Onboarding & Import Orchestration
- M0.20 — Import Scheduling, Concurrency Lease & Failure Recovery
- M0.21 — Due Feed Discovery, Worker Batch Execution & Operational Health
- M0.22 — Production Import Composition & Authenticated Operations Trigger

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Keten
`operations trigger → due feed discovery → atomic lease → integration registry → partner adapter → validation/matching → import run → catalog repository → storefront`

M0.18 kiest Daisycon als eerste echte readiness-target. M0.19–M0.21 voegen onboarding, leases, retry/backoff, due discovery, bounded batches en feed-health toe. M0.22 verbindt deze onderdelen in één production composition zonder providerlogica naar de worker te lekken.

De server-only trigger is `POST /api/ops/catalog-import` en vereist `Authorization: Bearer <WINKELNU_IMPORT_TRIGGER_SECRET>`. Het request kan geen feed-URL, partnercredential, adapterkey of merchantselectie aanleveren. De production factory weigert bovendien te draaien tenzij `CATALOG_PERSISTENCE=supabase`.

De eerste geregistreerde productieadapter is `daisycon:json`. Bol.com en latere partners kunnen via hetzelfde `PartnerFeedAdapterRegistry`-contract worden toegevoegd zonder de workerarchitectuur opnieuw te ontwerpen.

PostgreSQL UUIDs blijven interne relationele sleutels; duurzame Winkelnu-identiteiten gebruiken `external_key`. Partnercredentials blijven server-only en registryrecords bevatten uitsluitend `env:` secret references.

## Kwaliteitscontrole
```bash
npm install
npm run check
```

Zie [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md) voor de live activation gates.

## Volgende technische fase
**M0.23 — Scheduler Deployment Contract, Heartbeats & Import Run Correlation**: deploy-time schedulercontract vastleggen, leases voor lange imports kunnen verlengen en orchestration-executions koppelen aan import-run IDs voor end-to-end tracing.
