# WINKELNU PROJECT CONTEXT

Version: 1.0
Status: Active project baseline
Date: 2026-09-03
Domain: https://winkelnu.nl
Repository: dostrakon1/winkelnu

## 1. Purpose

Winkelnu.nl is a multi-merchant affiliate and comparison platform. It brings products and offers from multiple merchants together in one coherent storefront without acting as the merchant of record for those external offers.

The platform must help visitors discover products, compare relevant offers and continue to the selected merchant through a clearly identifiable affiliate link.

## 2. Core positioning

Winkelnu is not a traditional single-merchant webshop and must not be architected as one.

Core principles:

- Multi-merchant by design.
- Feed-driven product ingestion.
- Merchant-independent canonical product layer.
- Multiple offers can belong to one canonical product.
- Affiliate redirects are explicit and measurable.
- Price, availability and merchant data are treated as time-sensitive offer data.
- SEO pages must remain useful even when individual offers change.
- The platform must be able to scale to multiple affiliate networks and merchants.

## 3. Fixed product experience principles

The storefront should ultimately support:

- Product discovery through categories, search and curated surfaces.
- Product detail pages based on canonical products.
- Multiple merchant offers where available.
- CTA wording such as `Bekijk aanbieding` rather than pretending Winkelnu itself completes the purchase.
- Clear merchant attribution.
- Clear affiliate/commercial disclosure where required.
- Favourites / like functionality using a heart interaction.
- Useful counters and social proof only where data is real and meaningful.

## 4. Architecture baseline

The technical direction is:

- Next.js using the App Router.
- TypeScript.
- Tailwind CSS.
- GitHub as the source of truth for source code and project documentation.
- Vercel for preview deployments and production hosting of the storefront.
- PostgreSQL/Supabase when persistent application data is introduced.
- A separate ingestion/worker layer for affiliate feeds and scheduled synchronisation.
- Clear separation between canonical product data and merchant-specific offer data.
- Admin/operations tooling must not rely on a predictable public `/admin` route.

## 5. Core domain model

The platform should evolve around at least these conceptual entities:

### Merchant
A retailer or marketplace from which an offer originates.

### Affiliate Network
The network or integration through which tracking, feeds or commission attribution is supplied.

### Feed Source
A specific import source belonging to a merchant/network integration.

### Canonical Product
The merchant-independent representation of a product used by Winkelnu.

### Merchant Product / External Product
The merchant-specific representation received from a feed or API.

### Offer
The current commercial proposition for a canonical product at a merchant, including price, availability, destination URL and affiliate/tracking information.

### Category
The Winkelnu taxonomy used for navigation and SEO.

### Brand
Normalised brand identity where applicable.

### Import Run
A traceable ingestion/synchronisation job.

### Redirect / Click Event
A measurable outbound affiliate click while preserving privacy and compliance requirements.

## 6. Feed pipeline principles

Feed ingestion is a first-class subsystem, not an afterthought.

The pipeline must be designed for:

1. Source retrieval.
2. Validation.
3. Raw staging.
4. Normalisation.
5. Merchant-specific mapping.
6. Product matching / deduplication.
7. Canonical product assignment.
8. Offer creation or update.
9. Expiry/deactivation of stale offers.
10. Import observability and error reporting.

Imports should be idempotent wherever possible. A failed or malformed feed must not corrupt the storefront catalogue.

## 7. Product matching and deduplication

Where possible, matching can use strong identifiers such as GTIN/EAN, manufacturer part number, ISBN or other reliable product identifiers.

Weak matching based on titles or text similarity must never silently merge products without sufficient confidence and auditability.

The architecture must preserve merchant source records so canonicalisation can later be improved or reversed.

## 8. Affiliate-link principles

Affiliate links are commercially critical data and must be handled independently from presentation logic.

Requirements include:

- Merchant/network attribution.
- Stable internal offer identity.
- Ability to refresh destination/tracking URLs.
- Outbound redirects measurable by Winkelnu where appropriate.
- No misleading suggestion that Winkelnu is the seller if the transaction occurs elsewhere.
- Links and offers may expire and therefore require freshness handling.

## 9. SEO principles

SEO architecture must be based on durable Winkelnu entities rather than ephemeral merchant feed URLs.

Priorities:

- Stable canonical product URLs.
- Stable category URLs.
- Avoid uncontrolled indexation of filter combinations.
- Prevent duplicate pages generated from multiple merchant records for the same product.
- Preserve useful product pages when one merchant disappears if the canonical product remains relevant.
- Structured data must reflect the actual role of Winkelnu and the current offer data.

## 10. Trust and compliance baseline

Winkelnu must be transparent about its affiliate/comparison role.

The later compliance architecture must explicitly cover at least:

- Affiliate disclosure.
- Merchant relationship disclosure.
- Price/availability freshness and disclaimers where needed.
- Ranking and sorting transparency where legally required.
- Privacy and analytics.
- Cookies/consent.
- Click tracking.
- Consumer-information boundaries between Winkelnu and the merchant.
- Sponsored/promoted placements if introduced.

The next previously identified architecture phase after the established foundation is **Step 11 — Compliance, Privacy & Affiliate Policy Architecture v1.0**. The build roadmap may introduce repository/tooling milestones before that policy phase without invalidating the earlier product architecture.

## 11. Initial integrations

The architecture should not hard-code itself around one partner. Potential future sources include marketplaces and merchants such as Bol, Amazon, eBay and other affiliate programmes/networks that are commercially and technically suitable at implementation time.

Each integration must be evaluated against its then-current API/feed terms, affiliate policies, data-use rights and update requirements before activation.

## 12. Build workflow

Winkelnu is built iteratively:

1. Define or verify a milestone.
2. Implement the smallest coherent foundation.
3. Validate repository/build/deployment state.
4. Commit the result to GitHub.
5. Continue only from the verified baseline.

GitHub is the permanent technical source of truth. Architectural decisions that materially affect later implementation should be documented in the repository.

## 13. Infrastructure responsibilities

### GitHub
Source code, documentation, branches, commits and change history.

### Vercel
Preview builds and production deployment for the web application.

### Database
Introduced when persistent catalogue/application data is required. Current preferred direction: PostgreSQL/Supabase.

### Workers / scheduled jobs
Feed imports and other non-request-bound processing must be kept logically separate from storefront rendering and designed so they can later move to dedicated infrastructure if scale requires it.

## 14. Non-goals for the initial build

The initial foundation must not prematurely implement:

- A Winkelnu-owned checkout for external merchant products.
- Complex personalisation before core catalogue quality works.
- AI features without a defined user problem.
- Merchant integrations before the canonical data model and ingestion contracts are ready.
- Large-scale SEO page generation before data quality and indexation rules are established.

## 15. Decision rule

When choosing between a quick implementation and a structure that safely supports multiple merchants, feeds and changing offers, prefer the latter unless it creates disproportionate complexity for the current milestone.

This document is the central project baseline for the repository and should be updated when a formally accepted architectural decision changes it.
