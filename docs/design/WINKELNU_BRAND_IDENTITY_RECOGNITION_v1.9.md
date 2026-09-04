# Winkelnu Design System v1.9 — Brand Identity, Logo & Storefront Recognition

Status: implemented

## Purpose

This step gives Winkelnu a recognizable visual identity that can travel consistently across the storefront, browser iconography, social sharing and branded fallback states.

The identity is deliberately simple, calm and scalable. It is built from the existing Winkelnu palette rather than introducing a second visual language.

## Core mark

Path: `src/components/storefront/winkelnu-brand.tsx`

The Winkelnu mark combines:

- a compact rounded petrol tile;
- a white geometric `W` path;
- one warm-orange dot as a recognisable accent;
- the `winkelnu.nl` wordmark beside the symbol where space allows.

The geometric W represents Winkelnu directly without relying on an unrelated shopping-cart or price-tag cliché. The orange point acts as the visual accent that already exists in the design system for important actions and comparison focus.

## Shared components

Two shared primitives are available:

- `WinkelnuMark` — symbol-only identity for small branded surfaces;
- `WinkelnuBrand` — mark plus wordmark for navigation and footer identity.

Both support inverse presentation on dark petrol surfaces.

## Wordmark

The wordmark is intentionally lowercase:

`winkelnu.nl`

The core name uses the deep petrol/white identity depending on context. The `.nl` suffix uses the warm accent or a softer inverse tone.

This keeps the domain visible without making the brand look like a technical URL label.

## Header identity

The old plain uppercase text label in the public header has been replaced by the full Winkelnu brand component.

The same identity is repeated inside the mobile navigation panel, so opening the mobile menu preserves brand context.

The responsive discovery and touch-target rules from v1.7 remain intact.

## Footer identity

The footer now uses the same inverse brand component as the header.

This creates a clear visual beginning and end to every public storefront surface while preserving the existing affiliate and merchant-of-record disclosures.

## Product media fallback

The generic shopping-bag fallback from v1.4 has been replaced with a branded Winkelnu media fallback.

The fallback now includes:

- the Winkelnu mark;
- soft cream/petrol background geometry;
- the Winkelnu name;
- a clear `Productafbeelding niet beschikbaar` message.

The fallback still never pretends to show a real product image.

## Empty states

Shared storefront empty states now include the Winkelnu mark.

This means search, category and other no-result moments remain recognizable as part of the same storefront instead of looking like isolated utility panels.

## Browser icon

Path: `src/app/icon.svg`

The browser/favicon mark uses the same petrol square, geometric W and orange point. It is deliberately simplified so it stays readable at small sizes.

## Apple touch icon

Path: `src/app/apple-icon.tsx`

A generated 180 × 180 PNG version of the same symbol is now available through the Next.js metadata file convention for homescreen/bookmark use on Apple devices.

## Social sharing image

Path: `src/app/opengraph-image.tsx`

Winkelnu now has a generated 1200 × 630 social image with:

- the Winkelnu mark and wordmark;
- the petrol/cream/warm palette;
- the storefront statement `Slimmer ontdekken en vergelijken.`;
- the phrase `Ontdek • Vergelijk • Kies je winkel`.

The layout metadata now includes matching Open Graph and Twitter card copy.

## Metadata identity

The root metadata title is now:

`Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.`

Individual pages retain the existing title template:

`%s | Winkelnu.nl`

Open Graph and Twitter metadata use the same public identity and description.

## Visual rules

The v1.9 identity should follow these rules:

- petrol remains the dominant brand color;
- cream remains the calm storefront background;
- orange is a recognition/accent point, not a full-page dominant color;
- the mark should not be stretched, rotated or recolored arbitrarily;
- the W and orange point belong together as the primary symbol;
- the wordmark should normally remain lowercase;
- no extra shopping-cart icon should be attached to the logo;
- the brand must remain readable in both normal and inverse contexts.

## Recognition without clutter

Winkelnu should feel branded through repetition of a few consistent signals rather than through logo saturation.

Primary brand placements are therefore:

- public header;
- mobile navigation panel;
- footer;
- favicon/browser icon;
- Apple touch icon;
- social sharing image;
- product-image fallback;
- storefront empty states.

Product cards themselves do not receive redundant Winkelnu logos when a real product image is available.

## Accessibility

- brand links use an explicit `Winkelnu.nl home` aria-label;
- decorative SVG marks are hidden from assistive technology;
- text identity remains visible next to the mark in normal header/footer contexts;
- icon-only use is limited to decorative or already-labelled surfaces;
- contrast is maintained through white-on-petrol and deep-petrol-on-light combinations.

## Data-model impact

No database migration is required.

Brand identity is a presentation-layer concern and does not alter products, offers, merchants, ranking or affiliate logic.

## Next design-system step

The next logical step is v2.0 — **Homepage Composition & Launch-Level Storefront Presentation**: use the now-stable brand, product cards, trust language, discovery patterns and comparison components to turn the homepage into a complete public storefront with stronger category discovery, merchandising rhythm and launch-ready presentation.
