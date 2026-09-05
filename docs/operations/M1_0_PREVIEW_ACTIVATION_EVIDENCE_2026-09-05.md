# M1.0 Preview Activation Evidence — 2026-09-05

Status: **current-main preview revalidation accepted for continued preview testing on `61a30ceb16e5dd06e35cf7f27d08755219edc379`; production promotion is not approved by this record.**

This record contains only non-secret evidence. No Supabase keys, passwords, private feed URLs or partner credentials belong here.

## Truth boundary

The first live database, storefront and operator acceptance work in this session was executed on local commit `90af75ced06f4420e6e36675763309d756c65155`, based on the then-current remote baseline `6a4fec4`. Before that local commit could be pushed, `origin/main` had advanced by 129 commits. The local housekeeping change was later rebased and merged independently.

The later current-main closeout was performed after repository reconciliation and two runtime-rendering fixes. The current accepted preview code SHA is:

- `61a30ceb16e5dd06e35cf7f27d08755219edc379` — `fix: render Supabase-backed homepage at runtime`

Therefore this document distinguishes:
- historical live evidence from the first preview session;
- current-main automated deployment/CI evidence;
- fresh current-main live environment and human operator revalidation.

## Activation identity

- Session date: `2026-09-05`
- Preview Supabase project ref: `pbclprefyqpqtlrceund`
- Historical live session commit: `90af75ced06f4420e6e36675763309d756c65155`
- Historical published session base: `6a4fec4`
- Current accepted preview code SHA: `61a30ceb16e5dd06e35cf7f27d08755219edc379`
- Human preview operator: `info@akflow.nl`
- Resolved role: `owner`
- Persistence mode during live verification: `supabase`

## 1. Repository and schema gates

Verified during the live session and again through current-main CI:

- `npm run check:migration-manifest`
  - 17 migrations in exact order
  - `0001_catalog_foundation.sql` through `0017_external_key_unique_constraints.sql`
- `npm run check:db-contract`
  - 15 RLS-protected tables
  - 46 critical columns
  - 12 functions
  - 13 explicit Data API table contracts
  - 5 external-key conflict targets
  - 11 security contracts
- current-main GitHub Quality run `602`: `success`
- current-main test suite: 39 files / 117 tests passed
- current-main production build: `success`
- current-main Supabase Preview check: `success`
- current-main Vercel deployment status: `success`

The sitemap and homepage are runtime-rendered where live Supabase catalog data is involved, so deployment builds no longer depend on live database/JWT availability during prerendering.

## 2. Environment preflight — current main

Fresh revalidation was run from a clean local checkout with:

- HEAD: `61a30ce`
- branch status: `main...origin/main`
- no working-tree changes reported

`npm run verify:activation-env` returned:

```json
{
  "ok": true,
  "projectId": "pbclprefyqpqtlrceund",
  "persistence": "supabase",
  "operatorCount": 1,
  "roleCount": 1,
  "serverUrlMatchesPublicUrl": true,
  "serviceRoleSeparatedFromPublishableKey": true
}
```

No secret values were printed or stored in this record.

## 3. Migration state — live preview

The live preview migration history was repaired and verified so local and remote migration history matched exactly through `0017`.

Applied migration set:
- `0001` through `0017`, exactly once in recorded migration history.

Migration `0017_external_key_unique_constraints.sql` required removal of superseded unique indexes before its migration-history state could be finalized. After that correction, `supabase migration list` showed local/remote alignment through `0017`.

The current repository migration manifest remains exactly aligned with that live state.

## 4. Live connection and production-readiness verification — current main

Fresh `npm run verify:supabase` result:
- connection verified;
- 12 required tables readable.

Fresh `npm run verify:production-readiness` returned `ok: true` with:
- RLS-enabled tables: `15`
- operator RLS tables: `2`
- operator tables without policies: `0`
- untrusted operator table grants: `0`
- service-role table contract: `true`
- recovery functions available to service role: `true`
- recovery functions denied to anon: `true`
- recovery functions denied to authenticated: `true`
- audit append-only trigger: `true`
- published products: `3`
- active offers: `3`
- active merchants: `1`
- active feed sources: `1`
- latest successful import: `2026-09-03T22:51:03.097+00:00`

This proves that current-main still connects to the intended preview project and that the security/readiness contract remains intact after repository reconciliation.

