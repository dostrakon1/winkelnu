# Preview Supabase Provisioning & Migration Runbook

Status: repository-ready; execution requires a real preview Supabase project.

## Purpose
This runbook is the single operational procedure for moving Winkelnu from repository-only Supabase readiness to a verified preview Supabase environment. It is intentionally fail-closed: no persistence switch, scheduler activation, partner activation or production claim is allowed until every required preview gate passes.

## Preconditions
Before any migration is applied:

1. Create a dedicated preview Supabase project. Do not use the future production project.
2. Record the project ref, project URL, publishable key and service-role key in a secure local/Vercel environment store. Never commit these values.
3. Configure one explicit operator email and role mapping, including at least one `owner`.
4. Keep `CATALOG_PERSISTENCE=memory`.
5. Run `npm run verify:activation-env` and stop if it fails.
6. Run `npm run check` on the exact repository HEAD intended for preview activation.

## Required migration set
Apply exactly these migrations in filename order:

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
13. `0013_operator_action_idempotency.sql`
14. `0014_operations_security_readiness.sql`
15. `0015_operator_action_retention_policy.sql`

Do not skip, reorder or manually edit a migration in the Supabase dashboard. If a migration fails, stop immediately and diagnose against the committed SQL before applying any later migration.

## Migration execution record
For the first preview activation, record these facts outside secrets:

- repository commit SHA;
- Supabase preview project ref;
- migration range applied (`0001`–`0015`);
- date/time of apply;
- operator performing the apply;
- result of `verify:activation-env`;
- result of `verify:supabase`;
- result of `verify:production-readiness`;
- generated database type commit SHA once types are committed.

Never record service-role keys, publishable keys, passwords or generated partner feed URLs in this audit note.

## Phase A — Environment preflight
Run:

```bash
npm run verify:activation-env
```

Expected result: success without printing secret values.

Stop conditions:

- project URL does not match project ref;
- public and server Supabase URLs point at different projects;
- service-role and publishable key are equal or misclassified;
- operator allowlist or role mapping is invalid;
- no owner is configured.

## Phase B — Apply migrations
Apply migrations `0001` through `0015` exactly once and in order to the empty preview project.

After application, do not switch persistence yet.

If a migration partially fails:

1. stop applying further migrations;
2. inspect the exact failed statement;
3. compare preview schema state with the committed migration set;
4. prefer recreating a disposable preview project over hand-editing schema history when the project has no valuable data yet;
5. never patch production-oriented SQL directly in the dashboard without committing the equivalent migration to Git first.

## Phase C — Live connection verification
Run:

```bash
npm run verify:supabase
npm run verify:production-readiness
```

Acceptance requires both commands to succeed.

The readiness check must confirm at minimum:

- all 15 protected tables have RLS enabled;
- operator audit and idempotency tables have no untrusted grants/policies;
- recovery RPCs are service-role-only;
- append-only audit trigger exists;
- ranking/readiness RPCs execute successfully.

## Phase D — Generate project-derived types
Run:

```bash
npm run types:supabase
```

The generated types must come from the real preview project after all migrations are applied. Never synthesize or hand-write live schema output.

After generation:

1. review the diff;
2. ensure service-role-only/internal structures are not accidentally exposed to browser code;
3. run `npm run check` again;
4. commit the generated types as their own traceable change.

## Phase E — Seed and bootstrap validation
Only after Phases A–D pass:

1. apply `supabase/seed.sql` if required for repository-defined seed data;
2. register one synthetic or approved preview merchant/integration/feed source using server-side secret references only;
3. verify a newly active feed without an orchestration row is discoverable by `list_due_feed_imports()`;
4. run a non-destructive preview import;
5. inspect import run counts, rejects, match reviews, orchestration state and correlation ID;
6. verify `catalog_ranked_products` returns expected freshness/ranking behavior;
7. verify `/uit/<offer-id>` redirect attribution in preview.

## Phase F — Human operator boundary
Create one explicit Supabase Auth preview operator account. Public signup remains disabled/not part of the design.

Verify:

- login/logout;
- allowlist and role resolution;
- `read_only` cannot claim idempotency keys for denied recovery actions;
- owner/operator recovery actions create audit + idempotency evidence;
- duplicate request keys do not execute a second mutation;
- browser-facing recovery errors remain generic;
- audit rows cannot be updated/deleted;
- idempotency retention policy remains minimum 90 days with no automatic delete job.

## Phase G — Preview persistence switch
Only after all previous phases pass may preview change to:

```env
CATALOG_PERSISTENCE=supabase
```

Then redeploy/restart preview and repeat:

```bash
npm run verify:activation-env
npm run verify:supabase
npm run verify:production-readiness
```

Perform a storefront smoke test and confirm worker/import failures cannot take storefront reads offline.

## Acceptance gate
Preview Supabase is accepted only when all are true:

- exact committed migrations `0001`–`0015` are applied;
- environment preflight passes;
- live connection verification passes;
- production-readiness verification passes;
- project-derived TypeScript types are generated and checked;
- due-feed bootstrap works;
- one non-destructive preview import succeeds;
- ranking/freshness semantics are correct;
- affiliate redirect/click attribution works;
- human operator auth and recovery boundaries work;
- no raw secret or internal error reaches browser output;
- repository `npm run check` is green on the activation HEAD.

## Rollback / stop strategy
Before preview persistence is switched, rollback is simple: keep `CATALOG_PERSISTENCE=memory`, disable preview scheduler activity and correct/recreate the disposable preview project.

After preview persistence is switched:

1. switch `CATALOG_PERSISTENCE` back to `memory` if catalog persistence behavior is unsafe;
2. pause/disable affected feeds and scheduler triggers;
3. do not delete import, click, audit or idempotency history to hide a failure;
4. do not promote the same schema/configuration to production until the issue is fixed and the complete preview acceptance gate passes again.

## Production boundary
Passing this runbook proves preview acceptance only. Production requires a separate project, the same committed migration history, a fresh environment preflight and a separate production go-live verification. Preview success must never be treated as proof that production migrations have already been applied.
