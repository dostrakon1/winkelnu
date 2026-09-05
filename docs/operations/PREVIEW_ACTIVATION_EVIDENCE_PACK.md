# Winkelnu Preview Activation Evidence Pack

Status: template-ready; live preview evidence is not yet available.

> This document is the canonical handoff record for the first real Supabase preview activation. Do not mark an item `verified` unless the evidence was produced against the actual preview project. Never paste secrets, access tokens, private feed URLs or service-role keys into this file.

> Execution evidence from the 2026-09-05 M1.0 preview session is recorded separately in `M1_0_PREVIEW_ACTIVATION_EVIDENCE_2026-09-05.md`; this file remains the reusable blank template enforced by `check:preview-evidence-template`.

## Activation identity
- Repository commit SHA: `PENDING`
- Activation date/time (UTC): `PENDING`
- Preview project ref: `PENDING`
- Preview environment owner/operator: `PENDING`
- Evidence status: `pending`

## 1. Repository gates
- Migration manifest (`npm run check:migration-manifest`): `PENDING`
- Database contract (`npm run check:db-contract`): `PENDING`
- Quality workflow run ID: `PENDING`
- Quality workflow result: `PENDING`

Acceptance: the recorded commit SHA must be the exact commit deployed/tested and its Quality workflow must be green.

## 2. Environment preflight
- `npm run verify:activation-env`: `PENDING`
- `SUPABASE_URL` / `SUPABASE_PROJECT_ID` project-ref match: `PENDING`
- Public URL points to same preview project: `PENDING`
- Service-role / publishable-key separation: `PENDING`
- Operator allowlist and at least one owner: `PENDING`

Acceptance: all checks pass without printing or persisting secret values.

## 3. Migration state
Expected migration set: `0001` through `0017`.

- Applied migration range: `PENDING`
- Migration application method: `PENDING`
- Schema drift detected: `PENDING`
- Seed applied: `PENDING`

Acceptance: all committed migrations are applied exactly once in filename order and the deployed schema matches the repository contract.

## 4. Live connection and security readiness
- `npm run verify:supabase`: `PENDING`
- `npm run verify:production-readiness`: `PENDING`
- RLS-protected tables reported: `PENDING`
- Operations security readiness: `PENDING`
- Anonymous/authenticated operator access denial verified: `PENDING`
- Recovery RPC service-role boundary verified: `PENDING`
- Audit append-only trigger verified: `PENDING`

Acceptance: production-readiness checks pass and all operations security boundaries match the M0.45 contract.

## 5. Project-derived database types
- `npm run types:supabase`: `PENDING`
- Generated type artifact/path: `PENDING`
- Generated from preview project ref: `PENDING`
- Repository typecheck after generation: `PENDING`

Acceptance: types are generated from the actual migrated preview project and the repository still typechecks.

## 6. Catalog/bootstrap evidence
- Required category seed verified: `PENDING`
- Test merchant/integration/feed source registered: `PENDING`
- New feed without orchestration row discovered by `list_due_feed_imports()`: `PENDING`
- Preview import correlation ID: `PENDING`
- Preview import final status: `PENDING`
- Records seen / accepted / rejected: `PENDING`
- Offers written/updated: `PENDING`
- Review-required count: `PENDING`

Acceptance: one bounded, non-destructive preview import completes and produces correlated import/orchestration evidence without exposing raw feed payloads in this pack.

## 7. Storefront and attribution acceptance
- `catalog_ranked_products` returns expected eligible offers: `PENDING`
- Fresh/stale/expired semantics verified: `PENDING`
- Cheapest eligible offer ranking verified: `PENDING`
- `/uit/<offer-id>` redirect verified: `PENDING`
- Affiliate click attribution persisted: `PENDING`

Acceptance: preview catalog reads and affiliate redirect behavior match the repository contracts.

## 8. Human operator acceptance
- Explicit Supabase Auth operator created: `PENDING`
- Public signup remains disabled/not used: `PENDING`
- Login/logout verified: `PENDING`
- Owner/operator/read_only mapping verified: `PENDING`
- `read_only` recovery denial before idempotency claim verified: `PENDING`
- Retry verified: `PENDING`
- Pause confirmation + pause verified: `PENDING`
- Resume verified: `PENDING`
- Duplicate request suppression verified: `PENDING`
- Browser-facing recovery failure sanitization verified: `PENDING`
- Audit trail and idempotency ledger evidence verified: `PENDING`

Acceptance: human operations work through Supabase Auth and role boundaries, with no raw internal error details reaching the browser.

## 9. Persistence switch acceptance
- Pre-switch `CATALOG_PERSISTENCE`: `memory`
- All previous sections accepted: `PENDING`
- Switch approved: `PENDING`
- Preview `CATALOG_PERSISTENCE=supabase` deployed: `PENDING`
- Post-switch storefront smoke test: `PENDING`
- Post-switch operations smoke test: `PENDING`

Acceptance: persistence is switched only after all earlier evidence is verified. Any failure returns preview to `CATALOG_PERSISTENCE=memory` before further debugging.

## 10. Stop / rollback evidence
If activation is stopped, record only non-secret diagnostic references.

- Stop condition encountered: `PENDING`
- Affected phase: `PENDING`
- Rollback action: `PENDING`
- Persistence returned to memory (if switched): `PENDING`
- Scheduler remained disabled: `PENDING`
- Follow-up issue/reference: `PENDING`

## Final handoff decision
- Preview activation result: `pending`
- Approved for continued preview testing: `PENDING`
- Approved for production-promotion planning: `PENDING`
- Reviewer/operator: `PENDING`
- Notes: `PENDING`

Production promotion is never implied by completing this template. It requires a separate production project and repetition of the applicable live gates.
