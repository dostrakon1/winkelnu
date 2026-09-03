alter table merchants enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table feed_sources enable row level security;
alter table import_runs enable row level security;
alter table offers enable row level security;
alter table product_identifiers enable row level security;
alter table import_rejects enable row level security;
alter table product_match_reviews enable row level security;
alter table affiliate_click_events enable row level security;
alter table affiliate_networks enable row level security;
alter table merchant_affiliate_integrations enable row level security;
alter table feed_import_orchestration enable row level security;

-- No anon/authenticated policies are intentionally created here.
-- Winkelnu reads and writes the catalog through trusted server-side service-role code.

create or replace function winkelnu_production_readiness()
returns table (
  rls_enabled_tables integer,
  published_products bigint,
  active_offers bigint,
  active_merchants bigint,
  active_feed_sources bigint,
  latest_successful_import_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*)::integer from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = any(array['merchants','categories','products','feed_sources','import_runs','offers','product_identifiers','import_rejects','product_match_reviews','affiliate_click_events','affiliate_networks','merchant_affiliate_integrations','feed_import_orchestration']) and c.relrowsecurity),
    (select count(*) from products where status = 'published'),
    (select count(*) from offers where is_active = true),
    (select count(*) from merchants where is_active = true),
    (select count(*) from feed_sources where is_active = true),
    (select max(finished_at) from import_runs where status in ('completed','completed_with_errors'));
$$;

revoke all on function winkelnu_production_readiness() from public;
grant execute on function winkelnu_production_readiness() to service_role;
