# Winkelnu Design System v1.3 — Storefront Shell & Navigation

Status: implemented

## Purpose

This step turns the public storefront into a coherent shopping shell instead of a set of individually styled pages. The shell now has a stronger responsive header, persistent discovery paths and a complete public footer.

## Header

Path: `src/components/storefront/winkelnu-header.tsx`

The header now provides:

- Winkelnu brand anchor
- desktop navigation to products, categories and offers
- desktop quick search
- mobile menu without a client-side JavaScript dependency
- mobile search inside the menu
- consistent focus and hover states using the Winkelnu design tokens

The visual anchor remains the dark petrol market gradient.

## Footer

Path: `src/components/storefront/winkelnu-footer.tsx`

The footer is a first-class part of the design system, not an afterthought. It provides:

- Winkelnu brand statement
- discovery links
- explanation of Winkelnu's role as comparison/affiliate platform
- merchant-of-record clarification
- affiliate disclosure
- dynamic copyright year

The footer uses the evening gradient so the public storefront starts and ends with a recognizable Winkelnu brand surface.

## Public surface adoption

The shared footer is now present on:

- `/`
- `/zoeken`
- `/categorie/[slug]`
- `/product/[slug]`

The existing shared header remains present on these same public surfaces.

## Navigation contract

Primary discovery paths:

- `Producten` → `/zoeken`
- `Categorieën` → `/#categorieen`
- `Aanbiedingen` → `/zoeken?sort=price_asc`

The homepage category block now exposes the `categorieen` anchor so header/footer navigation lands on a real section.

## Affiliate transparency

The footer explicitly states that some links may be affiliate links and that Winkelnu may receive compensation without increasing the user's price.

The footer also makes clear that Winkelnu is not the seller and that purchase, payment, delivery, returns and warranty are handled by the relevant webwinkel.

## Responsive behavior

Desktop:

- brand left
- navigation center
- compact search right

Mobile:

- brand and menu control on one line
- navigation and search inside an accessible native `details` menu
- no dependency on client hydration for the menu to work

## Design rule

The shell should support discovery and trust without visually overpowering product content. Petrol remains the primary trust/navigation color; orange remains a restrained accent.

## Next design-system step

The next logical step is v1.4 — product media, imagery and richer merchandising states: real merchant-feed images, image fallbacks, aspect-ratio rules, favorite control groundwork and storefront empty/loading/error presentation.
