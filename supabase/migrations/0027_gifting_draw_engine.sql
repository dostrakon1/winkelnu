-- Lootje & Lijstje L5 — exclusions + atomic draw persistence.
-- The application computes a complete valid matching in pure domain code.
-- PostgreSQL revalidates the full draw under a group row lock and commits the
-- assignment set, draw_version and group status in one transaction.

create or replace function enforce_gift_group_exclusion_structure()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid;
  v_status text;
  v_expires_at timestamptz;
  v_participant_group uuid;
  v_recipient_group uuid;
begin
  if tg_op = 'DELETE' then
    v_group_id := old.group_id;
  else
    v_group_id := new.group_id;
  end if;

  select status, expires_at
    into v_status, v_expires_at
    from gift_groups
   where id = v_group_id
   for update;

  -- Allow ON DELETE CASCADE when the parent group is already gone.
  if not found then
    if tg_op = 'DELETE' then return old; end if;
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_NOT_FOUND';
  end if;

  if v_status <> 'draft' then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_STRUCTURE_LOCKED';
  end if;

  if v_expires_at <= now() then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_NOT_JOINABLE';
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    if new.participant_id = new.excluded_recipient_id then
      raise exception using errcode = 'P0001', message = 'GIFT_GROUP_EXCLUSION_SELF';
    end if;

    select group_id into v_participant_group
      from gift_group_participants
     where id = new.participant_id;

    select group_id into v_recipient_group
      from gift_group_participants
     where id = new.excluded_recipient_id;

    if v_participant_group is distinct from v_group_id
       or v_recipient_group is distinct from v_group_id then
      raise exception using errcode = 'P0001', message = 'GIFT_GROUP_EXCLUSION_PARTICIPANT_MISMATCH';
    end if;

    return new;
  end if;

  return old;
end;
$$;

revoke all on function enforce_gift_group_exclusion_structure() from public, anon, authenticated;
grant execute on function enforce_gift_group_exclusion_structure() to service_role;

drop trigger if exists gift_group_exclusion_structure_guard on gift_group_exclusions;
create trigger gift_group_exclusion_structure_guard
before insert or update or delete on gift_group_exclusions
for each row execute function enforce_gift_group_exclusion_structure();

