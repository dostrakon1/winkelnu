# Lootje & Lijstje Insights/Admin v1

Status: architecture approved; implementation not started.

## Purpose

Lootje & Lijstje already stores useful operational data in Supabase, but Winkelnu does not yet expose that information in the internal operations dashboard. This architecture adds a privacy-safe admin/insights layer that answers product and operational questions without turning gifting into a user-surveillance system.

The admin must help Winkelnu understand:

- whether Lootje & Lijstje is being used;
- whether groups progress from creation to participation to a completed draw;
- whether standalone wishlists are used and filled;
- which item types and Winkelnu products are most useful in gift lists;
- whether reservations are being used;
- where public flows appear to lose people;
- whether the gifting system is healthy, expiring and cleaning up correctly;
- whether gifting later contributes to commercial outbound clicks.

Email Hub implementation is intentionally deferred until this milestone is designed and implemented.

## Non-goals

V1 is not a CRM for individual gifting users and is not a support console for reading private list content.

The admin must not expose:

- Secret Santa giver → recipient assignments;
- participant names;
- organizer names;
- free-text wish titles or notes in generic insights screens;
- raw external URLs added by users;
- share codes;
- organizer/participant recovery tokens;
- token hashes;
- access-grant cookies/capabilities;
- IP addresses or browser fingerprints;
- a cross-page visitor identifier;
- a reconstructed individual browsing journey.

## Existing source-of-truth data

The gifting domain already stores enough state to build a useful first dashboard before richer funnel events are added.

Current business tables include:

- `gift_groups`
- `gift_group_participants`
- `gift_group_exclusions`
- `gift_group_assignments`
- `gift_lists`
- `gift_list_items`
- `gift_item_reservations`

Useful existing dimensions include:

- group status: `draft`, `drawn`, `closed`;
- list status: `active`, `archived`;
- occasion: `sinterklaas`, `kerst`, `verjaardag`, `anders`;
- optional budget;
- optional event date;
- creation/update/join timestamps;
- draw version;
- item type: `winkelnu_product`, `external_link`, `text`;
- Winkelnu product external key;
- current reservation records;
- expiry timestamps.

The existing `affiliate_click_events.source_path` can later attribute outbound affiliate clicks originating from `/lootje-lijstje...` without adding a person-level identifier.

## Core design: three layers

Do not make the dashboard query private gifting tables directly from the browser.

Use three layers:

```text
Consumer gifting state
        ↓
Server-side insights read model + minimal insight events
        ↓
Internal Lootje & Lijstje dashboard
```

Historical measurement uses a separate aggregate path:

```text
Minimal insight events / current state
        ↓
Daily rollup
        ↓
Long-term anonymous business metrics
```

This is important because consumer gifting data is deliberately deleted after its retention period. Historical business totals must survive without keeping the original personal group/list content.

## Privacy boundary

### No visitor profile

V1 does not introduce a persistent analytics visitor ID.

Public interaction events are counted as events. They are not joined into a personal browsing history.

For example, the system may know:

```text
27 group-create-form views
11 groups created
```

but it does not need to know which anonymous browser generated both events.

### Group-level operational linkage is allowed where required

Server-authoritative lifecycle events may temporarily reference `group_id` or `list_id` so the application can deduplicate events and calculate exact group/list progression while the underlying object exists.

Those foreign keys use `on delete set null` (or equivalent) so the historical event does not block consumer deletion. Long-term rollups contain counts only.

### No draw secrets

The admin may display:

- draw completed: yes/no;
- draw version;
- number of assignments expected/created as a health check;

but it must never expose the giver/recipient pairing.

## Internal navigation

Add a dedicated top-level destination to the existing internal operations navigation:

```text
Partner operations
Search learning
Campagnes
Lootje & Lijstje
```

Proposed route:

`/intern/operations/gifting`

Email remains deferred and should not be added to the live navigation until Email Hub implementation begins.

## Admin information architecture

The Lootje & Lijstje area contains five views.

### 1. Overzicht

Default date filter: last 30 days.

Supported filters:

- 7 days;
- 30 days;
- 90 days;
- custom date range;
- all-time where an aggregate metric exists.

Primary cards:

- groups created;
- active groups now;
- groups drawn;
- draw completion share;
- total participants joined;
- average participants per group;
- standalone lists created;
- gift items added;
- reservations made;
- Winkelnu products added to lists.

