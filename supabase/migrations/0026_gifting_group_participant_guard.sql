-- Lootje & Lijstje L3 hardening.
-- Keep group membership structurally safe without introducing consumer auth or
-- additional persistence tables. This trigger serializes participant structure
-- changes per group and enforces the L0 draft/max-50 contract in PostgreSQL.

create or replace function enforce_gift_group_participant_structure()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid;
  v_status text;
  v_expires_at timestamptz;
  v_participant_count integer;
begin
  if tg_op = 'INSERT' then
    v_group_id := new.group_id;
  elsif tg_op = 'UPDATE' then
    if new.group_id <> old.group_id then
      raise exception using errcode = 'P0001', message = 'GIFT_GROUP_PARTICIPANT_MOVE_FORBIDDEN';
    end if;
    v_group_id := new.group_id;
  else
    v_group_id := old.group_id;
  end if;

  select status, expires_at
    into v_status, v_expires_at
    from gift_groups
   where id = v_group_id
   for update;

  -- A missing parent can occur during ON DELETE CASCADE from gift_groups.
  -- In that case PostgreSQL is already removing the whole group, so allow it.
  if not found then
    if tg_op = 'DELETE' then return old; end if;
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_NOT_FOUND';
  end if;

  if v_status <> 'draft' then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_STRUCTURE_LOCKED';
  end if;

  if tg_op in ('INSERT', 'UPDATE') and v_expires_at <= now() then
    raise exception using errcode = 'P0001', message = 'GIFT_GROUP_NOT_JOINABLE';
  end if;

  if tg_op = 'INSERT' then
    select count(*) into v_participant_count
      from gift_group_participants
     where group_id = v_group_id;

    if v_participant_count >= 50 then
      raise exception using errcode = 'P0001', message = 'GIFT_GROUP_PARTICIPANT_LIMIT';
    end if;

    return new;
  end if;

  if tg_op = 'UPDATE' then return new; end if;
  return old;
end;
$$;

revoke all on function enforce_gift_group_participant_structure() from public, anon, authenticated;
grant execute on function enforce_gift_group_participant_structure() to service_role;

drop trigger if exists gift_group_participant_structure_guard on gift_group_participants;
create trigger gift_group_participant_structure_guard
before insert or update or delete on gift_group_participants
for each row execute function enforce_gift_group_participant_structure();
