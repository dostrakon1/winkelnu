# Winkelnu Foundation Architecture

## Purpose
Winkelnu is a multi-merchant affiliate and comparison platform. The architecture must therefore separate storefront concerns from catalog normalization, merchant offers and feed ingestion.

## High-level layers

### 1. Storefront
Public Next.js App Router application responsible for SEO pages, discovery, comparison UX and outbound affiliate actions.

### 2. Domain
Framework-light business concepts such as Product, Offer, Merchant and Category. UI code may consume these concepts but should not redefine them.

### 3. Application services
Use-case orchestration such as search, product detail aggregation, offer ranking, favorites and click tracking. These services will be introduced incrementally.

### 4. Persistence
Postgres/Supabase is the planned source of truth for normalized catalog and application data. Schema work is deliberately separated from the public UI.

### 5. Feed ingestion
External partner data must enter through adapters. Raw merchant feeds are never treated as the public catalog directly.

Pipeline principle:

`partner source -> raw ingest -> validation -> normalization -> identity matching -> offers/products -> publication`

### 6. Affiliate boundary
Affiliate URLs belong to offers, not products. A single normalized product may have multiple merchant offers and therefore multiple outbound destinations.

## Core invariants
- Product identity and merchant offer identity are separate concepts.
- Merchant-specific IDs are never used as Winkelnu canonical product IDs.
- Prices are offer data and must carry freshness metadata.
- Imported records can be deactivated without deleting canonical product identity.
- SEO pages consume normalized publishable data, not raw feeds.
- Feed failures must not take the storefront offline.

## Initial source tree

```text
src/
  app/                # Next.js routes and presentation entrypoints
  domain/
    catalog/          # Core commerce/comparison domain concepts
  application/        # Future use cases/orchestration
  infrastructure/     # Future databases, feeds, external providers
  components/         # Shared UI components
```

## Decision boundary
No merchant-specific API SDK or feed format may leak into `src/domain` or page components. Integrations belong in infrastructure adapters.
