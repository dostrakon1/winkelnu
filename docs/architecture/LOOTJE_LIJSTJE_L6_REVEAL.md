# Lootje & Lijstje — L6 Reveal & Reservation Contract

Status: implementation baseline for issue #98.

## Scope

L6 completes the participant-facing result flow after L5 has persisted a valid draw.

A participant can:

1. open `/lootje-lijstje/groep/[groupCode]/mijn/lootje`;
2. reveal only their own current recipient;
3. view that recipient's existing gift list;
4. continue into existing Winkelnu product/search flows;
5. mark one or more recipient wishes as `geregeld`;
6. remove that private marker again.

## Privacy boundary

The reveal is resolved from the participant grant already present in the signed `wn_gift_access` cookie. The browser never supplies an arbitrary giver ID.

`get_gift_group_participant_reveal(group_id, giver_participant_id)` is service-role only and returns at most one current mapping:

- current draw version;
- current recipient participant ID;
- recipient display name;
- recipient gift-list ID.

There is no organizer RPC that returns the complete giver-to-recipient mapping.

The recipient-facing participant/list DTO never contains reservation state.

## Reservation invariant

`gift_item_reservations` is private giver state. A reservation is valid only when:

- the group is currently `drawn`;
- the reserver is a current giver in the current `draw_version`;
- the item belongs to the current recipient's gift list.

This is enforced twice:

1. by the service-role `set_gift_item_reservation(...)` RPC;
2. by `gift_item_reservation_validity_guard` on direct inserts/updates.

A redraw deletes all reservations before replacing assignments, because previous giver-to-recipient state becomes invalid.

## Catalogue behaviour

Recipient wishes reuse the existing L1/L2 list model.

- Winkelnu products resolve through the existing catalog application layer.
- Current product pages/offers remain the shopping path.
- Missing products keep their stored snapshot and alternative-search fallback.
- Text wishes and external HTTPS links continue to work.
- No affiliate URL is copied into gifting tables.

## Empty list behaviour

If the recipient has no wishes, the reveal page does not dead-end. It links the giver back into Winkelnu search to discover a gift independently.

## Search/analytics

The reveal route remains inside the existing `/lootje-lijstje` privacy boundary:

- feature-gated until explicit release;
- `noindex, nofollow`;
- excluded from URL-level Web Analytics by the existing gifting exclusion.

## L6 database change

Migration `0028_gifting_reveal_reservations.sql` adds:

- `get_gift_group_participant_reveal(uuid, uuid)`;
- `enforce_gift_item_reservation_validity()`;
- `gift_item_reservation_validity_guard`;
- `set_gift_item_reservation(uuid, uuid, uuid, boolean)`.

All new functions revoke `public`, `anon` and `authenticated` execution and grant only `service_role`.

## Verified database behaviour

The implementation is expected to verify with rollback-only test data that:

- giver A reveals only recipient B;
- A can reserve an item on B's list;
- A cannot reserve an item on A's own/wrong list;
- a redraw clears previous reservations;
- rollback leaves no test data behind.

## Deferred to L7

- final privacy/legal wording review;
- retention cleanup implementation/verification;
- complete mobile/edge-case QA;
- release-secret and feature-gate activation plan;
- production acceptance and live activation.
