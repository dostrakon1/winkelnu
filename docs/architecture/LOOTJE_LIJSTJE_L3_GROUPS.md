# Lootje & Lijstje — L3 Groups & Participants

Status: **Implemented behind the existing gifting release gate.**

Date: 2026-09-13

Umbrella issue: #98 — `Winkelnu Lootje & Lijstje MVP`

## Scope

L3 adds the first real `Lootje` flow without introducing accounts or a new product/database subsystem:

- create a gift group;
- organizer is added as the first participant by default;
- share one opaque invitation URL;
- participants join with display name only;
- every participant receives one group-linked wish list;
- participant can manage text wishes, external links and existing Winkelnu products;
- organizer can see participant names and wish counts;
- organizer can remove participants while the group is still draft;
- no draw mapping exists yet.

## Routes

- `/lootje-lijstje/groep/nieuw` — create group.
- `/lootje-lijstje/groep/[groupCode]` — invitation / join surface.
- `/lootje-lijstje/groep/[groupCode]/beheer` — organizer-only management surface.
- `/lootje-lijstje/groep/[groupCode]/mijn` — participant-only pre-draw surface and own list editor.

All group-specific routes are `noindex, nofollow`. The existing `/lootje-lijstje` layout release gate still protects the complete module.

## No-login access

L3 uses the already approved signed `wn_gift_access` cookie:

- organizer grant entity = `gift_groups.id`;
- participant grant entity = `gift_group_participants.id`;
- invite/group code is read/join-only and never confers organizer or participant authority;
- no email, telephone number, password or Supabase Auth consumer is introduced.

Raw organizer and participant recovery tokens are generated only to seed their SHA-256 database hashes in L3 and are not exposed. Rotation + recovery-link UX is deliberately L4 scope. Until L4, current-session grants are sufficient because the complete gifting feature remains unreleased.

## Participant list ownership

Participant lists keep `owner_token_hash = null`. They are managed through the participant grant, not by silently creating a second list-owner capability.

The raw participant list share code is not persisted or exposed. This prevents the group implementation from weakening the L0 rule that share codes are stored only as hashes. The participant edits the list from the capability-protected `/mijn` route.

## Database safety

No eighth gifting table is added. L3 reuses the L0 seven-table model.

Migration `0026_gifting_group_participant_guard.sql` adds a PostgreSQL trigger to `gift_group_participants` which:

- serializes participant structure changes on the parent group row;
- permits insert/update/delete only while the group is `draft`;
- rejects joins to expired groups;
- enforces the hard maximum of 50 participants under concurrency;
- rejects moving an existing participant to another group;
- still allows normal `ON DELETE CASCADE` when the complete parent group is removed.

The existing unique expression index on `(group_id, lower(btrim(display_name)))` remains the authoritative race-safe duplicate-name guard.

## Privacy boundary

Public invitation DTOs contain only group metadata and participant count. They do not contain participant names or wish data.

Participant surfaces can see:

- group metadata;
- participant display names;
- wish counts;
- their own full wish list.

Organizer surfaces can see:

- group metadata;
- participant display names;
- wish counts.

Organizer surfaces do not receive hidden gift choices, reservations or future draw assignments.

## Deliberately deferred

L3 does **not** implement:

- organizer/participant recovery links and bootstrap token exchange (`L4`);
- exclusion pairs (`L5` preparation);
- draw engine or assignments (`L5`);
- reveal and reservation state (`L6`);
- public production activation / final retention acceptance (`L7`).

## Acceptance criteria

L3 is complete when:

1. one visitor can create a group without an account;
2. organizer is participant #1 and receives both current-session grants;
3. invitation link can be copied/shared without leaking organizer authority;
4. another browser can join with display name only;
5. duplicate normalized names are rejected;
6. participant #51 is rejected safely under concurrency;
7. every participant has exactly one group-linked list;
8. participant can add/edit/delete all L1/L2 wish types from `/mijn`;
9. organizer can inspect participant readiness and remove a participant in draft state;
10. no draw result can be created or viewed in L3;
11. migration manifest, database contract, lint, typecheck, tests and production build all pass.
