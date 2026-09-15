# Winkelnu Measurement Core — Ingestion & Storage v1

Status: design approved for implementation planning; no migration or production code is applied by this document.

Milestone: M1.11 — Measurement Core v1.0, Phase 2 design

Companion to: `docs/architecture/MEASUREMENT_CORE_V1.md`

## Purpose

This document turns the approved Measurement Core direction into an implementation-ready storage and ingestion contract without yet changing the production database or storefront.

It defines:

- the proposed `measurement_events` schema;
- database constraints and indexes;
- service-role-only persistence boundaries;
- the public ingestion contract;
- the central event registry;
- the `MeasurementRecorder` application abstraction;
- idempotency and navigation-safe browser delivery;
- privacy, abuse and cost guardrails;
- the first end-to-end `Akflow` footer event;
- the implementation and test sequence.

The document deliberately does not assign a migration number. The implementation branch must first rebase on the then-current `main` and use the next available migration number.

## Existing Winkelnu patterns this design preserves

Measurement Core should extend existing repository conventions rather than invent a parallel architecture.

Relevant precedents already present in Winkelnu:

1. `affiliate_click_events` uses UUID identity, a unique `external_key`, `occurred_at`, indexes and privacy-minimal attribution.
2. catalog and operational tables use RLS plus explicit denial for `public`, `anon` and `authenticated`, while trusted server code uses `service_role`.
3. the Next.js App Router already exposes validated server endpoints under `/api/...`.
4. `search-feedback-client.ts` already demonstrates navigation-safe best-effort delivery with `navigator.sendBeacon()` and `fetch(..., { keepalive: true })`.
5. database changes are governed by migration contract verification, live schema smoke verification and generated Supabase types.
6. Vercel Web Analytics remains the pageview layer; Measurement Core does not duplicate generic pageviews.
7. `/uit/[offerId]` remains the authoritative affiliate-click path and its raw records are not copied into `measurement_events`.

## Target architecture

```text
meaningful client action
        |
        v
MeasurementRecorder
        |
        v
POST /api/measurement/events
        |
        v
MeasurementEventRegistryV1
        |
   validate + derive
        |
        v
MeasurementEventRepository
        |
        v
service-role persistence
        |
        v
measurement_events

existing affiliate click
        |
        v
/uit/[offerId]
        |
        v
affiliate_click_events

measurement_events + affiliate_click_events + future conversions
        |
        v
unified admin read model
```

The application contract, transport, persistence adapter and reporting model remain separate. A future transport change must not require event renaming or dashboard redesign.

## Proposed raw-event table

The implementation should create one generic table called `measurement_events` for approved non-authoritative meaningful actions.

Proposed columns:

| Column | Type | Null | Purpose |
| --- | --- | --- | --- |
| `id` | `uuid` | no | relational database identity, default `gen_random_uuid()` |
| `external_key` | `text` | no | event idempotency key, unique |
| `event_name` | `text` | no | reusable event contract such as `outbound.click` |
| `event_version` | `smallint` | no | explicit positive contract version |
| `event_group` | `text` | no | server-derived reporting group |
| `source_path` | `text` | yes | sanitized relative Winkelnu pathname |
| `target_type` | `text` | yes | controlled target type |
| `target_key` | `text` | yes | stable target identifier |
| `placement` | `text` | yes | controlled UI placement |
| `properties` | `jsonb` | no | strictly validated event-specific object; default `{}` |
| `ingestion_source` | `text` | no | server-derived source such as `client` or `server` |
| `occurred_at` | `timestamptz` | no | authoritative stored event time |
| `created_at` | `timestamptz` | no | database creation time, default `now()` |

### SQL shape

The implementation migration should be structurally equivalent to the following design. This is documentation, not a migration to execute verbatim without re-checking current `main`.

```sql
create table measurement_events (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  event_name text not null,
  event_version smallint not null,
  event_group text not null,
  source_path text,
  target_type text,
  target_key text,
  placement text,
  properties jsonb not null default '{}'::jsonb,
  ingestion_source text not null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
```

## Database constraints

The database is the final defensive layer. Event-specific semantics remain in application validation, but the table must reject obviously invalid shapes.

Baseline constraints:

