# Human Operator Authentication & Session Boundary

M0.34 vervangt de tijdelijke browser-Bearer toegang tot `/intern/operations` door een menselijke login met Supabase Auth en cookie-based SSR sessions.

## Architectuur

- `@supabase/ssr` verzorgt cookie-based sessies voor Next.js.
- `proxy.ts` draait uitsluitend op `/intern/:path*` en laat `getClaims()` de tokenrefresh/validatieketen uitvoeren.
- Server Components en Server Actions gebruiken `createSupabaseAuthServerClient()`.
- `/intern/login` gebruikt e-mail + wachtwoord via `signInWithPassword()`.
- `/intern/operations` gebruikt `requireOperatorSession()` en `auth.getUser()` voor een server-confirmed user.
- `WINKELNU_OPERATOR_EMAILS` is een komma-gescheiden allowlist en is aanvullend op Supabase Auth.

## Fail-closed regels

Een geldige Supabase-user is niet automatisch Winkelnu-operator. Toegang vereist tegelijk:

1. een geldige Supabase Auth sessie;
2. een server-bevestigde user;
3. een e-mailadres dat exact in `WINKELNU_OPERATOR_EMAILS` staat.

Een ontbrekende allowlist betekent: niemand krijgt toegang.

## Environment

Voor de human-authlaag zijn nodig:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `WINKELNU_OPERATOR_EMAILS`

Voor het operations-dashboard blijven daarnaast de bestaande server-only persistencevariabelen nodig, waaronder `SUPABASE_SERVICE_ROLE_KEY` en `CATALOG_PERSISTENCE=supabase`.

De publishable key mag volgens het Supabase-model in browser/SSR-authcontext worden gebruikt; de service-role key blijft uitsluitend server-side.

## Security

- wachtwoorden worden rechtstreeks aan Supabase Auth aangeboden en niet door Winkelnu opgeslagen;
- loginfouten zijn bewust generiek om accountenumeratie te beperken;
- het interne dashboard blijft `noindex`;
- er is geen publieke signupflow;
- geen ops Bearer-secret hoeft nog in een normale browserrequest te worden geplaatst;
- de bestaande `/api/ops/*` machine endpoints behouden hun eigen Bearer-secret en worden niet gekoppeld aan de human session.

## Live gate

Repository-side auth is voorbereid. Live gebruik vereist een echt Supabase-project, Auth-configuratie, minstens één vooraf aangemaakte operator-user en de juiste environmentvariabelen op de deployment.
