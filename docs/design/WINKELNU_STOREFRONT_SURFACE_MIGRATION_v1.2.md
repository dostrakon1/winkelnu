# Winkelnu Design System v1.2 — Storefront Surface Migration

Status: implemented

## Purpose

This step migrates the public search, category and product-detail surfaces onto the shared Winkelnu design language introduced in v1.0 and the reusable React primitives from v1.1.

## Migrated surfaces

- `/zoeken`: shared header, Winkelnu form primitives, section hierarchy, product cards, empty state and pagination.
- `/categorie/[slug]`: shared header, branded category introduction, product cards, empty state and pagination.
- `/product/[slug]`: shared header, branded product hierarchy and reusable offer cards.

## Component refinements

### ProductCard

`ProductCard` now also supports products that temporarily have no active offer. This prevents category pages from inventing a price or availability state when the catalog has none. The CTA becomes `Bekijk product` in that state.

### OfferCard

`OfferCard` now separates item price, shipping context and known total price. The visually emphasized value is the known total price because Winkelnu's comparison model ranks on known total purchase price when shipping is known.

### WinkelnuButton

Link buttons can carry a `rel` attribute so offer links can retain the affiliate relationship semantics used by the outgoing `/uit/...` route.

## UX rules preserved

1. Search/filter pages remain `noindex,follow`.
2. Paginated category pages retain their existing crawl policy and canonicals.
3. No UI claim presents Winkelnu as the seller.
4. `Bekijk aanbieding` is only used on actual merchant offers.
5. Products without an active offer do not receive fabricated availability or price states.
6. Best-offer highlighting remains subtle and factual, without urgency language.
7. Existing catalog, affiliate redirect and persistence behavior is unchanged by this visual migration.

## Result

The homepage, search results, category discovery and product comparison now share the same brand palette, surfaces, typography hierarchy, controls, product-card anatomy and offer presentation. New public storefront work should extend this system instead of introducing separate zinc/neutral page styling.

## Next design-system step

Design System v1.3 should focus on the storefront shell and navigation: responsive header behavior, persistent search access, category discovery/navigation and a deliberate foundation for favorites without implementing product behavior that is not yet ready.
