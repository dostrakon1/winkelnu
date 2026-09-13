-- Lootje & Lijstje Insights/Admin GI1 foundation.
-- Adds privacy-minimal insight storage plus safe aggregate read functions for the
-- internal dashboard. Consumer gifting tables remain the source of truth.

create table gifting_insight_events (
  id uuid primary key default gen_random_uuid(),
  event_key text unique,
  occurred_at timestamptz not null default now(),
  event_type text not null,
  source_surface text,
  group_id uuid references gift_groups(id) on delete set null,
  list_id uuid references gift_lists(id) on delete set null,
  product_external_key text,
  item_type text,
  occasion text,
  value_int integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint gifting_insight_events_type_check check (event_type in (
    'group_created',
    'participant_joined',
    'participant_removed',
    'draw_completed',
    'redraw_completed',
    'standalone_list_created',
    'gift_item_added',
    'winkelnu_product_added',
    'gift_item_deleted',
    'reservation_created',
    'reservation_released',
    'group_deleted',
    'standalone_list_deleted',
    'gifting_landing_viewed',
    'group_create_form_viewed',
    'list_create_form_viewed',
    'group_invite_viewed',
    'shared_list_viewed',
    'share_link_copied',
    'whatsapp_share_clicked',
    'native_share_invoked'
  )),
  constraint gifting_insight_events_source_surface_check check (
    source_surface is null or char_length(source_surface) between 1 and 80
  ),
  constraint gifting_insight_events_product_key_check check (
    product_external_key is null or char_length(product_external_key) between 1 and 180
  ),
  constraint gifting_insight_events_item_type_check check (
    item_type is null or item_type in ('winkelnu_product', 'external_link', 'text')
  ),
  constraint gifting_insight_events_occasion_check check (
    occasion is null or occasion in ('sinterklaas', 'kerst', 'verjaardag', 'anders')
  ),
  constraint gifting_insight_events_metadata_object_check check (jsonb_typeof(metadata) = 'object')
);

create index gifting_insight_events_time_idx
  on gifting_insight_events (occurred_at desc);
create index gifting_insight_events_type_time_idx
  on gifting_insight_events (event_type, occurred_at desc);
create index gifting_insight_events_group_idx
  on gifting_insight_events (group_id, occurred_at desc)
  where group_id is not null;
create index gifting_insight_events_list_idx
  on gifting_insight_events (list_id, occurred_at desc)
  where list_id is not null;
create index gifting_insight_events_product_idx
  on gifting_insight_events (product_external_key, occurred_at desc)
  where product_external_key is not null;

create table gifting_daily_metrics (
  metric_date date not null,
  metric_key text not null,
  dimension_key text not null default 'all',
  dimension_value text not null default 'all',
  value bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (metric_date, metric_key, dimension_key, dimension_value),
  constraint gifting_daily_metrics_metric_key_check check (char_length(metric_key) between 1 and 80),
  constraint gifting_daily_metrics_dimension_key_check check (char_length(dimension_key) between 1 and 80),
  constraint gifting_daily_metrics_dimension_value_check check (char_length(dimension_value) between 1 and 180),
  constraint gifting_daily_metrics_value_check check (value >= 0)
);

create index gifting_daily_metrics_key_date_idx
  on gifting_daily_metrics (metric_key, metric_date desc);

alter table gifting_insight_events enable row level security;
alter table gifting_daily_metrics enable row level security;

revoke all on table gifting_insight_events from public, anon, authenticated;
revoke all on table gifting_daily_metrics from public, anon, authenticated;

grant select, insert, delete on table gifting_insight_events to service_role;
grant select, insert, update, delete on table gifting_daily_metrics to service_role;

-- Current-state source indexes used by the internal overview. These do not change
-- the consumer access model and only support server-side aggregate reads.
create index if not exists gift_groups_created_at_idx on gift_groups (created_at desc);
create index if not exists gift_groups_status_expiry_idx on gift_groups (status, expires_at);
create index if not exists gift_group_participants_joined_at_idx on gift_group_participants (joined_at desc);
create index if not exists gift_lists_created_at_idx on gift_lists (created_at desc);
create index if not exists gift_list_items_created_at_idx on gift_list_items (created_at desc);
create index if not exists gift_item_reservations_created_at_idx on gift_item_reservations (created_at desc);

