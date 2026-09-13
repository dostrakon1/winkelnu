-- Lootje & Lijstje L6 — participant reveal + reservation safety.
-- Reveal is scoped to one current giver. Reservation writes are accepted only
-- when the item belongs to that giver's current drawn recipient.

create or replace function get_gift_group_participant_reveal(
  p_group_id uuid,
  p_giver_participant_id uuid
)
returns table (
  draw_version integer,
  recipient_participant_id uuid,
  recipient_display_name text,
  recipient_gift_list_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    g.draw_version,
    recipient.id,
    recipient.display_name,
    recipient.gift_list_id
  from gift_groups g
  join gift_group_assignments a
    on a.group_id = g.id
   and a.draw_version = g.draw_version
   and a.giver_participant_id = p_giver_participant_id
  join gift_group_participants giver
    on giver.id = a.giver_participant_id
   and giver.group_id = g.id
  join gift_group_participants recipient
    on recipient.id = a.recipient_participant_id
   and recipient.group_id = g.id
  where g.id = p_group_id
    and g.status = 'drawn'
    and g.expires_at > now();
end;
$$;

revoke all on function get_gift_group_participant_reveal(uuid, uuid) from public, anon, authenticated;
grant execute on function get_gift_group_participant_reveal(uuid, uuid) to service_role;

create or replace function enforce_gift_item_reservation_validity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_draw_version integer;
  v_recipient_list_id uuid;
  v_item_list_id uuid;
begin
  select status, draw_version
    into v_status, v_draw_version
    from gift_groups
   where id = new.group_id
   for share;

  if not found or v_status <> 'drawn' or v_draw_version < 1 then
    raise exception using errcode = 'P0001', message = 'GIFT_RESERVATION_GROUP_NOT_DRAWN';
  end if;

  select recipient.gift_list_id
    into v_recipient_list_id
    from gift_group_assignments a
    join gift_group_participants giver
      on giver.id = a.giver_participant_id
     and giver.group_id = a.group_id
    join gift_group_participants recipient
      on recipient.id = a.recipient_participant_id
     and recipient.group_id = a.group_id
   where a.group_id = new.group_id
     and a.draw_version = v_draw_version
     and a.giver_participant_id = new.reserved_by_participant_id;

  if not found then
    raise exception using errcode = 'P0001', message = 'GIFT_RESERVATION_GIVER_NOT_ASSIGNED';
  end if;

  select gift_list_id
    into v_item_list_id
    from gift_list_items
   where id = new.gift_list_item_id;

  if not found or v_item_list_id is distinct from v_recipient_list_id then
    raise exception using errcode = 'P0001', message = 'GIFT_RESERVATION_ITEM_NOT_RECIPIENT';
  end if;

  return new;
end;
$$;

revoke all on function enforce_gift_item_reservation_validity() from public, anon, authenticated;
grant execute on function enforce_gift_item_reservation_validity() to service_role;

drop trigger if exists gift_item_reservation_validity_guard on gift_item_reservations;
create trigger gift_item_reservation_validity_guard
before insert or update on gift_item_reservations
for each row execute function enforce_gift_item_reservation_validity();

create or replace function set_gift_item_reservation(
  p_group_id uuid,
  p_reserved_by_participant_id uuid,
  p_gift_list_item_id uuid,
  p_reserved boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_draw_version integer;
  v_recipient_list_id uuid;
  v_item_list_id uuid;
begin
  select status, draw_version
    into v_status, v_draw_version
    from gift_groups
   where id = p_group_id
   for update;

  if not found or v_status <> 'drawn' or v_draw_version < 1 then
    raise exception using errcode = 'P0001', message = 'GIFT_RESERVATION_GROUP_NOT_DRAWN';
  end if;

  select recipient.gift_list_id
    into v_recipient_list_id
    from gift_group_assignments a
    join gift_group_participants giver
      on giver.id = a.giver_participant_id
     and giver.group_id = a.group_id
    join gift_group_participants recipient
      on recipient.id = a.recipient_participant_id
     and recipient.group_id = a.group_id
   where a.group_id = p_group_id
     and a.draw_version = v_draw_version
     and a.giver_participant_id = p_reserved_by_participant_id;

  if not found then
    raise exception using errcode = 'P0001', message = 'GIFT_RESERVATION_GIVER_NOT_ASSIGNED';
  end if;

  select gift_list_id
    into v_item_list_id
    from gift_list_items
   where id = p_gift_list_item_id;

  if not found or v_item_list_id is distinct from v_recipient_list_id then
    raise exception using errcode = 'P0001', message = 'GIFT_RESERVATION_ITEM_NOT_RECIPIENT';
  end if;

  if p_reserved then
    insert into gift_item_reservations (
      group_id,
      gift_list_item_id,
      reserved_by_participant_id
    )
    values (
      p_group_id,
      p_gift_list_item_id,
      p_reserved_by_participant_id
    )
    on conflict (group_id, gift_list_item_id)
    do update set reserved_by_participant_id = excluded.reserved_by_participant_id;
  else
    delete from gift_item_reservations
     where group_id = p_group_id
       and gift_list_item_id = p_gift_list_item_id
       and reserved_by_participant_id = p_reserved_by_participant_id;
  end if;

  return true;
end;
$$;

revoke all on function set_gift_item_reservation(uuid, uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function set_gift_item_reservation(uuid, uuid, uuid, boolean) to service_role;
