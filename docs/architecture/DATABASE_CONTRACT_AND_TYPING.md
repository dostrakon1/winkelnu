# Database Contract & Typing

Version: 1.0
Status: Active architecture baseline
Milestone: M0.9

## Goal

Keep the Winkelnu domain model stable while making persistence failures visible as early as possible.

## Three verification layers

### 1. Migration contract verification

`npm run check:db-contract`

Runs without network access and verifies that committed migrations still contain the tables and critical columns required by the persistence adapter.

This catches accidental migration drift before runtime.

### 2. Live schema smoke verification

`npm run verify:supabase`

Runs only when a real Supabase project and server credentials are available. It performs read-only checks against the required tables.

This proves that migrations were actually applied to the target project and that the server connection can read the expected schema.

### 3. Generated TypeScript database types

`npm run types:supabase`

Generates `src/infrastructure/supabase/database.types.ts` from the live public schema using the Supabase CLI.

Generated database types are authoritative for persistence implementation. They must never define Winkelnu business/domain identity; they only type the database boundary.

## Identity rule

PostgreSQL UUIDs remain relational implementation details.

Stable Winkelnu identity uses `external_key` values such as:

- `merchant:<source>`
- `product:<gtin>`
- `offer:<merchant>:<merchant-product-id>`
- `import:<source>:<merchant>:<timestamp>`

The adapter translates between UUID foreign keys and these stable application identifiers.

## Schema-change rule

Whenever a migration changes tables or columns consumed by application code:

1. update or add the migration;
2. update `scripts/verify-database-contract.mjs` when the required contract changes;
3. apply migrations to the preview Supabase project;
4. run `npm run verify:supabase`;
5. regenerate types with `npm run types:supabase`;
6. run `npm run check`;
7. only then promote the schema/application change toward production.

## Security rule

Database types contain schema metadata but no credentials and may be committed. Service-role credentials may never be committed and may never be exposed through a `NEXT_PUBLIC_` environment variable.
