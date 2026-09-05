# WINKELNU PROJECT CONTEXT

Version: 1.2
Status: Active project baseline
Date: 2026-09-06
Domain: https://winkelnu.nl
Repository: dostrakon1/winkelnu

## 1. Purpose

Winkelnu.nl is a multi-merchant shopping discovery, affiliate and comparison platform. It brings products and offers from multiple merchants together in one coherent storefront without acting as the merchant of record for those external offers.

The platform must help visitors discover what is interesting, compare relevant products and merchant offers, understand useful price/trend context and continue to the selected merchant through a clearly identifiable affiliate link.

The long-term product direction is fixed as:

**Shopping discovery + comparison + trends + smart choice assistance.**

Winkelnu should eventually be useful both when a visitor already knows the exact product and when the visitor only knows the shopping problem or wants to discover what is becoming interesting.

## 2. Core positioning

Winkelnu is not a traditional single-merchant webshop and must not be architected as one. It is also not intended to remain a conventional price-comparison table with affiliate links.

Core principles:

- Multi-merchant by design.
- Feed-driven product ingestion.
- Merchant-independent canonical product layer.
- Multiple offers can belong to one canonical product.
- Affiliate redirects are explicit and measurable.
- Price, availability and merchant data are treated as time-sensitive offer data.
- Discovery and trend surfaces must be backed by real signals.
- Price comparison remains core, but discovery and decision support are equal strategic layers.
- SEO pages must remain useful even when individual offers change.
- The platform must be able to scale to multiple affiliate networks and merchants.
- External trend sources may only be activated after technical, legal and data-rights review.

The accepted strategic architecture is documented in:

`docs/architecture/SHOPPING_DISCOVERY_TRENDS_AND_CHOICE_ASSISTANCE.md`

## 3. Strategic product pillars

### Winkelnu Pulse

The internal signal layer for product momentum, price movement and shopper interest. Potential inputs include views, favourites, searches, outbound clicks, price changes, merchant coverage and permitted external trend observations.

Public Pulse-derived claims must be explainable from real data. Winkelnu may not fabricate popularity, scarcity or trend status.

### TrendRadar

The discovery layer that identifies products or themes gaining attention outside Winkelnu. Candidate sources include TikTok-related signals, Google Trends-related signals, Pinterest-related signals and later other suitable public, licensed or partner-provided sources.

TrendRadar is source-agnostic. It must not depend on prohibited scraping or imply endorsement by a platform merely because a trend signal originated there.

### Slim Vergelijken

The decision layer above canonical products and merchant offers. It should evolve toward known total-price comparison, price history, meaningful price-drop context, alternatives, category-relative choices and explainable recommendation logic.

AI may later support defined product-choice problems, but it must remain grounded in verified catalogue attributes and eligible live offers.

## 4. Fixed product experience principles

The storefront should ultimately support:

- Product discovery through categories, search and curated surfaces.
- Product detail pages based on canonical products.
- Multiple merchant offers where available.
- CTA wording such as `Bekijk aanbieding` rather than pretending Winkelnu itself completes the purchase.
- Clear merchant attribution.
- Clear affiliate/commercial disclosure where required.
- Favourites / like functionality using a heart interaction.
- Useful counters and social proof only where data is real and meaningful.
- Price history and price-drop context when sufficient observations exist.
- Trend surfaces such as `Trending nu`, `Trending op TikTok`, `Prijsdalers`, `Veel opgeslagen`, `Populair onder €25` and category trends only when supported by real evidence.
- Smart alternatives and explainable product-choice assistance as later layers.
- Visual or reference-based product discovery as a future capability where it can be grounded in the canonical catalogue.

## 5. Architecture baseline

The technical direction is:

