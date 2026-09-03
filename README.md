# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository is op 3 september 2026 geïnitialiseerd en bevat inmiddels een werkende technische fundering, een synthetic end-to-end catalogusproef en een veilige kwaliteits-/observabilitylaag voor feedimports.

Afgerond:
- M0.1 — Repository Alignment & Verification
- M0.2 — Tooling & Application Scaffold
- M0.3 — Foundation Architecture
- M0.4 — Persistence & Catalog Schema Design
- M0.5 — Boundaries & Deployment Readiness
- M0.6 — Synthetic Catalog Vertical Slice
- M0.7 — Catalog Quality, Matching & Import Observability

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
- [`docs/architecture/CATALOG_QUALITY_AND_IMPORT_OBSERVABILITY.md`](docs/architecture/CATALOG_QUALITY_AND_IMPORT_OBSERVABILITY.md)
- [`docs/milestones/`](docs/milestones/) — formele bouwmijlpalen

## Wat de fundering nu bewijst

De storefront kan productdata ontvangen via dezelfde lagen die later echte affiliatefeeds gebruiken:

`merchant feed → adapter → validatie → matching → import run → canonical product + merchant offer → repository → storefront`

Voor de synthetic proef wordt een in-memory repository gebruikt achter dezelfde application ports die later door Supabase/Postgres worden geïmplementeerd. De demo gebruikt uitsluitend synthetische data en `.invalid` bestemmingen.

M0.7 voegt daar veilige importsemantiek aan toe: rejects blijven diagnosticeerbaar maar buiten de catalogus, twijfelgevallen gaan naar matching review, duplicate merchant records worden gecontroleerd en stale offers worden alleen gedeactiveerd nadat een volledige feedrun succesvol is doorlopen.

## Kernprincipe

Winkelnu wordt feedgedreven gebouwd. Merchantdata komt binnen via adapters, wordt gevalideerd en genormaliseerd en wordt pas daarna onderdeel van de publieke catalogus. Productidentiteit, merchantoffers, importkwaliteit en affiliatebestemmingen blijven bewust van elkaar gescheiden.

## Volgende technische fase

**M0.8 — Supabase Persistence Adapter & Repository Integration**: de bestaande application ports koppelen aan PostgreSQL/Supabase, zonder de storefront- of import-use-cases te herschrijven.
