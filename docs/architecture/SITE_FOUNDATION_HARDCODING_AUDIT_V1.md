# Site Foundation Hardcoding Audit v1

Status: **implemented foundation + scoped follow-up**  
Related decision: `MASTER_CONTROL_CENTER_MULTI_SITE_ARCHITECTURE_V1.md`

## Goal

Prepare Winkelnu for a future multi-site platform without prematurely building host routing, a `sites` database table, or a second storefront.

The smallest useful seam is a typed in-repository site registry with Winkelnu as site #1. Shared runtime and SEO code may depend on that site contract; intentionally branded storefront components may remain Winkelnu-specific.

## Implemented in this step

A typed `src/config/sites.ts` registry now defines the current active storefront and its stable platform identity:

- site id and slug
- brand/site name
- domain and canonical origin
- market
- locale, Open Graph locale and HTML language
- currency
- production analytics hosts
- shared root SEO metadata
- editorial author/publisher identity

The current active site is `winkelnu-nl`.

The registry is deliberately static for now. There is no database migration and no host-based site resolver yet.

### Hardcoding moved behind the site boundary

The following shared concerns now source site identity from `activeSite` instead of embedding `winkelnu.nl` or equivalent identity directly:

1. root metadata and HTML language in `src/app/layout.tsx`
2. robots sitemap origin in `src/app/robots.ts`
3. sitemap origin in `src/app/sitemap.ts`
4. production analytics host allowlist in `src/lib/analytics/public-web-analytics.ts`
5. product JSON-LD canonical origin in `src/lib/seo/product-json-ld.ts`
6. editorial JSON-LD canonical origin, author and publisher identity in `src/lib/seo/editorial-json-ld.ts`

`NEXT_PUBLIC_SITE_URL` remains supported as a deployment/runtime origin override where it was already used. Canonical structured data continues to use the configured canonical storefront origin rather than a preview deployment URL.

## Intentionally still Winkelnu-specific

These are storefront concerns, not shared-engine defects, and should not be renamed or generalized merely to make the code look multi-site:

- `WinkelnuHeader`, `WinkelnuFooter`, `WinkelnuButton`, `WinkelnuBadge`, hero and brand components
- current Winkelnu logo/icon/Open Graph artwork
- Dutch storefront copy and editorial content
- routes whose meaning is explicitly current-brand content, such as `/over-winkelnu`
- current theme/token naming such as `--wn-*`
- the `WinkelnuWebAnalytics` component name and its current SDK/debug labels
- current legal/public copy that specifically describes Winkelnu

When a second storefront is actually introduced, these should be handled through a storefront/theme/content boundary rather than mass-renamed in advance.

## Shared engine areas that should stay brand-neutral

New work in these areas should not introduce unnecessary Winkelnu-only assumptions:

- products and product identity
- offers and offer ranking
- merchants
- affiliate networks and integrations
- feed ingestion and provider adapters
- import orchestration/workers
- taxonomy and matching
- quality/observability/recovery
- click attribution
- affiliate revenue/performance ingestion
- Master Control Center read models
- AI/intelligence signals

## Deferred until there is a real second-site requirement

Do **not** implement these yet solely for future-proofing:

1. Supabase `sites` table and migrations
2. hostname-to-site runtime routing
3. multiple storefront apps/packages
4. per-site catalog publication tables
5. per-site affiliate approval persistence
6. per-site click/revenue attribution migrations
7. site selector in the Master Control Center
8. per-site themes/content packs
9. locale/currency conversion infrastructure

These become justified when the first concrete second storefront is ready to be onboarded.

## Next migration seam

Before site #2 launches, introduce `site_id` only at the boundaries that genuinely require site ownership or attribution. Likely order:

1. site registry persistence / host resolution
2. site publication eligibility for catalog entities
3. affiliate media/approval status by site
4. click attribution by site
5. revenue/conversion attribution by site
6. Control Center site selector and cross-site aggregates
7. storefront theme/content configuration

The shared product/offer/feed/import core should remain reusable and should not be duplicated per storefront.

## Guardrail

A future change should ask:

> Is this a storefront concern, or a shared platform concern?

If it is storefront-specific, keep it behind site/theme/content configuration. If it belongs to catalog, feeds, affiliate integrations, imports, analytics, revenue, operations or intelligence, keep it brand-neutral.
