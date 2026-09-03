# Operator Action History & Recovery Observability

Status: M0.38 repository-side implemented.

## Doel
Winkelnu toont recente menselijke recoveryacties naast operationele incidenten, zonder de write-scope verder uit te breiden.

## Read model
`OperatorActionHistoryService` leest maximaal 50 recente terminale audit-events (`succeeded` of `failed`). De standaard UI toont de laatste 20.

De read surface bevat uitsluitend:
- actor e-mail;
- actorrol;
- actie;
- target type/id;
- merchant external key indien veilig aanwezig;
- feed source key indien veilig aanwezig;
- outcome;
- timestamp.

Vrije metadata en ruwe foutteksten worden niet aan de UI doorgegeven. Dit voorkomt dat runtime-details of credentials via observability uitlekken.

## Datasource
`SupabaseOperatorActionHistoryRepository` leest server-side met de bestaande service-role client uit `operator_audit_events`. Er is geen browser-Supabase-query en geen nieuwe databasewrite of RPC nodig.

## UI
`/intern/operations` laadt operations health en action history parallel. Het dashboard toont recente acties newest-first naast incidenten. Recovery permissions en writeflows uit M0.35–M0.37 blijven ongewijzigd.

## Security
- operator session blijft verplicht;
- service-role blijft server-only;
- history is read-only;
- geen secret refs, tokens, tracking config, vrije metadata of error messages in de UI;
- geen nieuwe mutation permissions.