- `external_key` length: 8–128 characters;
- `event_name` length: 3–80 characters;
- `event_version > 0`;
- `event_group` length: 2–40 characters;
- `source_path` is null or a relative path beginning with `/`;
- `source_path` may not begin `//`;
- `source_path` may not contain `?`, `#` or `://`;
- `source_path` maximum length: 300 characters;
- `target_type` maximum length: 60 characters;
- `target_key` maximum length: 180 characters;
- `placement` maximum length: 80 characters;
- `properties` must be a JSON object;
- `ingestion_source` is restricted to an approved small vocabulary;
- controlled fields may not be empty strings.

Do not put a moving time-window constraint around `occurred_at` in PostgreSQL. Timestamp plausibility is an ingestion concern; a database check involving current time becomes operationally awkward and can make historical maintenance harder.

## Index strategy

V1 should use only indexes justified by known dashboard queries. Every index also increases write and storage cost.

Initial indexes:

```text
(occurred_at desc)
(event_name, occurred_at desc)
(target_type, target_key, occurred_at desc) where target_key is not null
```

A source-path index should be added only when the admin source-page breakdown is implemented and real query plans justify it. A placement-only index is not required for the first Akflow event.

Do not add a GIN index on `properties` in v1. Arbitrary JSON querying is deliberately not part of the contract.

## Database security

`measurement_events` is server-owned storage.

Required baseline:

```text
RLS enabled
public       -> no table access
anon         -> no table access
authenticated-> no table access
service_role -> only privileges required by trusted server code
```

The browser must never receive a service-role credential and must never insert directly into Supabase.

The migration should follow the same explicit grant/revoke style already used by Winkelnu. If persistence uses a dedicated security-definer function, that function must:

- set `search_path = public` explicitly;
- be revoked from `public`, `anon` and `authenticated`;
- be executable only by `service_role`;
- perform idempotent insertion using the unique `external_key`;
- expose no generic dynamic SQL surface.

A function such as `record_measurement_event_v1(...)` is acceptable, but the final implementation should choose between a dedicated RPC and a repository insert after tests show which keeps the contract clearest. Either option remains service-role-only.

## Idempotency contract

Each physical event envelope receives one random event key generated for that event only.

Recommended browser key:

```text
crypto.randomUUID()
```

The UUID is an event identifier, not a visitor identifier. It must not be reused between separate user actions and must not be persisted in localStorage, sessionStorage or a cookie.

`external_key` has a unique database constraint. A retry carrying the same key becomes a successful no-op rather than a second counted event.

The persistence adapter should treat a duplicate idempotency key as success. It must not turn a harmless retry into a visible application error.

## Central event registry

Clients may request an event name and version, but the server decides what that event means.

Create a versioned registry conceptually named:

```text
MeasurementEventRegistryV1
```

For every active event contract it defines:

- `eventName`;
- `eventVersion`;
- derived `eventGroup`;
- reliability class;
- allowed `targetType` values;
- allowed or required `targetKey` rules;
- allowed placements;
- property schema;
- maximum property count and value lengths;
- whether `sourcePath` is required;
- ingestion sources allowed for the contract.

The public client must not be able to choose `event_group` or `ingestion_source`. Those are derived server-side from the registry and request context.

This prevents a browser from relabeling an event as `commerce`, `server` or another privileged semantic class.

## First active registry contract

Only one new generic event needs to be activated for the first end-to-end release:

```text
eventName: outbound.click
eventVersion: 1
eventGroup: navigation
reliabilityClass: B
allowedTargetTypes: [brand]
allowedTargetKeys for initial release: [akflow]
allowedPlacements: [footer]
properties: {}
sourcePath: required
ingestionSource: client
```

The broader catalog in `MEASUREMENT_CORE_V1.md` stays reserved until each event has a real decision-use case and implementation review.

## Public ingestion route

Proposed route:

```text
POST /api/measurement/events
```

This matches the existing App Router `/api/...` pattern and remains outside Vercel pageview measurement because `/api` is already excluded from public Web Analytics.

### Request body

For v1, the browser sends only fields it legitimately knows:

```json
{
  "externalKey": "7be445a0-2d77-4474-8e06-17c854f7279f",
  "eventName": "outbound.click",
  "eventVersion": 1,
  "sourcePath": "/koopgidsen",
  "target": {
    "type": "brand",
    "key": "akflow"
  },
  "placement": "footer",
  "properties": {}
}
```

The public request does not contain:

```text
eventGroup
ingestionSource
occurredAt
createdAt
IP
user-agent
referrer URL
visitor/session/device identifier
```

