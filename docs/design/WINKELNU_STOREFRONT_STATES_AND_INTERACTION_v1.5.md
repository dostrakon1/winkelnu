# Winkelnu Design System v1.5 — Storefront States & Interaction Polish

Status: implemented

## Purpose

This step makes the public storefront feel complete when data is loading, absent, unavailable or when a route fails. It also improves product-card behavior on narrow screens without changing the underlying catalog or ranking contracts.

## Shared empty state

Path: `src/components/storefront/storefront-empty-state.tsx`

The shared empty state provides:

- eyebrow, title and explanatory copy
- optional recovery/discovery CTA
- the same cream/petrol/orange visual language as the rest of Winkelnu
- enough visual hierarchy to feel intentional without presenting an error as a crisis

It is now used on:

- `/zoeken` when filters return no products
- `/categorie/[slug]` when a valid category currently has no active products
- the global not-found route

## Loading state

Paths:

- `src/components/storefront/storefront-loading-grid.tsx`
- `src/app/loading.tsx`

The loading experience now keeps the full Winkelnu shell visible and shows a product-card skeleton grid while server-side storefront data resolves.

Principles:

- maintain page structure while loading
- avoid layout jumps where practical
- communicate loading to assistive technology with `aria-busy` and screen-reader text
- skeletons are decorative and do not pretend to contain real product data

## Error recovery

Path: `src/app/error.tsx`

Unexpected route/render failures now receive a recoverable branded error state with:

- clear neutral explanation
- `Opnieuw proberen` using the Next.js reset boundary
- direct route back to product discovery

The error boundary intentionally does not expose implementation details, stack traces, API messages or feed errors to visitors.

## Not-found state

Path: `src/app/not-found.tsx`

Missing pages, stale product links and removed catalog items now land on a coherent Winkelnu state instead of a generic framework page.

The user is directed back to `/zoeken`.

## Search empty-state behavior

A zero-result search now explains that the current combination of term and filters did not produce a match and gives the user one explicit recovery action: clear the filters.

The message does not imply that the requested product does not exist anywhere; it only describes the current Winkelnu result set.

## Category empty-state behavior

A valid category with no current active products now remains usable and explains that merchant-feed updates can change availability.

This keeps temporary feed/catalog emptiness distinct from a missing category, which still uses the not-found boundary.

## Product-card interaction polish

Path: `src/components/storefront/product-card.tsx`

Cards now improve small-screen behavior through:

- responsive padding
- slightly smaller mobile product titles
- stacked price/status presentation on narrow widths
- side-by-side price/status presentation from small breakpoints upward
- `h-full` card layout so grid rows align more consistently
- explicit shrink behavior around availability badges

The existing product image, total-price hierarchy and compare CTA remain unchanged.

## Interaction principles

Winkelnu storefront states follow these rules:

1. A temporary data state must not look like a permanent failure.
2. An empty result must offer a sensible next action.
3. Unexpected errors must not expose technical details.
4. Loading placeholders must not invent product information.
5. Missing pages must preserve the Winkelnu visual identity and discovery path.
6. Responsive changes must preserve the same commercial hierarchy on mobile and desktop.

## Accessibility

- loading content announces busy state without duplicating every skeleton element
- empty and not-found states use real headings and readable copy
- retry is a native button
- discovery links remain normal anchors where appropriate
- interaction does not depend on hover

## What v1.5 deliberately does not add

- fake loading progress percentages
- persistent toast infrastructure without a concrete need
- client-side state management for server-rendered catalog pages
- favorites persistence
- personalized recommendations
- fabricated error details

## Next design-system step

The next logical step is v1.6 — Trust, Comparison Signals & Microcopy: refine badges, shipping/price explanations, merchant trust context, affiliate disclosure placement and comparison microcopy across cards and product detail without adding unsupported trust scores or ratings.
