# Catalog Scale Query Pushdown

Status: M0.25 repository-side implementation.

## Goal
Remove the bootstrap N+1 product-detail pattern and the application-side 240-product search cap from the Supabase storefront path without changing public route/service contracts.

## Read-model boundary
`CatalogRankingReadModel` is a read-only application port. Memory/development keeps the existing repository implementation. Supabase uses `ScalableCatalogService` plus `SupabaseCatalogRankingReadModel`.

## Postgres responsibilities
Migration `0008_catalog_ranking_read_model.sql` adds `catalog_ranked_products` and supporting indexes. The function performs:
- published-product/category filtering;
- case-insensitive term and brand filtering;
- best active merchant offer selection by landed price (price + known shipping);
- M0.24 freshness cutoff: offers older than 72 hours are excluded;
- fresh/stale classification at the 24-hour boundary;
- min/max/in-stock checks against the actual best offer;
- relevance/price/title sorting;
- bounded offset/limit pagination.

The RPC is service-role-only. Browser code never receives database privileges or invokes it directly.

## Compatibility
The public `CatalogService` contract remains the storefront boundary. `createStorefrontCatalogService()` selects:
- memory: original `CatalogService` + synthetic/in-memory repository;
- Supabase: `ScalableCatalogService` + ranking read model.

Product-detail reads remain on the existing repository because they are one product request rather than an N+1 listing path. A later scale phase may introduce a dedicated detail read model if measured volume requires it.

## Correctness invariant
Price, stock and range filters apply after the cheapest eligible non-expired offer has been selected. A more expensive offer must never be promoted to best-offer merely because the true cheapest offer falls outside a search filter.

## External gate
The migration and adapter are committed but not applied to a live Supabase project. Query plans, index effectiveness and real-volume latency remain live activation checks.
