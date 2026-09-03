# Preview Activation Readiness Freeze & External Handoff Gate

Status: repository-side preparation frozen; next meaningful step requires a real preview Supabase project.

## Decision
M0.47 through M0.50 already define the environment contract, migration runbook, evidence pack and command sequence. No additional activation scaffolding should be added unless a real preview activation exposes a concrete gap.

The repository is considered activation-prepared when the exact target `main` commit has a green Quality workflow and all existing repository gates remain green.

## Frozen preparation set
The canonical preparation documents are:
- `docs/architecture/LIVE_SUPABASE_ACTIVATION_PREPARATION_AND_ENVIRONMENT_CONTRACT.md`
- `docs/operations/PREVIEW_SUPABASE_PROVISIONING_AND_MIGRATION_RUNBOOK.md`
- `docs/operations/PREVIEW_ACTIVATION_EVIDENCE_PACK.md`
- `docs/operations/PREVIEW_ACTIVATION_COMMAND_SEQUENCE.md`
- `docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`

The canonical repository gates are:
- `npm run check:migration-manifest`
- `npm run check:db-contract`
- `npm run check:preview-evidence-template`
- `npm run check`
- `npm run verify:activation-env`
- `npm run verify:supabase`
- `npm run verify:production-readiness`
- `npm run types:supabase`

## External handoff gate
The next phase starts only when all of the following external prerequisites exist:
1. A dedicated preview Supabase project exists and is separate from production.
2. The project ref, project URL, publishable key and service-role key are stored securely outside Git.
3. At least one explicit preview operator email/account is selected, with an `owner` role mapping.
4. There is access to apply the committed migrations `0001`–`0015` to that preview project.
5. There is access to configure preview deployment/environment variables while keeping `CATALOG_PERSISTENCE=memory` until the switch gate.

No secret value belongs in repository files, GitHub issues, screenshots or the evidence pack.

## What happens immediately after handoff
Once the external handoff gate is satisfied, do not create M0.52 preparation documents first. Execute `PREVIEW_ACTIVATION_COMMAND_SEQUENCE.md` against the real project:
- freeze the activation SHA;
- run environment and repository preflight;
- apply migrations;
- run live connection/security readiness;
- generate project-derived types;
- bootstrap one bounded preview feed;
- verify storefront and operator boundaries;
- switch preview persistence only after all earlier gates pass;
- close the evidence pack with real results.

## Stop condition for repository-only work
If no preview Supabase project is available, the correct state is **externally gated**, not “continue preparing”. Additional repository work is justified only for an independently useful product feature, security fix or defect discovered by CI/review—not for more activation paperwork.

## Current truth boundary
Repository readiness can prove committed code, migrations, static contracts and CI health. It cannot prove remote migration state, live RLS/grants, real project-derived types, Auth users, preview import behavior or persistence activation without access to the actual preview project.

## Next phase name
After this freeze, the next activation milestone is **M1.0 — Real Preview Supabase Provisioning & Verification**. It begins with the actual project, not another preparation milestone.