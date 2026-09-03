# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels een werkende technische fundering, synthetic end-to-end catalogusproef, importobservability, Supabase/Postgres repository-adapter, geautomatiseerde catalogustests, persistence-onafhankelijke storefront queries, SEO-veilige discovery/search, een eigen affiliate redirect/click-attributielaag, een expliciete affiliate network/merchant integration registry en partner-feed adapterresolution.

Afgerond / geïmplementeerd:
- M0.1 — Repository Alignment & Verification
- M0.2 — Tooling & Application Scaffold
- M0.3 — Foundation Architecture
- M0.4 — Persistence & Catalog Schema Design
- M0.5 — Boundaries & Deployment Readiness
- M0.6 — Synthetic Catalog Vertical Slice
- M0.7 — Catalog Quality, Matching & Import Observability
- M0.8 — Supabase Persistence Adapter & Repository Integration (repository-side complete; live project activation pending)
- M0.9 — Persistence Verification & Database Typing (repository-side verification/tooling complete; live Supabase gate pending)
- M0.10 — Automated Catalog Test Harness
- M0.11 — Catalog Service & Storefront Query Layer
- M0.12 — Category & Discovery Query Architecture
- M0.13 — Search & Filter Query Architecture
- M0.14 — Affiliate Redirect & Click Attribution Architecture (repository-side complete; live Supabase verification pending)
- M0.15 — Affiliate Network & Merchant Integration Registry (repository-side complete; live Supabase verification pending)
- M0.16 — Partner Adapter Registration & Feed Source Resolution

## Stack
- Next.js 16 — App Router
- React 19
- Node.js 22+
- TypeScript — strict
- Tailwind CSS v4
- ESLint
- Vitest 4
- GitHub Actions
- Vercel — gepland voor preview/productie
- Supabase/Postgres — adapters en migraties voorbereid; live projectkoppeling volgt

## Lokale start

```bash
npm install
npm run dev
```

Volledige kwaliteitscontrole:

```bash
npm run check
```

Deze controle voert database-contractverificatie, lint, TypeScript, tests en de production build uit.

## Persistence

Standaard gebruikt ontwikkeling de in-memory adapter:

```env
CATALOG_PERSISTENCE=memory
```

Na het aanmaken en migreren van een echt Supabase-project kan een previewomgeving schakelen naar:

```env
CATALOG_PERSISTENCE=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
SUPABASE_PROJECT_ID=<project-ref>
```

Partnercredentials worden nooit in registry- of config-rijen opgeslagen. Integraties bewaren uitsluitend server-side secret references zoals:

```text
env:AFFILIATE_PARTNER_API_TOKEN
```

Beschikbare verificatiecommando's:

```bash
npm run check:db-contract
npm run verify:supabase
npm run types:supabase
```

Zie [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Wat de fundering nu bewijst

De ingestieketen is gescheiden van de storefront-queryketen:

`merchant feed → adapter → validatie → matching → import run → canonical product + merchant offer → repository`

De publieke storefront leest via:

`Next.js route → CatalogService → CatalogReadRepository → persistence adapter`

Categorie-ontdekking gebruikt duurzame `/categorie/<slug>` routes. Zoek/filter-combinaties via `/zoeken` zijn bewust `noindex,follow` zodat queryvarianten geen onbeheersbare SEO-index vormen.

Aanbiedingen worden gerangschikt en op prijs gefilterd op bekende totale koopprijs: productprijs plus bekende verzendkosten.

Outbound affiliateklikken lopen via `/uit/<offer-id>`. De server resolveert de opgeslagen bestemming, weigert ontbrekende/inactieve/onveilige offers en schrijft privacy-minimale click-attributie zonder rauw IP-adres of user-agentfingerprint.

De affiliate-integratieketen is nu expliciet:

`merchant → affiliate integration → affiliate network/marketplace (indien van toepassing) → feed source → partner adapter`

`PartnerFeedSourceResolver` bepaalt eerst of de source/integration/network-context actief en consistent is. Daarna kiest `PartnerFeedAdapterRegistry` uitsluitend in de infrastructurelaag de technische adapter met sleutels zoals `network-slug:api`, `direct:csv` of `generic:xml`. Eventuele `env:` credentials worden pas op dat moment server-side opgelost en komen niet in application/domain modellen terecht.

PostgreSQL UUIDs blijven interne relationele sleutels. Duurzame Winkelnu-identiteiten worden opgeslagen als `external_key`.

## Kernprincipe

Winkelnu wordt feedgedreven gebouwd. Merchantdata komt binnen via adapters, wordt gevalideerd en genormaliseerd en wordt pas daarna onderdeel van de publieke catalogus. Productidentiteit, merchantoffers, importkwaliteit, persistence, querylogica, discovery, search, affiliate-attributie, partnerintegratiecontext en concrete provideradapters blijven bewust van elkaar gescheiden.

## Volgende technische fase

**M0.17 — Realistic Partner Adapter Contract & Fixture Proof**: één realistische providerachtige feedadapter bouwen met fixturedata, veldmapping, paginering/fouten en end-to-end importtests, zonder al productiecredentials of een echt affiliateprogramma nodig te hebben.
