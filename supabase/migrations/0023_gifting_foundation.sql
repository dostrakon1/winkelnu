-- Lootje & Lijstje L1 foundation.
-- Consumer access remains application-level capability access. The browser never
-- receives direct Data API privileges for these tables.

create table gift_lists (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  share_code_hash text not null unique,
  owner_token_hash text unique,
  display_name text not null,
  title text,
  occasion text not null,
  budget_min_cents integer,
  budget_max_cents integer,
  event_date date,
  status text not null default 'active',
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gift_lists_status_check check (status in ('active', 'archived')),
  constraint gift_lists_budget_min_check check (budget_min_cents is null or budget_min_cents >= 0),
  constraint gift_lists_budget_max_check check (budget_max_cents is null or budget_max_cents >= 0),
  constraint gift_lists_budget_range_check check (
    budget_min_cents is null or budget_max_cents is null or budget_min_cents <= budget_max_cents
  )
);

create table gift_list_items (
  id uuid primary key default gen_random_uuid(),
  gift_list_id uuid not null references gift_lists(id) on delete cascade,
  item_type text not null,
  product_external_key text,
  external_url text,
  title text not null,
  image_url_snapshot text,
  price_cents_snapshot integer,
  currency_snapshot text,
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gift_list_items_type_check check (item_type in ('winkelnu_product', 'external_link', 'text')),
  constraint gift_list_items_price_check check (price_cents_snapshot is null or price_cents_snapshot >= 0),
  constraint gift_list_items_shape_check check (
    (item_type = 'winkelnu_product' and product_external_key is not null)
    or (item_type = 'external_link' and external_url is not null)
    or (item_type = 'text')
  )
);

create table gift_groups (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  group_code_hash text not null unique,
  organizer_token_hash text not null unique,
  name text not null,
  occasion text not null,
  budget_cents integer,
  event_date date,
  status text not null default 'draft',
  draw_version integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gift_groups_status_check check (status in ('draft', 'drawn', 'closed')),
  constraint gift_groups_budget_check check (budget_cents is null or budget_cents >= 0),
  constraint gift_groups_draw_version_check check (draw_version >= 0)
);

create table gift_group_participants (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  group_id uuid not null references gift_groups(id) on delete cascade,
  gift_list_id uuid not null unique references gift_lists(id) on delete cascade,
  participant_token_hash text not null unique,
  display_name text not null,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gift_group_exclusions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references gift_groups(id) on delete cascade,
  participant_id uuid not null references gift_group_participants(id) on delete cascade,
  excluded_recipient_id uuid not null references gift_group_participants(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint gift_group_exclusions_no_self check (participant_id <> excluded_recipient_id),
  constraint gift_group_exclusions_unique unique (group_id, participant_id, excluded_recipient_id)
);

create table gift_group_assignments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references gift_groups(id) on delete cascade,
  draw_version integer not null,
  giver_participant_id uuid not null references gift_group_participants(id) on delete cascade,
  recipient_participant_id uuid not null references gift_group_participants(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint gift_group_assignments_no_self check (giver_participant_id <> recipient_participant_id),
  constraint gift_group_assignments_draw_version_check check (draw_version > 0),
  constraint gift_group_assignments_giver_unique unique (group_id, draw_version, giver_participant_id),
  constraint gift_group_assignments_recipient_unique unique (group_id, draw_version, recipient_participant_id)
);

create table gift_item_reservations (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references gift_groups(id) on delete cascade,
  gift_list_item_id uuid not null references gift_list_items(id) on delete cascade,
  reserved_by_participant_id uuid not null references gift_group_participants(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint gift_item_reservations_item_unique unique (group_id, gift_list_item_id)
);

create index gift_list_items_list_sort_idx on gift_list_items (gift_list_id, sort_order, created_at);
create index gift_group_participants_group_idx on gift_group_participants (group_id);
create unique index gift_group_participants_display_name_unique
  on gift_group_participants (group_id, lower(btrim(display_name)));
create index gift_group_exclusions_lookup_idx on gift_group_exclusions (group_id, participant_id);
create index gift_group_assignments_giver_lookup_idx on gift_group_assignments (group_id, giver_participant_id);
create index gift_group_assignments_recipient_lookup_idx on gift_group_assignments (group_id, recipient_participant_id);
create index gift_item_reservations_item_idx on gift_item_reservations (gift_list_item_id);
create index gift_lists_expires_at_idx on gift_lists (expires_at);
create index gift_groups_expires_at_idx on gift_groups (expires_at);

alter table gift_lists enable row level security;
alter table gift_list_items enable row level security;
alter table gift_groups enable row level security;
alter table gift_group_participants enable row level security;
alter table gift_group_exclusions enable row level security;
alter table gift_group_assignments enable row level security;
alter table gift_item_reservations enable row level security;

revoke all on table gift_lists from public, anon, authenticated;
revoke all on table gift_list_items from public, anon, authenticated;
revoke all on table gift_groups from public, anon, authenticated;
revoke all on table gift_group_participants from public, anon, authenticated;
revoke all on table gift_group_exclusions from public, anon, authenticated;
revoke all on table gift_group_assignments from public, anon, authenticated;
revoke all on table gift_item_reservations from public, anon, authenticated;

grant select, insert, update, delete on table gift_lists to service_role;
grant select, insert, update, delete on table gift_list_items to service_role;
grant select, insert, update, delete on table gift_groups to service_role;
grant select, insert, update, delete on table gift_group_participants to service_role;
grant select, insert, update, delete on table gift_group_exclusions to service_role;
grant select, insert, update, delete on table gift_group_assignments to service_role;
grant select, insert, update, delete on table gift_item_reservations to service_role;
