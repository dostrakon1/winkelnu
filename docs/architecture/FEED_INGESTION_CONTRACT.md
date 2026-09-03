# Feed Ingestion Contract v1

## Objective
Define the minimum contract every affiliate or merchant feed adapter must satisfy before data can enter Winkelnu's normalized catalog.

## Adapter output
Each source adapter should emit source-neutral candidate records containing, where available:
- source/merchant identifier
- merchant product identifier
- title
- description
- brand
- GTIN/EAN/UPC
- MPN/SKU
- category/source category
- image URL(s)
- current price
- previous/list price when supplied
- currency
- shipping cost when supplied
- availability
- product destination URL
- affiliate destination URL
- source update timestamp
- ingestion timestamp

## Required validation
Records must be rejected or quarantined when critical identifiers, destination URLs or price/currency data are structurally invalid.

## Normalization rules
- Currency values are stored as normalized decimal amounts; floating-point arithmetic must not be used for financial calculations in persistence logic.
- Merchant category names are mapped to Winkelnu categories rather than becoming canonical categories automatically.
- Source URLs and affiliate URLs remain merchant-offer attributes.
- Text encoding and whitespace are normalized before matching.
- GTIN values are sanitized and validated before being used as high-confidence identity signals.

## Identity hierarchy
Potential product matching signals, strongest first:
1. validated GTIN/EAN/UPC
2. brand + normalized MPN
3. deterministic normalized product fingerprints
4. review/manual matching for uncertain cases

A source record must never overwrite an existing canonical product solely because titles are similar.

## Freshness
Offers must retain import/source timestamps. A scheduled cleanup process will later mark stale offers inactive according to partner-specific freshness policy.

## Resilience
Feed processing is asynchronous from storefront rendering. A failed partner import must not prevent existing published catalog data from being served.
