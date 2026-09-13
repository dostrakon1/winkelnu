# Lootje & Lijstje — L7 Production Readiness

Status: **implementation baseline for the final MVP release phase**

Date: 2026-09-13

Umbrella issue: #98

## 1. Purpose

L7 does not add another major consumer feature. It turns the L1–L6 journey into a production-ready, deliberately releasable module.

The completed journey is:

`lijstje / groep -> uitnodigen -> wensen -> uitsluitingen -> trekking -> eigen onthulling -> cadeau zoeken -> privé geregeld-status`

The module remains behind the release gate until the production environment is explicitly activated and accepted.

## 2. Final privacy boundary

- no consumer account, password, mandatory email or phone number;
- raw recovery tokens are never persisted;
- no public/anon/authenticated Data API access to gift tables or gifting RPCs;
- server-side `service_role` remains the persistence boundary;
- private/share/invite/reveal/manage routes remain `noindex`;
- only `/lootje-lijstje` is eligible for sitemap/indexing;
- the complete `/lootje-lijstje` route family remains excluded from public Vercel Web Analytics;
- organizer still has no endpoint that exposes the complete giver -> recipient mapping;
- reservation state is queried only for the current giver and is not included in recipient-facing DTOs.

## 3. Final retention contract

### Standalone wish list

A standalone list expires at most **180 days after its last meaningful edit**. Existing L1/L2 mutations extend `gift_lists.expires_at` to this boundary.

### Group with an event date

A dated group expires **120 days after `event_date`**. Database trigger `gift_group_expiry_normalizer` makes the database authoritative for this rule.

All participant lists inherit the group's expiry.

### Group without an event date

An undated group expires **180 days after meaningful group activity**. Activity that can refresh the expiry includes:

- participant changes;
- exclusion changes;
- draw/redraw persistence;
- recipient-list item changes;
- private reservation changes.

All participant lists are kept in sync with the group expiry.

### Automatic cleanup

`cleanup_expired_gifting_data()` removes:

- expired groups;
- participant lists belonging to those groups;
- expired standalone lists;
- obsolete abuse-limit buckets.

PostgreSQL `pg_cron` runs the cleanup every day at **03:17 UTC** under job name:

`winkelnu-gifting-retention`

This is intentionally database-local. Lootje & Lijstje does **not** need a Vercel Cron invocation for retention cleanup.

## 4. Self-service deletion

Users do not have to wait for retention expiry.

### Standalone list

An owner with the current list-management capability can permanently remove the list and all list items.

The UI requires the exact confirmation text:

`VERWIJDER LIJSTJE`

### Group

An organizer with the current organizer capability can permanently remove the complete group. `delete_gift_group_with_lists()` deletes the group and then its captured participant-list records.

Cascade deletion removes group-linked:

- participants;
- exclusions;
- assignments;
- reservations.

The UI requires the exact confirmation text:

`VERWIJDER GROEP`

## 5. Abuse protection

High-write unauthenticated entry points are rate limited:

| Action | Limit | Window |
| --- | ---: | ---: |
| Create standalone list | 12 | 1 hour |
| Create group | 8 | 1 hour |
| Join a group | 60 | 1 hour |

The application derives a rate-limit bucket with HMAC-SHA256 using `WINKELNU_GIFT_SESSION_SECRET` and the request network address.

Only the 64-character keyed hash is stored. The raw address is not stored in `gifting_rate_limit_buckets` or any other gifting table.

Obsolete buckets are deleted after roughly two days by the daily cleanup.

Rate limiting is abuse mitigation, not identity, profiling or analytics.

## 6. Release gate

Production release is fail-closed.

`isGiftingEnabled()` returns true only when both conditions hold:

1. `WINKELNU_GIFTING_ENABLED=true`
2. `WINKELNU_GIFT_SESSION_SECRET` contains at least 32 bytes of server-only entropy

The secret is also used to sign the no-login access cookie and derive privacy-preserving abuse-limit bucket keys. It must therefore be:

- dedicated to gifting;
- high entropy;
- server-only;
- never committed;
- not reused from Supabase, catalog imports or another application secret.

Before activation run:

`npm run verify:gifting-release`

The verifier also requires the production Supabase server boundary and `NEXT_PUBLIC_SITE_URL=https://winkelnu.nl`.

## 7. Cookie contract

Cookie: `wn_gift_access`