For v1, the server sets `occurred_at` at successful ingestion time. This avoids trusting a client clock and avoids accepting arbitrary timestamps. If delayed/offline delivery ever becomes a real requirement, it needs a separately reviewed client-timestamp policy.

## Request validation

The endpoint reads a bounded raw body before parsing, following existing Winkelnu endpoint practice.

Recommended maximum body size for v1:

```text
4096 bytes
```

Validation order:

1. reject empty or oversized body;
2. parse JSON;
3. require a plain object;
4. validate `externalKey` format and length;
5. resolve `eventName + eventVersion` through the registry;
6. sanitize `sourcePath`;
7. validate target against registry;
8. validate placement against registry;
9. validate properties against the exact event property schema;
10. derive `eventGroup` and `ingestionSource` server-side;
11. persist idempotently.

Unknown top-level or property keys should fail validation rather than silently creating analytics-schema drift.

## Source-path sanitizer

The stored path is a Winkelnu location, not a referrer capture mechanism.

A valid stored value:

- begins with exactly one `/`;
- contains no scheme or host;
- contains no query string;
- contains no fragment;
- stays below the maximum length;
- represents only the pathname.

Examples:

```text
/                         -> /
/koopgidsen               -> /koopgidsen
/zoeken?q=koffie           -> /zoeken
/product/x#specificaties   -> /product/x
https://example.com/x      -> reject
//example.com/x            -> reject
```

The browser should normally send `window.location.pathname`. The server still validates because client input is untrusted.

## Endpoint response semantics

Successful accepted insert:

```text
204 No Content
```

Successful duplicate idempotency key:

```text
204 No Content
```

Malformed or unsupported event:

```text
400 Bad Request
```

Oversized body:

```text
413 Payload Too Large
```

Temporary storage failure:

```text
503 Service Unavailable
```

If bounded rate controls are introduced later:

```text
429 Too Many Requests
```

Responses use `cache-control: no-store` and return no stored event details. A public endpoint does not need to disclose whether a particular event key already existed.

## MeasurementRecorder contract

Application and UI code should not know about Supabase or the endpoint implementation.

Conceptual TypeScript contract:

```ts
export type MeasurementTarget = {
  type: string
  key: string
}

export type MeasurementEventInput = {
  eventName: string
  eventVersion: number
  sourcePath?: string
  target?: MeasurementTarget
  placement?: string
  properties?: Record<string, string | number | boolean | null>
}

export interface MeasurementRecorder {
  record(event: MeasurementEventInput): void | Promise<void>
}
```

The browser recorder is responsible for:

- creating a fresh event key;
- building the transport envelope;
- never adding visitor identity;
- using navigation-safe delivery;
- swallowing transport failure for Class A/B interactions;
- never blocking the user action being measured.

Event producers should preferably use typed helper functions built over the recorder rather than repeatedly constructing raw event objects.

For example:

```text
recordAkflowFooterOutbound(sourcePath)
```

may construct the approved `outbound.click` contract, while storage still receives the generic event.

## Browser delivery adapter

For Class B outbound navigation, the existing Winkelnu search-feedback delivery pattern is a good precedent:

1. serialize the validated client envelope;
2. attempt `navigator.sendBeacon()`;
3. if beacon submission is unavailable or returns false, fall back to `fetch` with `keepalive: true`;
4. ignore transport rejection in the UI;
5. never call `preventDefault()` merely to wait for analytics.

The Akflow link therefore remains an ordinary accessible external anchor. Measurement is attached to the click but navigation owns the user experience.

No retry queue is stored in localStorage or another persistent client store in v1. Missing an occasional Class B click is preferable to creating identity/state complexity for an analytics event.

## First end-to-end Akflow event

Target UI:

```text
© 2026 Winkelnu.nl · Een initiatief van Akflow · KvK ...
```

Only `Akflow` becomes a subtle link to:

```text
https://www.akflow.nl/
```

On activation the browser records:

```text
outbound.click v1
brand / akflow
placement = footer
source_path = window.location.pathname
```

No UTM parameters are required for Measurement Core itself.

The click handler must not:

- stop or delay navigation;
- open an artificial intermediate page;
- expose internal measurement IDs in the destination URL;
- store a persistent user/session identifier.

Keyboard activation of the anchor should follow normal browser click semantics and be measurable through the same handler.

## Reliability boundary

### Class A

