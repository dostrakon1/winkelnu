# Daisycon First Real Partner Readiness

Status: M0.18 repository-side readiness. No production credentials or live imports enabled.

## Why Daisycon first

Daisycon is a strong first real integration target for Winkelnu because its publisher tooling explicitly supports product feeds for comparison/catalog use-cases, JSON/XML/CSV delivery, OAuth-backed API access, a sandbox environment, documented rate limits and product-feed pagination.

## External contract verified on 3 September 2026

- Publisher API authentication uses OAuth.
- Daisycon offers a sandbox API at `https://services-sandbox.daisycon.com` and production at `https://services.daisycon.com`.
- Production API throttling is documented as 50 requests/minute/IP.
- Sandbox throttling is documented as 15 requests/minute/IP.
- Product feeds can be generated in XML, JSON or CSV.
- Pagination for a single program can use `records=<n>` and the response `X-Next-Url` header; `X-Current-Count` and `X-Total-Count` are also provided.

## Winkelnu integration split

### 1. Product-feed delivery

Catalog ingestion uses `DaisyconProductFeedAdapter`.

The generated Daisycon product-feed URL is stored server-side as a secret reference and is never committed to GitHub or exposed to the browser.

The adapter:
- requires HTTPS;
- requests JSON;
- follows `X-Next-Url` only when it stays on the same origin as the initial feed URL;
- retries HTTP 429 and 5xx responses with bounded retry count and bounded Retry-After delay;
- fails closed for 4xx responses such as 401/403;
- maps provider records through an injected feed-standard mapper into `FeedCandidate`;
- leaves final validation to the existing Winkelnu feed validation layer.

### 2. Publisher/API operations

OAuth/API access is a separate concern from catalog feed transport. Environment placeholders exist for:

- `DAISYCON_CLIENT_ID`
- `DAISYCON_CLIENT_SECRET`
- `DAISYCON_PUBLISHER_ID`
- `DAISYCON_MEDIA_ID`

No OAuth token storage or live API mutation is implemented in M0.18. The first live use should be read-only sandbox verification of publisher/program/feed metadata.

## Secret model

For the feed integration, `MerchantAffiliateIntegration.secretRef` should point to:

`env:DAISYCON_PRODUCT_FEED_URL`

The actual generated URL is injected only in the server runtime. OAuth secrets remain separate server environment variables.

## Registry model

Recommended first registry entities:

- network id: `network:daisycon`
- network slug: `daisycon`
- network kind: `network`
- integration kind: `network`
- source type: `json`
- adapter key resolved by infrastructure: `daisycon:json`

A specific merchant/program integration should not be registered until Winkelnu has been approved for that program.

## Mapping policy

Daisycon feed standards/campaigns may expose different field sets. Winkelnu therefore does not hard-code one universal Daisycon record schema as a business-domain contract.

`mapDaisyconStandardProductRecord` is only a baseline mapper for common fields. Once a real feed is generated, capture a sanitized sample and verify the mapping for:

- merchant product ID;
- title/description;
- brand;
- GTIN/EAN/MPN;
- category;
- image URL;
- price;
- shipping cost;
- availability;
- product URL;
- Daisycon tracking/deeplink;
- source update timestamp.

Unknown or invalid values remain subject to the existing Winkelnu validator and reject observability.

## Rate-limit policy

Winkelnu must operate below provider limits rather than using the documented ceiling as a target.

Initial policy:
- no parallel page fan-out for one feed;
- sequential `X-Next-Url` traversal;
- retry only 429 and 5xx;
- maximum two retries per page by default;
- honour `Retry-After` but cap an individual sleep at 15 seconds in-process;
- scheduled import frequency should be chosen from merchant/feed freshness requirements rather than continuously polling.

Longer provider outages should fail the import run and be handled by the worker/scheduler layer rather than keeping a single request alive indefinitely.

## SSRF and redirect safety

The public application never accepts a Daisycon feed URL from an HTTP query parameter.

The initial URL comes from server secret storage. Pagination URLs supplied by Daisycon must:
- be valid HTTPS URLs;
- have the exact same origin as the initial feed URL.

This prevents a compromised/malformed `X-Next-Url` from turning the import worker into an arbitrary URL fetcher.

## Sandbox/read-only activation gate

Before any production import:

1. Create/approve a Daisycon publisher account and media for Winkelnu.
2. Register a Daisycon developer application if API access is needed.
3. Store credentials only in local/Vercel server secrets.
4. Use the sandbox for OAuth/API connectivity tests.
5. Make only read-only requests initially.
6. Select one approved merchant/program with a product feed.
7. Generate a JSON product feed for a single program so pagination is available.
8. Store the generated feed URL as `DAISYCON_PRODUCT_FEED_URL`.
9. Capture a sanitized response sample and verify its actual fields against the mapper.
10. Run one preview import into non-production persistence.
11. Confirm rejects, matching reviews, price/shipping, availability and affiliate URLs.
12. Verify repeated import idempotency and stale-offer deactivation.
13. Only then enable a scheduled production import.

## Not yet completed

M0.18 deliberately does not claim:
- a Daisycon publisher account exists;
- a developer app has been created;
- any merchant/program approval exists;
- OAuth credentials exist;
- a real product-feed URL exists;
- the sandbox has been contacted;
- live Daisycon field mapping is verified;
- any production feed has been imported.

Those are external activation gates, not repository architecture gaps.
