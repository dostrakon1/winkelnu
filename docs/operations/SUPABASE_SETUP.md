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
9. `0009_production_security_and_readiness.sql`
10. `0010_due_feed_discovery_bootstrap.sql`
11. `0011_operator_roles_and_audit_boundary.sql`
12. `0012_feed_recovery_actions.sql`

Do not skip migrations. `0010` makes new active feed sources discoverable before orchestration exists. `0011` establishes the append-only human audit trail. `0012` adds the service-role-only retry/pause/resume recovery RPCs.

## Server environment
Required when `CATALOG_PERSISTENCE=supabase`:

```env
CATALOG_PERSISTENCE=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
SUPABASE_PROJECT_ID=<project-ref>
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
WINKELNU_OPERATOR_EMAILS=owner@example.com
WINKELNU_OPERATOR_ROLES=owner@example.com:owner
```

`SUPABASE_SERVICE_ROLE_KEY` is privileged and must never use a `NEXT_PUBLIC_` prefix. Partner credentials follow the same rule. Registry rows contain only `env:` references, never actual secrets.

For the operations trigger, configure either `CRON_SECRET` or `WINKELNU_IMPORT_TRIGGER_SECRET`. Human operator sessions use Supabase Auth and the server-side email/role policy; they do not use the machine Bearer secret.

## Repository-side verification
```bash
npm run check:db-contract
```

This validates committed schema contracts including RLS tables, orchestration/heartbeat functions, due-feed discovery, ranking/readiness RPCs, operator audit and feed recovery functions.

## Live connection smoke test
After all migrations are applied:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run verify:supabase
```

## Generate live database types
```bash
SUPABASE_PROJECT_ID=<project-ref> npm run types:supabase
```

Generate types from the real project after migration application; do not invent live schema output.

## Activation sequence
1. Create the Supabase project.
2. Apply migrations `0001` through `0012` in filename order.
3. Add server and auth environment variables locally/Vercel.
4. Run `npm run verify:supabase`.
5. Run `npm run types:supabase`.
6. Run `npm run check`.
7. Keep `CATALOG_PERSISTENCE=memory` until migration state is verified.
8. Seed required categories.
9. Register affiliate networks/programs using secret references only.
10. Link real feed sources to merchant integrations.
11. Verify a newly active feed with no orchestration row is returned by `list_due_feed_imports()`.
12. Validate partner onboarding with a non-destructive preview import.
13. Switch persistence in a preview environment first.
14. Verify catalog ranking/freshness and `/uit/<offer-id>` attribution.
15. Verify lease acquire, heartbeat, completion and trigger correlation.
16. Create an explicit Supabase Auth operator user; do not enable public signup.
17. Verify operator allowlist/role mapping and login/logout.
18. Verify `operator_audit_events` accepts service-role INSERT/SELECT and rejects UPDATE/DELETE.
19. Verify retry, pause and resume RPCs through the audited operator service in preview.
20. Only then enable recurring production imports and human recovery actions.

## Security properties
- Service-role and partner credentials are server-only.
- Human Auth uses the publishable key only for the session boundary.
- Storefront components do not directly query Supabase.
- Worker/ranking/due-feed/recovery RPCs are service-role-only.
- New feed sources can bootstrap before orchestration state exists.
- Operator role defaults to `read_only` when no explicit role assignment exists.
- Operator audit records are append-only and never contain credentials/tokens.
- Human recovery mutations must pass the audited action service.
- Public signup is not part of the operator architecture.

## Not yet possible without project access
The following remain external completion gates:
- applying migrations remotely;
- executing live connection/readiness checks;
- generating project-derived TypeScript database types;
- validating RLS and RPC grants against the real project;
- creating the first operator Auth account;
- executing a real due-feed bootstrap query;
- inserting and verifying a real operator audit event;
- executing retry/pause/resume against a real feed source;
- performance/index inspection with production-like catalog volume.
