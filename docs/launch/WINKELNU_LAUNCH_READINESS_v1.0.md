# Winkelnu Launch Readiness v1.0

Status: **technical storefront baseline strengthened; public launch gate not yet passed**

Date: 2026-09-04

## Purpose

This step changes the project from design-system expansion to launch verification. The goal is not to declare Winkelnu live-ready too early, but to make the remaining public-launch conditions explicit and to remove repository-level launch risks that can be solved safely now.

## Current public surface inventory

Canonical discovery surfaces currently present in the App Router:

- `/` — homepage
- `/zoeken` — search/filter discovery, intentionally `noindex,follow`
- `/categorie/[slug]` — category discovery
- `/product/[slug]` — product detail and merchant comparison
- `/aanbieding-niet-beschikbaar` — expired/unavailable offer recovery
- `/uit/[offerId]` — sponsored outbound redirect, not a content page
- generated `/robots.txt`
- generated `/sitemap.xml`
- generated Open Graph image
- generated favicon / Apple icon

Non-public operational surfaces:

- `/intern/login`
- `/intern/operations`
- `/intern/operations/preview-import`
- `/api/health`
- `/api/ops/*`

## Improvements implemented in v1.0

### 1. Crawler boundaries hardened

`src/app/robots.ts` now explicitly excludes:

- `/intern/`
- `/api/`
- `/uit/`

The public site remains crawlable and the canonical sitemap remains advertised.

Search/filter URLs are not blocked in robots because `/zoeken` already emits `noindex,follow`; blocking the route would prevent compliant crawlers from seeing that page-level indexing directive and can unnecessarily interfere with link discovery.

### 2. Internal surfaces now emit noindex metadata

A dedicated `src/app/intern/layout.tsx` now applies:

- `index: false`
- `follow: false`
- `noarchive: true`
- `nosnippet: true`

This is defense in depth. Authentication/authorization remains the actual security boundary; robots and metadata are never treated as access control.

### 3. Unavailable-offer recovery aligned with the storefront

The old zinc-styled `/aanbieding-niet-beschikbaar` page was a visual holdover from before the Winkelnu design system.

It now uses:

- the Winkelnu header
- the shared branded empty-state component
- current pricing/availability language
- the Winkelnu footer
- a direct recovery action to `/zoeken`
- existing `noindex,follow` metadata

This closes a launch-level consistency gap in a user journey that visitors can realistically hit after an affiliate offer expires.

### 4. Production go-live checklist updated

`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md` has been updated to:

- reference migrations `0001` through `0017`, matching the repository;
- avoid stale wording that assumed preview provisioning had not happened;
- add a dedicated Public storefront gate;
- add public-launch stop conditions alongside infrastructure/import stop conditions.

## SEO and discovery assessment

### Good baseline

- root metadata has a production-site URL fallback;
- product pages have canonical URLs;
- category pages have canonical URLs and pagination indexing controls;
- `/zoeken` is `noindex,follow`;
- sitemap contains homepage, categories and products rather than search/filter URLs;
- affiliate outbound redirects are not sitemap content;
- Open Graph, favicon and Apple icon are present;
- internal routes are now excluded from crawler discovery and indexing metadata.

### Remaining verification

Before public promotion, verify on the actual production hostname:

- `NEXT_PUBLIC_SITE_URL` resolves to the final canonical HTTPS origin;
- all generated canonical URLs use that origin;
- `/robots.txt` advertises the correct sitemap origin;
- `/sitemap.xml` resolves without catalog/runtime errors;
- Open Graph image renders from the public hostname;
- favicon and Apple icon render in browsers/devices;
- category/product URLs represented in the sitemap are valid production catalog records.

## Sitemap scale note

The current sitemap implementation calls `listProducts({ limit: 500 })`.

That is acceptable for an early catalog, but it is **not a final large-catalog sitemap architecture**. Once Winkelnu exceeds that scale, the sitemap should be sharded/paginated using Next.js sitemap generation rather than silently representing only the first 500 products.

This is not a launch blocker while the live canonical product set remains below the limit. It becomes a blocker before catalog size exceeds the representation capacity.

## Affiliate and comparison trust assessment

Already implemented:

