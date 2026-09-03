# Partner Onboarding & Import Orchestration

## Purpose
A merchant feed must never move from “we have a URL” directly to recurring production imports. Winkelnu uses explicit gates so bad mappings, identity collisions or incomplete feeds cannot silently damage the public catalog.

## Lifecycle
`registered → preview_ready → preview_passed → approved → active`

Exceptional states: `paused`, `rejected`.

Registry integration status remains the durable commercial/operational switch. The onboarding service derives whether preview or activation is allowed from registry state.

## Preview gate
A preview import uses the normal adapter, validation, matching and repository contracts, but calls `importFeed(..., deactivateMissingOffers: false)`.

This is a critical invariant: a partial/sample/read-only preview may write isolated test/import evidence, but it must never deactivate existing merchant offers merely because they were absent from the preview sample.

Baseline quality gate:
- at least one record seen;
- acceptance rate >= 95%;
- zero unresolved match-review items.

Thresholds can later become partner-specific, but lowering them requires an explicit decision.

## Activation gate
A source can only be considered activatable after its integration is `active`. An inactive feed source attached to an active integration is treated as approved but not yet running. Turning the source active is a separate operational action.

## Recurring imports
Recurring scheduling is intentionally not coupled to Next.js page traffic. Production orchestration will call the same resolver/adapter/import chain from a worker or scheduler. A run failure does not take the storefront offline.

Recommended production cadence is partner-specific and must respect source freshness, network rules and rate limits. No cadence is hard-coded into the domain.

## Safety
- preview imports never perform stale-offer cleanup;
- production full imports may deactivate offers not seen in a successful full traversal;
- failed imports do not run stale cleanup;
- activation is separate from successful parsing;
- unresolved canonical matching blocks automatic onboarding approval;
- credentials remain server-side and are resolved only in infrastructure.

## Next operational work
Persist onboarding decisions/audit events and add a scheduler/worker lease so duplicate recurring imports cannot run concurrently for the same source.
