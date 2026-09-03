alter table import_runs
  add column if not exists offers_deactivated integer not null default 0,
  add column if not exists review_required integer not null default 0;

create table if not exists import_rejects (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid not null references import_runs(id) on delete cascade,
  source_key text not null,
  merchant_product_id text not null,
  reasons jsonb not null default '[]'::jsonb,
  raw_record jsonb,
  rejected_at timestamptz not null default now()
);

create index if not exists import_rejects_import_run_id_idx
  on import_rejects(import_run_id, rejected_at);

create table if not exists product_match_reviews (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid not null references import_runs(id) on delete cascade,
  merchant_id uuid not null references merchants(id) on delete cascade,
  source_key text not null,
  merchant_product_id text not null,
  canonical_product_id uuid references products(id) on delete set null,
  match_method text not null check (match_method in ('gtin_exact','mpn_brand_exact','source_identity','manual','unmatched')),
  confidence text not null check (confidence in ('certain','high','review','none')),
  reasons jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (import_run_id, merchant_product_id)
);

create index if not exists product_match_reviews_pending_idx
  on product_match_reviews(status, created_at)
  where status = 'pending';

create index if not exists product_match_reviews_canonical_product_id_idx
  on product_match_reviews(canonical_product_id)
  where canonical_product_id is not null;

comment on table import_rejects is 'Rejected source records retained for diagnosis without entering the public catalog.';
comment on table product_match_reviews is 'Auditable queue for ambiguous or duplicate product matching decisions.';
