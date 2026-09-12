# Master Control Center + Multi-Site Architecture v1.0

Status: **Architecture decision / future-proof platform direction**  
Scope: **Winkelnu + future affiliate storefronts**  
Primary principle: **one shared affiliate commerce engine, multiple independent storefronts, one central Master Control Center**

## 1. Decision

Winkelnu.nl is treated as **storefront/site #1** on top of a shared affiliate commerce engine.

The engine is not a separate product or server today. It currently lives inside the same repository and application, primarily across the domain, application, infrastructure, import-worker, affiliate-integration and catalog layers.

The architectural goal is to keep shared platform logic independent from the Winkelnu brand so that future affiliate sites can reuse the same catalog, importer, matching, offer, analytics, revenue and intelligence capabilities without rebuilding the platform.

```text
                    MASTER CONTROL CENTER
                             |
                    Intelligence Layer
                             |
        +--------------------+--------------------+
        |                    |                    |
      Sites               Commerce            Operations
        |                    |                    |
   Brands/Markets      Products/Offers     Feeds/Imports
   Domains/Locales     Merchants           Health/Recovery
   Approvals           Catalog rules       Quality
        |                    |                    |
        +--------------------+--------------------+
                             |
                 SHARED AFFILIATE COMMERCE ENGINE
                             |
        +--------------------+--------------------+
        |                    |                    |
     Daisycon               bol            future providers
        |                    |                    |
        +--------------------+--------------------+
                             |
                        Shared data
                             |
        +--------------------+--------------------+
        |                    |                    |
    Winkelnu.nl          Site #2              Site #3
```

## 2. Hard architectural rule

New backend, importer, analytics, revenue, partner, feed and Control Center functionality must **not be unnecessarily hard-coded to Winkelnu.nl**.

Use this distinction:

### Shared platform concerns

- products
- offers
- merchants
- affiliate networks
- affiliate integrations
- feed sources
- import workers
- product matching
- catalog quality
- click attribution
- revenue ingestion
- performance analytics
- health and observability
- AI/intelligence services

### Site-specific concerns

- brand name
- domain
- logo
- visual theme
- market/country
- locale/language
- currency
- SEO configuration
- legal content
- enabled categories/niches
- publication eligibility
- affiliate media/site approvals
- site-specific affiliate tracking identifiers
- site-specific content

## 3. `Site` becomes a first-class platform concept

The platform should evolve toward an explicit `Site` or `Storefront` entity instead of assuming that every record or workflow belongs to Winkelnu.

Conceptual model:

```text
Site
- id
- external_key
- name
- domain
- status
- market
- locale
- currency
- brand_config
- theme_config
- catalog_profile
- seo_config
- feature_config
- created_at
- updated_at
```

Initial site:

```text
Name:       Winkelnu
Domain:     winkelnu.nl
Market:     NL
Locale:     nl-NL
Currency:   EUR
Catalog:    general
Status:     active
```

The exact schema is intentionally not fixed by this document. This document defines the direction and boundaries first.

## 4. Shared catalog, site-specific publication

A product is a platform entity. A product does not automatically need to appear on every storefront.

Future publication/eligibility model:

```text
Product
  |
  +-- Winkelnu.nl       allowed
  +-- Pet niche site    blocked
  +-- Tech site         allowed
```

Eligibility can later be based on:

- category
- brand
- merchant
- provider
- market
- availability
- price/currency
- legal constraints
- manual overrides
- site catalog profile

This prevents duplicate catalog ingestion for every site while allowing each storefront to have a tightly controlled assortment.

## 5. Products and offers remain separate

The product/offer separation is a core platform invariant.

Example:

```text
Product: Samsung TV
- offer A: bol, EUR 799
- offer B: merchant via Daisycon, EUR 789
- offer C: another merchant, EUR 819
```

One product may therefore:

- have multiple offers;
- receive offers from multiple affiliate networks;
- be eligible for multiple storefronts;
- have different best offers per market/site.

