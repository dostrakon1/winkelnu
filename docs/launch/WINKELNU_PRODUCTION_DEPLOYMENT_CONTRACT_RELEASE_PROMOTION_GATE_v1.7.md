# Winkelnu Production Deployment Contract & Release Promotion Gate v1.7

Status: **repository-side promotion contract implemented; real production promotion remains an external gate**

Date: 2026-09-04

## Purpose

v1.7 defines the exact boundary between a repository commit and a production release. A branch name such as `main`, a successful local build or a healthy preview deployment is not sufficient evidence that `winkelnu.nl` should point at that release.

The unit of promotion is one immutable 40-character Git commit SHA plus one explicit production environment contract.

## 1. New release-promotion verifier

Added:

- `scripts/verify-release-promotion.mjs`
- `npm run verify:release-promotion`

This verifier is intentionally separate from normal CI. CI proves repository quality; the release verifier proves that the environment selected for promotion is wired to the expected production identity.

## 2. Required release identity

Promotion requires:

```text
WINKELNU_RELEASE_SHA=<exact 40-character commit SHA>
WINKELNU_RELEASE_ENVIRONMENT=production
WINKELNU_RELEASE_ORIGIN=https://winkelnu.nl
```

The verifier rejects:

- abbreviated SHAs;
- branch names in place of a SHA;
- any environment other than `production`;
- non-HTTPS origins;
- origins with a path, query or fragment;
- any canonical production host other than `winkelnu.nl`.

This prevents a preview URL or stale deployment from being treated as the public release by accident.

## 3. Canonical URL contract

For promotion:

```text
NEXT_PUBLIC_SITE_URL=https://winkelnu.nl
```

must exactly match:

```text
WINKELNU_RELEASE_ORIGIN=https://winkelnu.nl
```

This makes canonical metadata, robots sitemap origin and the release target part of the same promotion decision.

## 4. Production persistence contract

The promoted production storefront must use:

```text
CATALOG_PERSISTENCE=supabase
```

The release gate rejects `memory` persistence because public promotion must not accidentally use the synthetic/in-memory catalog path.

## 5. Supabase environment identity

Promotion requires all of the following to be configured:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

`SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL` must resolve to the same HTTPS origin.

The verifier never prints the service-role key or publishable key. Its success output includes only non-secret release evidence such as the Supabase origin and project identifier.

This check proves environment consistency, not database readiness. Production database/security readiness remains the responsibility of:

```text
npm run verify:supabase
npm run verify:production-readiness
npm run check:db-contract
```

## 6. Operator and scheduler contract

Production promotion requires:

- `WINKELNU_OPERATOR_EMAILS`
- `WINKELNU_OPERATOR_ROLES`
- either `CRON_SECRET` or `WINKELNU_IMPORT_TRIGGER_SECRET`

The verifier checks only presence, not secret values.

Partner-specific secrets such as Daisycon credentials remain optional until that partner is deliberately activated. A prepared integration must never be mistaken for an active production dependency.

## 7. Public-secret guard

The verifier scans `NEXT_PUBLIC_*` environment variable names and rejects names that imply exposure of:

- service-role credentials;
- client secrets;
- cron secrets.

This is a defense-in-depth naming check. It does not replace provider-dashboard review, because an incorrectly placed secret with an innocuous variable name can still be dangerous.

## 8. Deployment-provider SHA evidence

When either of these is available:

```text
VERCEL_GIT_COMMIT_SHA
GITHUB_SHA
```

it must be a full SHA and exactly equal `WINKELNU_RELEASE_SHA`.

For a Vercel-backed production release this gives an explicit chain:

`approved Git SHA → Vercel deployment Git SHA → production release SHA`

If neither provider variable is available, the release verifier reports `providerShaVerified: false`. That does not automatically fail a local pre-promotion check, but the final deployment evidence record must still prove which provider deployment corresponds to the accepted SHA.

## 9. Promotion sequence

The required release sequence is:

1. choose one immutable candidate SHA;
2. verify exact-SHA GitHub Quality workflow is successful;
3. create/build the production deployment from that SHA;
4. configure the production environment contract;
5. run `npm run verify:release-promotion` against that environment;
6. run `npm run verify:supabase`;
7. run `npm run verify:production-readiness`;
8. run `npm run check:db-contract`;
9. verify the deployment/provider reference points to the same SHA;
10. only then attach or promote `winkelnu.nl` to that deployment;
11. run `npm run verify:live-deployment` on `https://winkelnu.nl`;
12. execute the first real-feed acceptance from v1.6;
13. archive non-sensitive evidence and record ACCEPT/BLOCK.