Best-effort client interaction. Loss is acceptable.

### Class B

Best-effort but navigation-safe and idempotent. `outbound.click` to Akflow is the first example.

### Class C

Authoritative server-side commercial event. Affiliate clicks remain in the current `/uit/[offerId]` flow. A future confirmed conversion must come from or be reconciled with an authoritative commercial source.

Do not route existing affiliate clicks through the public generic measurement endpoint merely for consistency. The unified reporting layer, not duplicated storage, provides consistency.

## Repository layer

Introduce a dedicated application port rather than calling Supabase from the API route.

Conceptual boundary:

```ts
export interface MeasurementEventRepository {
  record(event: MeasurementEvent): Promise<'recorded' | 'duplicate'>
}
```

A Supabase adapter lives in infrastructure and owns database column mapping. This follows the existing repository separation used elsewhere in Winkelnu.

The route should perform HTTP concerns and parsing. Registry/application code performs semantic validation. The repository performs persistence. This prevents a route handler from becoming the permanent business-logic layer.

## Abuse controls without visitor profiling

V1 controls should be cheap and privacy-minimal:

- strict allow-list event registry;
- 4 KiB body limit;
- exact property schemas;
- controlled strings and length bounds;
- same-origin browser credentials behavior;
- production host/origin checks where they are safe and do not break legitimate navigation delivery;
- unique event keys;
- no arbitrary destination URL supplied to storage;
- no direct database access from untrusted roles.

Do not store raw IP addresses for anti-abuse analytics.

If actual abuse creates material cost, an infrastructure-level transient rate limiter may later use request signals without persisting them in Measurement Core. That is a later operational decision, not a reason to add a durable visitor identity now.

Bot clicks remain a known limitation of non-financial interaction analytics. Financial truth remains with authoritative affiliate/conversion sources.

## Admin read-model direction

V1 storage should not force the future admin dashboard to query every raw source independently.

The future read layer should expose normalized records or aggregate queries from:

```text
measurement_events
affiliate_click_events
future conversion records
```

The read model may normalize them conceptually into dimensions such as:

```text
date/time
event family
source type
target type/key
placement
source path
count
```

It must retain source provenance so the dashboard can distinguish an indicative client event from an authoritative affiliate/conversion event.

The first admin queries need only support Akflow:

- total `outbound.click` where `target_type=brand` and `target_key=akflow`;
- today / 7 days / 30 days;
- daily trend;
- top `source_path` values;
- placement, currently `footer`.

## Rollups

Do not introduce a scheduled rollup job in the first release.

At current scale, indexed raw-event queries for one event are cheaper and operationally simpler. A cron or scheduled serverless job would create cost and another failure surface before there is evidence it is needed.

The future `measurement_daily_rollups` contract remains planned. Introduce it only when one or more of these are true:

- raw scans become measurably slow;
- event volume becomes materially large;
- retention deletes become expensive;
- admin reporting needs long-range trends that are cheaper from aggregates.

When rollups arrive, the admin read-model interface should remain stable.

## Retention

Architecture target remains:

```text
raw non-commercial Measurement Core events: 180 days
daily aggregates: at least 36 months after rollups exist
authoritative commerce records: separate policy
```

Do not introduce a per-request delete query in the new ingestion endpoint. That would make every click pay for retention housekeeping.

Retention enforcement should become a bounded maintenance operation once the table has meaningful volume. Until then, document the target and measure storage growth.

Before production activation, confirm that the public privacy/cookie disclosures remain accurate for this privacy-minimal first-party event collection.

## Cost guardrails

Phase 2 implementation must preserve all of the following:

1. no new analytics SaaS;
2. no duplicate pageview storage;
3. no Vercel Preview build merely for documentation;
4. no scheduled rollup/cleanup job before volume justifies it;
5. no one-request-per-hover or visibility tracking;
6. only one new event enabled initially;
7. no additional database indexes without a known query;
8. no persistent client retry queue;
9. no new Supabase project or database;
10. transport remains replaceable if serverless request cost ever becomes material.

The first production version therefore costs roughly one small server request and one small database insert per approved Akflow click, not per pageview.

## Migration implementation rule

When implementation begins:

