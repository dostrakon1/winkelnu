alter table merchants add column if not exists external_key text;
alter table categories add column if not exists external_key text;
alter table products add column if not exists external_key text;
alter table offers add column if not exists external_key text;

create unique index if not exists merchants_external_key_uidx on merchants(external_key) where external_key is not null;
create unique index if not exists categories_external_key_uidx on categories(external_key) where external_key is not null;
create unique index if not exists products_external_key_uidx on products(external_key) where external_key is not null;
create unique index if not exists offers_external_key_uidx on offers(external_key) where external_key is not null;

comment on column merchants.external_key is 'Stable application/domain identity; database UUID remains the relational primary key.';
comment on column categories.external_key is 'Stable application/domain identity; database UUID remains the relational primary key.';
comment on column products.external_key is 'Stable canonical Winkelnu product identity, e.g. product:<gtin>.';
comment on column offers.external_key is 'Stable application offer identity independent from the relational UUID.';
