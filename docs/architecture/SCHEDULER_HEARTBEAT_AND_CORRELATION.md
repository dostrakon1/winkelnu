# Scheduler Deployment, Lease Heartbeat & Import Correlation

## Goal
Recurring catalog imports need a deployment-independent trigger, safe execution for long feeds and one identifier that ties a scheduler request to every import run it creates.

## Trigger contract
The server-only endpoint is `/api/ops/catalog-import`.

Supported methods:
- `GET` for scheduler platforms such as Vercel Cron;
- `POST` for trusted external/manual schedulers.

Both require `Authorization: Bearer <secret>`. The route uses `CRON_SECRET` when configured, otherwise `WINKELNU_IMPORT_TRIGGER_SECRET`. Requests and responses are `no-store` operational traffic.

The request may suggest `?limit=N`, but the worker still enforces the M0.21 hard cap of 50 due feeds per batch. Requests cannot select partner credentials, feed URLs, adapter implementations or arbitrary merchants.

## Vercel deployment policy
Do not commit a high-frequency `vercel.json` cron until the selected Vercel plan and desired freshness cadence are explicit. The endpoint is scheduler-compatible now; cadence is deployment policy, not domain logic.

This avoids coupling catalog correctness to one scheduler vendor and avoids accidentally introducing a cron schedule that is incompatible with the active deployment plan.

## Correlation
Every authorized trigger generates a correlation identifier:

`catalog-import:<uuid>`

The same value is:
- returned in the JSON response;
- returned in `X-Winkelnu-Correlation-Id`;
- propagated through the production worker/composition layer;
- stored on each production `import_runs.correlation_id` row created by that batch.

The existing `importRun.id` remains the identity of one feed import. `correlation_id` groups multiple feed runs belonging to the same scheduler invocation.

## Heartbeat
The M0.20 lease remains the concurrency authority. M0.23 adds lease renewal for legitimately long imports.

`importFeed` calls its progress hook immediately after each provider page is successfully fetched. The orchestration layer turns that progress signal into a lease heartbeat only when the configured heartbeat interval has elapsed.

Defaults:
- lease duration: 15 minutes;
- heartbeat interval: max once every 5 minutes (or one third of a shorter custom lease).

This means rapid pagination does not create an RPC per page, while a slow multi-page feed can keep ownership past the original lease expiry.

## Heartbeat safety
The database renewal function succeeds only when:
- merchant/source match the current orchestration row;
- the supplied lease token is still the owner token;
- the current lease has not already expired.

A stale worker therefore cannot revive an expired lease after another worker becomes eligible.

The heartbeat RPC is `SECURITY DEFINER`, has `PUBLIC` execution revoked and is granted only to `service_role`.

## Failure semantics
If heartbeat renewal fails because ownership was lost/expired, execution fails and enters the existing orchestration failure path. The worker must not continue mutating the catalog under an invalid lease.

Storefront availability remains independent of scheduler/worker health.
