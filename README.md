# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository is op 3 september 2026 geïnitialiseerd en bevat inmiddels een werkende technische fundering, synthetic end-to-end catalogusproef, importobservability, Supabase/Postgres repository-adapter, geautomatiseerde catalogustests, een persistence-onafhankelijke storefront query-laag, SEO-veilige categorie/discovery-routes en gecontroleerde zoek/filterarchitectuur.

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

## Wat de fundering nu bewijst

De ingestieketen is gescheiden van de storefront-queryketen:

`merchant feed → adapter → validatie → matching → import run → canonical product + merchant offer → repository`

De publieke storefront leest vervolgens via:

`Next.js route → CatalogService → CatalogReadRepository → persistence adapter`

Daardoor kennen pagina's geen feed-, synthetic- of Supabase-details. Dezelfde storefront-querylaag werkt boven in-memory development en later boven Supabase/Postgres.

Categorie-ontdekking loopt via duurzame routes zoals `/categorie/<slug>`. Alleen de hoofd-categoriepagina wordt als indexeerbare SEO-entiteit behandeld; diepe paginering blijft navigeerbaar maar `noindex,follow`.

Zoeken loopt via `/zoeken` met gecontroleerde GET-parameters voor zoekterm, categorie, merk, minimum/maximum totale prijs, voorraad, sortering en pagina. Alle zoek/filter-combinaties zijn bewust `noindex,follow` en worden niet aan de sitemap toegevoegd. Curated SEO-landingspagina's moeten later expliciete routes worden, niet toevallige querycombinaties.

Aanbiedingen worden gerangschikt en op prijs gefilterd op bekende totale koopprijs: productprijs plus bekende verzendkosten.

PostgreSQL UUIDs blijven interne relationele sleutels. Duurzame Winkelnu-identiteiten worden opgeslagen als `external_key`.

## Kernprincipe

Winkelnu wordt feedgedreven gebouwd. Merchantdata komt binnen via adapters, wordt gevalideerd en genormaliseerd en wordt pas daarna onderdeel van de publieke catalogus. Productidentiteit, merchantoffers, importkwaliteit, persistence, querylogica, discovery, search en affiliatebestemmingen blijven bewust van elkaar gescheiden.

## Volgende technische fase

**M0.14 — Affiliate Redirect & Click Attribution Architecture**: outbound affiliateverkeer via een eigen, transparante redirectlaag sturen met offer-identiteit, click-attributie, veilige bestemmingsvalidatie en meetbaarheid zonder Winkelnu als verkoper te presenteren.
