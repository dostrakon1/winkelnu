# Realistic Partner Adapter Contract

Status: M0.17 repository-side baseline.

## Purpose

A partner adapter is an anti-corruption boundary between an external affiliate/feed provider and Winkelnu's normalized `FeedCandidate` contract.

External provider field names, pagination semantics and data-quality problems must not leak into catalog/domain code.

## Proven fixture flow

```text
Affiliate registry
  → PartnerFeedSourceResolver
  → PartnerFeedAdapterRegistry
  → RealisticPartnerFixtureAdapter
  → provider cursor pages
  → FeedCandidate[]
  → importFeed
  → validation + matching
  → canonical products + merchant offers
```

## Fixture provider shape

The M0.17 fixture deliberately uses provider-style fields such as:

- `offer_id`
- `product_name`
- `brand_name`
- `ean`
- `manufacturer_part_number`
- `sale_price`
- `delivery_cost`
- `stock_state`
- `landing_url`
- `tracking_url`
- `next_cursor`

These names never leave the fixture adapter.

## Mapping rules

The adapter maps provider records into the existing normalized feed contract:

- provider offer ID → `merchantProductId`
- product name → `title`
- EAN → `gtin`
- manufacturer part number → `mpn`
- sale price → EUR `price`
- delivery cost → EUR `shippingCost`
- provider stock state → normalized availability
- landing URL → `productUrl`
- tracking URL → `affiliateUrl`

## Pagination

The provider fixture uses cursor pagination.

The adapter accepts the previous `nextCursor` and returns another normalized `FeedPage`. `importFeed` remains unaware of the provider's pagination format.

Unknown cursors fail closed with an explicit adapter error.

## Data-quality proof

The second fixture page contains one deliberately malformed record:

- missing product title;
- negative price;
- HTTP product URL;
- HTTP tracking URL.

The adapter maps the record faithfully, but the existing domain validation rejects it. Valid records on the same import continue to be accepted.

This proves the intended responsibility split:

```text
adapter = translate external shape
validation = decide whether normalized candidate is acceptable
```

Adapters must not silently repair materially invalid commercial data merely to make an import pass.

## Import ordering correction

M0.17 also corrected the import bootstrap order:

```text
upsert merchant
→ create import run/feed source relation
→ traverse provider pages
```

This matters for relational persistence such as Supabase/Postgres, where the merchant foreign-key relation must exist before the import run/feed source can be created.

## Credential boundary

The fixture requires no credential. Real partner adapters may receive a resolved server-side credential from `PartnerFeedAdapterRegistry`, but the normalized feed contract, importer and domain never receive secret references or secret values.

## Next step

The next integration milestone can replace the fixture transport with one real network/merchant adapter while retaining the same resolver, registry, pagination and normalized candidate contracts.