- Next.js using the App Router.
- TypeScript.
- Tailwind CSS.
- GitHub as the source of truth for source code and project documentation.
- Vercel for preview deployments and production hosting of the storefront.
- PostgreSQL/Supabase for persistent catalogue, attribution, operations and future signal/history data.
- A separate ingestion/worker layer for affiliate feeds and scheduled synchronisation.
- Clear separation between canonical product data and merchant-specific offer data.
- Future trend-source adapters must remain separate from partner/feed adapters.
- Raw trend observations must remain distinguishable from derived product-level signals/scores.
- Admin/operations tooling must not rely on a predictable public `/admin` route.

## 6. Core domain model

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
The Winkelnu taxonomy used for navigation, discovery and SEO.

### Brand
Normalised brand identity where applicable.

### Import Run
A traceable ingestion/synchronisation job.

### Redirect / Click Event
A measurable outbound affiliate click while preserving privacy and compliance requirements.

### Trend Source
The origin of a permitted external or internal trend signal, such as `tiktok`, `google_trends`, `pinterest` or `winkelnu_internal`.

### Trend Observation
A time-bound raw observation connected to a canonical product, brand, category or search concept, with provenance and freshness information.

### Product Trend Signal
A normalised product-level signal derived from one or more observations.

### Price Observation / Price History
Historical offer-price evidence sufficient to support explainable price-change claims.

## 7. Feed pipeline principles

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

## 8. Product matching and deduplication

Where possible, matching can use strong identifiers such as GTIN/EAN, manufacturer part number, ISBN or other reliable product identifiers.

Weak matching based on titles or text similarity must never silently merge products without sufficient confidence and auditability.

The architecture must preserve merchant source records so canonicalisation can later be improved or reversed.

The same confidence-aware rule applies to external trend matching: an informal social reference, hashtag or product name may not silently attach itself to an unrelated canonical product.

## 9. Affiliate-link principles

Affiliate links are commercially critical data and must be handled independently from presentation logic.

Requirements include:

- Merchant/network attribution.
- Stable internal offer identity.
- Ability to refresh destination/tracking URLs.
- Outbound redirects measurable by Winkelnu where appropriate.
- No misleading suggestion that Winkelnu is the seller if the transaction occurs elsewhere.
- Links and offers may expire and therefore require freshness handling.

## 10. Ranking principles

Ranking must keep separate concepts for:

- textual/search relevance;
- offer eligibility and freshness;
- price / known total price;
- catalogue quality;
- merchant coverage;
- trend momentum;
- internal shopper interest;
- sponsored/paid placement, if ever introduced.

Affiliate commission may not silently become an organic ranking parameter. Trend or popularity signals are ranking inputs, not absolute truth, and public labels derived from them must remain explainable.

## 11. SEO principles

SEO architecture must be based on durable Winkelnu entities rather than ephemeral merchant feed URLs.

Priorities:

- Stable canonical product URLs.
- Stable category URLs.
- Avoid uncontrolled indexation of filter combinations.
- Prevent duplicate pages generated from multiple merchant records for the same product.
- Preserve useful product pages when one merchant disappears if the canonical product remains relevant.
- Structured data must reflect the actual role of Winkelnu and the current offer data.
- Trend/editorial discovery pages may only be indexed when they provide durable, useful content rather than thin automatically generated labels.

## 12. Trust and compliance baseline

Winkelnu must be transparent about its affiliate/comparison role.

The authoritative policy architecture is now:

`docs/compliance/WINKELNU_COMPLIANCE_PRIVACY_AFFILIATE_POLICY_ARCHITECTURE_v1.0.md`

That baseline fixes the following principles:

