# Feed Traversal Safety & Stale Data Policy

## Purpose
External affiliate feeds are untrusted operational input. A malformed provider cursor, unexpectedly huge dataset or stalled traversal must never consume a worker indefinitely. Likewise, Winkelnu must not present old prices as if they were freshly verified.

## Traversal safety
Every `importFeed` run is protected by `FeedTraversalGuard`.

Default limits:
- maximum pages: **10,000**;
- maximum wall-clock traversal time: **30 minutes**;
- repeated non-empty cursor: immediate failure.

Hard constructor caps prevent accidental configuration above 100,000 pages or 6 hours.

The runtime clock is deliberately separate from domain/import timestamps. Tests can freeze `now()` while runtime safety continues to use a monotonic-style millisecond source.

### Failure semantics
Traversal safety violations are normal import failures:
- the current import run becomes `failed`;
- the error is retained in `errorSummary`;
- stale-offer cleanup is not executed;
- orchestration handles retry/backoff;
- storefront availability is unaffected.

A provider returning the same cursor twice is never retried inside the same traversal. It is treated as a provider/adapter contract failure.

## Offer freshness
Freshness is based on `Offer.lastSeenAt`, not `sourceUpdatedAt`.

Reason: `sourceUpdatedAt` may represent the last time the merchant changed a price, while `lastSeenAt` means Winkelnu actually re-observed that unchanged price in a current feed.

Baseline policy:
- `fresh`: verified no more than 24 hours ago;
- `stale`: older than 24 hours, up to and including 72 hours;
- `expired`: older than 72 hours or timestamp invalid.

### Storefront behavior
- fresh offers participate normally in ranking;
- stale offers remain visible and carry `freshness: stale` so UI can disclose that the data is older;
- expired offers are suppressed from product detail, listing best-offer selection and search through `CatalogService`;
- suppression does not delete historical offer rows.

This means a temporary feed outage does not instantly erase all merchant offers, while a prolonged outage cannot leave an old price indefinitely presented as current.

## Operational tuning
The 24h/72h thresholds are a platform baseline, not a partner promise. A later partner policy may tighten them when a network requires faster price freshness.

The worker/deployment runtime may impose a stricter timeout than the 30-minute application budget. The stricter limit wins operationally.

## Invariants
1. No feed traversal is unbounded.
2. A cursor cannot be revisited in one import run.
3. A failed/partial traversal never triggers stale-offer deactivation.
4. Old offer data cannot remain indefinitely eligible for public ranking.
5. Historical persistence is separate from storefront eligibility.
