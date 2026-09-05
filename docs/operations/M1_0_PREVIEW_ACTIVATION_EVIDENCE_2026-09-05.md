# M1.0 Preview Activation Evidence — 2026-09-05

Status: historical live preview session captured; current `main` revalidation remains required before the preview activation can be closed against the latest deployment SHA.

This record contains only non-secret evidence. No Supabase keys, passwords, private feed URLs or partner credentials belong here.

## Truth boundary

The live database, storefront and operator acceptance work in this session was executed on local commit `90af75ced06f4420e6e36675763309d756c65155`, based on the then-current remote baseline `6a4fec4`. Before that local commit could be pushed, `origin/main` had advanced by 129 commits. The local housekeeping change was later rebased and ultimately merged independently into current `main`.

Therefore:
- the live evidence below is valid evidence for the real preview Supabase project and the tested runtime path;
- it must not be presented as proof that the later 129-commit application state has received the same live human acceptance;
- current `main` must receive a fresh live smoke/revalidation before the canonical preview activation is marked closed.

## Activation identity

- Session date: `2026-09-05`
- Preview Supabase project ref: `pbclprefyqpqtlrceund`
- Live session commit: `90af75ced06f4420e6e36675763309d756c65155` (local session commit; not published after remote divergence)
- Session base corresponding to published repository history: `6a4fec4`
- Current main at evidence-record preparation: `02e00f0878d66401030cec7d0742940e9ecb81f3`
- Human preview operator: `info@akflow.nl`
- Resolved role during acceptance: `owner`

## 1. Repository and schema gates — live session

Verified green during the live session:
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
- full repository check had previously completed green on the session baseline, including lint, typecheck, 39 test files / 117 tests and the Next.js production build.

## 2. Environment preflight — live session

`npm run verify:activation-env` returned `ok: true` with these safe facts:
- project ID: `pbclprefyqpqtlrceund`
- persistence: `supabase`
- operator count: `1`
- role count: `1`
- server URL matched public URL: `true`
- service-role key was separated from the publishable key: `true`

No secret values were printed or stored in this record.

## 3. Migration state — live preview

The live preview migration history was repaired/verified so local and remote migration history matched exactly through `0017`.

Applied migration set:
- `0001` through `0017`, exactly once in recorded migration history.

Migration `0017_external_key_unique_constraints.sql` required removal of superseded unique indexes before its migration-history state could be finalized. After that correction, `supabase migration list` showed local/remote alignment through `0017`.

## 4. Live connection and production-readiness verification

`npm run verify:supabase`:
- connection verified;
- 12 required tables readable.

`npm run verify:production-readiness` returned `ok: true` with:
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

## 5. Project-derived database types

`npm run types:supabase` completed against the linked preview project.

Result:
- no diff was produced in `src/infrastructure/supabase/database.types.ts`;
- repository typecheck remained green.

This means the committed generated database types already matched the migrated preview schema at the time of the session.

## 6. Catalog/bootstrap state observed

Live readiness reported:
- 3 published products;
- 3 active offers;
- 1 active merchant;
- 1 active feed source.

The preview fixture merchant was `Preview Fixture Shop` and intentionally used synthetic/non-production destination data.

A dedicated Step-7 import correlation ID and complete seen/accepted/rejected import count set were not independently captured in the final session notes. Those fields remain a gap for a strict current-main closeout.

## 7. Storefront and affiliate attribution acceptance

Live Supabase-backed storefront flow was verified:
- homepage returned HTTP `200` and showed preview catalog data;
- product page for `slimme-stekker-energy-mini-fx-1002` returned HTTP `200`;
- displayed landed total was `€25.45` (`€21.50` + `€3.95` shipping);
- storefront offer identity used the external key `offer:merchant:preview-fixture-shop:FX-1002`;
- `/uit/<offer-id>` returned HTTP `302` to `https://tracking.example.invalid`;
- that destination is explicitly synthetic preview fixture data, not a real partner URL.

Persisted click-attribution evidence:
- click event ID: `click:1001e1ed-bd97-4556-a76d-ae3c5280028c`
- source path: `/product/slimme-stekker-energy-mini-fx-1002`
- occurred at: `2026-09-05T19:12:50.777+00:00`
- click storage remained privacy-minimal and did not persist raw IP/user-agent fingerprint data.