The domain must not be the mechanism used to discover whether the release is valid. The release is validated first; the public domain is promoted second.

## 10. Release evidence template

Record at minimum:

```text
Candidate SHA:
GitHub Quality run:
Quality conclusion:

Deployment provider:
Deployment reference/ID:
Deployment Git SHA:
Production environment:
Release origin:

verify:release-promotion: PASS / FAIL
verify:supabase: PASS / FAIL
verify:production-readiness: PASS / FAIL
check:db-contract: PASS / FAIL

NEXT_PUBLIC_SITE_URL verified: yes / no
CATALOG_PERSISTENCE=supabase: yes / no
Supabase project ID verified: yes / no
Operator policy configured: yes / no
Scheduler secret configured: yes / no
Public-secret dashboard review: PASS / FAIL

Domain promoted to candidate deployment: yes / no
verify:live-deployment after promotion: PASS / FAIL
First real-feed acceptance: PASS / FAIL / PENDING

Final release decision: ACCEPT / BLOCK / ROLLBACK
Accepted at (UTC):
Operator:
Notes:
```

Never archive service-role keys, cron secrets, partner credentials, auth cookies or private generated feed URLs in this evidence record.

## 11. Hard stop conditions

Do not promote the production domain when any of these is true:

- candidate SHA is not immutable/full-length;
- exact candidate-SHA Quality run is not successful;
- deployment provider cannot be tied to the candidate SHA;
- `NEXT_PUBLIC_SITE_URL` is not exactly `https://winkelnu.nl`;
- production uses `CATALOG_PERSISTENCE=memory`;
- Supabase public/server URLs point at different projects;
- service-role/server secrets appear intentionally public;
- database/security readiness fails;
- required operator policy is missing;
- scheduler authentication is missing;
- public legal/compliance routes are materially inconsistent with runtime behavior;
- live verification fails after domain promotion.

## 12. Rollback contract

If live verification fails after promotion:

1. stop public promotion of the faulty deployment;
2. restore the previously accepted production deployment/domain target if one exists;
3. pause scheduler/import activation if the fault concerns catalog or attribution behavior;
4. retain audit, click and import history;
5. do not delete evidence to hide a failed release;
6. fix forward on a new Git SHA rather than silently mutating the accepted release identity.

A rollback target must itself be a previously accepted immutable deployment, not merely 'whatever was on main yesterday'.

## 13. Relationship to v1.6

v1.7 does not replace the v1.6 live verifier.

- v1.7 answers: **is this exact deployment allowed to become production?**
- v1.6 answers: **does the promoted public runtime and first real merchant journey actually behave correctly?**

Both gates are required for public launch acceptance.

## 14. Acceptance status

| Gate | Status |
| --- | --- |
| Immutable full-SHA promotion identity | **PASS — implemented** |
| Production-only environment identity | **PASS — implemented** |
| Exact canonical origin contract | **PASS — implemented** |
| Supabase persistence requirement | **PASS — implemented** |
| Supabase public/server origin consistency | **PASS — implemented** |
| Operator/scheduler configuration presence | **PASS — implemented** |
| NEXT_PUBLIC secret-name defense | **PASS — implemented** |
| Optional Vercel/GitHub provider-SHA match | **PASS — implemented** |
| Exact final v1.7 CI | **Must be verified on final SHA** |
| Actual production deployment reference | **PENDING external gate** |
| Domain promotion to accepted deployment | **PENDING external gate** |
| Post-promotion live verifier | **PENDING external gate** |
| First real merchant feed | **PENDING external/data gate** |

## Definition of v1.7 repository complete

Repository-side v1.7 is complete when:

1. the release-promotion verifier exists;
2. the package command exists;
3. the environment contract is documented;
4. the production go-live checklist references the promotion gate;
5. exact final-SHA CI is green.

Public production promotion remains deliberately pending until a real deployment reference can be tied to the accepted SHA.

## Next logical step

**Launch Readiness v1.8 — Production Deployment Execution & Domain Cutover Evidence**

That step should not simulate deployment. It should be executed only when the actual production deployment/provider environment is available. It will bind the accepted Git SHA to the real deployment reference, run the promotion/readiness verifiers, promote `winkelnu.nl`, and immediately run the v1.6 live evidence checks.