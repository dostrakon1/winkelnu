# Catalog Quality & Import Observability

Status: Active architecture baseline  
Milestone: M0.7  
Date: 2026-09-03

## Purpose

Affiliate feeds are external, mutable and not automatically trustworthy. Winkelnu therefore treats ingestion as an auditable process rather than a direct database import.

## Import lifecycle

Every feed execution creates an `ImportRun` before records are processed.

A run records:

- source and merchant identity;
- start and finish timestamps;
- records seen, accepted and rejected;
- offers deactivated as stale;
- matching decisions requiring review;
- a bounded error summary;
- final status.

Supported final states are `completed`, `completed_with_errors` and `failed`.

## Rejected records

A record that fails validation or is an exact duplicate merchant-product record inside the same run does not enter the public catalog.

Its rejection is written separately with the source identity, merchant product ID, reasons and timestamp. Production persistence may additionally retain a bounded/sanitised raw source record for diagnostics where partner terms and privacy rules permit this.

## Duplicate handling

Winkelnu distinguishes several duplicate cases:

1. The same merchant product ID occurs twice in one import: reject the later duplicate record.
2. Different source records map to the same canonical product: preserve the offers but flag the matching decision for review.
3. Strong identifiers such as GTIN can intentionally connect offers from different merchants to the same canonical product.
4. Weak textual similarity must never silently merge canonical products.

## Matching review

Every ambiguous match is represented by a `MatchReviewItem` with:

- matching method;
- confidence;
- reasons;
- candidate canonical product;
- pending/approved/rejected status;
- audit timestamps.

`source_identity` is intentionally reviewable because it does not establish cross-merchant identity.

## Stale offers

A successful import marks every accepted current offer with the run start timestamp as `lastSeenAt`.

Only after the feed has been fully traversed does Winkelnu deactivate active offers for that merchant whose `lastSeenAt` is older than the current run start.

This ordering is deliberate: if feed retrieval or processing throws before completion, stale-offer deactivation is not executed. A temporary feed outage must therefore never make an entire merchant disappear from the storefront.

## Public catalog rule

Operational quality state is not storefront presentation state. Rejects, raw records, errors and review queues belong to internal operations tooling and must not leak into public product pages.

## Persistence mapping

The initial PostgreSQL model uses:

- `import_runs` for run-level metrics;
- `import_rejects` for rejected records;
- `product_match_reviews` for ambiguous matching decisions;
- `offers.last_seen_at` and `offers.is_active` for freshness.

## Future extensions

Later milestones can add alert thresholds, source health scores, automatic retry/backoff, feed freshness SLAs, operator resolution workflows and historical price/availability events without changing the core storefront boundary.