## 5. Project-derived database types

During the first live session, `npm run types:supabase` completed against the linked preview project.

Result:
- no diff was produced in `src/infrastructure/supabase/database.types.ts`;
- repository typecheck remained green.

No migration changed after that schema-alignment proof; current-main typecheck is also green in Quality run `602`.

## 6. Catalog, import and orchestration evidence

Live preview state reported:
- 3 published products;
- 3 active offers;
- 1 active merchant;
- 1 active feed source.

The preview fixture merchant is `Preview Fixture Shop` and intentionally uses synthetic/non-production destination data.

The current operator dashboard exposed the preserved import evidence for the preview feed:
- import completed at local dashboard time `4-9-2026, 00:51:03`;
- status shown as `Import voltooid met fouten` because one row was rejected;
- records seen: `4`;
- accepted: `3`;
- rejected: `1`;
- deactivated: `0`;
- review-required: `0`;
- correlation ID: `preview-fixture:f43aeae-24ca-480c-824b-735c7d76bb00`;
- import quality summary: `runs 1`, `rejects 1`, `reviews pending 0`, `approved 0`, `rejected 0`.

The same current dashboard showed:
- feed active at snapshot `5-9-2026, 22:22:56`;
- health: `delayed`;
- failures: `0`;
- a next import scheduled after the successful resume action.

The one-time `list_due_feed_imports()` bootstrap branch for a feed with no orchestration row was not independently re-executed as a separate destructive setup exercise during closeout. The committed RPC explicitly includes active feeds where `fio.id is null`, is service-role-only, and current CI/database contracts remain green. The live preview feed has progressed through import execution and persisted orchestration state, so this limitation is recorded rather than hidden.

## 7. Storefront and affiliate attribution acceptance

Historical live Supabase-backed storefront verification established:
- homepage HTTP `200` with preview catalog data;
- product page `slimme-stekker-energy-mini-fx-1002` HTTP `200`;
- landed total `€25.45` (`€21.50` + `€3.95` shipping);
- merchant `Preview Fixture Shop`;
- storefront offer identity `offer:merchant:preview-fixture-shop:FX-1002`;
- `/uit/<offer-id>` HTTP `302` to `https://tracking.example.invalid/click/fx-1002`;
- the destination is explicitly synthetic preview fixture data, not a real partner URL.

A fresh current-checkout smoke after synchronizing to `61a30ce` again returned:
- homepage HTTP `200` and preview product visible;
- product page HTTP `200`, product title visible and merchant visible;
- affiliate redirect HTTP `302` to the same synthetic tracking destination.

Runtime provenance note: an attempted second dev-server start exited because port `3100` was already occupied. The responses came from the existing dev process serving the same clean current working tree. The exact replacement process PID was not separately re-pinned. This is recorded explicitly; the current-main Vercel deployment and Quality build were independently green.

Persisted click-attribution evidence from the first live session:
- click event ID: `click:1001e1ed-bd97-4556-a76d-ae3c5280028c`
- source path: `/product/slimme-stekker-energy-mini-fx-1002`
- occurred at: `2026-09-05T19:12:50.777+00:00`
- click storage remained privacy-minimal and did not persist raw IP/user-agent fingerprint data.

Offer freshness and cheapest-landed-offer semantics are regression-covered:
- `tests/catalog/offer-freshness.test.ts` verifies fresh/stale/expired classification and suppresses expired offers;
- `tests/catalog/catalog-service.test.ts` verifies ranking by landed total including shipping and selection of the cheapest landed offer.

These tests are part of the 117-test current-main suite and are green.

## 8. Human operator acceptance — current main

Fresh browser revalidation on `127.0.0.1:3100` confirmed:
- opening the protected operations route without an active session lands on `/intern/login`;
- the operator login page renders correctly;
- login succeeds for `info@akflow.nl`;
- the operations dashboard loads successfully;
- resolved role displayed in the dashboard: `Owner`;
- dashboard snapshot showed `1` integration, `1` feed and `2` incidents;
- logout succeeds and returns the browser to `/intern/login`.

The current dashboard also displayed the existing successful recovery/audit history:
- `Hervat feed` — succeeded;
- `Pauzeer feed` — succeeded;
- `Retry feed` — succeeded.

