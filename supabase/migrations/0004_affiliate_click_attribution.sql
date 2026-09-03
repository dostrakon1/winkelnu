create table if not exists affiliate_click_events (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  offer_id uuid not null references offers(id) on delete restrict,
  product_id uuid not null references products(id) on delete restrict,
  merchant_id uuid not null references merchants(id) on delete restrict,
  source_path text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists affiliate_click_events_offer_time_idx
  on affiliate_click_events (offer_id, occurred_at desc);

create index if not exists affiliate_click_events_product_time_idx
  on affiliate_click_events (product_id, occurred_at desc);

create index if not exists affiliate_click_events_merchant_time_idx
  on affiliate_click_events (merchant_id, occurred_at desc);

comment on table affiliate_click_events is
  'Privacy-minimal outbound affiliate click attribution. No raw IP address or user-agent fingerprint is stored in the baseline.';
