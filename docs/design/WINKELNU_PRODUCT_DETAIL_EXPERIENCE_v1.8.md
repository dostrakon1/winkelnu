# Winkelnu Design System v1.8 — Product Detail Experience & Comparison Layout

Status: implemented

## Purpose

This step turns the product-detail page into a stronger comparison surface. The visitor should understand the product first, then immediately understand what price information is known, how many merchant offers are available, and where the final purchase takes place.

The layout remains calm and evidence-led. It does not invent reviews, specifications, delivery promises or discount claims that are not present in the catalog.

## Product-detail hierarchy

The public product page now follows this order:

1. breadcrumb context
2. canonical product image
3. brand and active-offer state
4. product title
5. product description
6. mobile best-known-price summary
7. product facts
8. comparison/trust signals
9. merchant comparison panel
10. merchant-of-record clarification

This gives product identity and merchant comparison separate visual responsibilities.

## Breadcrumb context

A lightweight breadcrumb row now exposes:

- Home
- Producten
- current product title

The current product name is not linked and uses `aria-current="page"`.

The breadcrumb is horizontally resilient on narrow screens and does not introduce a new navigation dependency.

## Product facts

Path: `src/components/storefront/product-facts.tsx`

The new shared `ProductFacts` component exposes only catalog fields that actually exist:

- brand
- EAN / GTIN when available
- manufacturer part number / MPN when available
- number of currently eligible offers

Missing optional identifiers are omitted rather than replaced with fake or inferred values.

No database migration is required because all fields already exist on the canonical `Product` model.

## Mobile comparison access

On smaller screens, the product column now includes a compact best-known-price summary when an eligible offer exists.

The summary includes:

- lowest known total price when shipping is known;
- lowest known product price when shipping is unknown;
- selected merchant name;
- shipping-known context;
- an anchored `Bekijk winkels` action linking to `#aanbiedingen`.

This gives visitors immediate access to merchant comparison without adding a permanently floating bottom bar.

## Desktop comparison layout

The comparison panel remains sticky on large screens and now has a clearer internal hierarchy:

- `Winkelvergelijking` eyebrow
- number of eligible offers
- price-ordering context
- best-known-price summary
- merchant offer list
- merchant-of-record clarification

The panel is still visually anchored with the petrol market gradient, while the actual merchant offers remain calm white surfaces.

## Offer ordering

The page uses the already-ranked `offers` array from the catalog service. The first offer is therefore treated as the first price-ranked eligible option.

The UI says:

- `Eerste op basis van bekende prijs`
- `Optie 2`, `Optie 3`, etc.

It does not call the first merchant universally cheapest or the best deal in the market.

The highlighted offer continues to use the v1.6 price-language contract:

- known total price only when shipping is known;
- product price when shipping is not known;
- missing shipping is disclosed explicitly.

## Price summary

The comparison panel now displays a short summary above merchant cards.

When shipping is known:

- `Laagste bekende totaalprijs`
- known shipping is stated as included.

When shipping is unknown:

- `Laagste bekende productprijs`
- the visitor is warned that shipping may increase the final amount.

This avoids presenting incomplete checkout information as a total.

## Product imagery

The shared `ProductMedia` component from v1.4 remains the canonical product media primitive.

No gallery has been introduced because the current canonical product model exposes one primary image. A multi-image gallery should only be introduced after the catalog has a real ordered image set.

## Trust and merchant responsibility

The product page continues to state that:

- Winkelnu compares feed information;
- prices and stock can change at the merchant;
- the merchant determines the final price and conditions;
- payment, delivery, returns and warranty belong to the chosen merchant;
- Winkelnu is not the seller.

Affiliate outbound links remain handled by the existing sponsored redirect flow and `OfferCard` semantics.

## Responsive behavior

Mobile:

- product content comes first;
- compact price summary provides a direct comparison anchor;
- comparison panel follows in normal document flow;
- no permanent bottom overlay is introduced.

Desktop:

- product content and comparison panel use a two-column composition;
- the comparison panel remains sticky within the viewport;
- content width remains bounded for readability.

## Accessibility

The step adds or preserves:

- semantic heading hierarchy;
- breadcrumb context with `aria-current`;
- anchor-based navigation to the comparison panel;
- descriptive product facts through `dl`, `dt`, and `dd`;
- sufficiently large shared button touch targets from v1.7;
- no essential interaction hidden behind hover.

## Explicit exclusions

v1.8 does not add:

- fake reviews or star ratings;
- fabricated product specifications;
- inferred delivery dates;
- fake discount percentages;
- countdown urgency;
- unsupported seller quality scores;
- a fake multi-image gallery;
- a persistent mobile checkout bar;
- direct checkout on Winkelnu.

## Data-model impact

No database migration is required.

The page uses existing canonical fields:

- `Product.brand`
- `Product.gtin`
- `Product.mpn`
- `Product.imageUrl`
- ranked `offers`
- merchant information
- optional shipping cost
- availability

## Next design-system step

The next logical step is v1.9 — **Brand Identity, Logo & Storefront Recognition**: formalize how the Winkelnu wordmark/mark, favicon, social image, header identity and branded empty/media surfaces should work together before the storefront moves toward a more complete public launch presentation.
