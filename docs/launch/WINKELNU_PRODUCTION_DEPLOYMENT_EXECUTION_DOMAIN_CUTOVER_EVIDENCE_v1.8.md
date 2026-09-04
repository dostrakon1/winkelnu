# Winkelnu Production Deployment Execution & Domain Cutover Evidence v1.8

Status: **repository-side execution gate implemented; actual provider deployment/domain cutover evidence pending**

Date: 2026-09-04

## Purpose

v1.8 turns the production-domain handoff into a verifiable execution sequence. It does not claim that `winkelnu.nl` is live merely because a deployment exists or a provider dashboard says a domain is configured.

A successful cutover must be proven externally through DNS, transport redirects, the canonical HTTPS origin, robots and sitemap behavior, followed by the full v1.6 live deployment and first-real-feed acceptance.

## 1. New domain cutover verifier

Added:

- `scripts/verify-domain-cutover.mjs`
- `npm run verify:domain-cutover`

Required input:

```text
WINKELNU_CUTOVER_ORIGIN=https://winkelnu.nl
```

The verifier refuses a non-HTTPS canonical origin and currently requires the canonical production hostname to be exactly `winkelnu.nl`.

## 2. Explicit www policy

The launch contract now requires one deliberate choice:

```text
WINKELNU_CUTOVER_WWW_MODE=redirect
```

or:

```text
WINKELNU_CUTOVER_WWW_MODE=unused
```

### redirect

Use this when `www.winkelnu.nl` is part of the public DNS contract. The verifier requires:

- DNS resolution for `www.winkelnu.nl`;
- an HTTP redirect response from the `www` HTTPS origin;
- redirect destination exactly on the canonical `https://winkelnu.nl` origin.

### unused

Use this only if `www` is intentionally excluded from the launch contract. It is not a shortcut for a broken or forgotten `www` configuration.

The recommended production posture is `redirect` so common `www` traffic cannot fall onto an unrelated host or dead endpoint.

## 3. DNS evidence

The verifier resolves the apex production hostname through the running machine's external DNS resolver and captures:

- IPv4 (`A`) results;
- IPv6 (`AAAA`) results when present;
- CNAME results when applicable.

It requires at least one resolvable DNS result.

The verifier deliberately does **not** hardcode a Vercel IP address or CNAME. Provider DNS targets can change, and the acceptance concern is that the configured production host resolves and serves the accepted application—not that it matches a stale IP copied into repository policy.

## 4. HTTP → HTTPS transport gate

The verifier requests:

```text
http://winkelnu.nl/
```

without following redirects and requires:

- a redirect status (`301`, `302`, `307` or `308`);
- a `Location` header;
- destination protocol `https:`;
- destination host `winkelnu.nl`.

This prevents a launch where the HTTPS storefront works but the plain HTTP entry point remains incorrectly configured.

## 5. Canonical HTTPS gate

The verifier requests:

```text
https://winkelnu.nl/
```

and follows provider/network redirects. Acceptance requires:

- successful final response;
- final origin remains `https://winkelnu.nl`;
- no escape to a preview hostname, provider hostname or another domain.

The release may use internal provider deployment URLs for build/preview purposes, but they must not become the canonical production visitor origin.

## 6. robots and sitemap cutover gate

After DNS cutover, the verifier additionally requires:

- `/robots.txt` succeeds;
- robots advertises exactly `https://winkelnu.nl/sitemap.xml`;
- `/sitemap.xml` succeeds;
- sitemap contains canonical URLs under `https://winkelnu.nl`.

This catches a common production mistake where DNS is correct but a stale environment variable still generates preview-domain SEO metadata.

## 7. Execution order

A production launch candidate should now move through this exact sequence:

1. choose exact full Git SHA;
2. exact-SHA GitHub Quality workflow passes;
3. provider builds candidate from that exact SHA;
4. production environment variables are configured;
5. `npm run verify:release-promotion` passes;
6. `npm run verify:supabase` passes;
7. `npm run verify:production-readiness` passes;
8. `npm run check:db-contract` passes;
9. attach/promote `winkelnu.nl` to the accepted deployment;
10. allow DNS change to become externally resolvable;
11. `npm run verify:domain-cutover` passes;
12. `npm run verify:live-deployment` passes;
13. execute first-real-feed/product/offer acceptance;
14. complete manual keyboard/mobile/screen-reader and runtime privacy smoke tests;
15. record final ACCEPT/BLOCK decision.

