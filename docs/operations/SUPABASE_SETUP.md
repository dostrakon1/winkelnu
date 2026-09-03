# Supabase Setup — Winkelnu

Status: prepared, not yet connected to a live Supabase project.

## Purpose

Winkelnu keeps its application/domain IDs separate from PostgreSQL relational UUID primary keys. The application uses stable `external_key` values while Postgres uses UUIDs for foreign-key integrity.

## Required migration order

Apply migrations in filename order:

1. `0001_catalog_foundation.sql`
2. `0002_catalog_quality_observability.sql`
3. `0003_domain_external_keys.sql`

Do not skip `0003`; the Supabase repository adapter depends on `external_key` for merchants, products, offers, categories and import runs.

## Server environment

Required when `CATALOG_PERSISTENCE=supabase`:

```env
CATALOG_PERSISTENCE=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
SUPABASE_PROJECT_ID=<project-ref>
```

`SUPABASE_SERVICE_ROLE_KEY` is privileged. It must exist only in local server secrets / Vercel server environment variables and must never use a `NEXT_PUBLIC_` prefix.

The public anon/publishable key is intentionally not required by the current catalog implementation. Add browser-side Supabase access only when a concrete public-client use-case exists and after RLS policies are designed for it.

## Repository-side verification

The repository validates its migration contract without requiring network access:

```bash
npm run check:db-contract
```

This checks that all tables and critical columns expected by the persistence adapter are represented by the committed migrations. It is part of GitHub Actions.

## Live connection smoke test

After the project exists and migrations are applied, run:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run verify:supabase
```

This is read-only. It verifies that the service-role connection works and that the required catalog/observability tables can be read. It does not insert or modify data.

## Generate live database types

After the live schema is verified:

```bash
SUPABASE_PROJECT_ID=<project-ref> npm run types:supabase
```

This generates:

`src/infrastructure/supabase/database.types.ts`

from the actual `public` schema. The generated file must not be manually edited. Regenerate it whenever a migration materially changes the Supabase schema.

Once generated, the server client can use the generated `Database` type so schema drift becomes visible to TypeScript.

## Activation sequence

1. Create the Supabase project.
2. Apply the migrations in filename order.
3. Add server environment variables locally or in Vercel.
4. Run `npm run verify:supabase`.
5. Run `npm run types:supabase`.
6. Wire the generated `Database` type into the Supabase server client.
7. Run `npm run check`.
8. Keep `CATALOG_PERSISTENCE=memory` while validating migration state.
9. Seed required Winkelnu categories with both a UUID primary key and stable `external_key`.
10. Switch `CATALOG_PERSISTENCE=supabase` in a preview environment first.
11. Run a synthetic import against the Supabase adapter.
12. Verify products, offers, import runs, rejects and matching reviews.
13. Only then enable Supabase persistence for production.

## Feed-source note

M0.8 creates a minimal `feed_sources` row automatically when an import run starts. It uses `source_type=manual` as a neutral bootstrap value. A later affiliate-integration milestone must register the real source type (`api`, `xml`, `csv`, `json`) and partner-specific configuration explicitly.

## Safety properties

- Service-role credentials are server-only.
- Storefront components do not directly query Supabase.
- Application use-cases depend on repository ports, not Supabase APIs.
- Postgres UUIDs never leak into canonical Winkelnu identity rules.
- The in-memory adapter remains available for deterministic tests and development.
- Live smoke verification is read-only.
- Generated database types come from the live schema rather than hand-maintained assumptions.

## Not yet possible without project access

The following require a real Supabase project and therefore remain the external completion gate for M0.9:

- applying migrations remotely;
- executing the live read-only smoke test;
- generating project-derived TypeScript database types;
- validating the service-role connection;
- verifying RLS/security settings against the live project;
- performance/index inspection with real catalog volume.
