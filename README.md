# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-adapters, storefront discovery/search, affiliate click-attributie, integration registry, partner-adapterresolution, Daisycon-readiness, gecontroleerde onboarding, persistence-backed orchestration, due-feed batch execution, health-classificatie, production composition, beveiligde scheduler-trigger, lease-heartbeats, end-to-end importcorrelatie, bounded feed-traversal, storefront freshnessbeleid, een schaalbaar Supabase ranking read model, production security/go-live readiness, partneracceptatie, bol Affiliate readiness, productfeed mapping, partner operations, een interne operatorinterface, menselijke Supabase Auth, role/audit authorization en veilige geaudite feed-recoverywrites met server-side idempotency.

Afgerond / geïmplementeerd:
- M0.1 t/m M0.17 — fundering, catalogus, persistence, search, affiliate-attributie en partner-adapterarchitectuur
- M0.18 — First Real Partner Integration Readiness — Daisycon
- M0.19 — Partner Onboarding & Import Orchestration
- M0.20 — Import Scheduling, Concurrency Lease & Failure Recovery
- M0.21 — Due Feed Discovery, Worker Batch Execution & Operational Health
- M0.22 — Production Import Composition & Authenticated Operations Trigger
- M0.23 — Scheduler Deployment Contract, Heartbeats & Import Run Correlation
- M0.24 — Feed Traversal Safety, Runtime Budgets & Stale Data Policy
- M0.25 — Catalog Scale Query Pushdown & Ranking Read Model
- M0.26 — Production Catalog Activation, Security & Go-Live Readiness
- M0.27 — First Production Partner Activation & Live Catalog Acceptance Gate
- M0.28 — bol Affiliate Integration Readiness & Acceptance Profile
- M0.29 — bol Product Feed Transport & Real Mapping Validation
- M0.30 — Partner Portfolio Operations & Activation Registry
- M0.31 — Internal Partner Operations Read Model & Secure Ops Surface
- M0.32 — Internal Operations Dashboard Contract & Incident Prioritization
- M0.33 — Internal Operator UI Shell & Read-Only Dashboard
- M0.34 — Human Operator Authentication & Session Boundary
- M0.35 — Operator Authorization Roles & Audit Boundary
- M0.36 — Audited Feed Recovery Actions & Safe Mutation Contracts
- M0.37 — Recovery Confirmation, Idempotency & Operator Feedback

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Keten
`authenticated scheduler trigger → correlation id → due feed discovery → atomic renewable lease → integration registry → partner adapter → bounded pagination → validation/matching/import → correlated import run → scalable freshness-aware catalog read model → affiliate redirect/storefront`

Daisycon blijft de eerste kandidaat voor een volledige live acceptance run. Bol is tweede first-class affiliatepartner op readinessniveau, productfeed-first en met header-driven mapping totdat een actuele echte feedheader beschikbaar is.

M0.31–M0.34 bouwen de interne operationslaag: veilige Supabase read data, incidentprioritering, `/intern/operations`, `/intern/login`, cookie-based Supabase SSR sessions en een server-side operatorallowlist. Machine endpoints onder `/api/ops/*` houden hun aparte Bearer-auth.

M0.35 voegt echte operatorrollen toe. `owner` kan later partneractivatie en operatorbeheer uitvoeren; `operator` krijgt operationele feedacties; `read_only` kan uitsluitend lezen. `WINKELNU_OPERATOR_ROLES` kent rollen expliciet toe. Een toegestane gebruiker zonder role assignment valt veilig terug naar `read_only`.

`AuditedOperatorActionService` is de verplichte boundary voor menselijke writes: eerst permission check, vervolgens een append-only `attempted` audit event, daarna pas de mutation en tenslotte `succeeded` of `failed`. Als het eerste audit event niet kan worden geschreven, wordt de mutation niet uitgevoerd.

Migration `0010_due_feed_discovery_bootstrap.sql` sluit de eerdere due-feed bootstrapgap. Migration `0011_operator_roles_and_audit_boundary.sql` voegt de RLS-protected, append-only `operator_audit_events` tabel toe.

M0.36 voegt de eerste echte recoverywrites toe: `retry`, `pause` en `resume`. De UI toont gepauzeerde feeds expliciet en biedt alleen role-gated knoppen. De Server Action controleert de operator opnieuw en alle mutations lopen via de auditboundary. Migration `0012_feed_recovery_actions.sql` bevat service-role-only RPCs; browser- of authenticated Supabase-clients krijgen geen directe recovery-writepermission.

M0.37 maakt deze recoveryacties operationeel veiliger. Pauzeren vereist bevestiging, knoppen tonen pending-state en Server Actions geven zichtbare success/duplicate/error feedback. `IdempotentOperatorActionService` claimt vóór audit/mutation een unieke request key in migration `0013_operator_action_idempotency.sql`. Een dubbel submit met dezelfde key voert daarom geen tweede mutation en geen tweede auditketen uit.

Voor human operator auth zijn onder andere nodig:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
WINKELNU_OPERATOR_EMAILS=owner@example.com
WINKELNU_OPERATOR_ROLES=owner@example.com:owner
```

De Supabase service-role key en partnercredentials blijven strikt server-only. Winkelnu biedt geen publieke operator-signup.

## Kwaliteitscontrole
```bash
npm install
npm run check
```

Voor live activation:
```bash
npm run verify:supabase
npm run verify:production-readiness
```

Zie [`docs/architecture/RECOVERY_CONFIRMATION_IDEMPOTENCY_AND_OPERATOR_FEEDBACK.md`](docs/architecture/RECOVERY_CONFIRMATION_IDEMPOTENCY_AND_OPERATOR_FEEDBACK.md), [`docs/architecture/AUDITED_FEED_RECOVERY_ACTIONS.md`](docs/architecture/AUDITED_FEED_RECOVERY_ACTIONS.md), [`docs/architecture/OPERATOR_AUTHORIZATION_AND_AUDIT_BOUNDARY.md`](docs/architecture/OPERATOR_AUTHORIZATION_AND_AUDIT_BOUNDARY.md), [`docs/architecture/HUMAN_OPERATOR_AUTH_AND_SESSION_BOUNDARY.md`](docs/architecture/HUMAN_OPERATOR_AUTH_AND_SESSION_BOUNDARY.md), [`docs/architecture/PARTNER_PORTFOLIO_OPERATIONS.md`](docs/architecture/PARTNER_PORTFOLIO_OPERATIONS.md), [`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`](docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md) en [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Volgende technische fase
**M0.38 — Operator Action History & Recovery Observability**: recente menselijke recoveryacties en hun outcomes zichtbaar maken naast operationele incidenten, zonder de write-scope verder uit te breiden.