The shared engine owns product identity, offer identity, matching and freshness. A storefront owns visibility and presentation.

## 6. Master Control Center

The existing internal operations area is the first operational module of a broader **Master Control Center**.

Target navigation:

```text
Overview
Sites
Catalog
Offers
Partners
Affiliate Approvals
Feeds
Imports
Data Quality
Traffic
Revenue
Automation
System
AI Assistant
```

Not all modules must be built immediately. The navigation is an information architecture target so that new modules can be added without redesigning the platform.

## 7. Overview

The overview should answer four questions quickly:

1. Is the platform healthy?
2. Which site or integration needs attention?
3. What changed recently?
4. What is commercially important right now?

Example future summary:

```text
Platform health          96/100
Sites active              4
Products            742,000
Offers            1,860,000
Active feeds             128
Affiliate networks        14
Commission this month EUR 18,420
```

The overview should prioritize actions and anomalies rather than becoming a wall of metrics.

## 8. Site 360-degree view

Each site should have a dedicated 360-degree view containing at least:

- identity and domain
- market/locale/currency
- theme/brand status
- catalog coverage
- active merchants
- affiliate networks
- approval state
- feeds
- imports
- clicks
- revenue/commission
- health
- data-quality signals
- recent incidents
- AI insights

Example:

```text
Winkelnu.nl
Health              97/100
Products            312,840
Offers              811,420
Active feeds             41
Clicks this month    842,000
Commission            EUR ...
```

## 9. Affiliate Approval & Partner Status

Affiliate approvals are site-specific operational data and must be visible in the Master Control Center.

Relationship:

```text
Site
  -> Affiliate Network
      -> Media / Website Approval
          -> Campaign / Merchant Approval
              -> Feed / API Access
                  -> Tracking
                      -> Performance
```

Possible states:

- not_configured
- draft
- submitted
- pending
- approved
- rejected
- suspended
- expired

Example:

```text
Winkelnu.nl

Daisycon
- media approval: approved
- campaigns active: 14
- feeds active: 9
- credentials: configured

bol
- website approval: pending
- feed access: unavailable
- site code: configured
- tracking setup: repository_ready
```

The Control Center should support both network-level and merchant/campaign-level status.

## 10. Feed and API visibility

Operators must be able to inspect feed/integration state without exposing secrets.

Show:

- provider
- merchant
- source type
- source status
- last successful import
- next expected import
- records seen
- accepted records
- rejected records
- review counts
- duration
- freshness
- error state
- credential configured yes/no
- API/feed capability
- latest health signal

Do **not** expose:

- raw passwords
- API secrets
- OAuth secrets
- service-role keys
- complete secret-bearing feed URLs

Safe display example:

```text
Daisycon product feed
Status: connected
Credential: configured
Type: JSON
Feed URL: ********
Last connection: successful
```

Secrets remain server-side and are referenced through controlled secret references such as environment-backed references.

## 11. Import history and operations

Every import should be observable through a durable operational model.

Important fields/signals:

- site scope where relevant
- merchant
- source/feed
- provider
- start/end time
- duration
- records seen
- accepted
- rejected
- manual review/pending review
- products created/updated
- offers created/updated/deactivated
- error summary
- correlation id
- retry state
- freshness state

Existing retry/pause/resume operational actions remain a foundation for this model.

## 12. Revenue & Affiliate Performance

Revenue is a first-class Control Center module.

The platform must distinguish:

- **gross affiliate-attributed order value / sales value**;
- **pending commission**;
- **approved commission**;
- **paid commission**;
- **rejected/reversed commission**.

Never present gross sales value as Winkelnu/platform revenue.

Target metrics:

- clicks
- orders
- conversion rate
- CTR where meaningful
- EPC
- average order value
- average commission
- gross attributed sales value
- pending commission
- approved commission
- paid commission
- reversed/rejected commission

Dimensions:

- site
- network
- merchant
- product
- category
- market
- date range
- campaign/sub-id where available

This layer should ingest official provider reporting APIs/files when available and reconcile them with first-party click attribution.

