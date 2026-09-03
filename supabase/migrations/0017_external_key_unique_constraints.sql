-- PostgREST/Supabase upsert with onConflict=external_key requires a plain
-- UNIQUE constraint/index that can be inferred without a partial predicate.
-- Migration 0003 used partial unique indexes (WHERE external_key IS NOT NULL),
-- which protect non-null values but are not valid conflict targets for the
-- repository upserts that use onConflict: 'external_key'.

alter table merchants add constraint merchants_external_key_unique unique (external_key);
alter table categories add constraint categories_external_key_unique unique (external_key);
alter table products add constraint products_external_key_unique unique (external_key);
alter table offers add constraint offers_external_key_unique unique (external_key);
alter table import_runs add constraint import_runs_external_key_unique unique (external_key);

drop index if exists merchants_external_key_uidx;
drop index if exists categories_external_key_uidx;
drop index if exists products_external_key_uidx;
drop index if exists offers_external_key_uidx;
drop index if exists import_runs_external_key_uidx;

comment on constraint merchants_external_key_unique on merchants is
  'Stable domain identity and valid ON CONFLICT target for server-side upserts.';
comment on constraint categories_external_key_unique on categories is
  'Stable domain identity and valid ON CONFLICT target for server-side upserts.';
comment on constraint products_external_key_unique on products is
  'Stable canonical product identity and valid ON CONFLICT target for server-side upserts.';
comment on constraint offers_external_key_unique on offers is
  'Stable offer identity and valid ON CONFLICT target for server-side upserts.';
comment on constraint import_runs_external_key_unique on import_runs is
  'Stable import-run identity and valid ON CONFLICT target for server-side upserts.';
