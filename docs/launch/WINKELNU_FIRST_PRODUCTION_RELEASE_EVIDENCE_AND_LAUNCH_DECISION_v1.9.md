# Winkelnu First Production Release Evidence & Launch Decision v1.9

Status: **final release-evidence architecture implemented; actual first production launch decision remains BLOCK until live evidence exists**

Date: 2026-09-04

## Purpose

v1.9 is the final launch-readiness evidence layer for the first public Winkelnu release. It combines the previously separate repository, deployment, database, domain, SEO, compliance, accessibility, privacy and real-feed gates into one explicit release record.

The goal is simple: Winkelnu may only be called launched when one immutable production release has a complete evidence record and every required gate is `PASS`.

## Important CI correction discovered before v1.9

The v1.8 exact-HEAD Quality run `#584` completed with **failure**, not success.

The failure was in lint and exposed two real repository issues:

1. `src/app/error.tsx` used plain `<a>` navigation for internal Next.js pages;
2. `src/components/storefront/product-media.tsx` synchronously reset React state inside an effect, which violated the current React hooks lint contract.

A non-blocking unused-parameter warning also existed in the operator-facing recovery error helper.

All three were corrected before the v1.9 evidence layer was added:

- internal error-page navigation now uses `next/link`;
- product media now tracks the failed source URL without a reset effect, so a new image URL naturally gets a fresh attempt;
- the recovery-error argument remains API-compatible but is explicitly consumed without exposing internal error details.

Therefore v1.8 itself must **not** be treated as CI-green. The first release candidate must use a later SHA whose exact Quality run succeeds.

## 1. Canonical evidence record

Added:

`docs/launch/evidence/FIRST_PRODUCTION_RELEASE_EVIDENCE.json`

This is intentionally committed in a non-approved state:

- release SHA empty;
- live deployment reference empty;
- every evidence gate `PENDING`;
- final decision `BLOCK`.

The template must never be changed to `PASS` merely because implementation exists. Each field represents evidence from an actual release candidate or live production acceptance action.

## 2. Evidence verifier

Added:

- `scripts/verify-first-production-release-evidence.mjs`
- `npm run verify:first-release-evidence`

Default input:

`docs/launch/evidence/FIRST_PRODUCTION_RELEASE_EVIDENCE.json`

An alternative evidence file may be supplied with:

`WINKELNU_RELEASE_EVIDENCE_FILE=<path>`

The verifier is deliberately fail-closed.

## 3. Required release identity

The evidence record can pass only when:

- `release.sha` is a full immutable 40-character Git SHA;
- `release.environment` is exactly `production`;
- `release.origin` is exactly `https://winkelnu.nl`;
- a deployment provider/reference is recorded;
- a valid UTC acceptance timestamp is recorded.

This binds the launch decision to one real artifact rather than to `main`, a branch label or an ambiguous deployment URL.

## 4. Required launch gates

Every gate below must equal `PASS` before the final verifier succeeds:

1. `exactHeadCi`
2. `releasePromotion`
3. `supabaseConnection`
4. `productionReadiness`
5. `databaseContract`
6. `domainCutover`
7. `liveDeployment`
8. `legalCompliance`
9. `keyboardMobileAccessibility`
10. `runtimePrivacy`
11. `firstRealFeed`
12. `affiliateRedirect`
13. `singleClickAttribution`

There is intentionally no `WARN` state accepted by the final verifier. A non-critical observation belongs in notes; a required gate either passed or the first release remains blocked.

## 5. First real feed identity

A release cannot be accepted with only synthetic catalog evidence.

The record requires a real accepted journey containing:

- merchant name;
- product slug;
- offer ID;
- expected external merchant host.

These values link the final launch decision to a concrete visitor journey:

`discovery → canonical product → comparison → /uit/<offer-id> → external merchant`

The corresponding database evidence must confirm the expected single click-attribution event.

## 6. Final decision contract

The verifier accepts only:

`decision.status = ACCEPT`

and requires a named approving operator plus a notes field.