## 13. Intelligence / AI-native design

The Control Center is designed to **feel intelligent**, but critical platform behavior must remain deterministic and auditable.

Use three layers:

### Level 1: deterministic rules

Examples:

```text
last successful import > threshold -> warning
feed returns zero products -> critical
reject ratio > threshold -> attention
price drop > safety threshold -> review
```

### Level 2: anomaly detection

Compare current behavior against historical baselines:

- product count anomalies
- import-duration anomalies
- price anomalies
- click/CTR anomalies
- commission anomalies
- merchant performance anomalies

### Level 3: AI reasoning

AI receives structured signals/read models and explains them in human language.

Example:

> Merchant X lost 31% of its offers today. Other Daisycon feeds are healthy, so the issue appears isolated to this merchant rather than the network.

AI must not use unrestricted direct write access to production data.

## 14. AI Assistant

The Master Control Center should eventually provide one assistant that can answer cross-platform operational and commercial questions.

Examples:

- How are all sites performing today?
- Which feeds need attention?
- Which site earns the most commission?
- Which merchant has the highest EPC?
- Which campaigns are still waiting for approval?
- What changed since yesterday?
- Which products are available on multiple sites?
- Where are we losing potential commission?
- Which site or niche shows the strongest growth signal?

The assistant should consume controlled read models such as:

```text
SiteSummary
CatalogStats
FeedHealth
ImportRuns
AffiliateApprovalStatus
MerchantPerformance
RevenueSummary
DataQualitySignals
ClickAnalytics
SystemHealth
```

## 15. AI action boundaries

Use explicit action levels:

```text
READ
AI may inspect and explain.

SUGGEST
AI may propose an operator action.

EXECUTE
Only explicitly pre-authorized low-risk actions may execute automatically.
```

Actions that should normally require human approval:

- disable a merchant
- pause/disable a major feed
- delete integrations
- bulk-remove products
- change affiliate tracking configuration
- modify credentials
- make high-impact catalog changes

Low-risk actions may later be eligible for automation, for example:

- retry a failed import
- rebuild a derived index
- refresh a cache
- run a non-destructive validation

All actions remain permission-aware and auditable.

## 16. Health scoring

Provide health scores as explainable summaries, not opaque vanity metrics.

Potential hierarchy:

```text
Platform Health
- Site Health
- Feed Health
- Import Health
- Catalog Health
- Data Quality
- Tracking Health
- Revenue Sync Health
- Search Health
```

Every score must be drillable into concrete contributing signals.

Example:

```text
Data Quality: 91/100
- 312 products without image
- 84 uncategorized products
- 17 possible duplicates
- 4 suspicious prices
```

## 17. Roles and permissions

The Control Center must remain role-aware as the platform grows.

Initial/possible roles:

- owner
- operator
- content_manager
- analyst
- read_only

Permissions should apply consistently to both human actions and AI-assisted actions.

## 18. International and multi-market readiness

Do not assume these are global constants:

```text
country = NL
locale = nl-NL
currency = EUR
```

They belong to site/market configuration.

Future examples:

```text
Winkelnu.nl       NL   nl-NL   EUR
Example.co.uk     GB   en-GB   GBP
Example.com       US   en-US   USD
Example.de        DE   de-DE   EUR
```

International expansion also implies market-specific:

- affiliate networks
- merchants
- legal pages
- SEO
- product availability
- tracking identifiers
- commission models
- tax/currency presentation

## 19. Provider capability model

Providers do not all expose the same capabilities. Avoid provider-specific branching in the UI where possible.

Model capabilities such as:

- product_feed
- product_api
- click_reporting
- order_reporting
- commission_reporting
- conversion_reporting
- campaign_management
- webhook_support
- payout_reporting

The Control Center can then show what an integration supports without hard-coding assumptions about Daisycon, bol or future networks.

## 20. New site onboarding flow

A future storefront should be provisioned through a repeatable onboarding process rather than a bespoke rebuild.

Target workflow:

