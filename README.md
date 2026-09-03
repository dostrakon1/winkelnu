# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository is op 3 september 2026 geïnitialiseerd en bevat inmiddels een werkende technische fundering, een synthetic end-to-end catalogusproef, importobservability, een echte Supabase/Postgres repository-adapter, geautomatiseerde catalogustests, een persistence-onafhankelijke storefront query-laag en SEO-veilige categorie/discovery-routes.

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
- Supabase/Postgres — adapter en migraties voorbereid; live projectkoppeling volgt

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

Beschikbare verificatiecommando's:

```bash
npm run check:db-contract
npm run verify:supabase
npm run types:supabase
```

Zie [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Projectdocumentatie
- [`docs/WINKELNU_PROJECT_CONTEXT.md`](docs/WINKELNU_PROJECT_CONTEXT.md) — centrale projectgrondwet
- [`docs/architecture/FOUNDATION_ARCHITECTURE.md`](docs/architecture/FOUNDATION_ARCHITECTURE.md)
- [`docs/architecture/FEED_INGESTION_CONTRACT.md`](docs/architecture/FEED_INGESTION_CONTRACT.md)
- [`docs/architecture/CATALOG_QUALITY_AND_IMPORT_OBSERVABILITY.md`](docs/architecture/CATALOG_QUALITY_AND_IMPORT_OBSERVABILITY.md)
- [`docs/architecture/DATABASE_CONTRACT_AND_TYPING.md`](docs/architecture/DATABASE_CONTRACT_AND_TYPING.md)
- [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md)
- [`docs/milestones/`](docs/milestones/) — formele bouwmijlpalen

## Wat de fundering nu bewijst

De ingestieketen is gescheiden van de storefront-queryketen:

`merchant feed → adapter → validatie → matching → import run → canonical product + merchant offer → repository`

De publieke storefront leest vervolgens via:

`Next.js route → CatalogService → CatalogReadRepository → persistence adapter`

Daardoor kennen pagina's geen feed-, synthetic- of Supabase-details. Dezelfde storefront-querylaag werkt boven in-memory development en later boven Supabase/Postgres.

Categorie-ontdekking loopt via duurzame routes zoals `/categorie/<slug>`. Alleen de hoofd-categoriepagina wordt als indexeerbare SEO-entiteit behandeld; diepe paginering blijft navigeerbaar maar `noindex,follow`. De sitemap bevat alleen duurzame categorie- en product-URL's, niet elke mogelijke queryvariant.

Aanbiedingen worden in de huidige baseline gerangschikt op bekende totale koopprijs: productprijs plus verzendkosten. Dat voorkomt dat een ogenschijnlijk goedkoper aanbod met hoge verzendkosten automatisch als beste aanbod verschijnt.

PostgreSQL UUIDs blijven interne relationele sleutels. Duurzame Winkelnu-identiteiten worden opgeslagen als `external_key`, zodat canonical productidentiteit niet afhankelijk wordt van database-gegenereerde UUIDs.

De kernregels worden automatisch getest: productmatching, duplicate records, invalid records, matching review, stale-offer deactivation, storefront offer-ranking en categorie-paginering.

## Kernprincipe

Winkelnu wordt feedgedreven gebouwd. Merchantdata komt binnen via adapters, wordt gevalideerd en genormaliseerd en wordt pas daarna onderdeel van de publieke catalogus. Productidentiteit, merchantoffers, importkwaliteit, persistence, querylogica, discovery en affiliatebestemmingen blijven bewust van elkaar gescheiden.

## Volgende technische fase

**M0.13 — Search & Filter Query Architecture**: gecontroleerde zoek- en filtersemantiek toevoegen zonder een onbeperkte crawlruimte of thin-index pagina's te creëren.