Secondary cards:

- average configured group budget;
- percentage of groups with an event date;
- average wishes per list;
- share of items by item type;
- redraw count;
- deletion/expiry count where available.

Trend charts:

- groups created per day;
- participants joined per day;
- draws completed per day;
- standalone lists created per day;
- gift items added per day.

### 2. Funnel

Two funnels are shown separately.

#### Group flow

```text
Lootje & Lijstje landing viewed
→ New-group form viewed
→ Group created
→ 3+ participants reached
→ Draw completed
→ At least one gift item reserved
```

The first two steps are event-count ratios and are not unique-person conversion metrics.

The later group steps can be calculated as exact group cohorts because they are tied to the group lifecycle.

The UI must label this distinction so a page refresh is not misrepresented as a unique visitor.

#### Standalone list flow

```text
New-list form viewed
→ List created
→ First wish added
→ Winkelnu product added (optional)
→ Shared list viewed
```

Again, page/form views are event counts, while list lifecycle progression is object/cohort based.

### 3. Lijstjes & producten

Show aggregate product/list intelligence only.

Useful metrics:

- item type mix (`winkelnu_product`, `external_link`, `text`);
- Winkelnu product additions by product external key;
- most-added Winkelnu products;
- product additions per occasion;
- products that are most often on lists that later reach a draw;
- reservation counts for Winkelnu-product items;
- outbound affiliate clicks whose `source_path` begins with `/lootje-lijstje` once real offers exist.

Do not list users' free-text wishes or external URLs.

A product table may show:

```text
Product | Added to lists | Reservations | Gifting outbound clicks
```

Product titles/images are resolved from the current Winkelnu catalog, not copied from private list text in the admin.

### 4. Gebruik

Aggregate usage breakdowns:

- occasion distribution;
- group size distribution;
- budget buckets;
- groups with/without event date;
- standalone vs group-linked lists;
- first draw vs redraw;
- item type distribution;
- usage by day/week/month.

Recommended budget buckets instead of listing exact per-group budgets:

- no budget;
- < €15;
- €15–€24.99;
- €25–€49.99;
- €50–€99.99;
- €100+.

### 5. Gezondheid

Operational-only health indicators:

- active groups nearing expiry;
- orphaned/inconsistent group/list counts;
- drawn groups whose assignment count does not match participant count;
- groups over structural limits (should be zero);
- cleanup job last known state if observable;
- rate-limit rejections by action (aggregate only);
- recent gifting application failures if a safe error counter is added;
- stale active records past expiry (should be zero after cleanup).

This screen must not expose assignment pairs or token material.

## Redacted current-group table

V1 may include a small operational table for recent groups, but it is deliberately redacted.

Allowed columns:

- short internal reference;
- created date/time;
- occasion;
- status;
- participant count;
- total wish count;
- budget bucket;
- event date present/absent (or date if operationally needed);
- draw version;
- expiry date;
- health status.

Not allowed in the generic table:

- group name;
- organizer display name;
- participant names;
- wish text;
- external wish URLs;
- draw pairings;
- share/recovery secrets.

A future support-only drill-down, if ever needed, requires a separate design and a stricter permission/audit boundary.

## Metrics and definitions

### Groups created

Count of successful `gift_groups` creation events in the selected period.

### Active groups now

Current groups where:

```text
status != closed AND expires_at > now()
```

This is a current-state metric and should not be presented as historical.

### Drawn groups

Distinct groups whose first successful draw occurred in the selected cohort/period.

`draw_version >= 1` can describe current state; the event layer preserves historical timing.

### Draw completion share

For a creation cohort:

```text
groups in cohort that reached first successful draw
÷
groups created in cohort
```

The UI must note that very recent cohorts have had less time to complete and can show an artificially low rate.

### Participants joined

Successful participant additions, including the organizer participant created with a new group only if the dashboard labels this consistently. Recommended v1 convention:

- `participants_total`: includes organizer participant;
- `additional_participants_joined`: excludes organizer participant.

This avoids ambiguity.

### Average group size

Participant count across groups in the selected cohort divided by group count. If historical source objects have expired, use rollup values rather than deleted source rows.

### Standalone lists

