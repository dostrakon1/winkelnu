-- Lootje & Lijstje Insights/Admin GI4 product + commercial insights.
-- Builds durable anonymous product/item/occasion rollups and reuses the canonical
-- affiliate_click_events table for gifting-origin outbound commerce. No visitor,
-- participant, capability-code, wish-text or draw-pairing identity is introduced.

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

    if p_event_type = 'gift_item_added' then
      if p_item_type is not null then
        perform increment_gifting_daily_metric(v_metric_date, p_event_type, 1, 'item_type', p_item_type);
      end if;
      if p_occasion is not null then
        perform increment_gifting_daily_metric(v_metric_date, p_event_type, 1, 'occasion', p_occasion);
      end if;
    end if;

    if p_event_type = 'winkelnu_product_added' then
      if p_product_external_key is not null then
        perform increment_gifting_daily_metric(v_metric_date, p_event_type, 1, 'product_external_key', p_product_external_key);
      end if;
      if p_occasion is not null then
        perform increment_gifting_daily_metric(v_metric_date, p_event_type, 1, 'occasion', p_occasion);
      end if;
      if p_value_int is not null and p_value_int >= 0 then
        perform increment_gifting_daily_metric(v_metric_date, 'winkelnu_product_price_cents_sum', p_value_int::bigint, 'all', 'all');
        perform increment_gifting_daily_metric(v_metric_date, 'winkelnu_product_price_count', 1, 'all', 'all');
        if p_product_external_key is not null then
          perform increment_gifting_daily_metric(v_metric_date, 'winkelnu_product_price_cents_sum', p_value_int::bigint, 'product_external_key', p_product_external_key);
          perform increment_gifting_daily_metric(v_metric_date, 'winkelnu_product_price_count', 1, 'product_external_key', p_product_external_key);
        end if;
      end if;
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

-- From GI4 onward the retained price snapshot is attached only as an integer
-- amount. Titles, notes and external URLs remain outside the insight store.
create or replace function capture_gifting_item_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid;
  v_source text;
  v_occasion text;
begin
  begin
    if tg_op = 'DELETE' then
      if not exists (select 1 from gift_lists where id = old.gift_list_id) then return old; end if;
      select p.group_id into v_group_id
        from gift_group_participants p
       where p.gift_list_id = old.gift_list_id;
      select case when l.owner_token_hash is not null then 'standalone_list' else 'group_list' end, l.occasion
        into v_source, v_occasion
        from gift_lists l
       where l.id = old.gift_list_id;

      perform record_gifting_insight_event(
        'gift_item_deleted:' || old.id::text,
        'gift_item_deleted',
        now(),
        v_source,
        v_group_id,
        old.gift_list_id,
        old.product_external_key,
        old.item_type,
        v_occasion,
        null
      );
      return old;
    end if;

    select p.group_id into v_group_id
      from gift_group_participants p
     where p.gift_list_id = new.gift_list_id;
    select case when l.owner_token_hash is not null then 'standalone_list' else 'group_list' end, l.occasion
      into v_source, v_occasion
      from gift_lists l
     where l.id = new.gift_list_id;

    perform record_gifting_insight_event(
      'gift_item_added:' || new.id::text,
      'gift_item_added',
      new.created_at,
      v_source,
      v_group_id,
      new.gift_list_id,
      new.product_external_key,
      new.item_type,
      v_occasion,
      new.price_cents_snapshot
    );

    if new.item_type = 'winkelnu_product' then
      perform record_gifting_insight_event(
        'winkelnu_product_added:' || new.id::text,
        'winkelnu_product_added',
        new.created_at,
        v_source,
        v_group_id,
        new.gift_list_id,
        new.product_external_key,
        new.item_type,
        v_occasion,
        new.price_cents_snapshot
      );
    end if;
    return new;
  exception when others then
    raise warning 'GIFTING_INSIGHT_CAPTURE_FAILED item %: %', tg_op, sqlerrm;
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end;
end;
$$;

revoke all on function capture_gifting_item_lifecycle() from public, anon, authenticated;
grant execute on function capture_gifting_item_lifecycle() to service_role;

-- Backfill price snapshots only where the original retained list item still
-- exists. This intentionally does not reconstruct deleted consumer content.
update gifting_insight_events e
set value_int = i.price_cents_snapshot
from gift_list_items i
where e.event_type = 'winkelnu_product_added'
  and e.event_key = 'winkelnu_product_added:' || i.id::text
  and e.value_int is null
  and i.price_cents_snapshot is not null;

-- Durable anonymous dimensions for existing retained GI2/GI3 events.
insert into gifting_daily_metrics (metric_date, metric_key, dimension_key, dimension_value, value, updated_at)
select
  (occurred_at at time zone 'Europe/Amsterdam')::date,
  event_type,
  'item_type',
  item_type,
  count(*)::bigint,
  now()
from gifting_insight_events
where event_type = 'gift_item_added'
  and item_type in ('winkelnu_product', 'external_link', 'text')
group by 1, 2, 3, 4
on conflict (metric_date, metric_key, dimension_key, dimension_value)
do update set value = excluded.value, updated_at = now();

