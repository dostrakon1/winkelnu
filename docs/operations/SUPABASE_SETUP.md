# Supabase Setup — Winkelnu

Status: prepared, not yet connected to a live Supabase project.

## Purpose
Winkelnu keeps application/domain IDs separate from PostgreSQL relational UUID primary keys. The application uses stable `external_key` values while Postgres uses UUIDs for foreign-key integrity.

## Required migration order
Apply migrations in filename order:

1. `0001_catalog_foundation.sql`
2. `0002_catalog_quality_observability.sql`
3. `0003_domain_external_keys.sql`
4. `0004_affiliate_click_attribution.sql`
5. `0005_affiliate_integration_registry.sql`
6. `0006_import_orchestration.sql`
7. `0007_import_heartbeat_and_correlation.sql`
8. `0008_catalog_ranking_read_model.sql`

Do not skip `0003`; repository adapters depend on `external_key`. `0004` is required before live affiliate click attribution, `0005` before real partner registry use, `0006` before recurring production imports, `0007` before lease heartbeats/correlated production runs and `0008` before enabling the scalable Supabase storefront read path.

## Server environment
Required when `CATALOG_PERSISTENCE=supabase`:

```env
CATALOG_PERSISTENCE=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
SUPABASE_PROJECT_ID=<project-ref>
```

`SUPABASE_SERVICE_ROLE_KEY` is privileged and must never use a `NEXT_PUBLIC_` prefix. Partner credentials follow the same rule. Registry rows contain only `env:` references, never the actual secret.

For the operations trigger, configure either `CRON_SECRET` (preferred for Vercel Cron) or `WINKELNU_IMPORT_TRIGGER_SECRET` for an external/manual scheduler. These values are server-only.

## Repository-side verification
```bash
npm run check:db-contract
```

This validates committed schema contracts, including orchestration, heartbeat, correlation persistence and the catalog ranking RPC.

## Live connection smoke test
After migrations are applied:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run verify:supabase
```

The smoke test is read-only and verifies required tables are readable.

## Generate live database types
```bash
SUPABASE_PROJECT_ID=<project-ref> npm run types:supabase
```

This generates `src/infrastructure/supabase/database.types.ts` from the live schema. Do not manually edit it.

## Activation sequence
1. Create the Supabase project.
2. Apply migrations `0001` through `0008` in filename order.
3. Add server environment variables locally/Vercel.
4. Run `npm run verify:supabase`.
5. Run `npm run types:supabase`.
6. Wire generated `Database` types into the server client.
7. Run `npm run check`.
8. Keep `CATALOG_PERSISTENCE=memory` while validating migration state.
9. Seed required categories with stable `external_key` values.
10. Register affiliate networks/programs using secret references only.
11. Link real feed sources to merchant integrations.
12. Validate partner onboarding with a non-destructive preview import.
13. Switch catalog persistence in a preview environment first.
14. Verify products, offers, import runs, rejects and matching reviews.
15. Verify `/uit/<offer-id>` click attribution and redirect behavior.
16. Verify orchestration lease acquire, heartbeat renewal and completion using server-only worker code.
17. Verify a trigger correlation ID appears on its created `import_runs` rows.
18. Verify `catalog_ranked_products` returns price-ranked, non-expired offers with expected search filters and pagination.
19. Only then enable recurring production imports and the Supabase storefront read model.

## Storefront ranking read model
Migration `0008` adds the service-role-only `catalog_ranked_products` RPC plus supporting indexes. It performs offer freshness cutoff, best-offer selection, landed-price ranking, category/brand/text filtering and pagination in Postgres. The public application continues to use `CatalogService`; the Supabase composition swaps in `ScalableCatalogService` and `SupabaseCatalogRankingReadModel` behind that interface.

## Import orchestration security
Migrations `0006` and `0007` add `SECURITY DEFINER` worker functions for atomic lease acquire, heartbeat and completion. Their default `PUBLIC` execute permissions are revoked and execution is granted only to Supabase `service_role`.

The scheduler/worker and ranking read model use the service-role server client. Browser/anon code must never call these RPCs directly.

## Safety properties
- Service-role and partner credentials are server-only.
- Storefront components do not directly query Supabase.
- Application use-cases depend on repository/read-model ports, not browser-side Supabase APIs.
- Postgres UUIDs never leak into canonical identity rules.
- In-memory adapters remain available for deterministic tests/development.
- Affiliate destinations are resolved server-side from stored offers.
- Click attribution is privacy-minimal.
- Registry records contain secret references only.
- Preview imports never deactivate missing offers.
- Production import leases are atomic, expiring, heartbeat-renewable and token-protected.
- A stale/expired worker cannot renew or complete another worker's lease.
- Too-early scheduler triggers are rejected by persisted `next_run_at` state.
- Trigger correlation IDs are stored on production import-run audit rows.
- Expired offers are removed from the scalable ranking path before storefront pagination.

## Not yet possible without project access
The following remain external completion gates:
- applying migrations remotely;
- executing the live smoke test;
- generating project-derived TypeScript database types;
- validating service-role connectivity;
- validating click inserts and registry relations live;
- executing orchestration/heartbeat/ranking RPCs against the real project;
- verifying RLS/security settings;
- performance/index inspection with real catalog volume.
