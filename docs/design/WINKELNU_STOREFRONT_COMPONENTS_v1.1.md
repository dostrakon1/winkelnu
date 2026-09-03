# Winkelnu Design System v1.1 — Storefront Components

Status: implemented

## Purpose

This layer turns the v1.0 visual foundation into reusable React components for the public storefront. The goal is to reduce one-off Tailwind styling and keep interaction, spacing and visual hierarchy consistent across pages.

## Components

### `WinkelnuButton`
Path: `src/components/storefront/winkelnu-button.tsx`

Variants:
- `primary`: petrol background, white text
- `secondary`: light surface, petrol border/text
- `warm`: orange accent action

Supports both button and link behavior.

### `WinkelnuBadge`
Path: `src/components/storefront/winkelnu-badge.tsx`

Variants:
- neutral
- success
- warning
- danger

Use status colors for meaning, not decoration.

### `WinkelnuSearchField`
Path: `src/components/storefront/winkelnu-search-field.tsx`

Reusable GET search form with accessible label, product-query defaults and Winkelnu button treatment.

### `SectionHeader`
Path: `src/components/storefront/section-header.tsx`

Reusable section heading anatomy:
- optional eyebrow
- title
- optional supporting description
- optional text action

### `ProductCard`
Path: `src/components/storefront/product-card.tsx`

Standard storefront product-card anatomy:
- media area
- brand metadata
- title
- short description
- merchant/offer count
- price
- availability badge
- compare CTA

The current placeholder media area is intentionally feed-ready. Merchant images can replace it later without changing the card hierarchy.

### `OfferCard`
Path: `src/components/storefront/offer-card.tsx`

Reusable merchant-offer presentation for product detail and comparison views. It supports a subtle best-offer treatment while keeping the merchant checkout relationship explicit through the `Bekijk aanbieding` CTA.

## Homepage adoption

The homepage now consumes the shared components for:
- hero search
- product-grid section heading
- product cards

This establishes the pattern for category, search and product-detail migrations.

## Rules

1. Prefer these components over duplicating their markup in new storefront pages.
2. Preserve semantic pricing and availability rules from the catalog domain.
3. Do not introduce urgency styling or fake scarcity.
4. `Bekijk aanbieding` is reserved for an actual outgoing merchant offer; discovery cards use `Vergelijk aanbiedingen`.
5. Keep keyboard focus visible and touch targets large enough for mobile use.
6. New variants should be added only when an existing component cannot express a recurring UI need.

## Next design-system step

Migrate search, category and product-detail surfaces to this shared component layer, then add image handling, favorite controls and responsive navigation only when their underlying product behavior is ready.
