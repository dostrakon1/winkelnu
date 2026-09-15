-- Measurement Core v1.0
-- Privacy-minimal storage for meaningful non-commercial product/navigation events.
-- Public clients never receive direct table access; writes go through the validated
-- server-side ingestion boundary.

create table measurement_events (
  id uuid primary key default gen_random_uuid(),
  external_key uuid not null unique,
  event_name text not null,
  event_version smallint not null,
  event_group text not null,
  source_path text not null,
  target_type text not null,
  target_key text not null,
  placement text not null,
  properties jsonb not null default '{}'::jsonb,
  ingestion_source text not null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint measurement_events_version_check check (event_version > 0),
  constraint measurement_events_name_check check (char_length(event_name) between 1 and 80),
  constraint measurement_events_group_check check (char_length(event_group) between 1 and 40),
  constraint measurement_events_source_path_check check (
    char_length(source_path) between 1 and 300
    and left(source_path, 1) = '/'
    and source_path not like '//%'
    and position('?' in source_path) = 0
    and position('#' in source_path) = 0
  ),
  constraint measurement_events_target_type_check check (char_length(target_type) between 1 and 60),
  constraint measurement_events_target_key_check check (char_length(target_key) between 1 and 160),
  constraint measurement_events_placement_check check (char_length(placement) between 1 and 80),
  constraint measurement_events_properties_object_check check (jsonb_typeof(properties) = 'object'),
  constraint measurement_events_ingestion_source_check check (ingestion_source in ('client', 'server'))
);

create index measurement_events_time_idx
  on measurement_events (occurred_at desc);

create index measurement_events_target_time_idx
  on measurement_events (target_type, target_key, occurred_at desc);

create index measurement_events_source_time_idx
  on measurement_events (source_path, occurred_at desc);

alter table measurement_events enable row level security;

revoke all on table measurement_events from public, anon, authenticated;
grant select, insert, delete on table measurement_events to service_role;

comment on table measurement_events is
  'Privacy-minimal Measurement Core events. No raw IP address, user-agent fingerprint, visitor identifier, advertising identifier, email, name, full referrer, query string or arbitrary free-text payload belongs here.';

comment on column measurement_events.external_key is
  'Per-event idempotency UUID. This is not a visitor or session identifier.';

comment on column measurement_events.source_path is
  'Sanitized internal Winkelnu pathname only; query strings and fragments are forbidden.';
