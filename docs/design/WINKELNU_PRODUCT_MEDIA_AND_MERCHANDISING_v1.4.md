# Winkelnu Design System v1.4 — Product Media & Merchandising

Status: implemented

## Purpose

This step turns product media into a resilient first-class storefront primitive and strengthens the merchandising hierarchy without introducing artificial urgency or unsupported commercial claims.

## Shared product media

Path: `src/components/storefront/product-media.tsx`

`ProductMedia` is now the shared presentation layer for canonical product imagery on cards and product-detail pages.

It provides:

- merchant-feed image rendering from the canonical `Product.imageUrl` field
- HTTPS-only URL acceptance
- rejection of credential-bearing image URLs
- stable image proportions
- `object-contain` presentation so product imagery is not misleadingly cropped
- lazy loading for product cards
- eager loading for the primary product-detail image
- `referrerPolicy="no-referrer"`
- a Winkelnu-branded fallback when an image is absent or fails to load

The fallback is intentionally neutral: it keeps layout and product discovery usable without pretending that Winkelnu has an image it does not have.

## Why native image rendering is used

Affiliate and merchant feeds can reference many different HTTPS image hosts. A hardcoded Next.js remote-image host allowlist would make the storefront brittle whenever a new merchant or feed uses another legitimate CDN.

For this stage, Winkelnu therefore uses a native responsive image inside a controlled media surface rather than coupling feed onboarding to application image-host configuration.

This is a deliberate trade-off, not a permanent infrastructure decision. A future first-party image proxy/cache can improve privacy, reliability, transformations and cache control once real feed volumes justify it.

## Privacy and remote-image behavior

`no-referrer` prevents the page URL from being sent as the HTTP referrer, but the browser still requests a remote merchant/CDN image directly. That remote host can therefore still receive ordinary connection metadata such as the visitor IP address.

Do not describe the current implementation as an image proxy or privacy-isolated media layer.

## Media proportions

### Product cards

- standard ratio: 4:3
- white image surface
- contained image with internal breathing room
- subtle product zoom only when the containing card is hovered
- fixed layout even when the source image fails

### Product detail

- larger primary media surface
- minimum height scales from mobile to desktop
- one canonical primary image in v1.4
- no fake gallery or thumbnails until the canonical data model actually supports multiple product images

## Merchandising hierarchy

Product cards now follow this order:

1. product image
2. brand
3. product title
4. short description when available
5. `Beste bekende totaalprijs`
6. merchant and number of available offers
7. availability state
8. compare CTA

The price hierarchy deliberately says `Beste bekende totaalprijs` rather than implying an absolute market-wide cheapest price. It follows Winkelnu's existing ranking contract and known-shipping logic.

## Product detail hierarchy

The product-detail page now presents:

- the canonical product image
- feed-source image context
- brand and title
- description
- offer comparison panel
- individual merchant offer cards
- merchant-of-record clarification

The footer and storefront shell from v1.3 remain part of every migrated public surface.

## Failure behavior

A missing, invalid or broken media URL must never take the storefront offline.

Media failure degrades to the standard Winkelnu fallback while the canonical product, price comparison and merchant offers remain usable.

This mirrors the wider platform principle that feed-quality imperfections should not unnecessarily disable the storefront.

## Accessibility

- a real product image uses the product title as alt text
- the fallback icon is decorative
- the fallback includes readable text explaining that the product image is unavailable
- media surfaces do not contain essential interaction that depends on hover

## Merchandising constraints

Winkelnu must not invent or visually imply unsupported data. Therefore v1.4 does not introduce:

- fake percentage discounts
- fake old prices
- artificial countdowns or scarcity
- merchant logos without a trusted source and usage basis
- `beste deal` claims that exceed the ranking evidence
- cropped product imagery that can materially misrepresent the item
- multi-image galleries when only one canonical image exists

## Data contract

No database migration is required for v1.4 media presentation. The canonical `Product` already exposes `imageUrl`, the Supabase catalog repository maps `products.primary_image_url`, and the scalable ranking read model maps `product_image_url` back into `Product.imageUrl`.

This keeps product identity separate from merchant-offer identity while allowing the selected canonical product image to flow consistently through memory and Supabase storefront modes.

## Public surface adoption

The media component is now wired into:

- homepage product cards
- `/zoeken` product cards
- `/categorie/[slug]` product cards
- `/product/[slug]` primary product media

## Next design-system step

The next logical step after v1.4 is storefront states and interaction polish: reusable empty/error/loading treatments, stronger responsive card behavior, and groundwork for favorites only once the underlying persistence and product behavior are explicitly defined.