create or replace function set_gift_group_exclusion_pair(
  p_group_id uuid,
  p_participant_a uuid,
  p_participant_b uuid,
  p_enabled boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_expires_at timestamptz;
  v_a_group uuid;
  v_b_group uuid;
begin
  if p_participant_a = p_participant_b then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_EXCLUSION_SELF';
  end if;

  select status, expires_at
    into v_status, v_expires_at
    from gift_groups
   where id = p_group_id
   for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_NOT_FOUND';
  end if;

  if v_status <> 'draft' then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_STRUCTURE_LOCKED';
  end if;

  if v_expires_at <= now() then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_NOT_JOINABLE';
  end if;

  select group_id into v_a_group from gift_group_participants where id = p_participant_a;
  select group_id into v_b_group from gift_group_participants where id = p_participant_b;

  if v_a_group is distinct from p_group_id or v_b_group is distinct from p_group_id then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_EXCLUSION_PARTICIPANT_MISMATCH';
  end if;

  if p_enabled then
    insert into gift_group_exclusions (group_id, participant_id, excluded_recipient_id)
    values
      (p_group_id, p_participant_a, p_participant_b),
      (p_group_id, p_participant_b, p_participant_a)
    on conflict (group_id, participant_id, excluded_recipient_id) do nothing;
  else
    delete from gift_group_exclusions
     where group_id = p_group_id
       and (
         (participant_id = p_participant_a and excluded_recipient_id = p_participant_b)
         or
         (participant_id = p_participant_b and excluded_recipient_id = p_participant_a)
       );
  end if;
end;
$$;

revoke all on function set_gift_group_exclusion_pair(uuid, uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function set_gift_group_exclusion_pair(uuid, uuid, uuid, boolean) to service_role;

create or replace function apply_gift_group_draw(
  p_group_id uuid,
  p_expected_draw_version integer,
  p_assignments jsonb,
  p_redraw boolean default false
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_current_version integer;
  v_expires_at timestamptz;
  v_participant_count integer;
  v_assignment_count integer;
  v_unique_givers integer;
  v_unique_recipients integer;
  v_next_version integer;
begin
  if jsonb_typeof(p_assignments) <> 'array' then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_INVALID_ASSIGNMENTS';
  end if;

  select status, draw_version, expires_at
    into v_status, v_current_version, v_expires_at
    from gift_groups
   where id = p_group_id
   for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_NOT_FOUND';
  end if;

  if v_expires_at <= now() or v_status = 'closed' then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_CLOSED';
  end if;

  if v_current_version <> p_expected_draw_version then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_STALE';
  end if;

  if p_redraw then
    if v_status <> 'drawn' or v_current_version < 1 then
      raise exception using errcode = 'P0001', message = 'GIFT_GROUP_REDRAW_STATE';
    end if;
  else
    if v_status <> 'draft' or v_current_version <> 0 then
      raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_STATE';
    end if;
  end if;

  select count(*) into v_participant_count
    from gift_group_participants
   where group_id = p_group_id;

  if v_participant_count < 2 then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_MIN_PARTICIPANTS';
  end if;

  if v_participant_count > 50 then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_PARTICIPANT_LIMIT';
  end if;

  select count(*) into v_assignment_count from jsonb_array_elements(p_assignments);
  if v_assignment_count <> v_participant_count then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_INVALID_ASSIGNMENTS';
  end if;

  with parsed as (
    select
      (item ->> 'giverParticipantId')::uuid as giver_id,
      (item ->> 'recipientParticipantId')::uuid as recipient_id
    from jsonb_array_elements(p_assignments) as item
  )
  select count(distinct giver_id), count(distinct recipient_id)
    into v_unique_givers, v_unique_recipients
    from parsed;

  if v_unique_givers <> v_participant_count or v_unique_recipients <> v_participant_count then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_INVALID_ASSIGNMENTS';
  end if;

  if exists (
    with parsed as (
      select
        (item ->> 'giverParticipantId')::uuid as giver_id,
        (item ->> 'recipientParticipantId')::uuid as recipient_id
      from jsonb_array_elements(p_assignments) as item
    )
    select 1
      from parsed a
      left join gift_group_participants giver
        on giver.id = a.giver_id and giver.group_id = p_group_id
      left join gift_group_participants recipient
        on recipient.id = a.recipient_id and recipient.group_id = p_group_id
     where giver.id is null
        or recipient.id is null
        or a.giver_id = a.recipient_id
  ) then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_INVALID_ASSIGNMENTS';
  end if;

  if exists (
    with parsed as (
      select
        (item ->> 'giverParticipantId')::uuid as giver_id,
        (item ->> 'recipientParticipantId')::uuid as recipient_id
      from jsonb_array_elements(p_assignments) as item
    )
    select 1
      from parsed a
      join gift_group_exclusions e
        on e.group_id = p_group_id
       and e.participant_id = a.giver_id
       and e.excluded_recipient_id = a.recipient_id
  ) then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_DRAW_EXCLUSION_VIOLATION';
  end if;

  v_next_version := v_current_version + 1;

  -- Reservations belong to a specific giver -> recipient relation and therefore
  -- become invalid on any redraw. For the first draw this is normally empty.
  delete from gift_item_reservations where group_id = p_group_id;
  delete from gift_group_assignments where group_id = p_group_id;

  insert into gift_group_assignments (
    group_id,
    draw_version,
    giver_participant_id,
    recipient_participant_id
  )
  select
    p_group_id,
    v_next_version,
    (item ->> 'giverParticipantId')::uuid,
    (item ->> 'recipientParticipantId')::uuid
  from jsonb_array_elements(p_assignments) as item;

  update gift_groups
     set status = 'drawn',
         draw_version = v_next_version,
         updated_at = now()
   where id = p_group_id;

  return v_next_version;
end;
$$;

revoke all on function apply_gift_group_draw(uuid, integer, jsonb, boolean) from public, anon, authenticated;
grant execute on function apply_gift_group_draw(uuid, integer, jsonb, boolean) to service_role;
