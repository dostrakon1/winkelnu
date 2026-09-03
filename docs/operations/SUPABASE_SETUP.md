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
```

`SUPABASE_SERVICE_ROLE_KEY` is privileged. It must exist only in local server secrets / Vercel server environment variables and must never use a `NEXT_PUBLIC_` prefix.

The public anon/publishable key is intentionally not required by the current catalog implementation. Add browser-side Supabase access only when a concrete public-client use-case exists and after RLS policies are designed for it.

## Activation sequence

1. Create the Supabase project.
2. Apply the three migrations in order.
3. Add server environment variables locally or in Vercel.
4. Keep `CATALOG_PERSISTENCE=memory` while validating migration state.
5. Seed required Winkelnu categories with both a UUID primary key and stable `external_key`.
6. Switch `CATALOG_PERSISTENCE=supabase` in a preview environment first.
7. Run a synthetic import against the Supabase adapter.
8. Verify products, offers, import runs, rejects and matching reviews.
9. Only then enable Supabase persistence for production.

## Feed-source note

M0.8 creates a minimal `feed_sources` row automatically when an import run starts. It uses `source_type=manual` as a neutral bootstrap value. A later affiliate-integration milestone must register the real source type (`api`, `xml`, `csv`, `json`) and partner-specific configuration explicitly.

## Safety properties

- Service-role credentials are server-only.
- Storefront components do not directly query Supabase.
- Application use-cases depend on repository ports, not Supabase APIs.
- Postgres UUIDs never leak into canonical Winkelnu identity rules.
- The in-memory adapter remains available for deterministic tests and development.

## Not yet possible without project access

The following require a real Supabase project and therefore are not completed in-repository:

- applying migrations remotely;
- generating project-derived TypeScript database types;
- validating the service-role connection;
- verifying RLS/security settings against the live project;
- performance/index inspection with real catalog volume.
