-- Lootje & Lijstje L7 — retention, deletion and abuse protection.
-- Consumer gift data remains server-only. Rate limiting stores only a keyed hash,
-- never the raw request address.

create extension if not exists pg_cron;

create table gifting_rate_limit_buckets (
  bucket_key text not null,
  action text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (bucket_key, action),
  constraint gifting_rate_limit_bucket_key_check check (bucket_key ~ '^[a-f0-9]{64}$'),
  constraint gifting_rate_limit_action_check check (char_length(action) between 1 and 64),
  constraint gifting_rate_limit_count_check check (request_count >= 0)
);

create index gifting_rate_limit_window_idx on gifting_rate_limit_buckets (window_started_at);

alter table gifting_rate_limit_buckets enable row level security;
revoke all on table gifting_rate_limit_buckets from public, anon, authenticated;
grant select, insert, update, delete on table gifting_rate_limit_buckets to service_role;

create or replace function consume_gifting_rate_limit(
  p_bucket_key text,
  p_action text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_started_at timestamptz;
  v_request_count integer;
begin
  if p_bucket_key !~ '^[a-f0-9]{64}$'
     or char_length(p_action) not between 1 and 64
     or p_limit not between 1 and 10000
     or p_window_seconds not between 60 and 86400 then
    raise exception using errcode = 'P0001', message = 'GIFT_RATE_LIMIT_INVALID_ARGUMENTS';
  end if;

  insert into gifting_rate_limit_buckets (
    bucket_key,
    action,
    window_started_at,
    request_count,
    updated_at
  )
  values (p_bucket_key, p_action, now(), 0, now())
  on conflict (bucket_key, action) do nothing;

  select window_started_at, request_count
    into v_window_started_at, v_request_count
    from gifting_rate_limit_buckets
   where bucket_key = p_bucket_key
     and action = p_action
   for update;

  if v_window_started_at <= now() - make_interval(secs => p_window_seconds) then
    update gifting_rate_limit_buckets
       set window_started_at = now(),
           request_count = 1,
           updated_at = now()
     where bucket_key = p_bucket_key
       and action = p_action;
    return true;
  end if;

  if v_request_count >= p_limit then
    return false;
  end if;

  update gifting_rate_limit_buckets
     set request_count = request_count + 1,
         updated_at = now()
   where bucket_key = p_bucket_key
     and action = p_action;

  return true;
end;
$$;

revoke all on function consume_gifting_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function consume_gifting_rate_limit(text, text, integer, integer) to service_role;

create or replace function normalize_gift_group_expiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.event_date is not null then
    new.expires_at := ((new.event_date + 120)::timestamp at time zone 'UTC');
  elsif tg_op = 'INSERT' then
    new.expires_at := now() + interval '180 days';
  elsif old.event_date is distinct from new.event_date then
    new.expires_at := now() + interval '180 days';
  end if;

  return new;
end;
$$;

revoke all on function normalize_gift_group_expiry() from public, anon, authenticated;
grant execute on function normalize_gift_group_expiry() to service_role;

drop trigger if exists gift_group_expiry_normalizer on gift_groups;
create trigger gift_group_expiry_normalizer
before insert or update of event_date on gift_groups
for each row execute function normalize_gift_group_expiry();

create or replace function refresh_gift_group_retention(p_group_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expires_at timestamptz;
begin
  select case
           when event_date is not null then ((event_date + 120)::timestamp at time zone 'UTC')
           else now() + interval '180 days'
         end
    into v_expires_at
    from gift_groups
   where id = p_group_id
     and status <> 'closed';

  if not found then
    return null;
  end if;

  update gift_groups
     set expires_at = v_expires_at,
         updated_at = now()
   where id = p_group_id;

  update gift_lists l
     set expires_at = v_expires_at
    from gift_group_participants p
   where p.group_id = p_group_id
     and p.gift_list_id = l.id;

  return v_expires_at;
end;
$$;

revoke all on function refresh_gift_group_retention(uuid) from public, anon, authenticated;
grant execute on function refresh_gift_group_retention(uuid) to service_role;

create or replace function touch_gift_group_retention_direct()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid;
begin
  if tg_op = 'DELETE' then
    v_group_id := old.group_id;
  else
    v_group_id := new.group_id;
  end if;

  if v_group_id is not null then
    perform refresh_gift_group_retention(v_group_id);
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function touch_gift_group_retention_direct() from public, anon, authenticated;
grant execute on function touch_gift_group_retention_direct() to service_role;

create or replace function touch_gift_group_retention_from_list_item()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_list_id uuid;
  v_group_id uuid;
begin
  if tg_op = 'DELETE' then
    v_list_id := old.gift_list_id;
  else
    v_list_id := new.gift_list_id;
  end if;

  select group_id
    into v_group_id
    from gift_group_participants
   where gift_list_id = v_list_id;

  if found then
    perform refresh_gift_group_retention(v_group_id);
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function touch_gift_group_retention_from_list_item() from public, anon, authenticated;
grant execute on function touch_gift_group_retention_from_list_item() to service_role;

drop trigger if exists gift_group_participant_retention_touch on gift_group_participants;
create trigger gift_group_participant_retention_touch
after insert or update or delete on gift_group_participants
for each row execute function touch_gift_group_retention_direct();

drop trigger if exists gift_group_exclusion_retention_touch on gift_group_exclusions;
create trigger gift_group_exclusion_retention_touch
after insert or update or delete on gift_group_exclusions
for each row execute function touch_gift_group_retention_direct();

drop trigger if exists gift_group_assignment_retention_touch on gift_group_assignments;
create trigger gift_group_assignment_retention_touch
after insert or update or delete on gift_group_assignments
for each row execute function touch_gift_group_retention_direct();

drop trigger if exists gift_item_reservation_retention_touch on gift_item_reservations;
create trigger gift_item_reservation_retention_touch
after insert or update or delete on gift_item_reservations
for each row execute function touch_gift_group_retention_direct();

drop trigger if exists gift_list_item_group_retention_touch on gift_list_items;
create trigger gift_list_item_group_retention_touch
after insert or update or delete on gift_list_items
for each row execute function touch_gift_group_retention_from_list_item();

create or replace function delete_gift_group_with_lists(p_group_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_list_ids uuid[];
  v_deleted integer;
begin
  select coalesce(array_agg(gift_list_id), '{}'::uuid[])
    into v_list_ids
    from gift_group_participants
   where group_id = p_group_id;

  delete from gift_groups where id = p_group_id;
  get diagnostics v_deleted = row_count;

  if v_deleted = 0 then
    return false;
  end if;

  if cardinality(v_list_ids) > 0 then
    delete from gift_lists where id = any(v_list_ids);
  end if;

  return true;
end;
$$;

revoke all on function delete_gift_group_with_lists(uuid) from public, anon, authenticated;
grant execute on function delete_gift_group_with_lists(uuid) to service_role;

create or replace function cleanup_expired_gifting_data()
returns table (
  groups_deleted integer,
  lists_deleted integer,
  rate_limit_buckets_deleted integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_ids uuid[];
  v_group_list_ids uuid[];
  v_groups_deleted integer := 0;
  v_group_lists_deleted integer := 0;
  v_standalone_lists_deleted integer := 0;
  v_rate_buckets_deleted integer := 0;
begin
  select
    coalesce(array_agg(distinct g.id), '{}'::uuid[]),
    coalesce(array_agg(distinct p.gift_list_id) filter (where p.gift_list_id is not null), '{}'::uuid[])
    into v_group_ids, v_group_list_ids
    from gift_groups g
    left join gift_group_participants p on p.group_id = g.id
   where g.expires_at <= now();

  if cardinality(v_group_ids) > 0 then
    delete from gift_groups where id = any(v_group_ids);
    get diagnostics v_groups_deleted = row_count;
  end if;

  if cardinality(v_group_list_ids) > 0 then
    delete from gift_lists where id = any(v_group_list_ids);
    get diagnostics v_group_lists_deleted = row_count;
  end if;

  delete from gift_lists l
   where l.expires_at <= now()
     and not exists (
       select 1
         from gift_group_participants p
        where p.gift_list_id = l.id
     );
  get diagnostics v_standalone_lists_deleted = row_count;

  delete from gifting_rate_limit_buckets
   where window_started_at < now() - interval '2 days';
  get diagnostics v_rate_buckets_deleted = row_count;

  return query select
    v_groups_deleted,
    v_group_lists_deleted + v_standalone_lists_deleted,
    v_rate_buckets_deleted;
end;
$$;

revoke all on function cleanup_expired_gifting_data() from public, anon, authenticated;
grant execute on function cleanup_expired_gifting_data() to service_role;

-- Bring any pre-release test records in line with the final retention contract.
update gift_groups
   set expires_at = case
     when event_date is not null then ((event_date + 120)::timestamp at time zone 'UTC')
     else greatest(expires_at, updated_at + interval '180 days')
   end;

update gift_lists l
   set expires_at = g.expires_at
  from gift_group_participants p
  join gift_groups g on g.id = p.group_id
 where p.gift_list_id = l.id;

-- Database-local daily cleanup: no Vercel function invocation is required.
do $$
declare
  v_job_id bigint;
begin
  select jobid
    into v_job_id
    from cron.job
   where jobname = 'winkelnu-gifting-retention'
   limit 1;

  if v_job_id is not null then
    perform cron.unschedule(v_job_id);
  end if;

  perform cron.schedule(
    'winkelnu-gifting-retention',
    '17 3 * * *',
    'select * from public.cleanup_expired_gifting_data();'
  );
end;
$$;
