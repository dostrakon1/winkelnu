# Winkelnu Measurement Core v1.0

Status: approved architecture direction. Implementation has not started.

Milestone: M1.11 — Measurement Core v1.0

## Purpose

Measurement Core gives Winkelnu a durable, privacy-safe foundation for measuring meaningful product, navigation and commercial actions without turning the platform into a visitor-tracking system.

The objective is not to collect every possible interaction. The objective is to answer product and commercial questions that support decisions, for example:

- Which parts of Winkelnu are actually used?
- Which pages create product consideration or commercial outbound activity?
- Which placements generate meaningful clicks?
- Which merchants, products, categories and editorial pages contribute to affiliate activity?
- Which platform changes improve useful outcomes over time?
- Which aggregate signals may later support decision-assistance or AI-generated recommendations?

The first end-to-end non-affiliate event will be the subtle `Akflow` brand link in the public footer.

## Relationship to existing measurement

Measurement Core extends, but does not replace, the existing measurement architecture.

### Vercel Web Analytics

Vercel Web Analytics remains the pageview-oriented reach layer. It is intended for aggregate traffic and route-family measurement and must continue to respect the existing privacy boundary described in `docs/MEASUREMENT_M1.md`.

Pageviews must not be duplicated into the Measurement Core event table merely to recreate traffic analytics already available elsewhere.

### Affiliate click attribution

The existing `/uit/[offerId]` server-side attribution flow remains authoritative for affiliate outbound clicks.

Measurement Core must not weaken, bypass or duplicate the safety rules defined in `docs/architecture/AFFILIATE_REDIRECT_AND_CLICK_ATTRIBUTION.md`.

Affiliate clicks remain server-side because they are commercially important events. The unified reporting layer may read those records together with Measurement Core events without copying them into a second raw-event table.

## Architecture

```text
PUBLIC WINKELNU
      |
      |-- pageview ------------------> Vercel Web Analytics
      |
      |-- meaningful interaction
      |          |
      |    MeasurementRecorder
      |          |
      |    ingestion boundary
      |          |
      |    measurement_events
      |
      `-- affiliate click
                 |
             /uit/[id]
                 |
       affiliate_click_events
                 |
                 +-------------------+
                                     |
                          unified measurement read model
                                     |
                          daily / periodic rollups
                                     |
                               WINKELNU ADMIN
                                     |
                         trends / KPI / insights
                                     |
                              future AI layer
```

The event contract, transport mechanism, storage model and reporting model are separate concerns. This allows transport or infrastructure to change later without rewriting the entire measurement system.

## Core design principle

> Store an event only when Winkelnu can explain which product, operational or commercial decision the event can support.

Measurement Core is deliberately not a heatmap, session replay, advertising profile or mouse-tracking system.

Events such as `mouse_move`, generic hover tracking, arbitrary scroll percentages and high-volume visibility pings are out of scope unless a later milestone justifies them with a specific decision need, privacy review and cost review.

## Event model

Meaningful interactions use a generic versioned event envelope rather than feature-specific tables.

Conceptual fields:

| Field | Purpose | Example |
| --- | --- | --- |
| `id` | Internal database identity | UUID |
| `external_key` | Idempotency key | stable unique event key |
| `event_name` | Stable event contract | `outbound.click` |
| `event_version` | Contract version | `1` |
| `event_group` | High-level reporting group | `navigation` |
| `source_path` | Sanitized internal origin path | `/koopgidsen` |
| `target_type` | Kind of target | `brand` |
| `target_key` | Stable target identifier | `akflow` |
| `placement` | UI placement | `footer` |
| `properties` | Strictly validated event-specific JSON | limited schema |
| `ingestion_source` | Origin of event record | `client`, `server` |
| `occurred_at` | Event occurrence time | timestamp |
| `created_at` | Storage time | timestamp |

The precise SQL schema will be designed in the implementation milestone. This document defines the contract and constraints first.

## Naming rules

Event names describe reusable behavior, not one-off UI details.

Preferred:

```text
outbound.click
feature.open
search.submit
comparison.start
comparison.item_add
guide.cta_click
affiliate.click
conversion.confirmed
```

Avoid feature-specific names such as:

```text
footer_akflow_click
homepage_blue_button_click
lootje_card_click_v2
```

Feature, target and placement context belongs in structured fields such as `target_type`, `target_key` and `placement`.

## Versioning

Every event contract has an explicit version.

Example:

```text
event_name: outbound.click
event_version: 1
```

A future incompatible contract becomes a new version instead of silently changing the meaning of historical events.

Reporting code must be able to interpret historical versions for as long as retained data depends on them.

## Initial event catalog

The catalog is intentionally broader than the first implementation so naming does not drift later.

| Event | Group | Initial status | Typical target |
| --- | --- | --- | --- |
| `outbound.click` | navigation | v1 implementation candidate | brand / destination |
| `feature.open` | engagement | reserved | feature |
| `search.submit` | discovery | reserved | search |
| `comparison.start` | consideration | reserved | comparison |
| `comparison.item_add` | consideration | reserved | product |
| `guide.cta_click` | discovery | reserved | guide |
| `affiliate.click` | commerce | existing server-side source | offer |
| `conversion.confirmed` | commerce | future | transaction / network conversion |

Only events with an approved business purpose are activated.

## First event: Akflow footer outbound

The public footer may render `Akflow` as a subtle external link to `https://www.akflow.nl/`.

