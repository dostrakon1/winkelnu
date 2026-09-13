-- Lootje & Lijstje Insights/Admin GI5 health, retention and final control.
-- Adds aggregate-only operational health reads, rejection counters and explicit
-- insights retention. Consumer capability secrets and participant identity stay
-- outside the insights layer.

-- Count rejected gifting requests by action only. The keyed request bucket is
-- never copied into insights.
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
    perform increment_gifting_daily_metric(
      (now() at time zone 'Europe/Amsterdam')::date,
      'rate_limit_rejected',
      1,
      'action',
      p_action
    );
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

-- Keep the existing consumer-data cleanup contract intact while adding explicit
-- retention for the insights layer:
--   raw insight events: 90 days
--   product-key daily detail: 25 months
-- Aggregate daily business metrics remain available for long-term trends.
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

  delete from gifting_insight_events
   where occurred_at < now() - interval '90 days';

  delete from gifting_daily_metrics
   where dimension_key = 'product_external_key'
     and metric_date < (current_date - interval '25 months')::date;

  return query select
    v_groups_deleted,
    v_group_lists_deleted + v_standalone_lists_deleted,
    v_rate_buckets_deleted;
end;
$$;

revoke all on function cleanup_expired_gifting_data() from public, anon, authenticated;
grant execute on function cleanup_expired_gifting_data() to service_role;

create or replace function gifting_insights_health_overview(
  p_from date,
  p_to date
)
returns table (
  active_groups_nearing_expiry bigint,
  stale_active_groups bigint,
  stale_standalone_lists bigint,
  orphaned_group_lists bigint,
  expiry_mismatches bigint,
  drawn_assignment_mismatches bigint,
  groups_over_participant_limit bigint,
  rate_limit_rejections bigint,
  raw_event_retention_violations bigint,
  product_metric_retention_violations bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with participant_counts as (
    select group_id, count(*)::bigint as participant_count
      from gift_group_participants
     group by group_id
  ), assignment_counts as (
    select a.group_id, a.draw_version, count(*)::bigint as assignment_count
      from gift_group_assignments a
     group by a.group_id, a.draw_version
  )
  select
    (
      select count(*)::bigint
        from gift_groups g
       where g.status in ('draft', 'drawn')
         and g.expires_at > now()
         and g.expires_at <= now() + interval '14 days'
    ),
    (
      select count(*)::bigint
        from gift_groups g
       where g.status in ('draft', 'drawn')
         and g.expires_at <= now()
    ),
    (
      select count(*)::bigint
        from gift_lists l
       where l.owner_token_hash is not null
         and l.status = 'active'
         and l.expires_at <= now()
    ),
    (
      select count(*)::bigint
        from gift_lists l
       where l.owner_token_hash is null
         and not exists (
           select 1 from gift_group_participants p where p.gift_list_id = l.id
         )
    ),
    (
      select count(*)::bigint
        from gift_group_participants p
        join gift_groups g on g.id = p.group_id
        join gift_lists l on l.id = p.gift_list_id
       where abs(extract(epoch from (l.expires_at - g.expires_at))) > 1
    ),
    (
      select count(*)::bigint
        from gift_groups g
        left join participant_counts p on p.group_id = g.id
        left join assignment_counts a on a.group_id = g.id and a.draw_version = g.draw_version
       where g.status = 'drawn'
         and (
           g.draw_version < 1
           or coalesce(a.assignment_count, 0) <> coalesce(p.participant_count, 0)
         )
    ),
    (
      select count(*)::bigint
        from participant_counts p
       where p.participant_count > 50
    ),
    (
      select coalesce(sum(m.value), 0)::bigint
        from gifting_daily_metrics m
       where m.metric_date between p_from and p_to
         and m.metric_key = 'rate_limit_rejected'
         and m.dimension_key = 'action'
    ),
    (
      select count(*)::bigint
        from gifting_insight_events e
       where e.occurred_at < now() - interval '90 days'
    ),
    (
      select count(*)::bigint
        from gifting_daily_metrics m
       where m.dimension_key = 'product_external_key'
         and m.metric_date < (current_date - interval '25 months')::date
    );
$$;

revoke all on function gifting_insights_health_overview(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_health_overview(date, date) to service_role;

create or replace function gifting_insights_rate_limit_rejections(
  p_from date,
  p_to date
)
returns table (
  action text,
  rejection_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    m.dimension_value as action,
    sum(m.value)::bigint as rejection_count
  from gifting_daily_metrics m
  where m.metric_date between p_from and p_to
    and m.metric_key = 'rate_limit_rejected'
    and m.dimension_key = 'action'
  group by m.dimension_value
  order by rejection_count desc, action
  limit 50;
$$;

revoke all on function gifting_insights_rate_limit_rejections(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_rate_limit_rejections(date, date) to service_role;

create or replace function gifting_insights_cleanup_status()
returns table (
  configured boolean,
  active boolean,
  schedule text,
  last_started_at timestamptz,
  last_finished_at timestamptz,
  last_status text,
  last_success_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, cron
as $$
declare
  v_job_id bigint;
begin
  if to_regclass('cron.job') is null then
    return query select false, false, null::text, null::timestamptz, null::timestamptz, null::text, null::timestamptz;
    return;
  end if;

  select j.jobid, j.active, j.schedule
    into v_job_id, active, schedule
    from cron.job j
   where j.jobname = 'winkelnu-gifting-retention'
   order by j.jobid desc
   limit 1;

  if v_job_id is null then
    return query select false, false, null::text, null::timestamptz, null::timestamptz, null::text, null::timestamptz;
    return;
  end if;

  configured := true;

  if to_regclass('cron.job_run_details') is not null then
    select r.start_time, r.end_time, r.status
      into last_started_at, last_finished_at, last_status
      from cron.job_run_details r
     where r.jobid = v_job_id
     order by r.start_time desc
     limit 1;

    select max(r.end_time)
      into last_success_at
      from cron.job_run_details r
     where r.jobid = v_job_id
       and r.status = 'succeeded';
  end if;

  return next;
end;
$$;

revoke all on function gifting_insights_cleanup_status() from public, anon, authenticated;
grant execute on function gifting_insights_cleanup_status() to service_role;

comment on function gifting_insights_health_overview(date, date) is
  'GI5 aggregate-only gifting integrity, expiry, abuse and insights-retention health checks.';
comment on function gifting_insights_rate_limit_rejections(date, date) is
  'GI5 aggregate rate-limit rejection counts by action. No bucket/request identity is exposed.';
comment on function gifting_insights_cleanup_status() is
  'GI5 safe pg_cron retention-job health summary. Command text and consumer records are not exposed.';
