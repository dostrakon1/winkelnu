alter table import_runs
  add column if not exists correlation_id text;

create index if not exists import_runs_correlation_id_idx
  on import_runs(correlation_id)
  where correlation_id is not null;

create or replace function renew_feed_import_lease(
  p_merchant_external_key text,
  p_source_key text,
  p_token uuid,
  p_renewed_at timestamptz,
  p_expires_at timestamptz
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update feed_import_orchestration fio
  set lease_expires_at = p_expires_at,
      updated_at = p_renewed_at
  from feed_sources fs, merchants m
  where fio.feed_source_id = fs.id
    and fs.merchant_id = m.id
    and m.external_key = p_merchant_external_key
    and fs.source_key = p_source_key
    and fio.lease_token = p_token
    and fio.lease_expires_at is not null
    and fio.lease_expires_at > p_renewed_at;
  return found;
end;
$$;

revoke all on function renew_feed_import_lease(text, text, uuid, timestamptz, timestamptz) from public;
grant execute on function renew_feed_import_lease(text, text, uuid, timestamptz, timestamptz) to service_role;

comment on column import_runs.correlation_id is 'Trigger/batch correlation identifier propagated from the operations entrypoint.';
comment on function renew_feed_import_lease(text, text, uuid, timestamptz, timestamptz) is 'Extends a currently-owned unexpired feed import lease for long-running paginated imports.';