create or replace function gifting_insights_overview(
  p_from timestamptz,
  p_to timestamptz
)
returns table (
  groups_created bigint,
  active_groups_now bigint,
  groups_drawn_cohort bigint,
  groups_with_three_plus_participants bigint,
  participants_joined bigint,
  average_participants_per_group numeric,
  standalone_lists_created bigint,
  gift_items_present_from_period bigint,
  winkelnu_products_present_from_period bigint,
  active_reservations_now bigint,
  average_group_budget_cents numeric,
  groups_with_event_date bigint,
  redraw_groups_cohort bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with cohort_groups as (
    select id, budget_cents, event_date, draw_version
      from gift_groups
     where created_at >= p_from
       and created_at < p_to
  ),
  cohort_participant_counts as (
    select g.id as group_id, count(p.id)::bigint as participant_count
      from cohort_groups g
      left join gift_group_participants p on p.group_id = g.id
     group by g.id
  ),
  period_lists as (
    select l.id
      from gift_lists l
     where l.created_at >= p_from
       and l.created_at < p_to
  ),
  standalone_period_lists as (
    select l.id
      from period_lists l
     where not exists (
       select 1
         from gift_group_participants p
        where p.gift_list_id = l.id
     )
  )
  select
    (select count(*) from cohort_groups)::bigint,
    (select count(*) from gift_groups where status <> 'closed' and expires_at > now())::bigint,
    (select count(*) from cohort_groups where draw_version >= 1)::bigint,
    (select count(*) from cohort_participant_counts where participant_count >= 3)::bigint,
    (select count(*) from gift_group_participants where joined_at >= p_from and joined_at < p_to)::bigint,
    coalesce((select avg(participant_count)::numeric from cohort_participant_counts), 0::numeric),
    (select count(*) from standalone_period_lists)::bigint,
    (select count(*) from gift_list_items where created_at >= p_from and created_at < p_to)::bigint,
    (select count(*) from gift_list_items where created_at >= p_from and created_at < p_to and item_type = 'winkelnu_product')::bigint,
    (select count(*) from gift_item_reservations)::bigint,
    coalesce((select avg(budget_cents)::numeric from cohort_groups where budget_cents is not null), 0::numeric),
    (select count(*) from cohort_groups where event_date is not null)::bigint,
    (select count(*) from cohort_groups where draw_version > 1)::bigint;
$$;

revoke all on function gifting_insights_overview(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function gifting_insights_overview(timestamptz, timestamptz) to service_role;

create or replace function gifting_insights_daily_activity(
  p_from date,
  p_to date
)
returns table (
  metric_date date,
  groups_created bigint,
  participants_joined bigint,
  standalone_lists_created bigint,
  gift_items_present bigint,
  winkelnu_products_present bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with days as (
    select generate_series(p_from, p_to, interval '1 day')::date as metric_date
  )
  select
    d.metric_date,
    (select count(*) from gift_groups g where g.created_at >= d.metric_date::timestamptz and g.created_at < (d.metric_date + 1)::timestamptz)::bigint,
    (select count(*) from gift_group_participants p where p.joined_at >= d.metric_date::timestamptz and p.joined_at < (d.metric_date + 1)::timestamptz)::bigint,
    (
      select count(*)
        from gift_lists l
       where l.created_at >= d.metric_date::timestamptz
         and l.created_at < (d.metric_date + 1)::timestamptz
         and not exists (
           select 1 from gift_group_participants p where p.gift_list_id = l.id
         )
    )::bigint,
    (select count(*) from gift_list_items i where i.created_at >= d.metric_date::timestamptz and i.created_at < (d.metric_date + 1)::timestamptz)::bigint,
    (select count(*) from gift_list_items i where i.created_at >= d.metric_date::timestamptz and i.created_at < (d.metric_date + 1)::timestamptz and i.item_type = 'winkelnu_product')::bigint
  from days d
  order by d.metric_date;
$$;

revoke all on function gifting_insights_daily_activity(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_daily_activity(date, date) to service_role;

create or replace function gifting_insights_recent_groups(p_limit integer default 12)
returns table (
  internal_ref text,
  created_at timestamptz,
  occasion text,
  status text,
  participant_count bigint,
  wish_count bigint,
  budget_bucket text,
  has_event_date boolean,
  draw_version integer,
  expires_at timestamptz,
  health_status text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    upper(substr(replace(g.id::text, '-', ''), 1, 8)) as internal_ref,
    g.created_at,
    g.occasion,
    g.status,
    coalesce(p.participant_count, 0)::bigint,
    coalesce(w.wish_count, 0)::bigint,
    case
      when g.budget_cents is null then 'Geen budget'
      when g.budget_cents < 1500 then '< €15'
      when g.budget_cents < 2500 then '€15–€24,99'
      when g.budget_cents < 5000 then '€25–€49,99'
      when g.budget_cents < 10000 then '€50–€99,99'
      else '€100+'
    end as budget_bucket,
    (g.event_date is not null) as has_event_date,
    g.draw_version,
    g.expires_at,
    case
      when g.status <> 'closed' and g.expires_at <= now() then 'stale'
      when g.status = 'drawn' and coalesce(a.assignment_count, 0) <> coalesce(p.participant_count, 0) then 'draw_mismatch'
      else 'ok'
    end as health_status
  from gift_groups g
  left join lateral (
    select count(*)::bigint as participant_count
      from gift_group_participants p0
     where p0.group_id = g.id
  ) p on true
  left join lateral (
    select count(i.id)::bigint as wish_count
      from gift_group_participants p1
      join gift_list_items i on i.gift_list_id = p1.gift_list_id
     where p1.group_id = g.id
  ) w on true
  left join lateral (
    select count(*)::bigint as assignment_count
      from gift_group_assignments a0
     where a0.group_id = g.id
       and a0.draw_version = g.draw_version
  ) a on true
  order by g.created_at desc
  limit greatest(1, least(coalesce(p_limit, 12), 50));
$$;

revoke all on function gifting_insights_recent_groups(integer) from public, anon, authenticated;
grant execute on function gifting_insights_recent_groups(integer) to service_role;

comment on table gifting_insight_events is
  'Privacy-minimal Lootje & Lijstje insight events. No participant identity, public capability code, IP address, user-agent fingerprint or draw pairing belongs here.';

comment on table gifting_daily_metrics is
  'Anonymous daily Lootje & Lijstje business aggregates retained independently from temporary consumer gifting records.';
