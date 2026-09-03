# Preview Activation Command Sequence & Operator Checklist

Status: repository-ready; execution waits for a real preview Supabase project.

## Purpose
This is the short, command-by-command execution sheet for the first Winkelnu preview activation. The detailed safety rules remain in `PREVIEW_SUPABASE_PROVISIONING_AND_MIGRATION_RUNBOOK.md`; evidence is recorded in `PREVIEW_ACTIVATION_EVIDENCE_PACK.md`.

Golden rule: stop on the first failed gate. Keep `CATALOG_PERSISTENCE=memory` until Step 9 is explicitly accepted.

## Step 0 — Freeze the activation target
Operator:
- choose the exact green `main` commit to activate;
- do not continue committing activation-related changes while the live migration session is in progress;
- record that SHA in the evidence pack.

Repository check:
```bash
git rev-parse HEAD
npm run check
```

Acceptance: HEAD equals the recorded activation SHA and the complete repository check is green.

## Step 1 — Create the preview Supabase project
Operator in Supabase:
- create a dedicated preview project, separate from future production;
- public signup is not part of the Winkelnu operator design;
- collect project ref, project URL, publishable key and service-role key;
- store secrets only in a secure local/preview environment store.

Never paste keys into GitHub, documentation, screenshots or the evidence pack.

## Step 2 — Configure activation environment
Operator:
- configure the preview project URL/ref and keys according to `.env.example`;
- configure `WINKELNU_OPERATOR_EMAILS`;
- configure `WINKELNU_OPERATOR_ROLES` with at least one owner;
- keep `CATALOG_PERSISTENCE=memory`.

Repository check:
```bash
npm run verify:activation-env
```

Acceptance: success without secret output. On failure, correct environment configuration before doing anything to the database.

## Step 3 — Verify the migration set
Repository check:
```bash
npm run check:migration-manifest
npm run check:db-contract
```

Expected set: migrations `0001` through `0015`, exactly once and in filename order.

Acceptance: both checks green.

## Step 4 — Apply migrations to the empty preview project
Operator:
- apply committed migrations `0001` through `0015` in filename order using the chosen Supabase migration workflow;
- do not manually rewrite SQL in the dashboard;
- stop immediately on any failed statement.

If a disposable empty preview project ends in an uncertain partial state, prefer recreating it and reapplying the committed migration history over inventing schema fixes outside Git.

Evidence pack:
- record activation SHA;
- preview project ref;
- applied range;
- application method;
- whether drift was detected.

## Step 5 — Prove live connection and security readiness
Repository checks:
```bash
npm run verify:supabase
npm run verify:production-readiness
```

Acceptance requires both green and must cover the M0.45 operations-security contract: 15 RLS-protected tables, safe operator table privileges, service-role-only recovery RPCs and append-only audit behavior.

Do not switch persistence yet.

## Step 6 — Generate real database types
Repository command:
```bash
npm run types:supabase
npm run typecheck
npm run check
```

Operator/developer:
- inspect the generated type diff;
- confirm the types came from the same preview project ref;
- commit project-derived types separately so the activation evidence can reference that commit.

Acceptance: generated types reflect the migrated preview schema and the repository remains green.

## Step 7 — Bootstrap one bounded preview feed
Operator/developer:
- apply repository seed data if required;
- register one synthetic or explicitly approved preview merchant/integration/feed source;
- use server-side secret references only;
- confirm a newly active feed can be discovered by `list_due_feed_imports()`;
- run one bounded, non-destructive preview import.

Evidence pack records only safe aggregates:
- correlation ID;
- final import status;
- seen/accepted/rejected counts;
- offers written/updated;
- review-required count.

Never record raw feed payloads or private feed URLs.

## Step 8 — Accept storefront and human operations
Storefront acceptance:
- verify ranked eligible offers;
- verify fresh/stale/expired behavior;
- verify cheapest eligible offer selection;
- verify `/uit/<offer-id>` redirect and click attribution.

Operator acceptance:
- create one explicit preview operator account;
- verify login/logout and role resolution;
- verify `read_only` denial before idempotency claim;
- verify retry, confirmed pause and resume for authorized roles;
- verify duplicate request suppression;
- verify generic browser-facing recovery errors;
- verify audit/idempotency evidence remains intact.

Acceptance: all relevant Section 7 and 8 fields in the evidence pack can be marked verified.

## Step 9 — Persistence switch
Precondition: Steps 0–8 are accepted and recorded.

Operator:
```env
CATALOG_PERSISTENCE=supabase
```

Redeploy/restart preview, then run:
```bash
npm run verify:activation-env
npm run verify:supabase
npm run verify:production-readiness
```

Then perform storefront and operations smoke tests.

Acceptance: preview reads/writes behave correctly and import failures cannot take storefront reads offline.

## Step 10 — Close the evidence pack
Record:
- final activation result;
- exact activation/deployment SHA;
- Quality workflow run ID/result;
- migration state;
- readiness results;
- generated-types commit;
- preview import evidence;
- operator acceptance;
- persistence-switch result;
- reviewer/operator.

Only then may preview be called activated. This does not approve production.

## Emergency stop sequence
At any failed live gate:
1. stop the activation sequence;
2. keep or restore `CATALOG_PERSISTENCE=memory`;
3. keep scheduler/import triggers disabled or pause affected feeds;
4. preserve import/click/audit/idempotency evidence;
5. record the failed phase and non-secret diagnostic reference;
6. fix the repository/migration/configuration and repeat the applicable gates from a known state.

## What Dogan must provide when we execute this for real
Only the external project/account actions cannot be completed from repository code alone. At activation time the required handoff is:
- a real dedicated preview Supabase project;
- the environment values stored securely (not pasted into Git/docs);
- an explicit preview operator email/account;
- access to execute/apply the committed migrations and preview deployment configuration.

Everything that can be proven from the repository should continue to be automated by the existing verifier commands.