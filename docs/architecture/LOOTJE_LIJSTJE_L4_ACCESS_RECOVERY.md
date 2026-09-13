# Lootje & Lijstje — L4 No-login Access Recovery

Status: implementation baseline for issue #98.

Date: 2026-09-13

## Scope

L4 completes recovery of group access without introducing consumer accounts, passwords, email addresses or phone numbers.

Two group capabilities remain deliberately separate:

- `group-organizer` — manage group metadata/participants and later draw controls;
- `group-participant` — access exactly one participant identity and its group-linked wish list.

An organizer who is also a participant therefore has two independent grants and may save two independent recovery links. This is intentional: organizer authority must never imply the ability to impersonate arbitrary participants.

## Recovery-link creation

A recovery link can only be generated while the current browser already has the corresponding signed grant.

Organizer flow:

1. organizer opens `/lootje-lijstje/groep/[groupCode]/beheer`;
2. server action verifies `group-organizer` grant;
3. generate 32 random bytes with Node CSPRNG;
4. persist only `SHA-256(token)` to `gift_groups.organizer_token_hash`;
5. return one opaque recovery URL to the browser;
6. generating a new organizer link invalidates the previous organizer link.

Participant flow is identical except that the hash is persisted to `gift_group_participants.participant_token_hash` for the current participant only.

Raw recovery tokens are never intentionally logged or stored in PostgreSQL.

## Bootstrap exchange

The existing route `/lootje-lijstje/toegang/[token]` now supports:

- standalone list-owner recovery with `?lijst=[shareCode]`;
- group organizer/participant recovery with `?groep=[groupCode]`.

The handler rejects requests that provide both scopes or neither scope.

For group recovery the server:

1. hashes the group code and resolves an active group;
2. hashes the raw recovery token;
3. checks the organizer-token hash first;
4. otherwise checks participant-token hashes only inside the resolved group;
5. adds exactly one corresponding signed grant to `wn_gift_access`;
6. issues a `303` redirect to a canonical token-free page.

Redirects:

- organizer -> `/lootje-lijstje/groep/[groupCode]/beheer?toegang=hersteld`
- participant -> `/lootje-lijstje/groep/[groupCode]/mijn?toegang=hersteld`

The bootstrap response remains `no-store`, `noindex` and `Referrer-Policy: no-referrer` so the recovery token is not propagated as a referrer.

## Security invariants

- group invitation code alone never grants private access;
- organizer token never grants participant access;
- participant token never grants organizer access;
- participant token lookup is constrained to the group from the supplied invitation code;
- removed participants lose recovery access automatically because their participant row is deleted;
- closed/expired groups reject recovery;
- token rotation affects only one capability type/entity;
- the signed cookie stores opaque IDs and grant kinds, never names, wishes or raw tokens;
- gifting routes remain excluded from URL-level analytics.

## UX

Organizer management page shows `Bewaar je beheer-toegang`.

Participant page shows `Bewaar je deelnemers-toegang`.

Both explain that the link is private and that creating a replacement invalidates the previous link for that right.

When a browser lacks access, the private page explains that the saved recovery link can restore access without an account.

## Database impact

L4 requires no migration and no new tables.

It reuses the existing unique token-hash columns created by the L0/L1 database foundation:

- `gift_groups.organizer_token_hash`
- `gift_group_participants.participant_token_hash`

The existing RLS/service-role-only persistence boundary remains unchanged.

## Deferred

L4 does not add:

- exclusion pairs;
- draw calculation;
- assignment persistence;
- recipient reveal;
- reservation state;
- public release activation.

Those remain L5–L7 responsibilities.
