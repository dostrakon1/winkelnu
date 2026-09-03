# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, een realistische providerfixture, Daisycon-readiness en gecontroleerde partner-onboarding.

Afgerond / geïmplementeerd:
- M0.1 — Repository Alignment & Verification
- M0.2 — Tooling & Application Scaffold
- M0.3 — Foundation Architecture
- M0.4 — Persistence & Catalog Schema Design
- M0.5 — Boundaries & Deployment Readiness
- M0.6 — Synthetic Catalog Vertical Slice
- M0.7 — Catalog Quality, Matching & Import Observability
- M0.8 — Supabase Persistence Adapter & Repository Integration (repository-side complete; live project activation pending)
- M0.9 — Persistence Verification & Database Typing (repository-side complete; live gate pending)
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

## Persistence
Ontwikkeling gebruikt standaard `CATALOG_PERSISTENCE=memory`. Live Supabase vereist server-only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` en projectconfiguratie. Partnercredentials worden nooit in registryrijen opgeslagen; uitsluitend `env:` secret references worden geregistreerd.

Zie [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Architectuur in één lijn
`merchant feed → integration registry → source resolver → provider adapter → validatie → matching → import run → canonical product + merchant offer → repository → CatalogService → storefront`

Outbound affiliateklikken lopen via `/uit/<offer-id>` met server-side offerresolutie en privacy-minimale click-attributie.

Categorieën gebruiken duurzame `/categorie/<slug>` routes; zoek/filtervarianten via `/zoeken` zijn bewust `noindex,follow`.

M0.18 kiest Daisycon als eerste echte readiness-target. De `daisycon:json` transportlaag ondersteunt HTTPS-only ophalen, `X-Next-Url` paginering, same-origin bescherming en begrensde 429/5xx retries. De echte account-, programma- en feedmapping-gates zijn nog extern.

M0.19 voegt een gecontroleerde onboardinglaag toe. Een feed gaat niet rechtstreeks van registratie naar productie. De baseline is `registered → preview_ready → preview_passed → approved → active`, met `paused/rejected` als uitzonderingsstaten. Previewimports gebruiken exact dezelfde validatie/matching als productie maar voeren nooit stale-offer-deactivatie uit. Baseline previewkwaliteit vereist records, minimaal 95% acceptatie en nul open match-reviews.

PostgreSQL UUIDs blijven interne relationele sleutels; duurzame Winkelnu-identiteiten gebruiken `external_key`.

## Kernprincipe
Winkelnu wordt feedgedreven gebouwd. Externe providerdata wordt eerst vertaald, gevalideerd en gematcht voordat zij publieke catalogusdata kan worden. Productidentiteit, offers, importkwaliteit, persistence, discovery/search, affiliate-attributie, partnercontext, concrete adapters en onboarding blijven afzonderlijke verantwoordelijkheden.

## Volgende technische fase
**M0.20 — Import Scheduling, Concurrency Lease & Failure Recovery**: persistence-backed leases/idempotency voor terugkerende imports, zodat dezelfde feed niet dubbel tegelijk kan draaien en failures gecontroleerd hersteld kunnen worden zonder storefrontverkeer als scheduler te gebruiken.