Offer freshness and cheapest-landed-offer semantics were proven by automated regression tests, not by a multi-offer live preview fixture:
- `tests/catalog/offer-freshness.test.ts` verifies fresh/stale/expired classification and suppresses expired offers;
- `tests/catalog/catalog-service.test.ts` verifies ranking by landed total including shipping and selection of the cheapest landed offer.

These tests are part of the 117-test suite and were green again on the later current-main Quality workflow.

## 8. Human operator acceptance

Authentication/session boundary:
- unauthenticated `/intern/operations` redirected to `/intern/login`;
- operator login succeeded for `info@akflow.nl`;
- resolved role shown in the UI: `Owner`;
- logout succeeded;
- direct access to `/intern/operations` after logout redirected to `/intern/login` again.

Authorized recovery actions:
- a prior successful `Retry feed` audit action was visible for the same owner;
- live `Pause feed` succeeded;
- live `Resume feed` succeeded;
- pause changed the incident state to `feed_paused` and exposed the resume action;
- resume restored the active feed state and removed the paused incident.

Audit evidence:
- pause attempted/succeeded correlation: `operator:3785c499-0bbd-49fb-a6d0-5f80fff75195`
- pause succeeded at: `2026-09-05T19:19:19.487+00:00`
- resume attempted/succeeded correlation: `operator:37ef6b20-16ba-4560-a2f7-e976fde99430`
- resume succeeded at: `2026-09-05T19:23:28.349+00:00`
- actor: `info@akflow.nl`
- actor role: `owner`
- target: `merchant:preview-fixture-shop:preview-fixture-products`

Idempotency ledger evidence:
- pause request status: `succeeded`
- resume request status: `succeeded`
- a safe duplicate ledger probe was rejected with PostgreSQL code `23505`;
- `duplicate_rejected: true`;
- cleanup confirmed `leftover_probe_rows: 0`.

Authorization/error-boundary regression evidence:
- focused `feed-recovery` + `operator-facing-error` run: 2 files / 5 tests passed;
- `read_only` denial occurs before idempotency claim/mutation;
- raw Supabase/permission/table details are mapped to the generic Dutch browser-facing recovery message.

## 9. Persistence state

The live session environment already had:

```text
CATALOG_PERSISTENCE=supabase
```

As a result, the runbook's intended memory-to-Supabase switch was not executed as a separate linear step during this session. Instead, post-switch behavior itself was exercised directly:
- Supabase-backed homepage/product reads succeeded;
- affiliate redirect/click persistence succeeded;
- operator read/recovery/audit/idempotency behavior succeeded.

This is useful runtime evidence, but the procedural deviation must remain visible in the closeout record.

## 10. Current-main carry-forward checks

After the live session, remote `main` was found to be 129 commits ahead of the session base. The local housekeeping change was not force-pushed.

Repository reconciliation completed safely:
- sitemap was changed to runtime generation so `next build` no longer performs live Supabase catalog reads for `/sitemap.xml`;
- GitHub Quality on that fix passed all gates including 117 tests and production build;
- generated Next/Supabase housekeeping was merged separately;
- current `main`: `02e00f0878d66401030cec7d0742940e9ecb81f3`;
- current-main GitHub Quality run `598`: `success`;
- current-main Supabase Preview check: `success`.

Current-main Vercel deployment did not succeed:
- deployment ID: `dpl_BqZKLRVVoQXo3L5ZYjSv3cT9ZqWb`;
- GitHub Vercel status: `failure`;
- this blocks treating current `main` as the deployed/accepted preview SHA.

## Final decision

Session result: **substantial live M1.0 preview verification completed, but canonical activation closeout remains open for current `main`.**

Verified live in the real preview project:
- migrations through `0017`;
- environment/project identity;
- live Supabase connection;
- security/readiness boundaries;
- project-derived types;
- Supabase-backed storefront read path;
- affiliate redirect and persisted click attribution;
- operator login/logout and owner role resolution;
- pause/resume and prior retry evidence;
- audit and idempotency evidence;
- duplicate suppression;
- read-only pre-claim denial and generic error mapping via focused regressions.

Still required before closing the canonical current-main preview activation:
1. resolve the failed Vercel deployment for current `main`;
2. perform a fresh current-main storefront smoke against the deployed preview;
3. perform a fresh current-main operator login/logout + recovery smoke;
4. rerun/record the live activation/readiness verifiers against the current deployment environment;
5. capture any still-required bounded import/due-feed evidence that was not independently recorded in this session;
6. only then mark the reusable activation template/final handoff as accepted for the current deployment SHA.

This record does not approve production promotion.
