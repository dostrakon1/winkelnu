# Internal Operator UI Shell

M0.33 voegt de eerste visuele interne operationspagina toe zonder een publieke beheeromgeving of beheerwrites te introduceren.

## Route

`/intern/operations`

De route is bewust niet `/admin`. De routenaam is echter geen security boundary: toegang wordt server-side gecontroleerd.

## Security

- server-rendered Next.js App Router page;
- authorization wordt uit de request headers gelezen;
- dezelfde constant-time Bearer-check als de ops API wordt hergebruikt;
- ontbrekende/onjuiste authorization resulteert in `notFound()`;
- `robots` staat op `noindex`, `nofollow`, `nocache`;
- `CATALOG_PERSISTENCE=supabase` is vereist;
- Supabase service-role blijft uitsluitend server-side;
- browser-JavaScript ontvangt geen ops-secret, secret refs, trackingconfig of credentialwaarden;
- de pagina bevat geen mutations, retryknoppen, activatieknoppen of andere beheerwrites.

## UI-contract

De operatorweergave toont:

- aantal integrations;
- aantal actieve integrations;
- aantal feeds;
- totaal incidents;
- gecombineerd aantal critical/high incidents;
- incidenten gesorteerd volgens de M0.32-prioriteit;
- merchant/integration/feed context;
- concrete eerstvolgende operatoractie.

## Huidige toegangsbeperking

Bearer-header authorization is geschikt voor machine/reverse-proxy/internal tooling, maar nog niet de definitieve menselijke loginervaring. Een toekomstige human operator session/auth-laag moet bovenop deze pagina worden geplaatst zonder de service-role of ops bearer secret client-side te exposeren.
