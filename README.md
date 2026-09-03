# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository is op 3 september 2026 geïnitialiseerd en bevat inmiddels een werkende technische fundering, een synthetic end-to-end catalogusproef, importobservability en een echte Supabase/Postgres repository-adapter.

Afgerond:
- M0.1 — Repository Alignment & Verification
- M0.2 — Tooling & Application Scaffold
- M0.3 — Foundation Architecture
- M0.4 — Persistence & Catalog Schema Design
- M0.5 — Boundaries & Deployment Readiness
- M0.6 — Synthetic Catalog Vertical Slice
- M0.7 — Catalog Quality, Matching & Import Observability
- M0.8 — Supabase Persistence Adapter & Repository Integration (repository-side complete; live project activation pending)

## Stack
- Next.js 16 — App Router
- React 19
- Node.js 22+
- TypeScript — strict
- Tailwind CSS v4
- ESLint
- GitHub Actions
- Vercel — gepland voor preview/productie
- Supabase/Postgres — adapter en migraties voorbereid; live projectkoppeling volgt

## Lokale start

```bash
npm install
npm run dev
```

Kwaliteitscontrole:

```bash
npm run check
```

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
```

Zie [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Projectdocumentatie
- [`docs/WINKELNU_PROJECT_CONTEXT.md`](docs/WINKELNU_PROJECT_CONTEXT.md) — centrale projectgrondwet
- [`docs/architecture/FOUNDATION_ARCHITECTURE.md`](docs/architecture/FOUNDATION_ARCHITECTURE.md)
- [`docs/architecture/FEED_INGESTION_CONTRACT.md`](docs/architecture/FEED_INGESTION_CONTRACT.md)
- [`docs/architecture/CATALOG_QUALITY_AND_IMPORT_OBSERVABILITY.md`](docs/architecture/CATALOG_QUALITY_AND_IMPORT_OBSERVABILITY.md)
- [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md)
- [`docs/milestones/`](docs/milestones/) — formele bouwmijlpalen

## Wat de fundering nu bewijst

De storefront kan productdata ontvangen via dezelfde lagen die later echte affiliatefeeds gebruiken:

`merchant feed → adapter → validatie → matching → import run → canonical product + merchant offer → repository → storefront`

De persistence-laag is nu verwisselbaar achter dezelfde application ports. Synthetic ontwikkeling gebruikt in-memory persistence; de Supabase-adapter implementeert dezelfde contracten voor merchants, products, offers, categories en importobservability.

PostgreSQL UUIDs blijven interne relationele sleutels. Duurzame Winkelnu-identiteiten worden opgeslagen als `external_key`, zodat canonical productidentiteit niet afhankelijk wordt van database-gegenereerde UUIDs.

## Kernprincipe

Winkelnu wordt feedgedreven gebouwd. Merchantdata komt binnen via adapters, wordt gevalideerd en genormaliseerd en wordt pas daarna onderdeel van de publieke catalogus. Productidentiteit, merchantoffers, importkwaliteit, persistence en affiliatebestemmingen blijven bewust van elkaar gescheiden.

## Volgende technische fase

**M0.9 — Persistence Verification & Database Typing** zodra een echt Supabase-project beschikbaar is. Tot die activatie kan de repository veilig verder ontwikkelen op de in-memory adapter zonder de Supabase-integratie terug te draaien.
