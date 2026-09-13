-- Lootje & Lijstje Insights/Admin GI3 interaction + funnel instrumentation.
-- Public interaction signals are written through a strict server endpoint. This
-- migration keeps the durable aggregate model anonymous: no browser identity,
-- participant identity, capability codes, raw URLs or draw pairings are stored.

create or replace function record_gifting_insight_event(
  p_event_key text,
  p_event_type text,
  p_occurred_at timestamptz default now(),
  p_source_surface text default null,
  p_group_id uuid default null,
  p_list_id uuid default null,
  p_product_external_key text default null,
  p_item_type text default null,
  p_occasion text default null,
  p_value_int integer default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows integer := 0;
  v_metric_date date;
begin
  if p_event_key is null or char_length(p_event_key) not between 1 and 240 then
    raise exception using errcode = '22023', message = 'GIFTING_INSIGHT_INVALID_EVENT_KEY';
  end if;

  if p_source_surface is not null and char_length(p_source_surface) not between 1 and 80 then
    raise exception using errcode = '22023', message = 'GIFTING_INSIGHT_INVALID_SOURCE_SURFACE';
  end if;

  v_metric_date := (coalesce(p_occurred_at, now()) at time zone 'Europe/Amsterdam')::date;

  insert into gifting_insight_events (
    event_key,
    occurred_at,
    event_type,
    source_surface,
    group_id,
    list_id,
    product_external_key,
    item_type,
    occasion,
    value_int,
    metadata
  ) values (
    p_event_key,
    coalesce(p_occurred_at, now()),
    p_event_type,
    p_source_surface,
    p_group_id,
    p_list_id,
    p_product_external_key,
    p_item_type,
    p_occasion,
    p_value_int,
    '{}'::jsonb
  )
  on conflict (event_key) do nothing;

  get diagnostics v_rows = row_count;
  if v_rows = 1 then
    perform increment_gifting_daily_metric(v_metric_date, p_event_type, 1, 'all', 'all');
    if p_source_surface is not null then
      perform increment_gifting_daily_metric(v_metric_date, p_event_type, 1, 'source_surface', p_source_surface);
    end if;
    return true;
  end if;

  return false;
end;
$$;

revoke all on function record_gifting_insight_event(text, text, timestamptz, text, uuid, uuid, text, text, text, integer)
  from public, anon, authenticated;
grant execute on function record_gifting_insight_event(text, text, timestamptz, text, uuid, uuid, text, text, text, integer)
  to service_role;

-- GI2 already stored source_surface on retained raw events, but did not yet write
-- per-surface rollups. Backfill those anonymous dimensions once before GI3 starts.
insert into gifting_daily_metrics (
  metric_date,
  metric_key,
  dimension_key,
  dimension_value,
  value,
  updated_at
)
select
  (occurred_at at time zone 'Europe/Amsterdam')::date as metric_date,
  event_type as metric_key,
  'source_surface' as dimension_key,
  source_surface as dimension_value,
  count(*)::bigint as value,
  now() as updated_at
from gifting_insight_events
where source_surface is not null
  and char_length(source_surface) between 1 and 180
group by 1, 2, 3, 4
on conflict (metric_date, metric_key, dimension_key, dimension_value)
do update set
  value = excluded.value,
  updated_at = now();

create or replace function gifting_insights_funnel(
  p_from date,
  p_to date
)
returns table (
  gifting_landing_views bigint,
  group_create_form_views bigint,
  groups_created bigint,
  group_invite_views bigint,
  participants_joined bigint,
  groups_three_participants_reached bigint,
  draws_completed bigint,
  list_create_form_views bigint,
  standalone_lists_created bigint,
  shared_list_views bigint,
  share_links_copied bigint,
  whatsapp_shares_clicked bigint,
  native_shares_invoked bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(sum(value) filter (where metric_key = 'gifting_landing_viewed'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'group_create_form_viewed'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'group_created'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'group_invite_viewed'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'participant_joined'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'group_three_participants_reached'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'draw_completed'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'list_create_form_viewed'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'standalone_list_created'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'shared_list_viewed'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'share_link_copied'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'whatsapp_share_clicked'), 0)::bigint,
    coalesce(sum(value) filter (where metric_key = 'native_share_invoked'), 0)::bigint
  from gifting_daily_metrics
  where dimension_key = 'all'
    and dimension_value = 'all'
    and metric_date between p_from and p_to;
$$;

revoke all on function gifting_insights_funnel(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_funnel(date, date) to service_role;

create or replace function gifting_insights_interactions_by_surface(
  p_from date,
  p_to date
)
returns table (
  event_type text,
  source_surface text,
  event_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    metric_key as event_type,
    dimension_value as source_surface,
    sum(value)::bigint as event_count
  from gifting_daily_metrics
  where dimension_key = 'source_surface'
    and metric_date between p_from and p_to
    and metric_key in (
      'gifting_landing_viewed',
      'group_create_form_viewed',
      'list_create_form_viewed',
      'group_invite_viewed',
      'shared_list_viewed',
      'share_link_copied',
      'whatsapp_share_clicked',
      'native_share_invoked'
    )
  group by metric_key, dimension_value
  order by event_count desc, metric_key, dimension_value;
$$;

revoke all on function gifting_insights_interactions_by_surface(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_interactions_by_surface(date, date) to service_role;

comment on function gifting_insights_funnel(date, date) is
  'Anonymous event totals for the Lootje & Lijstje interaction funnel. Counts are period events, not person-level cohorts.';

comment on function gifting_insights_interactions_by_surface(date, date) is
  'Anonymous Lootje & Lijstje interaction totals grouped only by approved source surface.';
