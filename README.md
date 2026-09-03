# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository is op 3 september 2026 geïnitialiseerd en bevat inmiddels een werkende technische fundering plus een synthetic end-to-end catalogusproef.

Afgerond:
- M0.1 — Repository Alignment & Verification
- M0.2 — Tooling & Application Scaffold
- M0.3 — Foundation Architecture
- M0.4 — Persistence & Catalog Schema Design
- M0.5 — Boundaries & Deployment Readiness
- M0.6 — Synthetic Catalog Vertical Slice

## Stack
- Next.js 16 — App Router
- React 19
- TypeScript — strict
- Tailwind CSS v4
- ESLint
- GitHub Actions
- Vercel — gepland voor preview/productie
- Supabase/Postgres — schema voorbereid; live projectkoppeling volgt

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

## Wat M0.6 bewijst

De storefront kan nu productdata ontvangen via dezelfde lagen die later echte affiliatefeeds gebruiken:

`merchant feed → adapter → validatie → import use case → canonical product + merchant offer → repository → storefront`

Voor deze proef wordt een in-memory repository gebruikt achter dezelfde application ports die later door Supabase/Postgres worden geïmplementeerd. De demo gebruikt uitsluitend synthetische data en `.invalid` bestemmingen.

## Kernprincipe

Winkelnu wordt feedgedreven gebouwd. Merchantdata komt binnen via adapters, wordt gevalideerd en genormaliseerd en wordt pas daarna onderdeel van de publieke catalogus. Productidentiteit, merchantoffers en affiliatebestemmingen blijven bewust van elkaar gescheiden.

## Volgende technische fase

**M0.7 — Catalog Quality, Matching & Import Observability**: matching confidence, duplicate handling, import-run rapportage, rejected records en stale-offer gedrag formaliseren vóór de eerste echte affiliatefeed wordt gekoppeld.