1. rebase the implementation branch on current `main`;
2. inspect the latest migration number;
3. create the next available migration; never reserve a number in this design doc;
4. add `measurement_events`, constraints, RLS, revokes/grants and required indexes;
5. update `scripts/verify-database-contract.mjs` so the table and critical security contract are enforced offline;
6. apply the migration only to the intended verification environment first;
7. run `npm run verify:supabase`;
8. regenerate `src/infrastructure/supabase/database.types.ts` with `npm run types:supabase`;
9. run normal quality checks;
10. only then allow production promotion.

Do not manually patch production SQL outside the migration history.

## Proposed source layout

Exact filenames may be adjusted to repository conventions during implementation, but ownership should remain clear.

```text
src/domain/measurement/
  types.ts

src/application/measurement/
  event-registry.ts
  ports.ts
  validation.ts

src/infrastructure/measurement/
  browser-measurement-recorder.ts
  supabase-measurement-event-repository.ts

src/app/api/measurement/events/
  route.ts
```

If the browser recorder is considered a UI adapter rather than infrastructure under existing conventions, it may live under `src/components/analytics/`; the application port must remain independent of that choice.

## Automated test contract

### Event registry tests

Verify:

- only supported name/version pairs resolve;
- `outbound.click v1` derives `navigation`;
- only `brand/akflow/footer` is initially allowed;
- unknown properties fail;
- client cannot supply privileged group/source semantics.

### Source-path tests

Verify:

```text
/ -> accepted
/koopgidsen -> accepted
/zoeken?q=x -> stored/sanitized as /zoeken or rejected before normalization according to final function contract
/product/x#y -> stored/sanitized as /product/x
//evil.example -> rejected
https://evil.example -> rejected
```

Prefer one shared sanitizer contract rather than multiple almost-identical implementations.

### API route tests

Verify:

- valid body -> 204;
- duplicate same event key -> 204 and one row;
- unknown event -> 400;
- bad target -> 400;
- bad placement -> 400;
- unexpected property -> 400;
- oversized body -> 413;
- repository failure -> 503;
- response never contains raw stored row details.

### Persistence tests

Verify:

- unique `external_key` enforces idempotency;
- RLS is enabled;
- no `anon`/`authenticated` direct table access;
- JSON properties must be an object;
- invalid source path cannot be persisted through the intended function/repository contract.

### Browser recorder tests

Verify:

- a new event key is generated per action;
- beacon is preferred where available;
- keepalive fetch is the fallback;
- delivery rejection is swallowed;
- no local/session storage is written;
- navigation is never prevented by measurement.

### Footer integration tests

Verify:

- `Akflow` links to `https://www.akflow.nl/`;
- visual styling remains subtle;
- event is exactly `outbound.click v1`;
- target is `brand/akflow`;
- placement is `footer`;
- current pathname, not query/hash, is supplied as source;
- existing footer legal/affiliate contracts remain unchanged.

## Production activation gate

The first Measurement Core event may not be described as live until all of these are true:

1. architecture and this Phase 2 contract are accepted;
2. the implementation migration passes repository migration checks;
3. database contract checks include the new storage/security requirements;
4. live schema verification succeeds in the intended pre-production verification environment;
5. generated Supabase types are current;
6. unit/integration tests pass;
7. production build passes;
8. footer navigation still works when measurement transport is unavailable;
9. a production Akflow click creates one sanitized event;
10. repeating the same test envelope with the same key does not double-count;
11. no query/hash, raw IP, user-agent fingerprint or visitor identifier is stored;
12. the production route does not expose service-role credentials or direct database access;
13. privacy/legal copy has been rechecked for accuracy;
14. actual Vercel/Supabase usage is reviewed after initial activation before more events are enabled.

## Phase 2 decision summary

The implementation-ready v1 decision is:

```text
Storage
  one generic measurement_events table

Identity
  one random idempotency key per event, never per visitor

Public write path
  POST /api/measurement/events

Client authority
  name/version + UI context only

Server authority
  event group, ingestion source, schema interpretation, event time

First enabled event
  outbound.click v1 -> brand/akflow/footer

Delivery
  sendBeacon -> keepalive fetch fallback
  never block navigation

Database access
  service-role-only; RLS; no anon/authenticated inserts

Affiliate clicks
  remain in existing server-authoritative /uit flow

Pageviews
  remain in Vercel Web Analytics

Rollups/cron
  postponed until real volume justifies them
```

This creates a small first implementation while preserving a durable path toward the future Winkelnu admin measurement dashboard, affiliate/conversion reporting and evidence-based decision intelligence.