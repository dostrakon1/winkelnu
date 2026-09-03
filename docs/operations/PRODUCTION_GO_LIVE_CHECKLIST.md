# Winkelnu Production Go-Live Checklist

Status: repository-ready; live Supabase activation still requires real project access.

## Preview gate
1. Create a Supabase preview project.
2. Apply migrations `0001` through `0009` in order.
3. Run `supabase/seed.sql`.
4. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID` and `CATALOG_PERSISTENCE=supabase` server-side only.
5. Run `npm run verify:supabase`.
6. Run `npm run verify:production-readiness` and require `rlsEnabledTables = 13`.
7. Generate live types with `npm run types:supabase` and wire them into the server client before production promotion.
8. Register one verified merchant/integration/feed source.
9. Run a non-destructive preview import and inspect rejects/match reviews.
10. Run one production import manually through the authenticated operations trigger.
11. Verify correlation ID, import run, offers and orchestration state.
12. Verify `catalog_ranked_products` returns expected ranking/freshness semantics.
13. Verify `/uit/<offer-id>` redirect and click attribution.
14. Verify no browser/anon client can directly read protected public-schema tables.

## Production promotion gate
1. Create/confirm the production Supabase project.
2. Apply exactly the same committed migrations `0001`–`0009`.
3. Apply `supabase/seed.sql`.
4. Configure production server secrets; never expose service-role or partner secrets with `NEXT_PUBLIC_`.
5. Run `npm run verify:supabase`.
6. Run `npm run verify:production-readiness`.
7. Confirm 13 RLS-protected tables and successful ranking RPC execution.
8. Add real partner credentials only as server environment variables referenced by registry `secret_ref` values.
9. Activate partners one at a time after preview validation.
10. Enable scheduler only after one manual production import completes successfully.
11. Keep storefront independent from worker failures; failed imports must not take the site offline.
12. Confirm stale offers are excluded after 72 hours and freshness metadata behaves as expected.
13. Confirm scheduler secret and operations endpoint are inaccessible without Bearer authorization.
14. Record the first production import correlation ID as the go-live audit reference.

## Rollback / stop conditions
Do not enable or continue recurring imports when any of these is true:
- RLS readiness reports fewer than 13 protected tables;
- migrations differ between preview and production;
- generated database types do not match the deployed schema;
- ranking RPC fails or produces semantically wrong best-offer results;
- service-role connectivity fails;
- a feed cannot complete a clean preview import;
- click redirects or affiliate destinations are incorrect;
- scheduler authentication is not verified.

Rollback for import operations is operational: pause/disable the affected feed integration and scheduler. Do not delete historical import/click audit data to conceal a failure.
