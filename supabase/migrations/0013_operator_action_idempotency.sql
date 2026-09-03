create table if not exists operator_action_requests (
  id uuid primary key default gen_random_uuid(),
  request_key text not null unique,
  actor_user_id uuid not null,
  action text not null,
  target_type text not null,
  target_id text,
  status text not null default 'in_progress' check (status in ('in_progress','succeeded','failed')),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists operator_action_requests_created_at_idx
  on operator_action_requests(created_at desc);

alter table operator_action_requests enable row level security;

revoke all on table operator_action_requests from public, anon, authenticated;
grant select, insert, update on table operator_action_requests to service_role;

comment on table operator_action_requests is 'Server-only idempotency ledger for human operator mutations. A unique request_key guarantees one mutation attempt per rendered operator action request.';
