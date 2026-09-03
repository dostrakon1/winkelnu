# Internal Operations Dashboard & Incident Prioritization

M0.32 vertaalt de M0.31 read surface naar een compacte operatorweergave. Het dashboard blijft read-only en server-side.

## Prioriteitsmodel

Incidenten worden afgeleid uit integration- en feedstatus en krijgen één severity:

1. `critical`
   - actieve integration zonder credential reference;
   - feed met `attention_required`.
2. `high`
   - falende feed;
   - actieve feed zonder geobserveerde orchestration/health state.
3. `medium`
   - vertraagde feed;
   - pending integration.
4. `low`
   - paused/ended integration die operatorcontrole kan vereisen.

Elke incidentregel bevat een concrete `operatorAction`. Het dashboard voert zelf geen writes, retries, pauzes of activaties uit.

## Endpoint

`GET /api/ops/dashboard`

- gebruikt dezelfde bearer-auth boundary als de partner portfolio read surface;
- vereist `CATALOG_PERSISTENCE=supabase`;
- retourneert `Cache-Control: no-store`;
- toont alleen operationele metadata en incidenten;
- exposeert geen secret refs, secretwaarden of trackingconfig.

## Fail-closed gedrag

Een actieve feed zonder health-observatie wordt niet als gezond beschouwd. Dit levert een `high` incident `feed_not_running` op totdat een gecontroleerde run orchestration state heeft geproduceerd.

## Scope

M0.32 introduceert nog geen menselijke backoffice, login, mutaties of automatische remediation. Het contract is bedoeld als veilige basis voor een latere interne UI of operator tooling.