The corresponding Measurement Core event is:

```text
event_name: outbound.click
event_version: 1
event_group: navigation
target_type: brand
target_key: akflow
placement: footer
source_path: <sanitized current Winkelnu pathname>
ingestion_source: client
```

The event is a count of click actions, not a count of unique people.

The Akflow destination does not require tracking parameters for Winkelnu to know that the click originated from the footer. Any future UTM or inbound campaign strategy for Akflow is a separate decision.

## Source path rules

`source_path` exists because placement performance without origin context is often too weak to support decisions.

Allowed examples:

```text
/
/koopgidsen
/koopgidsen/robotstofzuiger
/vergelijken
/over-winkelnu
```

The stored value must be an internal relative Winkelnu pathname.

The ingestion boundary must remove or reject:

- query strings;
- URL fragments;
- absolute external referrers;
- unexpected protocol or host data.

For example:

```text
/zoeken?q=robotstofzuiger&budget=500
```

is stored as:

```text
/zoeken
```

## Placement vocabulary

Placements are controlled values, not arbitrary free text.

Initial vocabulary may include:

```text
footer
header
hero
product_card
product_detail
comparison_table
guide_body
guide_cta
lootje_result
```

New placements require a code change or approved schema extension so reporting does not fragment into near-duplicate labels.

## Properties policy

`properties` is JSON for controlled extensibility, not a free-form analytics bucket.

Each event contract defines an allow-list of property keys and value types. Unknown properties are rejected or discarded at the ingestion boundary.

Personally identifying, sensitive or arbitrary user-supplied text must not be placed in `properties` by default.

Examples of data that must not be stored in the baseline:

```text
raw_ip_address
user_agent_fingerprint
visitor_id
advertising_id
email
name
device_id
third_party_cookie
full_external_referrer
free_text_search_query
```

## Privacy boundary

Measurement Core measures aggregate actions, not persistent people.

Baseline rules:

1. No raw IP address is stored.
2. No browser or device fingerprint is created.
3. No custom visitor identifier is created merely for Measurement Core.
4. No cross-day user journey is reconstructed by default.
5. No third-party advertising identifier is introduced.
6. Search terms and query parameters are not copied into generic events.
7. Admin reporting focuses on aggregate counts, trends and dimensions.
8. Any future enrichment that changes this boundary requires a new privacy and consent review.

Conceptually:

```text
Measurement Core != Visitor Tracking System
```

## Reliability classes

Not every event requires the same delivery guarantees.

### Class A — indicative

Examples:

- `feature.open`
- `guide.cta_click`
- `comparison.item_add`

A small amount of loss is tolerable because these events support product analysis rather than financial truth.

### Class B — important interaction

Example:

- `outbound.click` to Akflow

