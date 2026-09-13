# Lootje & Lijstje — L5 Draw Engine

Status: implemented behind the existing gifting release gate.

Date: 2026-09-13

Umbrella issue: #98

## Scope

L5 adds the first real Secret Santa / lootjes functionality:

- organizer-managed mutual exclusion pairs;
- a pure one-to-one draw engine;
- cryptographically randomized candidate ordering;
- exact self-draw and exclusion enforcement;
- atomic first draw persistence;
- atomic full redraw;
- structural lock after the first draw;
- no assignment reveal yet.

L6 remains responsible for showing one participant only their own recipient, recipient wish list and reservation state.

## Exclusions

The v1 organizer UI expresses exclusions as mutual pairs: `A ↔ B`.

Internally the existing `gift_group_exclusions` table remains directed, so a mutual pair is stored as two rows:

- `A -> B`
- `B -> A`

`set_gift_group_exclusion_pair(...)` changes both rows in one PostgreSQL transaction.

Exclusions can only be edited while the group is `draft`. A database trigger locks the parent group row and verifies that both participant IDs belong to that exact group.

## Pure draw engine

`src/domain/gifting/draw.ts` has no Supabase or React dependency.

Input:

- participant IDs;
- directed exclusions;
- an injected random-index function.

Production injects `node:crypto.randomInt`; tests inject deterministic functions.

The engine constructs eligible-recipient sets and uses randomized augmenting-path bipartite matching. This avoids an unbounded `shuffle until it works` loop while still varying valid outcomes.

Invariants:

1. every participant is exactly one giver;
2. every participant is exactly one recipient;
3. nobody draws themselves;
4. directed exclusions are never violated;
5. impossible constraint graphs return `NO_VALID_DRAW`;
6. no partial assignment is returned.

Winkelnu does not claim mathematically uniform sampling across every valid permutation in v1. The user-facing promise is that the result is randomly ordered and valid within the configured constraints.

## Atomic persistence

Migration `0027_gifting_draw_engine.sql` adds `apply_gift_group_draw(...)`.

The RPC:

1. locks the target `gift_groups` row;
2. verifies group state, expiry and expected `draw_version`;
3. checks current participant count;
4. verifies assignment count and one-to-one uniqueness;
5. verifies all giver/recipient IDs belong to the group;
6. rejects self-draws;
7. rechecks all current exclusions;
8. deletes stale reservations and old assignments;
9. inserts the complete replacement assignment set;
10. increments `draw_version`;
11. sets group status to `drawn`;
12. commits all changes together.

Any failure rolls the full PostgreSQL function call back.

The first draw requires `draft` + draw version `0`. A redraw requires `drawn` + draw version `>= 1` and the caller must supply the currently observed version.

## Concurrency boundary

Participant changes, exclusion changes and draw persistence all lock the same parent group row before structural mutation.

This gives the draw RPC a serialization point. If application code computes a draw from stale participant/exclusion data, PostgreSQL revalidation rejects it instead of storing a partial or outdated mapping.

## Organizer privacy

L5 deliberately adds no application method that lists `gift_group_assignments`.

The organizer can see:

- draw status;
- draw version;
- participants;
- wish counts;
- configured exclusion pairs.

The organizer cannot see:

- the complete giver -> recipient mapping;
- one participant's recipient;
- another participant's recovery capability.

## Redraw

Redraw replaces the whole mapping. It never edits one assignment manually.

The organizer must type exactly `OPNIEUW TREKKEN` in the UI. On success:

- all old assignments are deleted in the same transaction;
- all existing gift-item reservations are deleted because their giver/recipient meaning is stale;
- one complete new mapping is stored;
- `draw_version` increments.

## UI state

After drawing:

- joining is already blocked by the existing group state;
- participant removal is hidden and database-blocked;
- exclusion editing is hidden/database-blocked;
- participant wish-list editing remains locked;
- participants see only that the draw has happened;
- actual recipient reveal is deferred to L6.

## Database security

The new functions are `SECURITY DEFINER` with a fixed `search_path = public`.

Execution is revoked from:

- `public`;
- `anon`;
- `authenticated`.

Execution is granted only to `service_role`.

Browser clients still receive no direct gifting table/RPC privileges.

## Tests / acceptance

L5 unit tests cover:

- 2-person reciprocal draw;
- valid draws with 3, 10 and 50 participants;
- unique giver and recipient coverage;
- no self-draw;
- directed exclusions;
- impossible exclusions returning `NO_VALID_DRAW`;
- invalid participant identities;
- deterministic injected randomness for repeatable tests.

Repository quality checks must additionally pass migration manifest, database contract, lint, TypeScript, all tests and production build before merge.
