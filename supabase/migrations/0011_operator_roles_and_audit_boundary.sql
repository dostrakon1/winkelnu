create table if not exists operator_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null,
  actor_email text not null,
  actor_role text not null check (actor_role in ('owner', 'operator', 'read_only')),
  action text not null,
  target_type text not null,
  target_id text,
  status text not null check (status in ('attempted', 'succeeded', 'failed')),
  correlation_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  error_message text,
  occurred_at timestamptz not null default now()
);

create index if not exists operator_audit_events_occurred_at_idx
  on operator_audit_events (occurred_at desc);

create index if not exists operator_audit_events_actor_idx
  on operator_audit_events (actor_user_id, occurred_at desc);

create index if not exists operator_audit_events_correlation_idx
  on operator_audit_events (correlation_id);

alter table operator_audit_events enable row level security;

revoke all on table operator_audit_events from public;
revoke all on table operator_audit_events from anon;
revoke all on table operator_audit_events from authenticated;
grant select, insert on table operator_audit_events to service_role;

create or replace function deny_operator_audit_event_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'operator_audit_events is append-only';
end;
$$;

drop trigger if exists operator_audit_events_append_only on operator_audit_events;
create trigger operator_audit_events_append_only
before update or delete on operator_audit_events
for each row execute function deny_operator_audit_event_mutation();