A provider dashboard showing `Valid Configuration` is useful operational evidence but is not sufficient by itself for step 11.

## 8. Cutover evidence template

Archive only non-sensitive evidence.

```text
Release SHA:
GitHub Quality run:
Quality conclusion:

Deployment provider:
Deployment reference / ID:
Provider deployment SHA:
Production environment: production

Canonical origin: https://winkelnu.nl
NEXT_PUBLIC_SITE_URL: https://winkelnu.nl
CATALOG_PERSISTENCE: supabase
Supabase project reference: [non-secret project reference only]

DNS changed at:
DNS provider / registrar:
A/AAAA/CNAME observation:
www mode: redirect / unused

npm run verify:release-promotion: PASS / FAIL
npm run verify:supabase: PASS / FAIL
npm run verify:production-readiness: PASS / FAIL
npm run check:db-contract: PASS / FAIL
npm run verify:domain-cutover: PASS / FAIL
npm run verify:live-deployment: PASS / FAIL

First real product:
First real offer:
Expected merchant host:
First real feed acceptance: PASS / FAIL

Manual browser/accessibility/privacy acceptance: PASS / FAIL

Final decision: ACCEPT / BLOCK
Blocking reason:
Accepted at UTC:
```

Never archive:

- service-role keys;
- publishable key if internal policy treats it as operational-only evidence;
- cron/import secrets;
- OAuth client secrets;
- private feed URLs;
- session cookies;
- raw visitor IP data.

## 9. Rollback behavior

If DNS cutover succeeds but application acceptance fails:

- prefer restoring the previously accepted immutable deployment when available;
- keep the canonical hostname `winkelnu.nl` rather than changing metadata to a temporary provider URL;
- fix forward on a new Git SHA;
- rerun the entire release-promotion and cutover evidence chain;
- retain historical import/click/audit/idempotency evidence.

If DNS itself is wrong:

- correct DNS/provider domain configuration;
- wait for external resolver evidence;
- rerun `verify:domain-cutover`;
- do not declare launch based solely on local DNS cache or the deployment dashboard.

## 10. Current v1.8 status

| Gate | Status |
| --- | --- |
| Domain cutover verifier | **PASS — implemented** |
| HTTPS-only canonical origin contract | **PASS — implemented** |
| External DNS resolution check | **PASS — automated contract implemented** |
| Apex HTTP → HTTPS check | **PASS — automated contract implemented** |
| Canonical HTTPS-origin check | **PASS — automated contract implemented** |
| Explicit www redirect/unused policy | **PASS — implemented** |
| robots production-sitemap check | **PASS — automated contract implemented** |
| sitemap canonical-origin check | **PASS — automated contract implemented** |
| Production checklist integration | **PASS — implemented** |
| Exact final v1.8 CI | **Must be verified on final SHA** |
| Actual provider production deployment | **PENDING external gate** |
| Actual `winkelnu.nl` DNS cutover | **PENDING external gate** |
| Live domain verifier execution | **PENDING external gate** |
| v1.6 real-feed acceptance | **PENDING external/data gate** |

## Important boundary

This repository can define and automate acceptance, but it cannot by itself attach the domain inside Vimexx/Vercel or edit production environment variables in a provider account without an authorised provider connection. Those external changes must be performed in the relevant account, after which the committed verifiers can prove the result.

## Definition of v1.8 complete

The repository portion is complete when the domain verifier, environment contract, package command, checklist integration and exact-HEAD CI all pass.

The **execution portion** is complete only when a real accepted deployment has been promoted, DNS resolves externally, `verify:domain-cutover` and `verify:live-deployment` both pass, and first-real-feed evidence is complete.

## Next logical step

If the production deployment/provider configuration is ready, the next step is **Launch Readiness v1.9 — First Production Release Evidence Record & Launch Decision**: execute the release/cutover commands against the real environment and capture one immutable launch evidence record.

If the provider/domain configuration has not yet been performed, that external configuration is the immediate prerequisite; do not simulate a production PASS in repository documentation.
