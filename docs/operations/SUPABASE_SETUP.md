# Supabase Setup — Winkelnu

Status: repository-ready, not yet connected to a live Supabase project.

## Purpose
Winkelnu keeps application/domain IDs separate from PostgreSQL relational UUID primary keys. The application uses stable `external_key` values while Postgres uses UUIDs for foreign-key integrity.

## Required migration order
Apply every migration in filename order, currently `0001` through `0015`. Do not skip migrations.

The later operations migrations establish due-feed bootstrap, human operator audit, recovery RPCs, server-side idempotency, operations-security readiness and the 90-day minimum idempotency retention policy.

## Activation environment contract
Required before a preview environment can switch to Supabase persistence:

```env
CATALOG_PERSISTENCE=memory
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-service-role-key>
SUPABASE_PROJECT_ID=<project-ref>
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
WINKELNU_OPERATOR_EMAILS=owner@example.com
WINKELNU_OPERATOR_ROLES=owner@example.com:owner
```

Start with `CATALOG_PERSISTENCE=memory`. Switch a preview deployment to `supabase` only after migrations and live verification succeed.

`SUPABASE_SERVICE_ROLE_KEY` is privileged and must never use a `NEXT_PUBLIC_` prefix. Partner credentials follow the same rule. The URL and publishable key belong only to the Supabase Auth session boundary. Registry rows contain only `env:` references, never actual partner secrets.

For the machine operations trigger, configure either `CRON_SECRET` or `WINKELNU_IMPORT_TRIGGER_SECRET`. Human operator sessions use Supabase Auth and the server-side email/role policy; they never use the machine Bearer secret.

## Preflight environment verification
With the real preview values loaded locally or in a protected deployment shell:

```bash
npm run verify:activation-env
```

This fails closed when:
- any required activation value is missing;
- the server and public Supabase URLs point at different projects;
- `SUPABASE_PROJECT_ID` does not match the project URL;
- the service-role and publishable keys are identical;
- persistence is neither `memory` nor `supabase`;
- no operator is allowlisted;
- an operator role is malformed, unsupported or assigned outside the allowlist;
- no allowlisted operator has the `owner` role.

The script reports only non-secret metadata. It never prints either Supabase key.

## Repository-side verification
```bash
npm run check:db-contract
npm run check
```

These validate the committed schema/security contracts and the application build without requiring live Supabase credentials.

## Live connection and readiness verification
After migrations `0001`–`0015` are applied to the preview project:

```bash
npm run verify:activation-env
npm run verify:supabase
npm run verify:production-readiness
```

`verify:production-readiness` must report the expected 15 RLS-protected tables plus the operations-security contract from M0.45.

## Generate live database types
Only after the real project schema is up to date:

```bash
SUPABASE_PROJECT_ID=<project-ref> npm run types:supabase
```

Generated types must come from the actual Supabase project. Do not invent or hand-author live schema output.

## One-time user actions required for first preview activation
The repository cannot create or administer the user's Supabase account/project by itself. The user must provide or configure only these external prerequisites:

1. Create one Supabase preview project for Winkelnu.
2. Obtain the project ref, project URL, publishable key and service-role key from that project.
3. Keep the service-role key private; never paste it into a public issue, commit, screenshot or browser-exposed variable.
4. Apply migrations `0001`–`0015` to the preview project, or provide an authorized Supabase execution path that can apply them.
5. Create the first explicit Supabase Auth operator account; public signup remains disabled/not part of the design.
6. Provide the chosen operator email so it can be placed in `WINKELNU_OPERATOR_EMAILS` and assigned an `owner` role.

Once those prerequisites exist, the repository can perform the remaining verification and activation sequence.

## Preview activation sequence
1. Keep `CATALOG_PERSISTENCE=memory`.
2. Load the real preview environment values securely.
3. Run `npm run verify:activation-env`.
4. Apply/confirm migrations `0001`–`0015`.
5. Run `npm run verify:supabase`.
6. Run `npm run verify:production-readiness`.
7. Generate project-derived database types.
8. Run `npm run check`.
9. Seed only the required reference/category data.
10. Verify due-feed discovery and ranking RPC semantics.
11. Verify the first human operator login/logout and owner role resolution.
12. Verify audit append-only behavior, idempotency, safe recovery errors and denied-action behavior.
13. Register one test/approved merchant integration using secret references only.
14. Run a non-destructive preview import.
15. Verify correlation, quality evidence, offers, ranking and affiliate redirect attribution.
16. Only then set `CATALOG_PERSISTENCE=supabase` in the preview deployment.
17. Re-run smoke/readiness checks against that deployment.
18. Do not enable recurring production imports until the production promotion checklist separately passes.

## Security properties
- Service-role and partner credentials are server-only.
- Human Auth uses the publishable key only for the session boundary.
- Storefront components do not directly query privileged Supabase tables.
- Worker/ranking/due-feed/recovery RPCs are service-role-only where designed.
- New feed sources can bootstrap before orchestration state exists.
- Operator role defaults to `read_only` when no explicit role assignment exists.
- Operator audit records are append-only and never contain credentials/tokens.
- Authorization occurs before an idempotency claim, with a second permission check at the audited boundary.
- Browser-facing recovery failures are sanitized.
- `operator_action_requests` has a 90-day minimum retention policy and no automatic deletion capability.
- Public operator signup is not part of the architecture.

## Not yet possible without project access
The following remain external completion gates:
- applying migrations remotely;
- executing live connection/readiness checks;
- generating project-derived TypeScript database types;
- validating RLS and RPC grants against the real project;
- creating/verifying the first operator Auth account;
- executing a real due-feed bootstrap query;
- inserting and verifying real operator audit/idempotency records;
- executing retry/pause/resume against a real feed source;
- performance/index inspection with production-like catalog volume.
