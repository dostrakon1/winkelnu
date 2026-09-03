create table if not exists affiliate_networks (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  slug text not null unique,
  name text not null,
  kind text not null check (kind in ('network','marketplace')),
  website_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists merchant_affiliate_integrations (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  merchant_id uuid not null references merchants(id) on delete cascade,
  affiliate_network_id uuid references affiliate_networks(id) on delete restrict,
  kind text not null check (kind in ('network','marketplace','direct')),
  program_identifier text,
  status text not null default 'pending' check (status in ('pending','active','paused','ended')),
  secret_ref text,
  tracking_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint merchant_affiliate_integrations_network_shape check (
    (kind = 'direct' and affiliate_network_id is null)
    or (kind in ('network','marketplace') and affiliate_network_id is not null)
  )
);

create index if not exists merchant_affiliate_integrations_merchant_idx
  on merchant_affiliate_integrations (merchant_id, status);

create index if not exists merchant_affiliate_integrations_network_idx
  on merchant_affiliate_integrations (affiliate_network_id, status)
  where affiliate_network_id is not null;

alter table feed_sources
  add column if not exists affiliate_integration_id uuid
  references merchant_affiliate_integrations(id) on delete set null;

create index if not exists feed_sources_affiliate_integration_idx
  on feed_sources (affiliate_integration_id)
  where affiliate_integration_id is not null;

comment on table affiliate_networks is
  'Registry of affiliate networks and marketplace partner ecosystems. No credentials are stored here.';

comment on table merchant_affiliate_integrations is
  'Merchant-to-affiliate-program registry. secret_ref may only point to server-side secret storage; it must never contain the secret itself.';

comment on column merchant_affiliate_integrations.tracking_config is
  'Non-secret tracking metadata only. Authentication tokens, API keys and passwords must never be stored in this JSON.';
