# M1 — Public Content Launch

Status: public foundation live; M1.9 editorial expansion in review.

## Purpose

Build a useful, honest editorial shopping layer before affiliate activation. The expanded public editorial release targets seven main categories and twenty-one original choice guides: three reviewed guides per category. A separate curated product-only catalog may be shown before affiliate approval, but it contains no invented merchant offers, prices or outbound affiliate links.

## Editorial launch set

The seven public editorial categories are:

1. Elektronica
2. Wonen & huishouden
3. Keuken & koffie
4. Persoonlijke verzorging
5. Huis, tuin & klussen
6. Sport & outdoor
7. Speelgoed & hobby

Each category contains three complete choice guides before it is treated as part of the public launch set. Six original category photographs are owner-approved and stored under `public/images/categories/`. Persoonlijke verzorging deliberately uses the documented Winkelnu Surface Motif as a visual fallback until a separate owner-approved editorial photograph is added; no unrelated stock image is substituted.

## Boundaries

- Existing catalog, ingestion, operator, database and affiliate architecture remain intact.
- Editorial categories are separate from persisted commerce categories and use an explicit mapping when their public slugs differ.
- No invented prices, reviews, popularity, testing, merchant relationships or trend evidence.
- Editorial guides are not independent laboratory tests or commissioned product reviews.
- The curated pre-affiliate catalog is product-only and contains no fabricated merchant offers or outbound affiliate links.
- Real persistent merchant and affiliate data remains fail-closed until the production data release gate is explicitly enabled.
- No new analytics, cookies, external paid APIs, database migrations or automated imports are introduced by the editorial expansion.
- The existing compliance inventory remains authoritative; this release does not declare unresolved operator, processor, cookie or retention items complete.

## Editorial → catalog bridge

A guide may link to a storefront product-type filter only when the guide topic has a known canonical comparison group in the current catalog taxonomy. The link is informational and does not imply ranking, endorsement, availability or a commercial offer. Editorial categories map explicitly to commerce categories; for example `huis-tuin-klussen` maps to the existing storefront category `tuin-klussen`.

## Structured data boundary

Guide pages may expose grounded `Article` and `BreadcrumbList` structured data using the actual guide title, description and `updated` date. Editorial category pages may expose `CollectionPage`, `ItemList` and `BreadcrumbList` data based on the guides actually rendered. Do not add ratings, reviews, prices, offers, popularity claims or an invented publication date.

## Real commerce release switch

`WINKELNU_PUBLIC_CATALOG_ENABLED` remains the explicit release gate for real persistent merchant/affiliate data. Enabling real commerce requires the production persistence mode and the existing acceptance checks. The curated product-only fallback must not be mistaken for proof that live merchant offers are approved.

Turning on real merchant data is a separate production release decision. It is not authorization to import feeds or publish unverified data. Verify that persistent data originates from approved partners and satisfies the existing acceptance gates before enabling it. Do not use a public `NEXT_PUBLIC_` variable for this switch.

## Release gates

1. Review the complete editorial copy, sources, navigation, visual fallback and accessibility on an isolated preview build.
2. Run lint, typecheck, tests and production build. Record the exact commit and results. Do not claim success from source review alone.
3. Confirm that all twenty-one guides and seven editorial categories resolve, invalid slugs return 404, the six approved category photographs load, the Persoonlijke verzorging Surface Motif fallback renders, and sitemap entries are correct.
4. Verify that guide-to-catalog links resolve to real category slugs or supported product-type facets and never imply unavailable prices or offers.
5. Verify that curated product pages remain free of fabricated prices, merchants and outbound affiliate links. Verify separately that real approved data works only behind the explicit production release gate.
6. Resolve remaining legal operator publication details, production processors, storage/cookies and visitor-data retention from the existing verified inventory.
7. Check actual Vercel production and preview settings, including automatic deployments, analytics and build budgets, before merging. Creating a PR must not be treated as proof that no deployment or cost is triggered.
8. Review the preview and later the live origin on desktop and mobile, including contact, legal pages, category cards, guides, robots, sitemap and links.
9. Only then request affiliate-network reapproval through the existing publisher support route. Approval is not guaranteed.

## CI cost policy

Draft PRs skip the Quality job before runner allocation. Ready-for-review and main retain the migration-manifest, database-contract, lint, typecheck, test and build checks. Concurrency cancels stale runs. A draft PR is not verified merely because its skipped checks are green or neutral. Move to Ready only when a final verification run is wanted and the account budget allows it. Check Vercel's automatic preview-deployment settings separately; GitHub Actions job gating does not control Vercel billing.

## Commercial activation

Keep editorial publishing separate from merchant activation. A partner may be activated only after approval, allowed feed terms, source validation, accurate prices/availability and compliance checks. Commission must not silently control organic relevance. Paid placements require clear labeling. Shopping discovery, Pulse, TrendRadar and Slim Vergelijken remain future evidence-backed capabilities, not claims of features already delivered.
