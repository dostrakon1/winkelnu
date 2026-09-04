# Winkelnu Live Runtime, SEO & Accessibility Acceptance v1.5

Status: **repository acceptance strengthened; live production acceptance still pending**

Date: 2026-09-04

## Purpose

This step separates what can be proven from the repository from what must be proven against the actual deployed Winkelnu production origin. It also fixes launch-level SEO and accessibility issues found during the acceptance pass.

## 1. Live runtime verification result

A fresh public-web discovery check for `winkelnu.nl` did not surface a verifiable Winkelnu production storefront. Search results returned unrelated domains rather than the current Winkelnu application.

Therefore this step does **not** claim that the live production runtime has passed acceptance.

Until a reachable deployed origin can be inspected directly, the following remain pending:

- HTTPS response and HTTP → HTTPS redirect behavior;
- final `NEXT_PUBLIC_SITE_URL` origin;
- rendered canonical URLs;
- live `/robots.txt`;
- live `/sitemap.xml`;
- Open Graph image and favicon delivery;
- response/security headers;
- browser cookies and storage;
- platform-level analytics;
- real production catalog and affiliate redirect journey.

This is an external runtime gate, not a repository failure.

## 2. SEO canonical audit

### Issue found

The root layout defines the homepage canonical `/`. In Next.js metadata this can be inherited by child routes that do not declare their own canonical metadata.

Product and category routes already have route-specific canonical behavior, but the public legal/information routes introduced during Launch Readiness v1.3 initially relied on the root metadata. That could cause those pages to advertise the homepage as their canonical URL.

### Fix implemented

Explicit canonical contracts now exist for:

- `/affiliate-en-vergelijking`
- `/cookies`
- `/disclaimer`
- `/over-winkelnu`
- `/privacy`

The root `/` canonical remains the homepage fallback. Indexable product/category pages keep their own route-specific canonical metadata.

`/zoeken` remains intentionally `noindex,follow`, and unavailable/internal/redirect surfaces remain outside the canonical discovery set.

## 3. Sitemap audit

The generated sitemap now includes the permanent public information routes:

- `/over-winkelnu`
- `/affiliate-en-vergelijking`
- `/privacy`
- `/cookies`
- `/disclaimer`

They use a monthly change frequency and lower priority than catalog discovery pages.

The sitemap continues to exclude:

- `/zoeken` filter/search URLs;
- `/uit/*` affiliate redirect URLs;
- `/intern/*` operator surfaces;
- `/api/*` machine endpoints;
- `/aanbieding-niet-beschikbaar` recovery content.

### Scale note

The catalog section still calls `listProducts({ limit: 500 })`. That remains acceptable only while the canonical live catalog fits within this ceiling. Before the catalog grows beyond it, the sitemap must be sharded/paginated rather than silently omitting products.

## 4. Accessibility semantic audit

### Issue found

The shared `StorefrontEmptyState` always rendered its title as an `h2`. On pages where the empty state is the page's primary content, this meant there was no page-level `h1`.

Affected launch journeys included:

- global not-found state;
- expired/unavailable affiliate offer recovery.

### Fix implemented

`StorefrontEmptyState` now supports:

- `h1`
- `h2`
- `h3`

through a typed `headingLevel` prop, defaulting to `h2` so existing search/category empty states preserve their hierarchy.

The global not-found page and unavailable-offer page now explicitly render their primary title as `h1`.

## 5. Repository-level accessibility baseline

Already present before this step:

- semantic `html lang="nl"`;
- visible focus system;
- reduced-motion foundation;
- shared controls with mobile-friendly touch sizing;
- labelled navigation regions;
- search-field labelling;
- semantic product facts and breadcrumbs;
- loading, error, empty and not-found states;
- clear affiliate CTA semantics.

This is a strong implementation baseline, but it is not a substitute for live/manual assistive-technology testing.

## 6. Manual live acceptance matrix

