create table if not exists feed_import_orchestration (
  id uuid primary key default gen_random_uuid(),
  feed_source_id uuid not null unique references feed_sources(id) on delete cascade,
  next_run_at timestamptz,
  failure_count integer not null default 0 check (failure_count >= 0),
  last_error text,
  last_started_at timestamptz,
  last_succeeded_at timestamptz,
  lease_owner text,
  lease_token uuid,
  lease_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists feed_import_orchestration_next_run_idx
  on feed_import_orchestration(next_run_at)
  where lease_token is null;

create index if not exists feed_import_orchestration_lease_expiry_idx
  on feed_import_orchestration(lease_expires_at)
  where lease_token is not null;

create or replace function try_acquire_feed_import_lease(
  p_merchant_external_key text,
  p_source_key text,
  p_owner text,
  p_token uuid,
  p_acquired_at timestamptz,
  p_expires_at timestamptz
) returns table (
  merchant_external_key text,
  source_key text,
  next_run_at timestamptz,
  failure_count integer,
  last_error text,
  last_started_at timestamptz,
  last_succeeded_at timestamptz,
  lease_owner text,
  lease_token uuid,
  lease_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_feed_source_id uuid;
begin
  select fs.id into v_feed_source_id
  from feed_sources fs
  join merchants m on m.id = fs.merchant_id
  where m.external_key = p_merchant_external_key
    and fs.source_key = p_source_key
  limit 1;

  if v_feed_source_id is null then
    return;
  end if;

  insert into feed_import_orchestration(feed_source_id)
  values (v_feed_source_id)
  on conflict (feed_source_id) do nothing;

  update feed_import_orchestration fio
  set lease_owner = p_owner,
      lease_token = p_token,
      lease_expires_at = p_expires_at,
      last_started_at = p_acquired_at,
      updated_at = p_acquired_at
  where fio.feed_source_id = v_feed_source_id
    and (fio.lease_token is null or fio.lease_expires_at is null or fio.lease_expires_at <= p_acquired_at);

  if not found then
    return;
  end if;

  return query
  select m.external_key, fs.source_key, fio.next_run_at, fio.failure_count, fio.last_error,
         fio.last_started_at, fio.last_succeeded_at, fio.lease_owner, fio.lease_token, fio.lease_expires_at
  from feed_import_orchestration fio
  join feed_sources fs on fs.id = fio.feed_source_id
  join merchants m on m.id = fs.merchant_id
  where fio.feed_source_id = v_feed_source_id;
end;
$$;

create or replace function complete_feed_import_success(
  p_merchant_external_key text,
  p_source_key text,
  p_token uuid,
  p_finished_at timestamptz,
  p_next_run_at timestamptz
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update feed_import_orchestration fio
  set next_run_at = p_next_run_at,
      failure_count = 0,
      last_error = null,
      last_succeeded_at = p_finished_at,
      lease_owner = null,
      lease_token = null,
      lease_expires_at = null,
      updated_at = p_finished_at
  from feed_sources fs, merchants m
  where fio.feed_source_id = fs.id
    and fs.merchant_id = m.id
    and m.external_key = p_merchant_external_key
    and fs.source_key = p_source_key
    and fio.lease_token = p_token;
  return found;
end;
$$;

create or replace function complete_feed_import_failure(
  p_merchant_external_key text,
  p_source_key text,
  p_token uuid,
  p_finished_at timestamptz,
  p_next_run_at timestamptz,
  p_error text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update feed_import_orchestration fio
  set next_run_at = p_next_run_at,
      failure_count = fio.failure_count + 1,
      last_error = left(p_error, 2000),
      lease_owner = null,
      lease_token = null,
      lease_expires_at = null,
      updated_at = p_finished_at
  from feed_sources fs, merchants m
  where fio.feed_source_id = fs.id
    and fs.merchant_id = m.id
    and m.external_key = p_merchant_external_key
    and fs.source_key = p_source_key
    and fio.lease_token = p_token;
  return found;
end;
$$;

comment on table feed_import_orchestration is 'Per-feed scheduling, failure recovery and expiring worker lease state.';
