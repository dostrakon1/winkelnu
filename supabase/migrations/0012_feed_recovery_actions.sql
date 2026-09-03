create or replace function operator_retry_feed(
  p_merchant_external_key text,
  p_source_key text,
  p_now timestamptz
)
returns void
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
    and fs.is_active = true
    and m.is_active = true;

  if v_feed_source_id is null then
    raise exception 'Active feed source not found';
  end if;

  insert into feed_import_orchestration (feed_source_id, next_run_at)
  values (v_feed_source_id, p_now)
  on conflict (feed_source_id) do update
    set next_run_at = excluded.next_run_at,
        updated_at = now();
end;
$$;

create or replace function operator_pause_feed(
  p_merchant_external_key text,
  p_source_key text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update feed_sources fs
  set is_active = false,
      updated_at = now()
  from merchants m
  where fs.merchant_id = m.id
    and m.external_key = p_merchant_external_key
    and fs.source_key = p_source_key;

  if not found then
    raise exception 'Feed source not found';
  end if;
end;
$$;

create or replace function operator_resume_feed(
  p_merchant_external_key text,
  p_source_key text,
  p_now timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_feed_source_id uuid;
begin
  update feed_sources fs
  set is_active = true,
      updated_at = now()
  from merchants m
  where fs.merchant_id = m.id
    and m.external_key = p_merchant_external_key
    and fs.source_key = p_source_key
  returning fs.id into v_feed_source_id;

  if v_feed_source_id is null then
    raise exception 'Feed source not found';
  end if;

  insert into feed_import_orchestration (feed_source_id, next_run_at)
  values (v_feed_source_id, p_now)
  on conflict (feed_source_id) do update
    set next_run_at = excluded.next_run_at,
        updated_at = now();
end;
$$;

revoke all on function operator_retry_feed(text, text, timestamptz) from public, anon, authenticated;
revoke all on function operator_pause_feed(text, text) from public, anon, authenticated;
revoke all on function operator_resume_feed(text, text, timestamptz) from public, anon, authenticated;

grant execute on function operator_retry_feed(text, text, timestamptz) to service_role;
grant execute on function operator_pause_feed(text, text) to service_role;
grant execute on function operator_resume_feed(text, text, timestamptz) to service_role;
