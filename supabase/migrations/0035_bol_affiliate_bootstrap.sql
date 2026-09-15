-- Prepare bol Affiliate in the Winkelnu integration registry.
-- The feed source remains inactive until the production FTPS runtime
-- has a stable outbound IPv4 that is whitelisted at bol.

insert into public.merchants (
  external_key,
  slug,
  name,
  website_url,
  is_active
)
values (
  'merchant:bol',
  'bol',
  'bol.com',
  'https://www.bol.com/',
  true
)
on conflict (external_key) do update
set
  slug = excluded.slug,
  name = excluded.name,
  website_url = excluded.website_url,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.affiliate_networks (
  external_key,
  slug,
  name,
  kind,
  website_url,
  is_active
)
values (
  'network:bol',
  'bol',
  'bol Affiliate',
  'marketplace',
  'https://partner.bol.com/',
  true
)
on conflict (external_key) do update
set
  slug = excluded.slug,
  name = excluded.name,
  kind = excluded.kind,
  website_url = excluded.website_url,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.merchant_affiliate_integrations (
  external_key,
  merchant_id,
  affiliate_network_id,
  kind,
  status,
  secret_ref,
  tracking_config
)
select
  'integration:bol',
  m.id,
  n.id,
  'marketplace',
  'active',
  'env:BOL_PRODUCT_FEED_CREDENTIALS',
  '{"siteId":"1542789"}'::jsonb
from public.merchants m
join public.affiliate_networks n
  on n.external_key = 'network:bol'
where m.external_key = 'merchant:bol'
on conflict (external_key) do update
set
  merchant_id = excluded.merchant_id,
  affiliate_network_id = excluded.affiliate_network_id,
  kind = excluded.kind,
  status = excluded.status,
  secret_ref = excluded.secret_ref,
  tracking_config = excluded.tracking_config,
  updated_at = now();

insert into public.feed_sources (
  merchant_id,
  source_key,
  source_type,
  is_active,
  config,
  affiliate_integration_id
)
select
  m.id,
  'bol:gift-cards:nl',
  'csv',
  false,
  '{}'::jsonb,
  i.id
from public.merchants m
join public.merchant_affiliate_integrations i
  on i.external_key = 'integration:bol'
where m.external_key = 'merchant:bol'
on conflict (merchant_id, source_key) do update
set
  source_type = excluded.source_type,
  is_active = false,
  config = excluded.config,
  affiliate_integration_id = excluded.affiliate_integration_id,
  updated_at = now();
