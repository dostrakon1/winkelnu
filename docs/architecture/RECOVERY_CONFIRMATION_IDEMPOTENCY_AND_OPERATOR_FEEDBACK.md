# Recovery Confirmation, Idempotency & Operator Feedback

Status: repository-side implemented in M0.37.

## Goal
Make the first human feed-recovery writes safe to operate repeatedly from a browser without accidental duplicate mutations or ambiguous outcomes.

## Interaction boundary
Recovery remains limited to retry, pause and resume. No partner activation, catalog editing or credential mutation is introduced here.

The UI adds three protections:
- pending buttons are disabled while a Server Action is running;
- pausing a feed requires an explicit browser confirmation because it stops automatic imports;
- every Server Action returns visible success, duplicate or error feedback.

## Server-side idempotency
Client-side disabled state is not considered sufficient. Each rendered recovery action carries a request key derived from the current dashboard snapshot, incident and operation.

`IdempotentOperatorActionService` claims that key through `OperatorActionIdempotencyRepository` before entering the audit/mutation boundary. The Supabase implementation inserts into `operator_action_requests`, where `request_key` is unique.

Execution order:

`session → role permission → idempotency claim → attempted audit → mutation → succeeded/failed audit → idempotency completion`

If a duplicate request key is submitted, claim returns false and the recovery mutation and duplicate audit events are skipped.

If the idempotency claim itself cannot be persisted for a reason other than an existing key, execution fails closed before mutation.

## Database boundary
Migration `0013_operator_action_idempotency.sql` creates `operator_action_requests` with RLS enabled. `anon` and `authenticated` receive no access. The service role may select/insert/update the ledger.

The ledger stores operational identifiers and status only. It must not contain credentials, tokens or partner secrets.

## Feedback semantics
- `success`: the mutation executed once and was audited;
- `duplicate`: this request key was already claimed, so no second mutation was performed;
- `error`: the server-side operation failed or was denied.

A successful mutation revalidates `/intern/operations` so a subsequent render reflects current feed state.

## Non-goals
- automatic retry loops;
- destructive actions;
- partner activation;
- replacing the immutable audit trail with the idempotency ledger;
- live Supabase verification before a real project is connected.