insert into gifting_daily_metrics (metric_date, metric_key, dimension_key, dimension_value, value, updated_at)
select
  (occurred_at at time zone 'Europe/Amsterdam')::date,
  event_type,
  'occasion',
  occasion,
  count(*)::bigint,
  now()
from gifting_insight_events
where event_type in ('gift_item_added', 'winkelnu_product_added')
  and occasion in ('sinterklaas', 'kerst', 'verjaardag', 'anders')
group by 1, 2, 3, 4
on conflict (metric_date, metric_key, dimension_key, dimension_value)
do update set value = excluded.value, updated_at = now();

insert into gifting_daily_metrics (metric_date, metric_key, dimension_key, dimension_value, value, updated_at)
select
  (occurred_at at time zone 'Europe/Amsterdam')::date,
  event_type,
  'product_external_key',
  product_external_key,
  count(*)::bigint,
  now()
from gifting_insight_events
where event_type = 'winkelnu_product_added'
  and product_external_key is not null
  and char_length(product_external_key) between 1 and 180
group by 1, 2, 3, 4
on conflict (metric_date, metric_key, dimension_key, dimension_value)
do update set value = excluded.value, updated_at = now();

insert into gifting_daily_metrics (metric_date, metric_key, dimension_key, dimension_value, value, updated_at)
select
  (occurred_at at time zone 'Europe/Amsterdam')::date,
  'winkelnu_product_price_cents_sum',
  'all',
  'all',
  sum(value_int)::bigint,
  now()
from gifting_insight_events
where event_type = 'winkelnu_product_added'
  and value_int is not null
  and value_int >= 0
group by 1
on conflict (metric_date, metric_key, dimension_key, dimension_value)
do update set value = excluded.value, updated_at = now();

insert into gifting_daily_metrics (metric_date, metric_key, dimension_key, dimension_value, value, updated_at)
select
  (occurred_at at time zone 'Europe/Amsterdam')::date,
  'winkelnu_product_price_count',
  'all',
  'all',
  count(*)::bigint,
  now()
from gifting_insight_events
where event_type = 'winkelnu_product_added'
  and value_int is not null
  and value_int >= 0
group by 1
on conflict (metric_date, metric_key, dimension_key, dimension_value)
do update set value = excluded.value, updated_at = now();

insert into gifting_daily_metrics (metric_date, metric_key, dimension_key, dimension_value, value, updated_at)
select
  (occurred_at at time zone 'Europe/Amsterdam')::date,
  'winkelnu_product_price_cents_sum',
  'product_external_key',
  product_external_key,
  sum(value_int)::bigint,
  now()
from gifting_insight_events
where event_type = 'winkelnu_product_added'
  and product_external_key is not null
  and value_int is not null
  and value_int >= 0
group by 1, 4
on conflict (metric_date, metric_key, dimension_key, dimension_value)
do update set value = excluded.value, updated_at = now();

insert into gifting_daily_metrics (metric_date, metric_key, dimension_key, dimension_value, value, updated_at)
select
  (occurred_at at time zone 'Europe/Amsterdam')::date,
  'winkelnu_product_price_count',
  'product_external_key',
  product_external_key,
  count(*)::bigint,
  now()
from gifting_insight_events
where event_type = 'winkelnu_product_added'
  and product_external_key is not null
  and value_int is not null
  and value_int >= 0
group by 1, 4
on conflict (metric_date, metric_key, dimension_key, dimension_value)
do update set value = excluded.value, updated_at = now();

