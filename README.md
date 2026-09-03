# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository is op 3 september 2026 geïnitialiseerd en bevat inmiddels de technische applicatiefundering en de eerste architectuurgrenzen.

Afgerond:
- M0.1 — Repository Alignment & Verification
- M0.2 — Tooling & Application Scaffold
- M0.3 — Foundation Architecture

## Stack
- Next.js 16 — App Router
- React 19
- TypeScript — strict
- Tailwind CSS v4
- ESLint
- GitHub Actions
- Vercel — gepland voor preview/productie
- Supabase/Postgres — gepland als persistencelaag

## Lokale start

```bash
npm install
npm run dev
```

Kwaliteitscontrole:

```bash
npm run check
```

## Projectdocumentatie
- [`docs/WINKELNU_PROJECT_CONTEXT.md`](docs/WINKELNU_PROJECT_CONTEXT.md) — centrale projectgrondwet
- [`docs/architecture/FOUNDATION_ARCHITECTURE.md`](docs/architecture/FOUNDATION_ARCHITECTURE.md)
- [`docs/architecture/FEED_INGESTION_CONTRACT.md`](docs/architecture/FEED_INGESTION_CONTRACT.md)
- [`docs/milestones/`](docs/milestones/) — formele bouwmijlpalen

## Kernprincipe

Winkelnu wordt feedgedreven gebouwd. Merchantdata komt binnen via adapters, wordt gevalideerd en genormaliseerd en wordt pas daarna onderdeel van de publieke catalogus. Productidentiteit, merchantoffers en affiliatebestemmingen blijven bewust van elkaar gescheiden.

## Volgende technische fase

M0.4 — Persistence & Catalog Schema Design: de databasegrondslag voor merchants, products, offers, categories, imports en matching, zonder al partner-specifieke feeds te koppelen.