The decision must remain `BLOCK` when any of the following is still true:

- exact release SHA has no successful Quality run;
- release-promotion verifier fails;
- production Supabase verification fails;
- domain cutover is incomplete or points to another deployment;
- live canonical/robots/sitemap checks fail;
- legal/privacy runtime differs materially from published policy;
- accessibility smoke acceptance is incomplete;
- no real merchant feed has been accepted;
- affiliate redirect reaches the wrong host;
- click attribution cannot be proven to persist correctly.

## 7. First-release execution sequence

When Winkelnu is ready for the actual first public release, execute in this order:

### Candidate freeze

1. Select exact Git SHA.
2. Stop treating newer `main` commits as part of that release.
3. Confirm Quality succeeds on that exact SHA.

### Pre-promotion

4. Build production deployment from the same SHA.
5. Configure production environment contract.
6. Run `npm run verify:release-promotion`.
7. Run `npm run verify:supabase`.
8. Run `npm run verify:production-readiness`.
9. Run `npm run check:db-contract`.

### Domain cutover

10. Attach/promote `winkelnu.nl` to the accepted deployment.
11. Run `npm run verify:domain-cutover`.

### Live acceptance

12. Run `npm run verify:live-deployment`.
13. Complete keyboard/mobile/screen-reader smoke checks.
14. Complete runtime cookie/storage/network inspection.
15. Confirm legal/compliance copy matches live behavior.

### First merchant acceptance

16. Import/activate the first production-shaped real merchant feed.
17. Approve one concrete product identity and its offer data.
18. Confirm pricing/shipping/availability/ranking accuracy.
19. Follow the real `/uit/<offer-id>` route.
20. Confirm the expected external merchant host.
21. Confirm one corresponding application click-attribution event.

### Decision

22. Fill `FIRST_PRODUCTION_RELEASE_EVIDENCE.json` with actual non-sensitive evidence references and statuses.
23. Set every required gate to `PASS` only where proven.
24. Set decision to `ACCEPT` only when no launch blocker remains.
25. Run `npm run verify:first-release-evidence`.
26. Archive the accepted SHA, deployment reference and evidence record.

Only after step 25 succeeds may the first production release be formally described as accepted.

## 8. Evidence hygiene

The launch record must contain enough information to reproduce the decision, but must not become a secret dump.

Never commit:

- Supabase service-role key;
- publishable/auth session values that should remain runtime-only;
- cron/import secrets;
- Daisycon client secret;
- private generated feed URLs;
- session cookies;
- raw visitor IP addresses;
- unrelated request logs;
- merchant/network credentials.

Use non-sensitive identifiers, timestamps, internal IDs and provider deployment references instead.

## 9. Current v1.9 status

| Item | Status |
| --- | --- |
| Final evidence JSON template | **IMPLEMENTED** |
| Fail-closed final evidence verifier | **IMPLEMENTED** |
| Package verification command | **IMPLEMENTED** |
| v1.8 CI failure investigated | **COMPLETE** |
| v1.8 lint blockers corrected | **IMPLEMENTED** |
| Exact final v1.9 CI | **PENDING exact final SHA** |
| Production deployment | **PENDING external gate** |
| Domain cutover | **PENDING external gate** |
| Live runtime acceptance | **PENDING external gate** |
| First real merchant feed | **PENDING data/partner gate** |
| Final release evidence status | **BLOCK by design until evidence exists** |

## Definition of v1.9 repository complete

The repository portion of v1.9 is complete when the exact final SHA passes Quality.

The **first production release** is complete only when `npm run verify:first-release-evidence` passes against a truthful evidence record built from the actual deployed release.

## Next logical step

The architecture phase is now effectively finished. The next meaningful phase is no longer another theoretical launch-readiness version.

The next step should be **First Production Candidate — CI Stabilisation, Vercel Deployment & Live Cutover Execution**.

That phase starts by obtaining a green exact-HEAD Quality run for the current repository, then deploying that candidate and filling the v1.9 evidence record with real production evidence rather than adding more preparatory architecture.
