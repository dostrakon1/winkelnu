# Winkelnu Deployment Evidence & First Real Feed Acceptance v1.6

Status: **repository-side acceptance tooling complete; live deployment and first real-feed evidence pending**

Date: 2026-09-04

## Purpose

v1.6 converts the remaining live-launch checks from an informal checklist into a repeatable acceptance procedure. The repository now contains an operator-run verifier for the exact promoted Winkelnu HTTPS origin and an explicit evidence contract for the first real merchant journey.

This step deliberately does not mark production as accepted until the actual deployment and a real production-shaped offer can be tested.

## 1. New live deployment verifier

Added:

- `scripts/verify-live-deployment.mjs`
- `npm run verify:live-deployment`

The verifier is intentionally **not** part of the normal CI `check` command. Repository CI must remain deterministic and must not depend on an external production origin being online.

The verifier requires:

```text
WINKELNU_ACCEPTANCE_ORIGIN=https://winkelnu.nl
```

It refuses a non-HTTPS origin.

Optional first-product/offer inputs:

```text
WINKELNU_ACCEPTANCE_PRODUCT_PATH=/product/<slug>
WINKELNU_ACCEPTANCE_OFFER_PATH=/uit/<offer-id>?from=/product/<slug>
WINKELNU_ACCEPTANCE_MERCHANT_HOST=<expected external host>
```

These values are operator acceptance inputs, not application credentials.

## 2. Automated deployment checks

Against the exact accepted origin the script verifies:

### Homepage

- HTTP success;
- final response remains on the accepted Winkelnu origin;
- canonical equals the exact production homepage;
- any `Set-Cookie` response value is captured into the JSON evidence output for review.

### robots.txt

- successful response;
- `/intern/` blocked;
- `/api/` blocked;
- `/uit/` blocked;
- sitemap declaration uses the exact accepted production origin.

### sitemap.xml

- successful response;
- canonical homepage present;
- `/over-winkelnu` present;
- `/affiliate-en-vergelijking` present;
- `/privacy` present;
- `/cookies` present;
- `/disclaimer` present.

### Public information canonicals

Each permanent information/legal route must return successfully and canonicalize to itself on the accepted origin.

### Search indexing policy

`/zoeken` must return successfully and expose `noindex` through robots metadata.

### Not-found semantics

A deliberately nonexistent route must:

- return HTTP 404;
- contain a page-level `h1`.

## 3. Optional first real product acceptance

When `WINKELNU_ACCEPTANCE_PRODUCT_PATH` is supplied, the verifier additionally checks:

- product page returns successfully;
- product canonical exactly matches the accepted production origin plus supplied path;
- product page contains an `h1`.

The script does not attempt to infer a product automatically because first-feed acceptance must name the actual production product being approved.

## 4. Optional affiliate redirect acceptance

When `WINKELNU_ACCEPTANCE_OFFER_PATH` is supplied, the verifier performs the request with redirects disabled and requires:

- path starts with `/uit/`;
- response is HTTP 302;
- a `Location` header exists;
- destination uses HTTPS;
- destination leaves the Winkelnu host.

If `WINKELNU_ACCEPTANCE_MERCHANT_HOST` is supplied, the redirect destination must match that host exactly.

This prevents a green acceptance result when the route accidentally redirects back into Winkelnu or to an unexpected merchant domain.

## 5. Evidence output

A successful run prints structured JSON containing:

- `ok: true`;
- accepted origin;
- UTC acceptance timestamp;
- homepage response/canonical;
- homepage `Set-Cookie` observation;
- robots and sitemap status;
- public-page canonicals;
- search robots metadata;
- not-found status;
- optional product evidence;
- optional affiliate destination host.

This output should be copied into the launch evidence record for the exact promoted SHA.

Do not store secrets, full private feed URLs, session cookies or service-role credentials in launch evidence.

## 6. First real feed manual acceptance

The automated verifier proves routing and rendered contracts, but it cannot determine whether merchant data is commercially correct. The first real feed therefore also needs the following manual acceptance.

### Product identity

- product title identifies the correct product;
- brand is correct where supplied;
- GTIN/MPN matching has not merged a different product;
- variants are not incorrectly collapsed into one canonical product;
- description is understandable and not obviously polluted by feed markup.

### Product media

- primary image belongs to the actual product;
- image aspect/contain behavior remains usable;
- broken or rejected image falls back cleanly;
- image does not cause horizontal overflow.

### Merchant and offer data

- merchant display name is correct;
- product price matches the source feed at acceptance time;
- known shipping cost is displayed correctly;
- unknown shipping remains explicitly unknown rather than being presented as free;
- known total price equals product price plus known shipping;
- availability wording matches feed data without overstating certainty.

