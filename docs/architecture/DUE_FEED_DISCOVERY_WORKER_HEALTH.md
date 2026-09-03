# Due Feed Discovery, Batch Worker & Health

## Purpose
M0.21 turns import orchestration into an executable worker boundary without coupling imports to storefront traffic.

## Flow
`due discovery → batch candidate → per-feed lease → execute import → success/failure scheduling → health classification`

Discovery is advisory only. A source returned by discovery must still acquire the M0.20 atomic lease before any work starts. This preserves correctness when multiple workers discover the same feed concurrently.

## Batch policy
- default batch size: 10;
- hard application cap: 50;
- sources execute independently;
- one failure does not abort unrelated feeds in the same batch;
- result reports discovered/completed/failed/skipped counts.

## Due discovery
Supabase discovery reads active merchant/feed sources whose orchestration state is due (`next_run_at` null or <= now). A currently valid lease is filtered out, but the atomic lease remains the final concurrency authority.

## Health
Baseline operational health is derived from orchestration state:
- `healthy`: no failures and not materially overdue;
- `delayed`: no failure, but next run is more than 30 minutes overdue;
- `failing`: one or two consecutive failures;
- `attention_required`: three or more consecutive failures.

Health is operational metadata. It must never take the storefront down. Existing valid catalog data remains readable while a source is delayed or failing.

## Runtime boundary
This worker can later be invoked by Vercel Cron, a dedicated Node worker, CI/manual operations, or a queue consumer. Those mechanisms are triggers, not business logic.

## Next work
Build the concrete production composition that resolves the merchant integration and provider adapter, calls `importFeed`, and exposes an authenticated operational endpoint/worker command with structured health reporting.