Only lists that are not linked to a `gift_group_participants` row.

### Gift items added

Successful new item insertions, split by item type. Edits do not count as new additions.

### Reservations

Count successful transitions from unreserved to reserved. Releasing a reservation is recorded separately and does not decrement the historical reservation-made metric.

## Insight event model

Add an append-only, privacy-minimal table such as `gifting_insight_events`.

Suggested fields:

```text
id uuid primary key
occurred_at timestamptz not null
event_type text not null
source_surface text null
group_id uuid null
list_id uuid null
product_external_key text null
item_type text null
occasion text null
value_int integer null
metadata jsonb null
created_at timestamptz not null
```

Rules:

- `group_id`/`list_id` may only reference internal UUIDs, never public codes;
- references must not prevent deletion (`on delete set null` where FKs are used);
- no participant ID in the generic insight event table;
- no display names;
- no email address;
- no raw URL;
- no share/recovery code;
- no IP/user-agent storage;
- `metadata` uses an allowlist and must not become a free-form dumping ground;
- event writes are server-side or go through a tightly validated public measurement endpoint;
- lifecycle event insertion must be idempotent where retries could occur.

## V1 event taxonomy

### Server-authoritative lifecycle events

These are recorded only after the underlying operation succeeds:

- `group_created`
- `participant_joined`
- `participant_removed`
- `draw_completed`
- `redraw_completed`
- `standalone_list_created`
- `gift_item_added`
- `winkelnu_product_added`
- `gift_item_deleted`
- `reservation_created`
- `reservation_released`
- `group_deleted`
- `standalone_list_deleted`

Edits to notes/titles are not insight events in v1 because they add little business value and create noise.

### Privacy-safe interaction events

Only events needed to understand the funnel:

- `gifting_landing_viewed`
- `group_create_form_viewed`
- `list_create_form_viewed`
- `group_invite_viewed`
- `shared_list_viewed`
- `share_link_copied`
- `whatsapp_share_clicked`
- `native_share_invoked`

These events contain no persistent visitor identity. A view is a page/event count, not a unique user.

## Instrumentation boundary

Prefer instrumenting application services immediately after successful domain operations instead of duplicating instrumentation in multiple UI actions.

Examples:

```text
createGiftGroup succeeds
→ record group_created

joinGiftGroup succeeds
→ record participant_joined

drawGiftGroup first draw succeeds
→ record draw_completed

addWinkelnuProductToGiftList succeeds
→ record winkelnu_product_added

setGiftItemReservation false → true succeeds
→ record reservation_created
```

This keeps metrics correct if a future UI invokes the same application service from another surface.

Public-only interaction events such as WhatsApp/share clicks need a small dedicated client → server measurement boundary because they do not mutate gifting state.

## Daily aggregates

Consumer gifting records are temporary, so add a rollup table such as `gifting_daily_metrics`.

Suggested key:

```text
metric_date date
metric_key text
dimension_key text null
dimension_value text null
value bigint
updated_at timestamptz
```

Examples:

```text
2026-12-05 | groups_created | occasion | sinterklaas | 184
2026-12-05 | draws_completed | null | null | 161
2026-12-05 | items_added | item_type | winkelnu_product | 422
```

A separate `gifting_product_daily_metrics` table is acceptable if product reporting becomes large enough to justify a narrower schema.

Daily aggregates must contain no group/list/person identifier.

## Retention

The existing consumer gifting retention rules stay unchanged.

Recommended insight retention:

- raw/minimal `gifting_insight_events`: 90 days;
- group/list foreign-key linkage disappears naturally when source data is deleted;
- anonymous daily business aggregates: long-term retention is allowed because no person/group identifier remains;
- product-level daily aggregates: initially 25 months, then review based on actual product-analysis value;
- error/health detail: short operational retention, with totals rolled up where useful.

Do not extend Lootje & Lijstje consumer-data retention merely to improve analytics.

## Operator authorization

Extend the existing owner/operator/read-only permission model with an explicit permission:

- `read_gifting_insights`

Recommended initial mapping:

- `owner`: allowed;
- `operator`: allowed;
- `read_only`: not enabled by default until a concrete need exists.

V1 admin is read-only. It does not add buttons to alter, redraw, close or delete consumer groups from the internal insights dashboard.