The browser implementation should use a navigation-safe delivery mechanism such as `navigator.sendBeacon()` or a `fetch(..., { keepalive: true })` strategy, subject to implementation testing.

### Class C — authoritative commercial

Examples:

- affiliate outbound click;
- confirmed conversion.

These events must be recorded server-side or reconciled from an authoritative affiliate source. Client-only analytics must never become the financial source of truth.

## Ingestion boundary

Public clients must not receive unrestricted insert access to the raw event table.

All public Measurement Core writes pass through a validation boundary that checks at least:

- known `event_name`;
- supported `event_version`;
- allowed `event_group`;
- allowed `target_type`;
- controlled `placement`;
- valid and sanitized `source_path`;
- allowed property keys and types;
- maximum payload size;
- valid idempotency key;
- timestamp sanity;
- basic abuse limits.

Unknown or malformed event contracts fail closed.

## Idempotency

`external_key` is unique within the Measurement Core store.

This allows a client or server to retry a meaningful event without intentionally producing duplicate records.

Idempotency is not a guarantee that every physical user action can never be duplicated; it is a transport-safety mechanism for the same event envelope.

## Abuse and bot handling

Measurement data is decision-support data, not bookkeeping truth.

Bots, automated clients and accidental repeated actions can influence aggregate counts. The implementation may therefore add bounded abuse controls such as rate limiting, payload validation and obvious automation filtering, provided those controls do not introduce invasive fingerprinting.

Financial conversion truth remains the affiliate network or other authoritative commercial source.

## Storage and retention

Baseline retention target:

- raw non-commercial interaction events: 180 days;
- aggregate daily rollups: at least 36 months;
- authoritative commercial records: governed separately because financial analysis or reconciliation may justify longer retention.

Retention must remain configurable so actual event volume, database cost and operational value can be reviewed before scale makes the decision expensive.

## Rollups

The admin dashboard must not depend on scanning an indefinitely growing raw event table.

A future rollup model such as `measurement_daily_rollups` should aggregate useful dimensions, for example:

```text
date
event_name
event_version
event_group
target_type
target_key
placement
source_path or normalized source family
count
```

At low volume, direct raw-event queries may be acceptable initially. The reporting contract should nevertheless be designed so the storage implementation can move to rollups without rewriting the admin UI.

## Unified measurement read model

The admin reporting layer should consume a unified read contract instead of knowing every underlying persistence table.

Conceptually:

```text
measurement event store
affiliate click store
future conversion store
        |
        v
unified measurement read model
        |
        v
admin KPI / trends / breakdowns
```

This read layer may normalize different sources into common reporting concepts while preserving which source is authoritative.

Raw affiliate click records do not need to be copied into `measurement_events` merely to make the dashboard unified.

## Admin dashboard direction

A future internal navigation section called `Metingen` should support time ranges such as:

```text
Vandaag
7 dagen
30 dagen
90 dagen
Aangepast
```

Initial KPI families may include:

- meaningful interactions;
- affiliate outbound clicks;
- non-affiliate outbound clicks;
- Akflow footer clicks;
- top source pages;
- top placements;
- top merchants;
- top products or guides where commercially meaningful.

The first Akflow detail view should answer:

- total Akflow clicks;
- today / 7-day / 30-day counts;
- source-path breakdown;
- trend over time.

## Cost guardrails

Measurement Core must remain cheap to operate at small and medium scale.

Baseline rules:

1. Do not add a new analytics SaaS merely for this feature.
2. Do not duplicate pageviews into Supabase when Vercel already provides that layer.
3. Do not generate high-volume low-value events.
4. Batch or roll up reporting where useful as volume grows.
5. Separate the event contract from transport so ingestion can move away from a Vercel route later if cost or scale requires it.
6. Review real usage before increasing event scope.
7. Any event that creates material Vercel, database or third-party cost must have an explicit decision-use case.

## Transport abstraction

Application code should depend on a small abstraction such as:

```text
MeasurementRecorder
```

rather than on a specific HTTP route, Supabase client or analytics vendor.

This keeps event producers independent from infrastructure decisions and gives Winkelnu the option to change ingestion later without renaming events or rebuilding reporting.

