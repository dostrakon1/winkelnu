# Operator Recovery Hardening & Safe Error Boundary

M0.46 hardens the existing human recovery path without adding new recovery mutations.

## Authorization before idempotency
`IdempotentOperatorActionService` now checks the actor permission before `operator_action_requests.tryClaim()` is called. A denied operator therefore cannot reserve an idempotency request key. `AuditedOperatorActionService` repeats the permission check as defense in depth.

## Safe operator-facing errors
The internal Server Action no longer returns raw exception messages to the browser. Recovery failures are mapped to one fixed operator-facing message. Database names, RPC names, Supabase details, SQL errors and internal relation names are not exposed through the action state.

Internal audit/idempotency persistence may still retain failure evidence for trusted server-side diagnosis; that evidence is not echoed to the operator UI.

## Idempotency retention policy
`operator_action_requests` records are retained for at least 90 days. No automatic deletion job or delete RPC is introduced in M0.46. Any future cleanup must be a deliberate service-role maintenance operation with separate review and audit.

This keeps duplicate-prevention evidence available through the operational window while avoiding an unreviewed background deletion capability.