create or replace function gifting_insights_product_overview(
  p_from date,
  p_to date
)
returns table (
  native_product_saves bigint,
  external_link_wishes bigint,
  text_wishes bigint,
  gifting_affiliate_clicks bigint,
  active_reservations bigint,
  average_native_price_cents bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with metric_totals as (
    select
      coalesce(sum(value) filter (
        where metric_key = 'winkelnu_product_added'
          and dimension_key = 'all' and dimension_value = 'all'
      ), 0)::bigint as native_product_saves,
      coalesce(sum(value) filter (
        where metric_key = 'gift_item_added'
          and dimension_key = 'item_type' and dimension_value = 'external_link'
      ), 0)::bigint as external_link_wishes,
      coalesce(sum(value) filter (
        where metric_key = 'gift_item_added'
          and dimension_key = 'item_type' and dimension_value = 'text'
      ), 0)::bigint as text_wishes,
      coalesce(sum(value) filter (
        where metric_key = 'winkelnu_product_price_cents_sum'
          and dimension_key = 'all' and dimension_value = 'all'
      ), 0)::bigint as price_sum,
      coalesce(sum(value) filter (
        where metric_key = 'winkelnu_product_price_count'
          and dimension_key = 'all' and dimension_value = 'all'
      ), 0)::bigint as price_count
    from gifting_daily_metrics
    where metric_date between p_from and p_to
  ), clicks as (
    select count(*)::bigint as value
    from affiliate_click_events
    where source_path = '/lootje-lijstje'
      and (occurred_at at time zone 'Europe/Amsterdam')::date between p_from and p_to
  ), reservations as (
    select count(*)::bigint as value
    from gift_item_reservations r
    join gift_list_items i on i.id = r.gift_list_item_id
    where i.item_type = 'winkelnu_product'
      and i.product_external_key is not null
  )
  select
    m.native_product_saves,
    m.external_link_wishes,
    m.text_wishes,
    c.value,
    r.value,
    case when m.price_count > 0 then round(m.price_sum::numeric / m.price_count)::bigint else 0 end
  from metric_totals m
  cross join clicks c
  cross join reservations r;
$$;

revoke all on function gifting_insights_product_overview(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_product_overview(date, date) to service_role;

create or replace function gifting_insights_product_rankings(
  p_from date,
  p_to date
)
returns table (
  product_external_key text,
  product_title text,
  product_slug text,
  category_name text,
  saved_count bigint,
  gifting_click_count bigint,
  active_reservation_count bigint,
  average_saved_price_cents bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with saves as (
    select dimension_value as product_external_key, sum(value)::bigint as saved_count
    from gifting_daily_metrics
    where metric_date between p_from and p_to
      and metric_key = 'winkelnu_product_added'
      and dimension_key = 'product_external_key'
    group by dimension_value
  ), clicks as (
    select p.external_key as product_external_key, count(*)::bigint as gifting_click_count
    from affiliate_click_events a
    join products p on p.id = a.product_id
    where a.source_path = '/lootje-lijstje'
      and (a.occurred_at at time zone 'Europe/Amsterdam')::date between p_from and p_to
    group by p.external_key
  ), reservations as (
    select i.product_external_key, count(*)::bigint as active_reservation_count
    from gift_item_reservations r
    join gift_list_items i on i.id = r.gift_list_item_id
    where i.item_type = 'winkelnu_product'
      and i.product_external_key is not null
    group by i.product_external_key
  ), price_sums as (
    select dimension_value as product_external_key, sum(value)::bigint as price_sum
    from gifting_daily_metrics
    where metric_date between p_from and p_to
      and metric_key = 'winkelnu_product_price_cents_sum'
      and dimension_key = 'product_external_key'
    group by dimension_value
  ), price_counts as (
    select dimension_value as product_external_key, sum(value)::bigint as price_count
    from gifting_daily_metrics
    where metric_date between p_from and p_to
      and metric_key = 'winkelnu_product_price_count'
      and dimension_key = 'product_external_key'
    group by dimension_value
  ), product_keys as (
    select product_external_key from saves
    union
    select product_external_key from clicks
    union
    select product_external_key from reservations
  )
  select
    p.external_key,
    p.title,
    p.slug,
    c.name,
    coalesce(s.saved_count, 0)::bigint,
    coalesce(cl.gifting_click_count, 0)::bigint,
    coalesce(r.active_reservation_count, 0)::bigint,
    case
      when coalesce(pc.price_count, 0) > 0 then round(ps.price_sum::numeric / pc.price_count)::bigint
      else 0
    end
  from product_keys k
  join products p on p.external_key = k.product_external_key
  left join categories c on c.id = p.category_id
  left join saves s on s.product_external_key = k.product_external_key
  left join clicks cl on cl.product_external_key = k.product_external_key
  left join reservations r on r.product_external_key = k.product_external_key
  left join price_sums ps on ps.product_external_key = k.product_external_key
  left join price_counts pc on pc.product_external_key = k.product_external_key
  order by coalesce(s.saved_count, 0) desc,
           coalesce(cl.gifting_click_count, 0) desc,
           coalesce(r.active_reservation_count, 0) desc,
           p.title
  limit 50;
$$;

revoke all on function gifting_insights_product_rankings(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_product_rankings(date, date) to service_role;

create or replace function gifting_insights_products_by_occasion(
  p_from date,
  p_to date
)
returns table (
  occasion text,
  items_added bigint,
  native_product_saves bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    dimension_value as occasion,
    coalesce(sum(value) filter (where metric_key = 'gift_item_added'), 0)::bigint as items_added,
    coalesce(sum(value) filter (where metric_key = 'winkelnu_product_added'), 0)::bigint as native_product_saves
  from gifting_daily_metrics
  where metric_date between p_from and p_to
    and dimension_key = 'occasion'
    and dimension_value in ('sinterklaas', 'kerst', 'verjaardag', 'anders')
    and metric_key in ('gift_item_added', 'winkelnu_product_added')
  group by dimension_value
  order by items_added desc, dimension_value;
$$;

revoke all on function gifting_insights_products_by_occasion(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_products_by_occasion(date, date) to service_role;

comment on function gifting_insights_product_overview(date, date) is
  'GI4 anonymous gifting product/commercial totals. Affiliate clicks come only from the canonical affiliate click table with static gifting source path.';
comment on function gifting_insights_product_rankings(date, date) is
  'GI4 product rankings for saved native products and gifting-origin affiliate clicks. Active reservations are current state, not period cohorts.';
comment on function gifting_insights_products_by_occasion(date, date) is
  'GI4 anonymous gift-item and native-product save totals by allowlisted occasion.';
