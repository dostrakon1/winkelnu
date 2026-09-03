# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, een realistische providerfixture, Daisycon-readiness, gecontroleerde partner-onboarding en persistence-backed import orchestration.

Afgerond / geïmplementeerd:
- M0.1 — Repository Alignment & Verification
- M0.2 — Tooling & Application Scaffold
- M0.3 — Foundation Architecture
- M0.4 — Persistence & Catalog Schema Design
- M0.5 — Boundaries & Deployment Readiness
- M0.6 — Synthetic Catalog Vertical Slice
- M0.7 — Catalog Quality, Matching & Import Observability
- M0.8 — Supabase Persistence Adapter & Repository Integration
- M0.9 — Persistence Verification & Database Typing
- M0.10 — Automated Catalog Test Harness
- M0.11 — Catalog Service & Storefront Query Layer
- M0.12 — Category & Discovery Query Architecture
- M0.13 — Search & Filter Query Architecture
- M0.14 — Affiliate Redirect & Click Attribution Architecture
- M0.15 — Affiliate Network & Merchant Integration Registry
- M0.16 — Partner Adapter Registration & Feed Source Resolution
- M0.17 — Realistic Partner Adapter Contract & Fixture Proof
- M0.18 — First Real Partner Integration Readiness — Daisycon
- M0.19 — Partner Onboarding & Import Orchestration
- M0.20 — Import Scheduling, Concurrency Lease & Failure Recovery

## Stack
- Next.js 16 — App Router
- React 19
- Node.js 22+
- TypeScript — strict
- Tailwind CSS v4
- ESLint
- Vitest 4
- GitHub Actions
- Vercel — gepland
- Supabase/Postgres — adapters/migraties voorbereid; live projectkoppeling volgt

## Lokale start
```bash
npm install
npm run dev
```

Volledige kwaliteitscontrole:
```bash
npm run check
```

## Architectuur in één lijn
`merchant feed → integration registry → source resolver → provider adapter → validatie → matching → import run → canonical product + merchant offer → repository → CatalogService → storefront`

Outbound affiliateklikken lopen via `/uit/<offer-id>` met server-side offerresolutie en privacy-minimale click-attributie.

M0.18 kiest Daisycon als eerste echte readiness-target. De echte account-, programma- en feedmapping-gates zijn nog extern.

M0.19 voegt gecontroleerde onboarding toe: `registered → preview_ready → preview_passed → approved → active`. Previewimports gebruiken dezelfde validatie/matching als productie maar voeren nooit stale-offer-deactivatie uit.

M0.20 voegt per feed source een duurzame orchestration-state toe met `next_run_at`, failure history en een expirerende lease. Lease-acquisitie gebeurt atomair in PostgreSQL. Een tweede worker kan dezelfde feed niet tegelijk draaien, een gecrashte worker verliest zijn lock na expiry, een stale worker kan niet met een oud token completen en mislukte imports krijgen exponentiële backoff. Storefrontverkeer is nooit de scheduler.

PostgreSQL UUIDs blijven interne relationele sleutels; duurzame Winkelnu-identiteiten gebruiken `external_key`.

## Persistence
Ontwikkeling gebruikt standaard `CATALOG_PERSISTENCE=memory`. Live Supabase vereist server-only configuratie en migraties in filename-volgorde. Partnercredentials worden nooit in registryrijen opgeslagen; uitsluitend `env:` secret references worden geregistreerd.

Zie [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Kernprincipe
Winkelnu wordt feedgedreven gebouwd. Externe providerdata wordt eerst vertaald, gevalideerd en gematcht voordat zij publieke catalogusdata kan worden. Productidentiteit, offers, importkwaliteit, persistence, discovery/search, affiliate-attributie, partnercontext, concrete adapters, onboarding en scheduling blijven afzonderlijke verantwoordelijkheden.

## Volgende technische fase
**M0.21 — Due Feed Discovery, Worker Batch Execution & Operational Health**: due sources veilig in batches selecteren, de volledige resolver/adapter/import/orchestration-keten uitvoeren en operationele health/escalatie voor langdurig falende feeds toevoegen.
