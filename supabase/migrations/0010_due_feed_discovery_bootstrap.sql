create or replace function list_due_feed_imports(
  p_now timestamptz,
  p_limit integer default 10
)
returns table (
  merchant_external_key text,
  source_key text,
  next_run_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    m.external_key as merchant_external_key,
    fs.source_key,
    fio.next_run_at
  from feed_sources fs
  join merchants m on m.id = fs.merchant_id
  left join feed_import_orchestration fio on fio.feed_source_id = fs.id
  where fs.is_active = true
    and m.is_active = true
    and (fio.id is null or fio.next_run_at is null or fio.next_run_at <= p_now)
    and (
      fio.id is null
      or fio.lease_token is null
      or fio.lease_expires_at is null
      or fio.lease_expires_at <= p_now
    )
  order by fio.next_run_at nulls first, fs.created_at
  limit least(greatest(p_limit, 1), 50);
$$;

revoke all on function list_due_feed_imports(timestamptz, integer) from public;
revoke all on function list_due_feed_imports(timestamptz, integer) from anon;
revoke all on function list_due_feed_imports(timestamptz, integer) from authenticated;
grant execute on function list_due_feed_imports(timestamptz, integer) to service_role;
