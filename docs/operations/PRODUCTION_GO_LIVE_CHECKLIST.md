# Winkelnu Production Go-Live Checklist

Status: repository-ready; live environment promotion requires explicit verification against the current deployed projects.

## Preview gate
1. Confirm the Supabase preview project.
2. Apply migrations `0001` through `0017` in order.
3. Run `supabase/seed.sql` where the environment requires the committed bootstrap data.
4. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID` and `CATALOG_PERSISTENCE=supabase` server-side only.
5. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `WINKELNU_OPERATOR_EMAILS` and `WINKELNU_OPERATOR_ROLES` for the internal human operator boundary.
6. Run `npm run verify:supabase`.
7. Run `npm run verify:production-readiness`; verify the protected-table and operations-security contract, including operator-table RLS/policies/grants, recovery-RPC execution boundaries and the append-only audit trigger.
8. Run `npm run check:db-contract`; CI statically verifies the committed schema and critical security contracts.
9. Generate live types with `npm run types:supabase` when schema changes require regeneration and keep them aligned with the deployed project.
10. Register one verified merchant/integration/feed source.
11. Verify a new active feed without an orchestration row is returned by `list_due_feed_imports()`.
12. Run a non-destructive preview import and inspect rejects/match reviews.
13. Run one production-shaped import manually through the authenticated operations trigger.
14. Verify correlation ID, import run, offers and orchestration state.
15. Verify `catalog_ranked_products` returns expected ranking/freshness semantics.
16. Verify `/uit/<offer-id>` redirect and click attribution.
17. Verify no browser/anon/authenticated client can directly read protected public-schema operator tables.
18. Verify an explicit Supabase Auth operator user can login/logout and resolves to the intended role.
19. Verify `operator_audit_events` is append-only and service-role-only.
20. Verify retry, pause and resume through `/intern/operations` in preview.
21. Submit one identical recovery request key twice and confirm `operator_action_requests` prevents the second mutation.
22. Verify a `read_only` operator cannot claim an idempotency request key for a denied recovery action.
23. Force a safe preview recovery failure and confirm the browser receives only the generic operator-facing error, never raw Supabase/RPC/SQL details.
24. Confirm `operator_action_requests` records are retained for at least 90 days; no automatic cleanup is enabled without separate review.
25. Verify the UI shows pending state, pause confirmation and success/duplicate/error feedback.

## Public storefront gate
Before the public domain is treated as launch-ready, verify all of the following:
1. Homepage, search, category, product, unavailable-offer, 404, loading and recoverable-error surfaces use the current Winkelnu design system.
2. `/zoeken` remains `noindex,follow`; filtered/search URLs must not become an indexable crawl trap.
3. `/intern/`, `/api/` and `/uit/` are excluded from crawler discovery through `robots.txt`; internal pages additionally emit `noindex,nofollow` metadata.
4. Sitemap contains only canonical public discovery URLs and never internal, API, redirect or search/filter routes.
5. Product and category canonical URLs are correct under the production `NEXT_PUBLIC_SITE_URL`.
6. Open Graph, favicon and Apple icon render correctly on the production hostname.
7. Affiliate CTAs remain visibly distinguishable and outbound links preserve sponsored semantics.
8. Price copy distinguishes known total price from product-only price when shipping is unknown.
9. Winkelnu consistently states that the merchant is the seller and controls final price, payment, delivery, returns and warranty.
10. Public legal/compliance pages are complete, reviewed and linked from the footer before launch. At minimum: privacy, cookies, affiliate disclosure/comparison methodology and disclaimer/company-contact information as applicable.
11. Any analytics, advertising or non-essential cookies are consent-gated where required; do not deploy tracking merely because the UI has a cookie notice.
12. Perform keyboard, focus-visible, mobile viewport and screen-reader spot checks on the primary discovery and comparison journeys.
13. Verify real feed imagery, missing-image fallbacks, unavailable offers and stale-data behavior using production-shaped data.
14. Run a final production build and exact-HEAD CI check before public promotion.

## Production promotion gate
1. Confirm the production Supabase project and target deployment environment.
2. Apply exactly the committed migrations `0001`–`0017` in order.
3. Apply `supabase/seed.sql` only when the documented production bootstrap requires it.
4. Configure production server secrets; never expose service-role or partner secrets with `NEXT_PUBLIC_`.
5. Run `npm run verify:supabase`.
6. Run `npm run verify:production-readiness` and `npm run check:db-contract`.
7. Confirm the production readiness RPCs report the expected protected-table and security contract.
8. Confirm operator tables have no unintended public/anon/authenticated grants or policies and recovery execution remains service-role-only.
9. Confirm denied operator actions do not create idempotency claims and browser-facing recovery errors are sanitized.
10. Confirm the 90-day minimum idempotency retention policy is present and no unreviewed delete automation exists.
11. Add real partner credentials only as server environment variables referenced by registry `secret_ref` values.
12. Activate partners one at a time after preview validation.
13. Enable scheduler only after one manual production import completes successfully.
14. Keep storefront independent from worker failures; failed imports must not take the site offline.
15. Confirm stale offers are excluded after 72 hours and freshness metadata behaves as expected.
16. Confirm scheduler secret and machine operations endpoints are inaccessible without Bearer authorization.
17. Confirm human operations requires Supabase Auth plus allowlist/role authorization and never exposes service-role credentials.
18. Confirm feed recovery writes produce both audit events and an idempotency request record.
19. Record the first production import correlation ID as the go-live audit reference.
20. Complete the Public storefront gate above before pointing the public domain at this deployment.

## Rollback / stop conditions
Do not enable or continue recurring imports when any of these is true:
- committed or live database readiness does not report the expected RLS-protected tables;
- an operator table has a public/anon/authenticated grant or an unexpected RLS policy;
- anon/authenticated can execute an operator recovery RPC;
- the service role is missing required operator-table or recovery privileges;
- the audit append-only trigger is missing;
- a denied operator action can claim an idempotency request key;
- raw internal recovery errors can reach the browser;
- the idempotency retention policy is missing or automatic deletion is enabled without separate review;
- migrations differ between preview and production;
- generated database types do not match the deployed schema;
- ranking or due-feed RPCs fail or produce semantically wrong results;
- service-role connectivity fails;
- a feed cannot complete a clean preview import;
- click redirects or affiliate destinations are incorrect;
- scheduler authentication is not verified;
- human operator auth/role checks can be bypassed;
- audit or idempotency persistence fails for operator mutations.

Do not publicly promote the storefront when any of these is true:
- required public legal/compliance information is incomplete or still contains placeholders;
- search/filter pages become indexable crawl traps;
- canonical or sitemap URLs point at the wrong hostname;
- affiliate or merchant-of-record disclosures are misleading or absent;
- known and unknown shipping costs are presented as if they had the same certainty;
- primary public journeys fail keyboard/mobile/accessibility checks;
- exact-HEAD CI or the production build is failing.

Rollback for import operations is operational: pause/disable the affected feed integration and scheduler. Do not delete historical import, click, operator audit or idempotency records to conceal a failure.
