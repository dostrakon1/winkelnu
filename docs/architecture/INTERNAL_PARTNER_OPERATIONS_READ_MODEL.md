# Internal Partner Operations Read Model

M0.31 koppelt de operationele partnerlaag aan echte Supabase registry- en orchestrationdata zonder een publieke adminomgeving te introduceren.

## Read model

`PartnerOperationsReadService` leest via `PartnerOperationsReadRepository` een server-side snapshot van:

- merchant affiliate integrations;
- affiliate networknaam;
- integration status;
- aanwezigheid van een secret reference (nooit de secret zelf);
- gekoppelde feed sources;
- feed source type/active status;
- orchestration state;
- afgeleide `FeedHealth`.

De Supabase-adapter gebruikt de service-role server client. Browsercode krijgt geen databaseclient en RLS blijft de public-schema baseline.

## Secure ops surface

`GET /api/ops/partner-portfolio` is een machine/operations endpoint, geen publieke adminpagina.

Het endpoint:

- vereist `Authorization: Bearer ...`;
- gebruikt bij voorkeur `WINKELNU_OPS_READ_SECRET`, met `CRON_SECRET` als bestaande operations fallback;
- weigert te draaien wanneer `CATALOG_PERSISTENCE` niet `supabase` is;
- retourneert `Cache-Control: no-store`;
- retourneert uitsluitend operationele metadata, nooit credentialwaarden.

## Security boundary

De response mag aangeven dat een integration een secret reference heeft, maar mag `secret_ref` zelf niet tonen. Trackingconfig en andere potentieel gevoelige configuratie worden evenmin door deze read surface teruggegeven.

De route is niet bedoeld als authenticatiemodel voor een toekomstige menselijke backoffice. Als Winkelnu later een echte interne beheerinterface krijgt, krijgt die eigen user/session/role-auth en blijft deze bearer operations surface daarvan gescheiden.
