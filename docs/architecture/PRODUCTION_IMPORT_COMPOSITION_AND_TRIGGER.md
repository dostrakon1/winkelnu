# Production Import Composition & Authenticated Operations Trigger

## Purpose
M0.22 connects the previously isolated production pieces without changing their responsibilities.

Runtime chain:

`POST operations trigger → due feed discovery → per-source lease → affiliate registry → partner adapter → importFeed → catalog repository → orchestration completion`

## Production composition
`ProductionImportCompositionService` resolves the active merchant, resolves the registered partner source and adapter, then invokes the existing `importFeed` use-case. It does not duplicate mapping, validation, matching or stale-offer rules.

`createProductionImportWorker()` wires the Supabase catalog, Supabase affiliate registry, due-feed discovery, import-orchestration repository and partner adapter registry. The factory refuses to start unless `CATALOG_PERSISTENCE=supabase`.

The first registered real-provider adapter remains `daisycon:json`. Future bol.com/Awin/etc. adapters register into the same `PartnerFeedAdapterRegistry`; the worker itself does not need provider-specific branches.

## Operations trigger
The server route is:

`POST /api/ops/catalog-import`

Authentication requires:

`Authorization: Bearer <WINKELNU_IMPORT_TRIGGER_SECRET>`

Properties:
- POST only;
- bearer secret is server-only;
- exact secret comparison uses constant-time comparison when lengths match;
- no feed URL, merchant ID, adapter key or partner credential is accepted from the request;
- response is `Cache-Control: no-store`;
- optional `?limit=` is only a batch-size hint and remains bounded by `ImportWorkerService` to 1–50;
- every discovered source still must acquire its own M0.20 lease.

## Scheduler compatibility
The route is intentionally scheduler-agnostic. A later Vercel Cron, external scheduler or dedicated worker may call it. Scheduler configuration is deployment infrastructure, not domain logic.

## Security boundary
The route must never use a `NEXT_PUBLIC_` secret. `WINKELNU_IMPORT_TRIGGER_SECRET` belongs only in server secret storage. The production factory also requires Supabase server credentials and uses service-role-only database RPCs for import leases.

No claim is made that the route is live until deployment environment variables exist and the Supabase migrations have been applied.