```text
Create site
  -> brand + domain
  -> market + locale + currency
  -> theme
  -> niche/catalog profile
  -> select affiliate providers
  -> register media/site approvals
  -> register campaign approvals
  -> connect feeds/APIs
  -> verify tracking
  -> validate catalog eligibility
  -> launch
```

The platform may later automate parts of this workflow, but approvals from external affiliate providers remain external dependencies.

## 21. Scale principles

The Control Center must remain usable at large catalog sizes.

Required principles:

- server-side pagination
- server-side filters/search
- indexed query paths
- query pushdown
- bounded dashboard queries
- derived aggregates for expensive totals
- background processing for heavy work
- no browser-side loading of full catalogs
- streaming/chunked feed processing where applicable
- clear separation between operational and analytical workloads

At larger scale, the same application layer should be able to sit in front of additional infrastructure such as:

```text
PostgreSQL / Supabase
Search index
Analytics store
Queue/workers
Cache
```

without requiring a complete Control Center rewrite.

## 22. Current repository relationship

Today the shared engine and Winkelnu storefront remain in the same repository. This is intentional.

Preferred current structure: **modular monolith**.

Do not split into multiple repositories/services merely to satisfy the future multi-site idea.

Only extract packages/services when there is a real operational reason, for example after the second storefront proves that reuse is needed.

Possible future structure:

```text
apps/
  winkelnu/
  second-storefront/
  control-center/

packages/
  affiliate-core/
  catalog-core/
  import-engine/
  analytics/
  intelligence/
```

This is a future option, not a current requirement.

## 23. Migration strategy from today's Winkelnu

Avoid a big-bang rewrite.

### Phase A - now

- keep Winkelnu production work moving;
- treat existing `/intern/operations` as the first Control Center module;
- stop adding unnecessary `winkelnu.nl` hard-coding to shared services;
- inventory current hard-coded site assumptions;
- define a minimal `Site` boundary.

### Phase B - first real affiliate sources

- activate Daisycon feeds;
- show real feed/import/catalog data in Control Center;
- activate bol when approved and external access is validated;
- prove provider-independent operations.

### Phase C - performance and revenue

- ingest provider transaction/commission reporting;
- reconcile reporting with click attribution;
- add Revenue & Affiliate Performance;
- add explainable commercial signals.

### Phase D - intelligence

- add anomaly detection;
- add cross-module AI summaries;
- add AI Assistant over controlled read models;
- add approval-based suggested actions.

### Phase E - second storefront

- create a second site configuration;
- connect its own domain/brand/market;
- register it separately with affiliate providers;
- apply site-specific approvals and tracking;
- prove shared engine + shared Control Center operation.

## 24. Non-goals for v1

This architecture does **not** mean that Winkelnu must immediately become a SaaS platform or that all future storefronts must be launched now.

Not required now:

- separate microservices
- separate repositories
- multi-tenant customer billing
- public customer self-service
- automatic AI writes to production
- dozens of storefronts
- cross-border commerce at launch

The goal is architectural optionality without current scope explosion.

## 25. Success criteria

This direction is successful when:

1. Winkelnu can continue operating as the first production storefront.
2. Shared engine code does not depend unnecessarily on the Winkelnu brand.
3. A second site can be added primarily through configuration and site-specific integration records.
4. Affiliate approvals, feeds, imports, catalog health and revenue can be monitored centrally.
5. Provider-specific complexity stays behind adapters/capability boundaries.
6. AI explains and prioritizes reliable system signals instead of becoming a hidden source of truth.
7. High-impact actions remain permissioned, auditable and human-controlled.

## 26. Architecture statement

> **Winkelnu is storefront #1 of a multi-site, multi-brand affiliate commerce platform. The platform uses one shared commerce engine and one central Master Control Center to operate sites, affiliate approvals, products, offers, feeds, imports, data quality, traffic, revenue and AI-assisted intelligence across current and future affiliate properties.**

This statement is the guiding rule for future architecture decisions unless explicitly superseded by a later architecture decision record.