# Live Supabase Activation Preparation & Environment Contract

M0.47 turns live Supabase activation into an explicit, fail-closed handoff instead of an informal setup step.

## Goals
- define the exact environment values required for preview activation;
- distinguish public auth values from privileged server secrets;
- verify project identity before any live persistence switch;
- make the one-time external prerequisites explicit;
- keep `CATALOG_PERSISTENCE=memory` until preview verification succeeds;
- preserve the rule that live readiness is never claimed from repository state alone.

## Required activation values
Server-only:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`
- `WINKELNU_OPERATOR_EMAILS`
- `WINKELNU_OPERATOR_ROLES`

Auth-session boundary:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Runtime selection:
- `CATALOG_PERSISTENCE=memory|supabase`

Machine trigger secrets remain separate from human Auth and are not part of the minimum first-connection contract.

## Fail-closed preflight
`npm run verify:activation-env` checks all required values without connecting to Supabase. It verifies URL/project consistency, key separation, persistence mode and operator policy integrity. Secret values are never printed.

## Activation gates
Repository-ready is not the same as live-ready. Live preview activation requires:
1. a real Supabase project;
2. migrations `0001`–`0015` applied to that project;
3. real project credentials loaded securely;
4. preflight environment verification;
5. connection smoke test;
6. production-readiness RPC verification;
7. project-derived database types;
8. successful application quality checks;
9. first operator Auth validation;
10. preview import and catalog/redirect acceptance.

Only after these pass may the preview deployment use `CATALOG_PERSISTENCE=supabase`.

## External handoff boundary
A human/account owner must create or authorize the Supabase project and obtain the project-specific secrets. Winkelnu source control must never contain the service-role key or partner credentials.

## Non-goals
M0.47 does not:
- create a Supabase account or project;
- apply migrations to a project without authorized access;
- invent live database types;
- claim production readiness;
- activate a real affiliate partner;
- enable recurring production imports.
