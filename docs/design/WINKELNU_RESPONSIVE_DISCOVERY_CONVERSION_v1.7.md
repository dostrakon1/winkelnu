# Winkelnu Design System v1.7 — Responsive Discovery & Conversion Polish

Status: implemented

## Purpose

This step improves how Winkelnu feels on phones and tablets without changing the trust, ranking or merchant-of-record rules established in earlier design-system stages.

The focus is practical: easier search, clearer filter actions, calmer product density, stronger outbound CTA hierarchy and reliable touch targets.

## Touch-target contract

The shared `.wn-button` minimum height is now 48px.

This applies to primary, secondary and warm actions and gives the storefront a more dependable touch target on mobile devices.

Navigation links and pagination actions that behave like controls now also use a minimum 48px interaction height where appropriate.

On small screens, card hover elevation no longer moves cards vertically. This avoids desktop-style hover behavior leaking into touch-first interaction.

## Responsive search field

Path: `src/components/storefront/winkelnu-search-field.tsx`

The shared search field now:

- stacks input and submit button on small screens;
- keeps the submit button full width on mobile;
- returns to an inline layout from the small breakpoint upward;
- uses a 16px search input size on phones to avoid unnecessary browser zoom behavior;
- preserves the existing Winkelnu search and focus styling.

## Header discovery

Path: `src/components/storefront/winkelnu-header.tsx`

The header now has stronger touch ergonomics:

- desktop navigation links have consistent vertical interaction space;
- the mobile menu control meets the 48px target;
- mobile navigation rows meet the same target;
- the mobile menu width is bounded to the viewport;
- mobile search uses a phone-friendly text size;
- the existing hydration-free native `details` menu is retained.

No new client-side navigation state is introduced.

## Mobile search and filters

Path: `src/app/zoeken/page.tsx`

The filter form now prioritizes one-handed use:

- slightly tighter mobile padding;
- phone-friendly 16px form control text;
- larger stock checkbox target;
- a sticky mobile action bar for `Toon resultaten` and `Wis filters`;
- the action bar returns to normal document flow on larger screens;
- primary and reset actions share available width on mobile.

This keeps filters usable without requiring a custom JavaScript drawer.

## Product-grid density

Homepage, search and category grids now use the same density rule:

- one column on narrow phones;
- two columns from the small breakpoint;
- three columns on wider desktop layouts.

Grid gaps are slightly tighter on small screens and return to the established spacing on larger layouts.

This increases useful product visibility on common mobile/tablet widths without turning Winkelnu into a visually dense marketplace wall.

## Homepage discovery

The homepage receives additional responsive refinement:

- slightly tighter mobile hero spacing;
- smaller mobile headline while preserving the large desktop brand statement;
- trust points stack cleanly on phones;
- category chips become a horizontal swipe row on mobile;
- category chips keep a minimum touch height;
- categories return to a wrapped layout on larger screens.

The horizontal category row is discovery navigation, not a carousel with hidden JavaScript controls.

## Category actions

Category-page actions now stack full width on phones and return to inline controls on larger screens.

Pagination links have larger interaction areas while preserving standard `rel=prev` and `rel=next` semantics.

## Offer-card conversion hierarchy

Path: `src/components/storefront/offer-card.tsx`

The outbound merchant CTA is now visually clearer without becoming aggressive:

- `Bekijk aanbieding` uses the warm Winkelnu accent;
- the CTA spans the card width on mobile;
- it returns to content width on larger screens;
- an outward arrow communicates that the visitor leaves Winkelnu for the merchant;
- `rel="nofollow sponsored"` remains intact;
- price, shipping and stock caveats remain visible before the CTA.

The warm accent is reserved for this meaningful conversion action rather than being scattered across the storefront.

## Trust preservation

v1.7 does not change:

- canonical product identity;
- offer ranking rules;
- known-shipping price language;
- availability evidence;
- affiliate disclosure;
- merchant-of-record responsibility;
- sponsored outbound-link semantics.

Conversion polish must never make the interface more certain than the underlying data.

## Accessibility and mobile behavior

The step specifically improves:

- touch target size;
- mobile form font size;
- focus-visible behavior already defined by the design system;
- responsive stacking without information loss;
- control reachability near the bottom of the mobile filter form;
- predictable native navigation behavior.

No essential information is hidden behind hover.

## Next design-system step

The next logical step is v1.8 — **Product Detail Experience & Comparison Layout**: refine the product-detail information hierarchy, merchant comparison readability, mobile sticky/anchored comparison access and richer product metadata presentation without adding unsupported commerce data.