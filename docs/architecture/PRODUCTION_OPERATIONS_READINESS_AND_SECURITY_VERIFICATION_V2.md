# Production Operations Readiness & Security Verification v2

M0.45 extends Winkelnu production-readiness from the original catalog boundary to the complete committed operations security boundary.

## Repository contract
The committed schema now contains 15 RLS-protected tables. The two operator tables are `operator_audit_events` and `operator_action_requests`.

`winkelnu_production_readiness()` now counts all 15 protected tables.

`winkelnu_operations_security_readiness()` verifies live database state for:
- RLS enabled on both operator tables;
- zero RLS policies on those server-only operator tables;
- zero table grants for `PUBLIC`, `anon` or `authenticated`;
- exact service-role table privileges: audit select/insert only; idempotency select/insert/update only;
- service-role execute privilege on retry/pause/resume RPCs;
- denied retry/pause/resume execution for `anon` and `authenticated`;
- presence of the append-only audit trigger.

## CI boundary
`npm run check:db-contract` now includes migration `0014`, requires the operations-readiness function and statically checks critical revoke/grant/trigger statements. This catches repository regressions before deployment.

## Live verification
`npm run verify:production-readiness` requires real `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. It calls both readiness RPCs and fails closed when any expected operations-security property is absent.

Repository CI cannot prove live Supabase state. Until migrations `0001`–`0014` are applied to a real preview/production project and the live verification command succeeds, Winkelnu must remain described as repository-ready rather than live-production-verified.

## Non-goals
M0.45 does not activate Supabase, create operator users, configure partner secrets or change recovery behavior. It verifies boundaries; it does not widen them.
