# Affiliate Redirect & Click Attribution Architecture

Status: active baseline from M0.14.

## Purpose

Winkelnu must not expose merchant affiliate destinations as the storefront's primary navigation contract. Public product pages link to a stable internal offer route and the server resolves the current stored affiliate destination.

Flow:

`product page → /uit/<offer-id> → AffiliateRedirectService → AffiliateAttributionRepository → stored active offer → click event → HTTPS redirect`

## Invariants

1. The destination is resolved from the stored offer; callers cannot supply an arbitrary redirect URL.
2. Unknown or inactive offers never redirect to their stored destination.
3. Only HTTPS destinations without embedded credentials are accepted.
4. The redirect fails closed to an internal unavailable-offer page.
5. A successful redirect writes one click event before returning the redirect response.
6. Baseline attribution stores no raw IP address and no user-agent fingerprint.
7. The internal `from` value is accepted only when it is a relative Winkelnu path.
8. Product pages retain `rel="nofollow sponsored"` on affiliate CTAs even though the immediate href is an internal redirect route.

## Click event baseline

Stored fields:
- stable event external key;
- offer relation;
- product relation;
- merchant relation;
- optional internal source path;
- occurrence timestamp.

Not stored in the baseline:
- raw IP address;
- user-agent fingerprint;
- third-party tracking identifier;
- arbitrary inbound referrer URL.

## Why the redirect route is stable

Affiliate destinations can change independently from public Winkelnu URLs. Product pages reference the durable internal offer identity. Feed updates can refresh `affiliate_url` without rewriting public product content or invalidating historical click attribution.

## Failure behavior

If an offer disappears, becomes inactive or contains an invalid destination, `/uit/<offer-id>` redirects to `/aanbieding-niet-beschikbaar` instead of trusting stale or unsafe data.

## Future extensions

Possible later additions require explicit product/compliance decisions:
- affiliate-network attribution metadata;
- campaign/sub-ID propagation;
- conversion reconciliation;
- aggregate reporting;
- fraud/abuse controls;
- consent-aware analytics enrichment.

These are not prerequisites for the baseline redirect contract.
