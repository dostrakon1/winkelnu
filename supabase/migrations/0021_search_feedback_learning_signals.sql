create table if not exists search_feedback_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'search_performed',
    'predictive_clicked',
    'best_match_clicked',
    'product_clicked',
    'search_refined'
  )),
  query_normalized text not null check (char_length(query_normalized) between 1 and 160),
  previous_query_normalized text check (previous_query_normalized is null or char_length(previous_query_normalized) between 1 and 160),
  corrected_query text check (corrected_query is null or char_length(corrected_query) <= 160),
  product_term text check (product_term is null or char_length(product_term) <= 120),
  intent_keys text[] not null default '{}',
  zero_results boolean not null default false,
  best_match_count integer check (best_match_count is null or best_match_count between 0 and 20),
  target_kind text check (target_kind is null or target_kind in (
    'product',
    'category',
    'subcategory',
    'guide',
    'collection',
    'collection-section'
  )),
  target_key text check (target_key is null or char_length(target_key) <= 200),
  target_position integer check (target_position is null or target_position between 1 and 100),
  category_slug text check (category_slug is null or char_length(category_slug) <= 100),
  created_at timestamptz not null default now()
);

comment on table search_feedback_events is
  'Privacy-minimal first-party search learning signals. No IP address, user-agent fingerprint, visitor ID, cookie ID or cross-site identifier is stored.';

comment on column search_feedback_events.query_normalized is
  'Normalized and identifier-redacted search text used only to improve Winkelnu search relevance.';

create index if not exists search_feedback_events_query_time_idx
  on search_feedback_events (query_normalized, created_at desc);

create index if not exists search_feedback_events_type_time_idx
  on search_feedback_events (event_type, created_at desc);

create index if not exists search_feedback_events_created_at_idx
  on search_feedback_events (created_at);

alter table search_feedback_events enable row level security;

revoke all on table search_feedback_events from public, anon, authenticated;
grant select, insert, delete on table search_feedback_events to service_role;

create or replace view search_feedback_query_summary as
select
  query_normalized,
  count(*) filter (where event_type = 'search_performed')::bigint as searches,
  count(*) filter (where event_type = 'search_performed' and zero_results)::bigint as zero_result_searches,
  count(*) filter (where event_type = 'predictive_clicked')::bigint as predictive_clicks,
  count(*) filter (where event_type = 'best_match_clicked')::bigint as best_match_clicks,
  count(*) filter (where event_type = 'product_clicked')::bigint as product_clicks,
  count(*) filter (where event_type = 'search_refined')::bigint as refinements,
  max(created_at) as last_seen_at,
  (
    count(*) filter (where event_type = 'search_performed' and zero_results) * 6
    + count(*) filter (where event_type = 'search_refined') * 3
    + count(*) filter (where event_type = 'search_performed')
    - count(*) filter (where event_type in ('predictive_clicked', 'best_match_clicked', 'product_clicked'))
  )::bigint as opportunity_score
from search_feedback_events
where created_at >= now() - interval '90 days'
group by query_normalized;

comment on view search_feedback_query_summary is
  'Rolling 90-day query-level learning summary. Higher opportunity_score means the query deserves more search-quality attention; it does not automatically change rankings.';

revoke all on search_feedback_query_summary from public, anon, authenticated;
grant select on search_feedback_query_summary to service_role;