- `Bekijk aanbieding` links preserve `rel="nofollow sponsored"` at the storefront CTA layer;
- outbound navigation is mediated by the existing `/uit/[offerId]` redirect/click-attribution flow;
- Winkelnu does not claim to be the seller;
- final price, payment, delivery, return and warranty responsibility are assigned to the merchant;
- product-only price is distinguished from known total price when shipping is missing;
- no fabricated reviews, scarcity, merchant scores or discount claims are used;
- remote feed media failure degrades to a branded fallback rather than breaking discovery.

Still required for public launch:

- a permanent public explanation of affiliate compensation and comparison/ranking methodology;
- public privacy information covering click attribution, operational logs and any analytics actually deployed;
- cookie/consent treatment based on the actual tracking stack, not a generic banner;
- company/contact/disclaimer information appropriate to the legal operator of Winkelnu.

## Legal/compliance launch blocker

The repository currently does **not** contain complete public legal/compliance routes such as privacy, cookies, affiliate/comparison methodology and operator/company information.

This is intentionally recorded as an unresolved public-launch blocker rather than filled with guessed legal identity or placeholder contact data.

The next compliance step must establish the authoritative operator details and actual data-processing/tracking behavior first, then publish the legal pages and footer links from that verified information.

Do not mark Winkelnu public-launch-ready until this gate is closed.

## Accessibility and mobile QA gate

The design system already includes:

- visible focus styling;
- reduced-motion handling;
- minimum 48px shared button targets;
- phone-friendly form input sizing;
- semantic product facts;
- semantic breadcrumbs on product detail;
- loading, empty, error and not-found states.

Still perform a production-shaped manual QA pass for:

- keyboard-only homepage → search → product → merchant CTA journey;
- mobile menu and mobile search;
- search filter controls and sticky action region;
- category horizontal discovery row;
- product comparison anchor and merchant cards;
- focus order after navigation and error recovery;
- zoom/text scaling at common mobile widths;
- screen-reader labels for search and navigation landmarks.

## Real-feed acceptance gate

Design-system completion is not proof that real affiliate data looks correct.

Before public promotion, validate with at least one production-shaped real feed:

- image URLs load or fail safely;
- title/brand/description lengths do not destroy card layouts;
- missing brand, shipping, GTIN and MPN remain graceful;
- known and unknown shipping labels stay accurate;
- expired/stale offers disappear according to catalog rules;
- redirect destinations resolve to the intended merchant product;
- merchant names are human-readable;
- duplicate/matched products do not produce misleading comparison pages.

## Launch readiness matrix

| Gate | Status | Notes |
| --- | --- | --- |
| Design system / responsive storefront | Ready for QA | v1.0–v2.0 foundation present |
| Homepage launch composition | Implemented | production data still needs acceptance testing |
| Product/category/search surfaces | Implemented | canonical/noindex rules present |
| Error/loading/empty/unavailable states | Implemented | unavailable-offer page aligned in this step |
| Crawler boundaries | Hardened | intern/api/outbound redirect excluded |
| Sitemap | Ready for early catalog | 500-product scale ceiling remains |
| Affiliate outbound semantics | Implemented | final live redirect acceptance still required |
| Internal operator indexing | Hardened | noindex plus robots; auth remains security boundary |
| Exact production CI/build | Pending per final release commit | must be green on the promoted SHA |
| Real production-shaped feed QA | Pending | required before launch |
| Accessibility/manual mobile QA | Pending | required before launch |
| Public legal/compliance pages | **BLOCKER** | authoritative operator/data-processing facts required |
| Production domain/canonical verification | Pending | validate on final deployed hostname |

## Definition of public-launch-ready

Winkelnu may be considered public-launch-ready only when:

1. exact-HEAD CI and production build are green;
2. canonical domain/robots/sitemap/social metadata are verified live;
3. at least one real feed has passed storefront and redirect acceptance;
4. public legal/compliance pages contain verified information and are linked from the footer;
5. analytics/cookies match the published privacy/consent behavior;
6. keyboard/mobile/accessibility smoke tests pass;
7. no unresolved severity-1 or severity-2 launch blocker remains.

## Next step

**Launch Readiness v1.1 — Compliance, Privacy & Affiliate Policy Architecture**

This should establish the verified public legal model for Winkelnu before writing final legal pages. It should cover operator identity, affiliate disclosure, ranking methodology, privacy/data inventory, cookie/analytics policy, retention, user rights/contact routes, and the exact footer/legal navigation contract.