- Winkelnu is the comparison/discovery service, not the seller for external merchant offers.
- Affiliate compensation must be disclosed clearly.
- Affiliate commission is not an ordinary organic ranking parameter.
- Paid/sponsored placement may not influence presentation silently; if introduced later it requires explicit data, policy and visible labelling.
- Known shipping may be included in a known total; unknown shipping must remain visibly unknown.
- Application-level affiliate click attribution remains privacy-minimal and intentionally does not store raw IP addresses or user-agent fingerprints in the click event.
- Generic/decorative cookie banners are not acceptable; consent controls must correspond to real tracking technology.
- Tracking requiring consent may not run before valid consent, and rejecting optional tracking may not make the storefront unusable.
- Final public legal pages must be generated from verified operator, processor, retention and production-tracking facts rather than boilerplate assumptions.
- Trend badges, viral claims and popularity labels must be evidence-backed.
- Winkelnu may not imply TikTok, Google, Pinterest or another platform endorses a product unless that is actually true.
- Prohibited scraping may not be used as a shortcut to trend data.

The current next compliance phase remains **Launch Readiness v1.2 — Verified Operator & Production Data Inventory**. Final public legal pages remain a launch blocker until that factual inventory is complete.

## 13. Initial integrations and source expansion

The architecture must not hard-code itself around one partner.

Current practical affiliate rollout preference:

1. Daisycon as first real affiliate-network/feed activation.
2. bol.com affiliate integration when account/media requirements permit.
3. Awin.
4. TradeTracker.
5. Direct merchant programmes and other suitable marketplaces/networks.

This is a rollout preference, not a permanent exclusivity order. Every integration must be evaluated against its then-current API/feed terms, affiliate policies, data-use rights and update requirements before activation.

Potential trend-source families include TikTok-related signals, Google Trends-related signals, Pinterest-related signals and later other permitted sources. Each trend source requires the same explicit acquisition-rights and freshness review before activation.

## 14. Delivery order

The strategic discovery/trend direction is accepted now, but implementation remains staged.

### Current priority

Establish real merchant/feed coverage and catalogue quality first. Daisycon remains the first real partner activation target.

### Next layer

Add internal Winkelnu signals such as views, favourites, clicks and price-history observations.

### Then

Introduce external trend-source adapters and TrendRadar, beginning only with sources that have a documented permitted acquisition method.

### Later

Add advanced recommendation, visual search and AI-assisted choice flows once product attributes and catalogue coverage are sufficiently reliable.

## 15. Build workflow

Winkelnu is built iteratively:

1. Define or verify a milestone.
2. Implement the smallest coherent foundation.
3. Validate repository/build/deployment state.
4. Commit the result to GitHub.
5. Continue only from the verified baseline.

GitHub is the permanent technical source of truth. Architectural decisions that materially affect later implementation should be documented in the repository.

## 16. Infrastructure responsibilities

### GitHub
Source code, documentation, branches, commits and change history.

### Vercel
Preview builds and production deployment for the web application.

### Database
PostgreSQL/Supabase persistence for catalogue, affiliate attribution, internal operations and future signal/history data.

### Workers / scheduled jobs
Feed imports, trend-source retrieval and other non-request-bound processing must be kept logically separate from storefront rendering and designed so they can later move to dedicated infrastructure if scale requires it.

## 17. Non-goals for the initial build

The initial foundation must not prematurely implement:

- A Winkelnu-owned checkout for external merchant products.
- Complex personalisation before core catalogue quality works.
- AI features without a defined user problem and sufficiently reliable catalogue attributes.
- Large-scale SEO page generation before data quality and indexation rules are established.
- Behavioural advertising/profiling merely because affiliate monetisation exists.
- Generic legal/cookie pages that describe processors or tracking not actually used.
- Unverified `viral`, `trending` or social-proof claims.
- Broad scraping of social platforms as a shortcut to a proper trend-source integration.

## 18. Decision rule

When choosing between a quick implementation and a structure that safely supports multiple merchants, feeds, changing offers and future trend signals, prefer the latter unless it creates disproportionate complexity for the current milestone.

When choosing between collecting more visitor data and meeting a product need with less data, prefer the lower-data design unless the additional processing has a documented purpose, lawful basis and launch decision.

When choosing between a visually exciting popularity claim and a less exciting claim that can be verified, prefer the verifiable claim.

This document is the central project baseline for the repository and should be updated when a formally accepted architectural decision changes it.
