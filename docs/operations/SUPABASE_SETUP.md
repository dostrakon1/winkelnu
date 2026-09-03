# Supabase Setup — Winkelnu

Status: prepared, not yet connected to a live Supabase project.

## Purpose

Winkelnu keeps its application/domain IDs separate from PostgreSQL relational UUID primary keys. The application uses stable `external_key` values while Postgres uses UUIDs for foreign-key integrity.

## Required migration order

Apply migrations in filename order:

1. `0001_catalog_foundation.sql`
2. `0002_catalog_quality_observability.sql`
3. `0003_domain_external_keys.sql`
4. `0004_affiliate_click_attribution.sql`
5. `0005_affiliate_integration_registry.sql`

Do not skip `0003`; the Supabase catalog repository adapter depends on `external_key`. Do not skip `0004` before enabling outbound affiliate redirects in Supabase mode. Do not skip `0005` before registering real affiliate networks, merchant programs or feed-source integration context.

## Server environment

Required when `CATALOG_PERSISTENCE=supabase`:

```env
CATALOG_PERSISTENCE=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
SUPABASE_PROJECT_ID=<project-ref>
```

`SUPABASE_SERVICE_ROLE_KEY` is privileged. It must exist only in local server secrets / Vercel server environment variables and must never use a `NEXT_PUBLIC_` prefix.

Affiliate partner credentials follow the same rule. Registry records may contain only references such as `env:AFFILIATE_PARTNER_API_TOKEN`; the actual token belongs in server-side environment/secret storage.

The public anon/publishable key is intentionally not required by the current catalog implementation. Add browser-side Supabase access only when a concrete public-client use-case exists and after RLS policies are designed for it.

## Repository-side verification

```bash
npm run check:db-contract
```

This validates the committed catalog, observability, attribution and affiliate-registry migration contract without network access. It is part of GitHub Actions.

## Live connection smoke test

After the project exists and migrations are applied:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run verify:supabase
```

This is read-only and verifies that all required tables are readable.

## Generate live database types

```bash
SUPABASE_PROJECT_ID=<project-ref> npm run types:supabase
```

This generates `src/infrastructure/supabase/database.types.ts` from the actual `public` schema. Do not manually edit that generated file.

## Activation sequence

1. Create the Supabase project.
2. Apply migrations `0001` through `0005` in filename order.
3. Add server environment variables locally or in Vercel.
4. Run `npm run verify:supabase`.
5. Run `npm run types:supabase`.
6. Wire the generated `Database` type into the Supabase server client.
7. Run `npm run check`.
8. Keep `CATALOG_PERSISTENCE=memory` while validating migration state.
9. Seed required Winkelnu categories with UUID primary keys and stable `external_key` values.
10. Register affiliate networks/programs using secret references only.
11. Link each real feed source to its merchant integration where applicable.
12. Switch `CATALOG_PERSISTENCE=supabase` in a preview environment first.
13. Run a synthetic import against the Supabase adapter.
14. Verify products, offers, import runs, rejects and matching reviews.
15. Verify `/uit/<offer-id>` records one click event and redirects to the stored HTTPS affiliate destination.
16. Only then enable Supabase persistence for production.

## Affiliate click attribution

The baseline stores offer/product/merchant relations, optional internal source path and timestamp. It deliberately does not store raw IP addresses or user-agent fingerprints.

## Affiliate integration registry

`affiliate_networks` represents external networks/marketplaces. `merchant_affiliate_integrations` represents the concrete program relationship for one merchant. Direct programs have no network relation. `feed_sources.affiliate_integration_id` records which commercial integration a feed belongs to.

Actual API keys, passwords and tokens are never stored in these tables.

## Feed-source note

M0.8 can still create a neutral bootstrap `feed_sources` row with `source_type=manual`. M0.15 adds the explicit registry needed to replace that bootstrap context with the real source type and affiliate integration before production partner ingestion.

## Safety properties

- Service-role and partner credentials are server-only.
- Storefront components do not directly query Supabase.
- Application use-cases depend on repository ports, not Supabase APIs.
- Postgres UUIDs never leak into canonical Winkelnu identity rules.
- The in-memory adapters remain available for deterministic tests/development.
- Live smoke verification is read-only.
- Generated database types come from the live schema.
- Affiliate destinations are resolved from stored offers server-side.
- Click attribution is privacy-minimal by default.
- Registry records contain secret references, never actual partner credentials.

## Not yet possible without project access

The following require a real Supabase project and remain an external completion gate:

- applying migrations remotely;
- executing the live smoke test;
- generating project-derived TypeScript database types;
- validating service-role connectivity;
- validating affiliate click inserts live;
- validating registry writes/relations live;
- verifying RLS/security settings;
- performance/index inspection with real catalog volume.
