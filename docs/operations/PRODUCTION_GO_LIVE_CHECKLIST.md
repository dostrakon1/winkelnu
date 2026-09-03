# Winkelnu Production Go-Live Checklist

Status: repository-ready; live Supabase activation still requires real project access.

## Preview gate
1. Create a Supabase preview project.
2. Apply migrations `0001` through `0014` in order.
3. Run `supabase/seed.sql`.
4. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID` and `CATALOG_PERSISTENCE=supabase` server-side only.
5. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `WINKELNU_OPERATOR_EMAILS` and `WINKELNU_OPERATOR_ROLES` for the internal human operator boundary.
6. Run `npm run verify:supabase`.
7. Run `npm run verify:production-readiness`; M0.45 verifies all 15 protected tables plus the operations security contract, including operator-table RLS/policies/grants, recovery-RPC execution boundaries and the append-only audit trigger.
8. Run `npm run check:db-contract`; CI statically verifies the full committed schema and critical operations security revoke/grant contracts.
9. Generate live types with `npm run types:supabase` and wire them into the server client before production promotion.
10. Register one verified merchant/integration/feed source.
11. Verify a new active feed without an orchestration row is returned by `list_due_feed_imports()`.
12. Run a non-destructive preview import and inspect rejects/match reviews.
13. Run one production import manually through the authenticated operations trigger.
14. Verify correlation ID, import run, offers and orchestration state.
15. Verify `catalog_ranked_products` returns expected ranking/freshness semantics.
16. Verify `/uit/<offer-id>` redirect and click attribution.
17. Verify no browser/anon/authenticated client can directly read protected public-schema operator tables.
18. Create an explicit Supabase Auth operator user and verify login/logout plus role resolution.
19. Verify `operator_audit_events` is append-only and service-role-only.
20. Verify retry, pause and resume through `/intern/operations` in preview.
21. Submit one identical recovery request key twice and confirm `operator_action_requests` prevents the second mutation.
22. Verify the UI shows pending state, pause confirmation and success/duplicate/error feedback.

## Production promotion gate
1. Create/confirm the production Supabase project.
2. Apply exactly the same committed migrations `0001`–`0014`.
3. Apply `supabase/seed.sql`.
4. Configure production server secrets; never expose service-role or partner secrets with `NEXT_PUBLIC_`.
5. Run `npm run verify:supabase`.
6. Run `npm run verify:production-readiness` and `npm run check:db-contract`.
7. Confirm `winkelnu_production_readiness()` reports all 15 RLS-protected tables.
8. Confirm `winkelnu_operations_security_readiness()` reports: 2 operator RLS tables, zero operator policies, zero untrusted table grants, the expected service-role table contract, service-role-only recovery execution, anon/authenticated recovery denial and the append-only audit trigger.
9. Add real partner credentials only as server environment variables referenced by registry `secret_ref` values.
10. Activate partners one at a time after preview validation.
11. Enable scheduler only after one manual production import completes successfully.
12. Keep storefront independent from worker failures; failed imports must not take the site offline.
13. Confirm stale offers are excluded after 72 hours and freshness metadata behaves as expected.
14. Confirm scheduler secret and machine operations endpoints are inaccessible without Bearer authorization.
15. Confirm human operations requires Supabase Auth plus allowlist/role authorization and never exposes service-role credentials.
16. Confirm feed recovery writes produce both audit events and an idempotency request record.
17. Record the first production import correlation ID as the go-live audit reference.

## Rollback / stop conditions
Do not enable or continue recurring imports when any of these is true:
- committed or live database readiness does not report all 15 expected RLS-protected tables;
- either operator table has a public/anon/authenticated grant or an unexpected RLS policy;
- anon/authenticated can execute any operator recovery RPC;
- the service role is missing required operator-table or recovery privileges;
- the audit append-only trigger is missing;
- migrations differ between preview and production;
- generated database types do not match the deployed schema;
- ranking or due-feed RPCs fail or produce semantically wrong results;
- service-role connectivity fails;
- a feed cannot complete a clean preview import;
- click redirects or affiliate destinations are incorrect;
- scheduler authentication is not verified;
- human operator auth/role checks can be bypassed;
- audit or idempotency persistence fails for operator mutations.

Rollback for import operations is operational: pause/disable the affected feed integration and scheduler. Do not delete historical import, click, operator audit or idempotency records to conceal a failure.