### Ranking

For the approved product, compare all active visible offers manually and confirm:

- expired offers are excluded;
- inactive offers are excluded;
- ranking follows known total amount;
- missing shipping does not become a false `€0` shipping claim;
- affiliate compensation is not being used as an undisclosed organic ranking criterion.

### Merchant journey

Perform the complete visitor path:

1. discover product from homepage/category/search;
2. open canonical product detail;
3. inspect comparison explanation;
4. choose a real merchant offer;
5. follow `/uit/<offer-id>`;
6. confirm destination merchant/product context;
7. confirm the merchant remains responsible for checkout;
8. verify click attribution is recorded once as expected.

## 7. Click-attribution evidence

The browser-side redirect test alone cannot prove the database event was recorded correctly.

For the accepted offer, inspect the server-side attribution store and record only non-sensitive evidence such as:

- acceptance timestamp;
- internal offer identifier;
- internal product identifier where appropriate;
- internal merchant identifier where appropriate;
- source path if present;
- expected single-event count.

Do not copy raw IP addresses, browser fingerprints or unrelated request logs into the launch record.

## 8. Runtime privacy review

The live verifier surfaces homepage `Set-Cookie`, but a browser/manual pass is still required for:

- cookies after initial page load;
- localStorage;
- sessionStorage;
- IndexedDB;
- analytics/network requests;
- consent behavior if optional trackers are ever introduced;
- internal Supabase Auth cookies remaining scoped to operator functionality rather than becoming a public customer-account dependency.

Any runtime behavior that conflicts with `/privacy` or `/cookies` blocks launch acceptance until either the runtime or the public policy is corrected.

## 9. Production evidence record template

Complete this only against the exact promoted production SHA.

```text
Accepted SHA:
Deployment provider/reference:
Acceptance origin:
Accepted at (UTC):
Operator:

npm run verify:live-deployment: PASS / FAIL
Verifier output archived: yes / no

Homepage HTTPS + canonical: PASS / FAIL
robots.txt: PASS / FAIL
sitemap.xml: PASS / FAIL
public legal/information canonicals: PASS / FAIL
/search noindex: PASS / FAIL
404 status + h1: PASS / FAIL

First real feed/integration:
Merchant:
Feed source:
Product slug:
Offer id:
Expected merchant host:

Product identity: PASS / FAIL
Product media: PASS / FAIL
Price/shipping accuracy: PASS / FAIL
Availability accuracy: PASS / FAIL
Offer ranking: PASS / FAIL
Affiliate redirect: PASS / FAIL
Single click attribution event: PASS / FAIL

Keyboard smoke test: PASS / FAIL
Mobile/zoom smoke test: PASS / FAIL
Screen-reader smoke test: PASS / FAIL
Runtime cookie/storage review: PASS / FAIL

Final decision: ACCEPT / BLOCK
Blocking notes:
```

## 10. Acceptance status

| Gate | Status |
| --- | --- |
| Repository deployment verifier | **PASS — implemented** |
| HTTPS-only acceptance-origin contract | **PASS — implemented** |
| Homepage canonical verification | **PASS — automated contract implemented** |
| robots/sitemap verification | **PASS — automated contract implemented** |
| legal/information canonical verification | **PASS — automated contract implemented** |
| search noindex verification | **PASS — automated contract implemented** |
| 404 status/h1 verification | **PASS — automated contract implemented** |
| optional real product canonical/h1 verification | **PASS — automated contract implemented** |
| optional affiliate 302/external-host verification | **PASS — automated contract implemented** |
| exact final v1.6 CI | **Must be verified on final SHA** |
| public production deployment evidence | **PENDING external gate** |
| first real merchant feed data acceptance | **PENDING external/data gate** |
| click-attribution persistence evidence | **PENDING external/data gate** |
| manual browser accessibility/privacy acceptance | **PENDING external gate** |

## Definition of v1.6 repository complete

The repository portion is complete when:

1. the live deployment verifier exists;
2. its environment contract is documented;
3. package command is present;
4. exact-HEAD CI is green.

The **production acceptance** portion remains pending until a promoted `https://winkelnu.nl` deployment and at least one real production-shaped merchant offer have passed the evidence record above.

## Next logical step

If the public deployment is still not reachable, the next engineering step should be **Launch Readiness v1.7 — Production Deployment Contract & Release Promotion Gate**: make the deploy/promotion boundary itself explicit so the exact Git SHA, Vercel environment, production URL and required environment variables can be proven before domain cutover.

If `https://winkelnu.nl` is already reachable with real catalog data, skip that preparatory step and execute the v1.6 evidence run directly against production.
