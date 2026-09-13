-- Lootje & Lijstje Insights/Admin GI2 lifecycle instrumentation.
-- Records privacy-minimal successful gifting lifecycle events inside PostgreSQL,
-- keeps anonymous daily rollups beyond consumer-data retention, and never exposes
-- participant identity, wish text, public capability codes or draw pairings.

alter table gifting_insight_events
  drop constraint if exists gifting_insight_events_type_check;

alter table gifting_insight_events
  add constraint gifting_insight_events_type_check check (event_type in (
    'group_created',
    'group_three_participants_reached',
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
  ));

create or replace function increment_gifting_daily_metric(
  p_metric_date date,
  p_metric_key text,
  p_amount bigint default 1,
  p_dimension_key text default 'all',
  p_dimension_value text default 'all'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_metric_date is null
     or p_metric_key is null
     or char_length(p_metric_key) not between 1 and 80
     or p_dimension_key is null
     or char_length(p_dimension_key) not between 1 and 80
     or p_dimension_value is null
     or char_length(p_dimension_value) not between 1 and 180
     or p_amount is null
     or p_amount < 0 then
    raise exception using errcode = '22023', message = 'GIFTING_INSIGHT_INVALID_DAILY_METRIC';
  end if;

  insert into gifting_daily_metrics (
    metric_date,
    metric_key,
    dimension_key,
    dimension_value,
    value,
    updated_at
  ) values (
    p_metric_date,
    p_metric_key,
    p_dimension_key,
    p_dimension_value,
    p_amount,
    now()
  )
  on conflict (metric_date, metric_key, dimension_key, dimension_value)
  do update set
    value = gifting_daily_metrics.value + excluded.value,
    updated_at = now();
end;
$$;

revoke all on function increment_gifting_daily_metric(date, text, bigint, text, text) from public, anon, authenticated;
grant execute on function increment_gifting_daily_metric(date, text, bigint, text, text) to service_role;

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
    return true;
  end if;

  return false;
end;
$$;

revoke all on function record_gifting_insight_event(text, text, timestamptz, text, uuid, uuid, text, text, text, integer)
  from public, anon, authenticated;
grant execute on function record_gifting_insight_event(text, text, timestamptz, text, uuid, uuid, text, text, text, integer)
  to service_role;

create or replace function capture_gifting_participant_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group gift_groups%rowtype;
  v_participant_count bigint;
  v_group_created boolean := false;
  v_metric_date date;
begin
  begin
    if tg_op = 'INSERT' then
      select * into v_group from gift_groups where id = new.group_id;
      if not found then return new; end if;

      perform record_gifting_insight_event(
        'participant_joined:' || new.id::text,
        'participant_joined',
        new.joined_at,
        'group',
        new.group_id,
        new.gift_list_id,
        null,
        null,
        v_group.occasion,
        null
      );

      select count(*) into v_participant_count
        from gift_group_participants
       where group_id = new.group_id;

      if v_participant_count = 1 then
        v_group_created := record_gifting_insight_event(
          'group_created:' || new.group_id::text,
          'group_created',
          new.joined_at,
          'group',
          new.group_id,
          null,
          null,
          null,
          v_group.occasion,
          v_group.budget_cents
        );

        if v_group_created then
          v_metric_date := (new.joined_at at time zone 'Europe/Amsterdam')::date;
          if v_group.event_date is not null then
            perform increment_gifting_daily_metric(v_metric_date, 'groups_with_event_date', 1);
          end if;
          if v_group.budget_cents is not null then
            perform increment_gifting_daily_metric(v_metric_date, 'group_budget_cents_sum', v_group.budget_cents::bigint);
            perform increment_gifting_daily_metric(v_metric_date, 'group_budget_count', 1);
          end if;
        end if;
      end if;

      if v_participant_count = 3 then
        perform record_gifting_insight_event(
          'group_three_participants_reached:' || new.group_id::text,
          'group_three_participants_reached',
          new.joined_at,
          'group',
          new.group_id,
          null,
          null,
          null,
          v_group.occasion,
          null
        );
      end if;

      return new;
    end if;

    -- A participant removed because their own list was deleted is a real
    -- lifecycle change. Cascades from deleting the parent group are ignored.
    if exists (select 1 from gift_groups where id = old.group_id) then
      perform record_gifting_insight_event(
        'participant_removed:' || old.id::text,
        'participant_removed',
        now(),
        'group',
        old.group_id,
        null,
        null,
        null,
        null,
        null
      );
    end if;
    return old;
  exception when others then
    raise warning 'GIFTING_INSIGHT_CAPTURE_FAILED participant %: %', tg_op, sqlerrm;
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end;
end;
$$;

revoke all on function capture_gifting_participant_lifecycle() from public, anon, authenticated;
grant execute on function capture_gifting_participant_lifecycle() to service_role;

drop trigger if exists gifting_participant_lifecycle_insight on gift_group_participants;
create trigger gifting_participant_lifecycle_insight
after insert or delete on gift_group_participants
for each row execute function capture_gifting_participant_lifecycle();

create or replace function capture_gifting_standalone_list_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    if tg_op = 'INSERT' then
      if new.owner_token_hash is not null then
        perform record_gifting_insight_event(
          'standalone_list_created:' || new.id::text,
          'standalone_list_created',
          new.created_at,
          'standalone_list',
          null,
          new.id,
          null,
          null,
          new.occasion,
          null
        );
      end if;
      return new;
    end if;

    if old.owner_token_hash is not null then
      perform record_gifting_insight_event(
        'standalone_list_deleted:' || old.id::text,
        'standalone_list_deleted',
        now(),
        'standalone_list',
        null,
        old.id,
        null,
        null,
        old.occasion,
        null
      );
    end if;
    return old;
  exception when others then
    raise warning 'GIFTING_INSIGHT_CAPTURE_FAILED standalone_list %: %', tg_op, sqlerrm;
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end;
end;
$$;

revoke all on function capture_gifting_standalone_list_lifecycle() from public, anon, authenticated;
grant execute on function capture_gifting_standalone_list_lifecycle() to service_role;

drop trigger if exists gifting_standalone_list_created_insight on gift_lists;
create trigger gifting_standalone_list_created_insight
after insert on gift_lists
for each row execute function capture_gifting_standalone_list_lifecycle();

drop trigger if exists gifting_standalone_list_deleted_insight on gift_lists;
create trigger gifting_standalone_list_deleted_insight
before delete on gift_lists
for each row execute function capture_gifting_standalone_list_lifecycle();

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
      -- Skip list-cascade deletion; the list lifecycle event already records it.
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
      null
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
        null
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

drop trigger if exists gifting_item_lifecycle_insight on gift_list_items;
create trigger gifting_item_lifecycle_insight
after insert or delete on gift_list_items
for each row execute function capture_gifting_item_lifecycle();

create or replace function capture_gifting_draw_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted boolean := false;
  v_event_type text;
  v_metric_date date;
begin
  begin
    if new.draw_version <= old.draw_version or new.status <> 'drawn' then return new; end if;

    v_event_type := case when new.draw_version = 1 then 'draw_completed' else 'redraw_completed' end;
    v_inserted := record_gifting_insight_event(
      v_event_type || ':' || new.id::text || ':v' || new.draw_version::text,
      v_event_type,
      new.updated_at,
      'group_draw',
      new.id,
      null,
      null,
      null,
      new.occasion,
      new.draw_version
    );

    if v_inserted and new.draw_version = 2 then
      v_metric_date := (new.updated_at at time zone 'Europe/Amsterdam')::date;
      perform increment_gifting_daily_metric(v_metric_date, 'groups_redrawn', 1);
    end if;
    return new;
  exception when others then
    raise warning 'GIFTING_INSIGHT_CAPTURE_FAILED draw UPDATE: %', sqlerrm;
    return new;
  end;
end;
$$;

revoke all on function capture_gifting_draw_lifecycle() from public, anon, authenticated;
grant execute on function capture_gifting_draw_lifecycle() to service_role;

drop trigger if exists gifting_draw_lifecycle_insight on gift_groups;
create trigger gifting_draw_lifecycle_insight
after update of status, draw_version on gift_groups
for each row execute function capture_gifting_draw_lifecycle();

create or replace function capture_gifting_reservation_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    if tg_op = 'INSERT' then
      perform record_gifting_insight_event(
        'reservation_created:' || new.id::text,
        'reservation_created',
        new.created_at,
        'gift_reveal',
        new.group_id,
        null,
        null,
        null,
        null,
        null
      );
      return new;
    end if;

    -- Skip cascades caused by deleting the parent group. Redraw releases and
    -- explicit unreserve actions keep the group alive and are real lifecycle events.
    if exists (select 1 from gift_groups where id = old.group_id) then
      perform record_gifting_insight_event(
        'reservation_released:' || old.id::text,
        'reservation_released',
        now(),
        'gift_reveal',
        old.group_id,
        null,
        null,
        null,
        null,
        null
      );
    end if;
    return old;
  exception when others then
    raise warning 'GIFTING_INSIGHT_CAPTURE_FAILED reservation %: %', tg_op, sqlerrm;
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end;
end;
$$;

revoke all on function capture_gifting_reservation_lifecycle() from public, anon, authenticated;
grant execute on function capture_gifting_reservation_lifecycle() to service_role;

drop trigger if exists gifting_reservation_lifecycle_insight on gift_item_reservations;
create trigger gifting_reservation_lifecycle_insight
after insert or delete on gift_item_reservations
for each row execute function capture_gifting_reservation_lifecycle();

create or replace function capture_gifting_group_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    perform record_gifting_insight_event(
      'group_deleted:' || old.id::text,
      'group_deleted',
      now(),
      'group',
      old.id,
      null,
      null,
      null,
      old.occasion,
      null
    );
  exception when others then
    raise warning 'GIFTING_INSIGHT_CAPTURE_FAILED group DELETE: %', sqlerrm;
  end;
  return old;
end;
$$;

revoke all on function capture_gifting_group_deleted() from public, anon, authenticated;
grant execute on function capture_gifting_group_deleted() to service_role;

drop trigger if exists gifting_group_deleted_insight on gift_groups;
create trigger gifting_group_deleted_insight
before delete on gift_groups
for each row execute function capture_gifting_group_deleted();

-- Backfill the current retained source records. This can reconstruct creation,
-- participant, list, wish and reservation history that still exists at GI2 launch.
-- Draw timestamps before GI2 cannot be reconstructed exactly and are therefore
-- represented only by the latest known group update timestamp.
do $$
declare
  r record;
  v_inserted boolean;
  v_metric_date date;
begin
  for r in
    select g.*, min(p.joined_at) as first_joined_at, count(p.id) as participant_count
      from gift_groups g
      join gift_group_participants p on p.group_id = g.id
     group by g.id
  loop
    v_inserted := record_gifting_insight_event(
      'group_created:' || r.id::text,
      'group_created',
      r.first_joined_at,
      'backfill',
      r.id,
      null,
      null,
      null,
      r.occasion,
      r.budget_cents
    );
    if v_inserted then
      v_metric_date := (r.first_joined_at at time zone 'Europe/Amsterdam')::date;
      if r.event_date is not null then
        perform increment_gifting_daily_metric(v_metric_date, 'groups_with_event_date', 1);
      end if;
      if r.budget_cents is not null then
        perform increment_gifting_daily_metric(v_metric_date, 'group_budget_cents_sum', r.budget_cents::bigint);
        perform increment_gifting_daily_metric(v_metric_date, 'group_budget_count', 1);
      end if;
    end if;

    if r.participant_count >= 3 then
      perform record_gifting_insight_event(
        'group_three_participants_reached:' || r.id::text,
        'group_three_participants_reached',
        (
          select p3.joined_at
            from gift_group_participants p3
           where p3.group_id = r.id
           order by p3.joined_at, p3.id
           offset 2 limit 1
        ),
        'backfill',
        r.id,
        null,
        null,
        null,
        r.occasion,
        null
      );
    end if;

    if r.draw_version >= 1 then
      perform record_gifting_insight_event(
        'draw_completed:' || r.id::text || ':backfill',
        'draw_completed',
        r.updated_at,
        'backfill',
        r.id,
        null,
        null,
        null,
        r.occasion,
        1
      );
    end if;

    if r.draw_version > 1 then
      v_inserted := record_gifting_insight_event(
        'redraw_completed:' || r.id::text || ':backfill',
        'redraw_completed',
        r.updated_at,
        'backfill',
        r.id,
        null,
        null,
        null,
        r.occasion,
        r.draw_version
      );
      if v_inserted then
        perform increment_gifting_daily_metric((r.updated_at at time zone 'Europe/Amsterdam')::date, 'groups_redrawn', 1);
      end if;
    end if;
  end loop;

  for r in select * from gift_group_participants loop
    perform record_gifting_insight_event(
      'participant_joined:' || r.id::text,
      'participant_joined',
      r.joined_at,
      'backfill',
      r.group_id,
      r.gift_list_id,
      null,
      null,
      null,
      null
    );
  end loop;

  for r in select * from gift_lists where owner_token_hash is not null loop
    perform record_gifting_insight_event(
      'standalone_list_created:' || r.id::text,
      'standalone_list_created',
      r.created_at,
      'backfill',
      null,
      r.id,
      null,
      null,
      r.occasion,
      null
    );
  end loop;

  for r in
    select i.*, l.occasion,
           p.group_id,
           case when l.owner_token_hash is not null then 'standalone_list' else 'group_list' end as surface
      from gift_list_items i
      join gift_lists l on l.id = i.gift_list_id
      left join gift_group_participants p on p.gift_list_id = i.gift_list_id
  loop
    perform record_gifting_insight_event(
      'gift_item_added:' || r.id::text,
      'gift_item_added',
      r.created_at,
      'backfill',
      r.group_id,
      r.gift_list_id,
      r.product_external_key,
      r.item_type,
      r.occasion,
      null
    );
    if r.item_type = 'winkelnu_product' then
      perform record_gifting_insight_event(
        'winkelnu_product_added:' || r.id::text,
        'winkelnu_product_added',
        r.created_at,
        'backfill',
        r.group_id,
        r.gift_list_id,
        r.product_external_key,
        r.item_type,
        r.occasion,
        null
      );
    end if;
  end loop;

  for r in select * from gift_item_reservations loop
    perform record_gifting_insight_event(
      'reservation_created:' || r.id::text,
      'reservation_created',
      r.created_at,
      'backfill',
      r.group_id,
      null,
      null,
      null,
      null,
      null
    );
  end loop;
end;
$$;

-- Historical overview now uses durable daily rollups for lifecycle counts while
-- keeping clearly current-state values sourced from live consumer tables.
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
  with bounds as (
    select
      (p_from at time zone 'Europe/Amsterdam')::date as from_date,
      ((p_to - interval '1 microsecond') at time zone 'Europe/Amsterdam')::date as to_date
  ),
  metrics as (
    select metric_key, sum(value)::bigint as value
      from gifting_daily_metrics, bounds
     where metric_date between bounds.from_date and bounds.to_date
       and dimension_key = 'all'
       and dimension_value = 'all'
     group by metric_key
  ),
  valueset as (
    select
      coalesce((select value from metrics where metric_key = 'group_created'), 0)::bigint as groups_created,
      coalesce((select value from metrics where metric_key = 'draw_completed'), 0)::bigint as groups_drawn,
      coalesce((select value from metrics where metric_key = 'group_three_participants_reached'), 0)::bigint as groups_three_plus,
      coalesce((select value from metrics where metric_key = 'participant_joined'), 0)::bigint as participants_joined,
      coalesce((select value from metrics where metric_key = 'standalone_list_created'), 0)::bigint as standalone_lists,
      coalesce((select value from metrics where metric_key = 'gift_item_added'), 0)::bigint as gift_items,
      coalesce((select value from metrics where metric_key = 'winkelnu_product_added'), 0)::bigint as winkelnu_products,
      coalesce((select value from metrics where metric_key = 'group_budget_cents_sum'), 0)::bigint as budget_sum,
      coalesce((select value from metrics where metric_key = 'group_budget_count'), 0)::bigint as budget_count,
      coalesce((select value from metrics where metric_key = 'groups_with_event_date'), 0)::bigint as event_date_groups,
      coalesce((select value from metrics where metric_key = 'groups_redrawn'), 0)::bigint as redrawn_groups
  )
  select
    v.groups_created,
    (select count(*) from gift_groups where status <> 'closed' and expires_at > now())::bigint,
    v.groups_drawn,
    v.groups_three_plus,
    v.participants_joined,
    case when v.groups_created > 0 then (v.participants_joined::numeric / v.groups_created::numeric) else 0::numeric end,
    v.standalone_lists,
    v.gift_items,
    v.winkelnu_products,
    (select count(*) from gift_item_reservations)::bigint,
    case when v.budget_count > 0 then (v.budget_sum::numeric / v.budget_count::numeric) else 0::numeric end,
    v.event_date_groups,
    v.redrawn_groups
  from valueset v;
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
    coalesce(max(m.value) filter (where m.metric_key = 'group_created'), 0)::bigint,
    coalesce(max(m.value) filter (where m.metric_key = 'participant_joined'), 0)::bigint,
    coalesce(max(m.value) filter (where m.metric_key = 'standalone_list_created'), 0)::bigint,
    coalesce(max(m.value) filter (where m.metric_key = 'gift_item_added'), 0)::bigint,
    coalesce(max(m.value) filter (where m.metric_key = 'winkelnu_product_added'), 0)::bigint
  from days d
  left join gifting_daily_metrics m
    on m.metric_date = d.metric_date
   and m.dimension_key = 'all'
   and m.dimension_value = 'all'
   and m.metric_key in (
     'group_created',
     'participant_joined',
     'standalone_list_created',
     'gift_item_added',
     'winkelnu_product_added'
   )
  group by d.metric_date
  order by d.metric_date;
$$;

revoke all on function gifting_insights_daily_activity(date, date) from public, anon, authenticated;
grant execute on function gifting_insights_daily_activity(date, date) to service_role;

create or replace function cleanup_gifting_insight_events()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted bigint;
begin
  delete from gifting_insight_events
   where occurred_at < now() - interval '90 days';
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function cleanup_gifting_insight_events() from public, anon, authenticated;
grant execute on function cleanup_gifting_insight_events() to service_role;

select cron.schedule(
  'winkelnu-gifting-insight-retention',
  '23 3 * * *',
  $$select public.cleanup_gifting_insight_events();$$
);

comment on function record_gifting_insight_event(text, text, timestamptz, text, uuid, uuid, text, text, text, integer) is
  'Idempotently records one privacy-minimal gifting lifecycle event and increments its anonymous daily rollup.';
comment on function cleanup_gifting_insight_events() is
  'Deletes raw gifting insight events after 90 days; anonymous daily metrics remain available for long-term reporting.';
