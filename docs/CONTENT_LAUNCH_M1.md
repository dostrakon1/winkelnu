# M1 — Public Content Launch

Status: implementation in review. Content may be published only after the release gates below are complete.

## Purpose

Replace the temporary coming-soon page with a useful, honest editorial shopping guide. The first release contains three editorial categories and six original choice guides. It is not a substitute for real affiliate approval or live product data.

## Boundaries

- Existing catalog, ingestion, operator, database and affiliate architecture remain intact.
- Editorial categories are separate from persisted commerce categories.
- No invented products, prices, reviews, popularity, testing, merchant relationships or trend evidence.
- Editorial guides are not independent laboratory tests or commissioned product reviews.
- The public catalog is fail-closed until a production data release gate is explicitly enabled. Synthetic in-memory data must never be publicly presented as real offers.
- No new analytics, cookies, external APIs, paid services, database migrations or automated imports are introduced.
- The existing compliance inventory remains authoritative; this release does not declare unresolved operator, processor, cookie or retention items complete.

## Public catalog release switch

`WINKELNU_PUBLIC_CATALOG_ENABLED` is a server-only environment variable. It is disabled unless its exact value is `true` and `CATALOG_PERSISTENCE=supabase`. The public commerce routes `/zoeken`, `/categorie/*`, `/product/*` and `/uit/*` are blocked at the request boundary while disabled. The public sitemap excludes commerce data while disabled, and navigation does not advertise the catalog. The existing operator and ingestion paths remain unchanged.

Turning on the switch is a separate, explicit production release decision. It is not authorization to import feeds or publish synthetic data. Verify that persistent data originates from approved partners and satisfies the existing acceptance gates before enabling it. Do not use a public `NEXT_PUBLIC_` variable for this switch.

## Release gates

1. Review the complete editorial copy, sources, navigation and accessibility on a local or isolated preview build.
2. Run lint, typecheck, tests and production build locally. Record the exact commit and results. Do not claim success from source review alone.
3. Confirm that all six guides and three editorial categories resolve, invalid slugs return 404, and sitemap entries are correct.
4. Verify that every public catalog and outbound route is unavailable when the catalog release gate is off. Verify separately that real approved data works when it is enabled; do not use synthetic fixtures as production evidence.
5. Resolve remaining legal operator publication details, production processors, storage/cookies and visitor-data retention from the existing verified inventory.
6. Check actual Vercel production and preview settings, including automatic deployments, analytics and build budgets, before merging. Creating a PR must not be treated as proof that no deployment or cost is triggered.
7. Review the live origin on desktop and mobile, including contact, legal pages, robots, sitemap, links and actual browser storage.
8. Only then request Daisycon reapproval through the existing publisher support ticket. Approval is not guaranteed.

## CI cost policy

Draft PRs skip the Quality job before runner allocation. Ready-for-review and main retain the migration-manifest, database-contract, lint, typecheck, test and build checks. Concurrency cancels stale runs. A draft PR is not verified merely because its skipped checks are green or neutral. Move to Ready only when a final verification run is wanted and the account budget allows it. Check Vercel's automatic preview-deployment settings separately; GitHub Actions job gating does not control Vercel billing.

## Commercial activation

Keep editorial publishing separate from merchant activation. A partner may be activated only after approval, allowed feed terms, source validation, accurate prices/availability and compliance checks. Commission must not silently control organic relevance. Paid placements require clear labeling. Shopping discovery, Pulse, TrendRadar and Slim Vergelijken remain future evidence-backed capabilities, not claims of features already delivered.
