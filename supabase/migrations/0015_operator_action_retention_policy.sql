comment on table operator_action_requests is
  'Server-only idempotency ledger for human operator mutations. Retain records for at least 90 days. No automatic deletion is enabled; cleanup must be a deliberate service-role maintenance operation with separate review and audit.';
