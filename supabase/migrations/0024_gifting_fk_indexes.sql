-- Cover gifting foreign keys used by cascade/delete integrity checks and later draw queries.

create index gift_group_assignments_giver_participant_idx
  on gift_group_assignments (giver_participant_id);

create index gift_group_assignments_recipient_participant_idx
  on gift_group_assignments (recipient_participant_id);

create index gift_group_exclusions_participant_idx
  on gift_group_exclusions (participant_id);

create index gift_group_exclusions_excluded_recipient_idx
  on gift_group_exclusions (excluded_recipient_id);

create index gift_item_reservations_reserved_by_participant_idx
  on gift_item_reservations (reserved_by_participant_id);