- HttpOnly;
- Secure in production;
- SameSite=Lax;
- scoped to `/lootje-lijstje`;
- maximum cookie age 180 days;
- signed with `WINKELNU_GIFT_SESSION_SECRET`;
- contains only grant kind/entity id/expiry;
- contains no name, wish text, recipient identity, group title or product link.

Underlying grants can become unusable earlier because the referenced entity expires or is deleted.

## 8. Production activation sequence

Do not enable the feature before the L7 PR is merged and its production deployment is READY.

1. Merge L7 only after GitHub Quality is fully green.
2. Confirm migration `0029_gifting_retention_rate_limits` exists in `winkelnu-production`.
3. Confirm the `winkelnu-gifting-retention` pg_cron job exists and is active.
4. Confirm Supabase security/performance advisors have no new L7-critical finding.
5. Configure a dedicated 32+ byte `WINKELNU_GIFT_SESSION_SECRET` in the Vercel production environment.
6. Set `WINKELNU_GIFTING_ENABLED=true` in the Vercel production environment.
7. Trigger/await a fresh production deployment so server functions receive the new environment.
8. Run `npm run verify:gifting-release` in an environment containing the exact production variables.
9. Perform live acceptance below.
10. Keep the kill switch available: setting `WINKELNU_GIFTING_ENABLED=false` and redeploying hides the complete consumer route family again.

## 9. Live acceptance checklist

### Public / SEO

- `/lootje-lijstje` -> 200 and usable landing page;
- sitemap contains `/lootje-lijstje` only after the gate is active;
- create/share/invite/manage/participant/reveal routes have noindex;
- no capability-bearing route appears in sitemap or metadata;
- `/lootje-lijstje` remains blocked from public Web Analytics.

### Standalone list

- create a list;
- add a text wish;
- add an external HTTPS link;
- add a Winkelnu product;
- share/read-only page works;
- recovery link restores owner access in another browser context;
- wrong browser does not receive edit access from share code alone;
- exact delete confirmation removes the list and its wishes.

### Group

- create a group;
- second participant joins through invitation link;
- duplicate normalized name is rejected;
- participant wish lists remain separate;
- organizer can configure exclusion pair before draw;
- draw produces one valid mapping per participant;
- participant can reveal only own recipient;
- organizer cannot inspect the full mapping;
- giver can mark recipient item as `geregeld`;
- recipient cannot see that reservation state;
- redraw clears old reservation state;
- exact delete confirmation removes group and linked participant lists.

### Retention / abuse

- dated test group receives event date + 120-day expiry;
- undated meaningful activity refreshes to about 180 days;
- standalone edit refreshes list expiry to about 180 days;
- cleanup removes expired test records;
- rate limit RPC denies an over-limit bucket;
- database contains only hashed bucket keys;
- cleanup cron remains scheduled.

### Mobile / accessibility

At minimum validate narrow mobile and desktop widths for:

- landing;
- list create/edit/share;
- group create/join/manage;
- participant page;
- reveal page;
- reservation controls;
- recovery-link controls;
- destructive confirmation panels.

Check keyboard focus, readable contrast, wrapping of long names/titles and 44px-class touch targets.

## 10. Failure and edge states

Production acceptance must preserve explicit safe outcomes for:

- invalid/expired share code;
- invalid/expired recovery token;
- deleted group/list;
- group already drawn;
- group full;
- duplicate participant name;
- impossible exclusions;
- stale draw/redraw state;
- missing catalogue product;
- empty recipient list;
- incorrect deletion confirmation;
- rate-limit exhaustion;
- feature flag enabled with missing/short session secret.

None of these states may reveal whether a guessed recovery token belongs to a named person.

## 11. Kill switch and rollback

The primary operational rollback is application-level:

`WINKELNU_GIFTING_ENABLED=false`

After redeployment the entire `/lootje-lijstje` app route family returns the existing hidden/not-found behavior and the landing route leaves the sitemap.

The database schema and retention cleanup may remain installed while the consumer feature is dark. Do not roll back migrations merely to hide the feature.

## 12. L7 completion definition

L7 is complete when:

- migration and contract checks are green;
- rate limiting is active;
- automatic retention cleanup is active;
- self-service deletion works;
- legal wording matches actual behavior;
- full repository Quality CI is green;
- L7 is merged and production deployment is READY;
- required production environment values are configured;
- feature is deliberately enabled;
- live acceptance passes without critical errors.

Until those final release steps are explicitly performed, the implementation is production-ready but intentionally dark.