## Conversion roadmap

When affiliate networks such as Bol, Daisycon, Awin or future partners expose trustworthy conversion data, Measurement Core reporting can add a `conversion.confirmed` source.

The future commercial chain becomes:

```text
product / guide / comparison
        |
        v
affiliate click
        |
        v
merchant
        |
        v
confirmed conversion
        |
        v
commission / value
```

Possible later reporting includes:

- click-through rate;
- conversion rate;
- earnings per click;
- commission by merchant;
- commission by category;
- top commercial products;
- top commercial guides;
- attributed outbound value by placement.

No such metric should be presented as authoritative until the underlying source supports it reliably.

## Future decision engine / AI layer

Measurement Core may later provide aggregate evidence to a decision-support layer.

Examples:

```text
High traffic + many comparisons + low merchant click-through
-> inspect offer coverage, CTA clarity or price freshness.
```

```text
Low traffic + unusually strong commercial click-through
-> consider giving the guide or category more visibility.
```

The AI layer must consume validated aggregate evidence. It must not autonomously change ranking, content or commercial behavior solely because of noisy raw events.

## Implementation phases

### Phase 1 — architecture contract

- Approve this document.
- Freeze v1 naming, privacy and cost guardrails.
- Define implementation acceptance criteria.

### Phase 2 — storage and ingestion

- Define SQL schema and indexes.
- Add migration.
- Implement `MeasurementRecorder` abstraction.
- Implement validated ingestion boundary.
- Add idempotency and abuse controls.
- Add automated tests.

### Phase 3 — first end-to-end event

- Make the footer `Akflow` text a subtle external link.
- Record `outbound.click` v1 with `target_key=akflow` and `placement=footer`.
- Verify click navigation cannot be blocked by event delivery failure.
- Verify no prohibited personal data is stored.

### Phase 4 — admin reporting

- Add `Metingen` to the internal admin area.
- Add Akflow click KPI and source breakdown.
- Add time filters and trend reporting.
- Add unified read-model contract.

### Phase 5 — commercial unification

- Surface existing affiliate click records through the unified read model.
- Add merchant, product and placement breakdowns.
- Avoid duplicating raw affiliate events.

### Phase 6 — rollups and scale

- Introduce daily rollups when real query volume justifies them.
- Add retention automation.
- Review indexes, storage growth and cost.

### Phase 7 — conversions and decision intelligence

- Reconcile authoritative affiliate conversions where available.
- Add commercial KPI.
- Feed aggregate signals into a future decision-support or AI layer only after data quality is sufficient.

## Acceptance criteria for v1 implementation

Measurement Core v1 is not complete until all of the following are true:

1. The event contract is versioned and centrally defined.
2. Public clients cannot insert arbitrary rows directly into raw storage.
3. Query strings and URL fragments cannot reach `source_path` storage.
4. Unknown event names and properties are rejected.
5. Raw IP addresses, browser fingerprints and custom visitor identifiers are not stored.
6. Duplicate retries can be safely handled through idempotency.
7. The Akflow footer link still navigates successfully if measurement ingestion fails.
8. One Akflow click can be observed end-to-end from public UI to validated storage to admin reporting.
9. Existing `/uit/[offerId]` affiliate attribution remains authoritative and unchanged.
10. Pageviews are not redundantly copied into the custom event store.
11. Automated tests cover validation, sanitization, idempotency and failure behavior.
12. Privacy, retention and cost assumptions are documented before production activation.

## Non-goals for v1

The following are explicitly out of scope:

- session replay;
- heatmaps;
- mouse movement tracking;
- arbitrary scroll-depth tracking;
- advertising profiles;
- persistent cross-site identifiers;
- user fingerprinting;
- copying full search queries into analytics;
- duplicating all Vercel pageviews;
- replacing affiliate-network conversion reporting;
- autonomous AI-driven ranking or content changes.

## Architectural decision

Measurement Core v1 is the default architecture for future meaningful interaction measurement in Winkelnu.

New measurement features should extend the event catalog, read model or authoritative commerce sources described here instead of creating unrelated tracking tables or one-off analytics code paths.