If operational mutation is ever required, it must use separate permissions, confirmation flows and operator audit logs.

## Read model

Add a server-only application read service, for example:

```text
GiftingInsightsReadService
```

It should return purpose-built DTOs such as:

- `GiftingOverviewMetrics`
- `GiftingFunnelMetrics`
- `GiftingProductMetrics`
- `GiftingUsageBreakdown`
- `GiftingHealthSummary`

The UI must never receive raw gifting repository rows and filter secrets client-side.

A Supabase read repository performs aggregate queries/server RPCs and returns only the fields required by the admin screen.

## Performance guardrail

Do not run expensive full-table scans on every admin page request as data grows.

V1 strategy:

1. small current-state counts can query indexed source tables;
2. historical trends use daily rollups;
3. product trends use product/day aggregates once volume requires it;
4. all queries are server-side;
5. no new external analytics vendor is required.

## Existing analytics relationship

Vercel Web Analytics remains the privacy-safe public pageview layer for general Winkelnu traffic.

Lootje & Lijstje Insights is different:

- Vercel answers aggregate public page traffic questions;
- Gifting Insights answers gifting-domain lifecycle/product questions;
- no visitor identity is shared between the two;
- custom gifting events are not forwarded to Vercel in v1.

## Affiliate attribution relationship

The existing affiliate click table stores `source_path` without a personal visitor identity.

When real offers are used from gifting surfaces, the admin can count clicks where:

```text
source_path = '/lootje-lijstje/...'
```

or the normalized equivalent implemented by the outbound redirect layer.

Do not create a second affiliate-click tracking system for Lootje & Lijstje.

## Database migration sequencing

Current production migrations end at `0029_gifting_retention_rate_limits.sql`.

Because Lootje & Lijstje Insights is now prioritized before Email Hub, the first new migration is reserved for this feature:

`0030_gifting_insights_foundation.sql`

Email Hub migration numbering becomes intentionally TBD and must follow whichever gifting-insights migrations are actually merged.

## Rollout milestones

### GI1 — Foundation and current-state overview

- migration `0030_gifting_insights_foundation.sql`;
- insight event + aggregate schema boundaries;
- `read_gifting_insights` authorization;
- server-only insights repository/read service;
- `/intern/operations/gifting` route;
- overview using existing state plus safe aggregates;
- no client interaction tracking yet.

### GI2 — Server lifecycle instrumentation

- record successful group/list lifecycle events;
- idempotency rules;
- first historical daily rollups;
- tests proving instrumentation cannot expose draw assignments or tokens.

### GI3 — Funnel interaction measurement

- privacy-safe interaction endpoint;
- landing/form/invite/shared-list views;
- share-copy / WhatsApp / native-share events;
- Funnel admin view;
- no persistent visitor identifier.

### GI4 — Product and commercial insights

- product/day aggregate reporting;
- item type and occasion breakdowns;
- gifting-origin outbound affiliate clicks via existing attribution;
- product ranking table.

### GI5 — Health and retention verification

- gifting health summary;
- cleanup/expiry consistency checks;
- retention job verification;
- rate-limit aggregate visibility;
- final privacy/security review.

## Acceptance criteria

V1 is complete when:

1. `/intern/operations/gifting` exists and requires an authorized operator session.
2. No public user can query insights tables directly.
3. Overview shows reliable 7/30/90-day gifting metrics.
4. Current and historical metrics remain clearly distinguished.
5. Group funnel progression is available without exposing participant identities.
6. Standalone list usage is measurable.
7. Winkelnu-product additions are measurable by product.
8. Gifting-origin affiliate clicks can be reported through the existing attribution system when offers exist.
9. Consumer data can expire/delete without breaking long-term daily aggregate reporting.
10. No admin response includes draw pairings, names, free-text wishes, raw URLs, public codes, tokens or token hashes.
11. No persistent analytics visitor ID is introduced.
12. Tests cover authorization, secret-field exclusion, event validation, idempotency and retention/rollup behaviour.

## Fixed v1 decision

Lootje & Lijstje Insights/Admin is an aggregate product/operations dashboard, not a window into individual users.

The core question for every metric is:

> Does this help Winkelnu improve the feature or operate it safely without retaining or exposing more consumer data than necessary?

If the answer is no, the metric does not belong in v1.
