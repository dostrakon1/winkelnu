# Audited Feed Recovery Actions

M0.36 introduceert de eerste menselijke write-acties in Winkelnu Operations. De scope is bewust beperkt tot feed recovery:

- retry now;
- pause;
- resume.

Partneractivatie, credentialbeheer, productwijzigingen en andere beheerwrites vallen buiten deze fase.

## Security- en auditketen

Elke recovery-actie loopt via dezelfde vaste keten:

`Supabase Auth session → operator role → permission check → attempted audit event → service-role recovery RPC → succeeded/failed audit event`

Een write mag dus niet rechtstreeks vanuit de UI of Server Action op `feed_sources` of `feed_import_orchestration` schrijven.

`read_only` kan geen recovery uitvoeren. `operator` en `owner` hebben `retry_feed`, `pause_feed` en `resume_feed`.

## Retry

`operator_retry_feed()` accepteert alleen een actieve feed van een actieve merchant en zet `next_run_at` op het opgegeven tijdstip. De functie reset failure history niet: een recovery-poging mag observability niet wissen. Een bestaande lease blijft leidend; due-feed discovery zal een nog geldige lease respecteren.

## Pause

`operator_pause_feed()` zet uitsluitend `feed_sources.is_active=false`. Hierdoor verdwijnt de feed uit due-feed discovery zonder historische import- of orchestrationdata te verwijderen.

## Resume

`operator_resume_feed()` activeert de feed opnieuw en upsert tegelijk een orchestrationrow met `next_run_at` op het opgegeven tijdstip. Daardoor is hervatten expliciet en leidt het direct tot een nieuwe geplande importmogelijkheid.

## UI

Gepauzeerde feeds blijven als `feed_paused` zichtbaar in het interne dashboard. Operators kunnen daardoor zien waarom een feed niet draait en hem bewust hervatten.

De knoppen zijn role-aware, maar UI-verbergen is niet de securitygrens. De Server Action vraagt opnieuw een server-confirmed operator session op en `AuditedOperatorActionService` controleert de permission opnieuw vóór de mutation.

## Database boundary

Migration `0012_feed_recovery_actions.sql` bevat drie `SECURITY DEFINER` RPCs. Execute is ingetrokken voor `public`, `anon` en `authenticated` en alleen aan `service_role` toegekend.

De menselijke Supabase Auth-session krijgt dus nooit directe database-writepermission voor deze recoveryacties.