Historical mutation evidence remains preserved:
- pause attempted/succeeded correlation: `operator:3785c499-0bbd-49fb-a6d0-5f80fff75195`
- pause succeeded at: `2026-09-05T19:19:19.487+00:00`
- resume attempted/succeeded correlation: `operator:37ef6b20-16ba-4560-a2f7-e976fde99430`
- resume succeeded at: `2026-09-05T19:23:28.349+00:00`
- actor: `info@akflow.nl`
- actor role: `owner`
- target: `merchant:preview-fixture-shop:preview-fixture-products`

Idempotency evidence:
- pause request status: `succeeded`
- resume request status: `succeeded`
- a safe duplicate ledger probe was rejected with PostgreSQL code `23505`;
- `duplicate_rejected: true`;
- cleanup confirmed `leftover_probe_rows: 0`.

No additional pause/resume mutation was repeated during current-main closeout because the mutation path had already been accepted live and current-main recovery/idempotency/error-boundary tests are green. The closeout human smoke intentionally verified the session, authorization, dashboard read path and logout boundary without creating unnecessary new operational mutations.

Authorization/error-boundary regression evidence:
- focused `feed-recovery` + `operator-facing-error` tests remain part of the green suite;
- `read_only` denial occurs before idempotency claim/mutation;
- raw Supabase/permission/table details are mapped to the generic browser-facing recovery message.

## 9. Persistence state

The live preview environment is already:

```text
CATALOG_PERSISTENCE=supabase
```

Fresh current-main preflight reconfirmed `persistence: "supabase"`.

The runbook's originally planned memory-to-Supabase switch was not replayed during this session because the preview had already been switched. Post-switch runtime behavior has been exercised directly through:
- Supabase-backed storefront reads;
- affiliate redirect/click persistence;
- operator read/recovery/audit/idempotency behavior;
- fresh current-main environment and readiness verification.

## 10. Repository reconciliation and deployment closeout

The original remote divergence was resolved without force-pushing.

Reconciliation sequence completed:
- stale local housekeeping work was rebased safely;
- sitemap catalog reads were moved to runtime rendering;
- generated Next/Supabase housekeeping was merged;
- M1.0 historical evidence and migration documentation were aligned through `0017`;
- homepage catalog reads were moved to runtime rendering.

Current accepted preview code SHA:
- `61a30ceb16e5dd06e35cf7f27d08755219edc379`

Automated closeout state:
- GitHub Quality run `602`: `success`;
- Supabase Preview check: `success`;
- Vercel deployment status for `61a30ce`: `success`.

Fresh live closeout state:
- activation environment: `ok: true`;
- Supabase connection: `OK`;
- production-readiness: `ok: true`;
- operator login/dashboard/logout: verified;
- current checkout storefront/product/redirect smoke: verified with the runtime-process provenance note recorded in Section 7.

## Final decision

**M1.0 preview activation is accepted for continued preview testing on current-main code SHA `61a30ceb16e5dd06e35cf7f27d08755219edc379`.**

Verified or revalidated across the combined historical and current-main evidence:
- migrations through `0017`;
- environment/project identity;
- live Supabase connection;
- RLS/grants/recovery/audit security boundaries;
- project-derived database type alignment;
- bounded preview import with correlation and record counts;
- persisted orchestration/feed state;
- Supabase-backed storefront read path;
- affiliate redirect and persisted click attribution;
- operator login/logout and owner role resolution;
- pause/resume and retry evidence;
- audit and idempotency evidence;
- duplicate suppression;
- read-only pre-claim denial and generic error mapping;
- current-main GitHub Quality, Supabase Preview and Vercel deployment success.

Documented limitations that remain visible:
1. the exact one-time no-orchestration-row branch of `list_due_feed_imports()` was not separately replayed during closeout;
2. the local storefront re-smoke reused an already-running dev process on port `3100`, so a newly spawned PID was not separately pinned, although the clean current checkout, CI build and Vercel deployment were independently verified.

These limitations do not authorize production promotion and should not be erased from the record.

Production promotion remains a separate future gate requiring, at minimum:
- the production-specific environment/project boundary;
- real approved affiliate partner credentials and destinations;
- production release-promotion verification;
- domain cutover verification when Winkelnu.nl is actually promoted;
- a separate production go-live acceptance record.

**Production promotion: NOT APPROVED by M1.0.**