When the production deployment is reachable, complete these checks on the exact promoted SHA.

### Domain and transport

- `https://winkelnu.nl/` returns the intended application;
- HTTP redirects to HTTPS;
- only the intended canonical host is promoted;
- no preview/deployment hostname leaks into canonical metadata.

### SEO

- homepage canonical = `https://winkelnu.nl/`;
- each category canonical points to its own canonical category URL;
- each product canonical points to its own canonical product URL;
- each legal/information page canonical points to itself;
- `/zoeken` renders `noindex,follow`;
- `/intern/*` remains noindex and access-controlled;
- `/robots.txt` advertises the production sitemap and blocks intern/api/uit;
- `/sitemap.xml` returns valid production URLs;
- Open Graph image and favicon load from the production origin.

### Keyboard

Test without a mouse:

1. header navigation;
2. homepage search;
3. category discovery;
4. search/filter controls;
5. pagination;
6. product detail;
7. offer comparison;
8. merchant CTA;
9. footer legal links;
10. error/not-found recovery.

Focus must remain visible and follow a logical reading order.

### Mobile and zoom

Verify at narrow phone widths and at increased text/zoom:

- no horizontal document overflow;
- menu/search remain operable;
- sticky search actions do not obscure content;
- product grids collapse cleanly;
- merchant CTA remains reachable;
- legal content remains readable;
- no fixed element traps interactive content.

### Screen-reader smoke test

Verify at least:

- page title and one meaningful `h1` per primary page state;
- navigation landmarks;
- search label;
- product links have understandable names;
- availability/price text is understandable without visual position;
- external merchant action communicates its purpose.

## 7. Runtime privacy/compliance acceptance

On the exact production origin inspect:

- all cookies before interaction;
- localStorage/sessionStorage/IndexedDB where applicable;
- any analytics/network requests;
- Vercel platform analytics configuration;
- Supabase Auth cookies only where the internal operator flow requires them;
- whether public visitors receive any optional tracker before consent.

If runtime behavior differs from `/cookies` or `/privacy`, policy text or runtime configuration must be corrected before launch.

## 8. Real-feed acceptance

A design-system or synthetic-data pass cannot approve the first real merchant feed.

For at least one active production-shaped feed verify:

- titles and descriptions fit discovery/detail layouts;
- image success and fallback behavior;
- merchant names are readable;
- product matching is correct;
- known/unknown shipping copy remains accurate;
- stale/expired offers disappear according to policy;
- ranking reflects the documented known-price methodology;
- `/uit/<offer-id>` reaches the intended merchant destination;
- click attribution is written once as expected.

## 9. Acceptance status

| Gate | Status |
| --- | --- |
| Repository SEO canonical architecture | **PASS after v1.5 fixes** |
| Public information routes in sitemap | **PASS** |
| Not-found / unavailable heading semantics | **PASS after v1.5 fixes** |
| Existing responsive/accessibility implementation baseline | **PASS for repository review** |
| Exact-HEAD CI | **Must be verified on final v1.5 SHA** |
| Public production origin reachable and inspected | **PENDING** |
| Live canonical/robots/sitemap/OG verification | **PENDING** |
| Manual keyboard/mobile/screen-reader acceptance | **PENDING** |
| Runtime cookie/storage/analytics acceptance | **PENDING** |
| First real production-shaped feed journey | **PENDING** |

## Definition of v1.5 complete

The repository portion of v1.5 is complete when exact-HEAD CI is green.

The **live acceptance portion** is complete only after a real production deployment is reachable and every applicable pending runtime check above has evidence. Do not convert a repository review into a live-pass claim.

## Next step

**Launch Readiness v1.6 — Deployment Evidence & First Real Feed Acceptance**

Once the exact deployment URL/domain is reachable, capture the live domain/SEO/runtime evidence and run the first complete visitor journey from discovery → product → offer → affiliate redirect using production-shaped merchant data.