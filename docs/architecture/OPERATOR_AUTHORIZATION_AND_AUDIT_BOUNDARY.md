# Operator Authorization & Audit Boundary

M0.35 voegt expliciete rollen en een verplichte auditgrens toe vóórdat Winkelnu interne write-actions krijgt.

## Rollen

- `owner`: read operations, retry/pause feeds, partneractivatie en operatorbeheer.
- `operator`: read operations en operationele feedacties zoals retry/pause.
- `read_only`: uitsluitend operations lezen.

De bestaande `WINKELNU_OPERATOR_EMAILS` blijft de login-allowlist. `WINKELNU_OPERATOR_ROLES` kent expliciete rollen toe in het formaat:

```env
WINKELNU_OPERATOR_ROLES=owner@example.com:owner,ops@example.com:operator,reader@example.com:read_only
```

Een toegestane gebruiker zonder expliciete role assignment valt bewust terug naar `read_only`. Daarmee kan ontbrekende roleconfig nooit per ongeluk mutationrechten geven.

## Audit boundary

`AuditedOperatorActionService` is de verplichte application boundary voor toekomstige menselijke mutations.

Volgorde:

1. controleer role/permission;
2. schrijf append-only `attempted` audit event;
3. voer de mutation uit;
4. schrijf `succeeded` of `failed` met dezelfde correlation ID.

Wanneer het eerste audit event niet kan worden opgeslagen wordt de mutation niet uitgevoerd.

## Database

Migration `0011_operator_roles_and_audit_boundary.sql` voegt `operator_audit_events` toe. De tabel:

- heeft RLS aan;
- is alleen select/insertbaar via service role;
- bevat actor, role, action, target, status, correlation ID en tijdstip;
- blokkeert UPDATE en DELETE via een database trigger en is dus append-only.

Credentials, passwords, tokens en secretwaarden mogen nooit als auditmetadata worden opgeslagen.

## Due-feed hardening

Voorafgaand aan de auditmigration repareert `0010_due_feed_discovery_bootstrap.sql` een oudere production correctness gap. Due feed discovery start nu bij actieve `feed_sources` met een LEFT JOIN naar orchestration, zodat een nieuwe actieve feed zonder bestaande orchestrationrow wél voor zijn eerste import gevonden kan worden.

## Nog geen mutations

M0.35 introduceert uitsluitend permission- en auditinfrastructuur. Er zijn nog geen retry-, pause- of activation-knoppen/API-writes toegevoegd. Die mogen pas later via `AuditedOperatorActionService` worden geïmplementeerd.
