create extension if not exists pgcrypto;

create table if not exists merchants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  description text,
  brand text,
  mpn text,
  primary_gtin text,
  primary_image_url text,
  status text not null default 'draft' check (status in ('draft','published','hidden','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products(category_id);
create index if not exists products_primary_gtin_idx on products(primary_gtin) where primary_gtin is not null;
create index if not exists products_brand_mpn_idx on products(brand, mpn) where brand is not null and mpn is not null;

create table if not exists feed_sources (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  source_key text not null,
  source_type text not null check (source_type in ('api','xml','csv','json','manual')),
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (merchant_id, source_key)
);

create table if not exists import_runs (
  id uuid primary key default gen_random_uuid(),
  feed_source_id uuid not null references feed_sources(id) on delete cascade,
  status text not null default 'running' check (status in ('running','completed','completed_with_errors','failed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  records_seen integer not null default 0,
  records_accepted integer not null default 0,
  records_rejected integer not null default 0,
  error_summary jsonb not null default '{}'::jsonb
);

create index if not exists import_runs_feed_source_id_started_at_idx on import_runs(feed_source_id, started_at desc);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  merchant_id uuid not null references merchants(id) on delete cascade,
  feed_source_id uuid references feed_sources(id) on delete set null,
  merchant_product_id text not null,
  price numeric(12,2) not null check (price >= 0),
  currency char(3) not null default 'EUR',
  shipping_cost numeric(12,2) check (shipping_cost is null or shipping_cost >= 0),
  availability text,
  product_url text not null,
  affiliate_url text not null,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (merchant_id, merchant_product_id)
);

create index if not exists offers_product_id_active_price_idx on offers(product_id, is_active, price);
create index if not exists offers_merchant_id_active_idx on offers(merchant_id, is_active);
create index if not exists offers_last_seen_at_idx on offers(last_seen_at);

create table if not exists product_identifiers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  identifier_type text not null check (identifier_type in ('gtin','ean','upc','mpn','merchant_sku','fingerprint')),
  identifier_value text not null,
  merchant_id uuid references merchants(id) on delete cascade,
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  created_at timestamptz not null default now()
);

create index if not exists product_identifiers_lookup_idx on product_identifiers(identifier_type, identifier_value);
create unique index if not exists product_identifiers_global_unique_idx
  on product_identifiers(identifier_type, identifier_value)
  where merchant_id is null and identifier_type in ('gtin','ean','upc');

comment on table products is 'Canonical Winkelnu products, independent of individual merchants.';
comment on table offers is 'Merchant-specific purchasable/affiliate offers linked to canonical products.';
comment on table import_runs is 'Operational audit trail for feed ingestion runs.';
