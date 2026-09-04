# Winkelnu Design System v2.0 — Homepage Composition & Launch-Level Storefront Presentation

Status: implemented

## Purpose

v2.0 brings the earlier design-system work together into one launch-level homepage composition. The homepage should introduce Winkelnu as a calm comparison brand, make product discovery immediately useful and explain the merchant/price model without overloading the visitor.

The page remains evidence-led and does not invent product counts, merchant counts, discounts, popularity scores, ratings or urgency.

## Launch composition

The homepage now contains the following narrative sequence:

1. branded comparison hero
2. primary product search
3. fast category discovery
4. three-step Winkelnu explanation
5. current active product offers
6. trust and comparison philosophy
7. final discovery CTA
8. full Winkelnu footer

This composition turns the homepage from a collection of components into a coherent storefront entry point.

## Hero

The hero now carries the primary proposition:

`Vind sneller wat je zoekt. Vergelijk voordat je kiest.`

Supporting copy explains that Winkelnu brings products and current merchant offers together in one comparison experience.

The hero contains:

- the established petrol/cream/warm-orange palette;
- the Winkelnu brand identity from v1.9;
- primary search as the dominant action;
- trust microcopy from v1.6;
- a comparison explainer card using the existing `ComparisonSignals` primitive;
- restrained branded geometry rather than decorative commerce imagery.

## Search-first discovery

Search remains the main homepage action. The shared `WinkelnuSearchField` is used without introducing a second search implementation.

The hero tells visitors directly that:

- known shipping costs are included when available;
- multiple merchants can be compared;
- checkout remains with the merchant.

## Category discovery

The homepage exposes up to eight categories as quick discovery chips.

The existing responsive behavior remains:

- horizontal swipe row on small screens;
- wrapped category layout on larger screens;
- minimum touch height from v1.7.

No category popularity ranking is implied.

## How Winkelnu works

A dark petrol band explains the service in three steps:

1. Ontdek
2. Vergelijk
3. Kies je winkel

This explicitly positions Winkelnu as the comparison layer rather than the seller or checkout provider.

## Product merchandising

The product section now uses the heading `Nu op Winkelnu` and only renders catalog items that currently have an eligible best offer.

The existing `ProductCard` rules remain authoritative for:

- canonical product identity;
- best-known price language;
- shipping-known context;
- availability state;
- merchant count;
- product media fallback;
- product-detail navigation.

If no active products are available, the homepage degrades to an honest catalog-state message instead of showing empty or fabricated product cards.

## Trust section

A new editorial trust section expresses Winkelnu's operating principles in user-facing language:

- price with context;
- direct merchant purchase;
- no invented scores or artificial urgency;
- feed data can change;
- missing information should be disclosed rather than guessed.

This reinforces the technical and compliance principles already established in the catalog and affiliate architecture.

## Final CTA

The final market-gradient section returns the visitor to the two main discovery routes:

- product search;
- category discovery.

It intentionally does not introduce account creation, newsletters, checkout, fake scarcity or unrelated calls to action.

## Brand continuity

v2.0 reuses the v1.9 identity across the launch page. The homepage does not create a second logo or visual sub-brand.

The established identity remains:

- petrol primary brand color;
- warm-orange recognition accent;
- geometric W mark;
- lowercase `winkelnu.nl` wordmark;
- calm cream/sand surfaces;
- market/morning/welcome gradients.

## Responsive behavior

The homepage is mobile-first:

- hero content is single-column before desktop;
- search is stacked on phones;
- category chips swipe horizontally;
- process explanation stacks vertically;
- product grid follows the v1.7 density rules;
- trust cards stack before becoming a grid;
- final CTA actions stack on phones.

No essential content depends on hover.

## Explicit exclusions

v2.0 does not add:

- fake merchant logos;
- fake reviews or ratings;
- artificial product popularity;
- unsupported discount percentages;
- countdowns or urgency;
- hard-coded marketplace statistics;
- own checkout;
- login/account requirements;
- newsletter capture;
- sponsored claims disguised as editorial ranking.

## Data-model impact

No database migration is required.

The homepage uses existing catalog APIs for:

- products;
- ranked eligible offers;
- shipping-known state;
- merchants;
- categories.

## Public launch direction

With v2.0, the visual design-system phase has a complete public storefront entry point. The next logical phase should move from pure design composition toward launch-readiness verification: final public routes, legal/compliance surface completeness, metadata/SEO validation, responsive QA, accessibility QA, real-feed presentation QA and deployment-domain readiness.
