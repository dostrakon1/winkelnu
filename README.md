# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-persistence, discovery/search, affiliate-attributie, partnerintegraties, importorchestration, production readiness en een beveiligde interne operationslaag met auth, rollen, audit, idempotente recovery, observability, per-feed timelines en bounded import-run evidence.

Afgerond / geïmplementeerd:
- M0.1 t/m M0.17 — fundering, catalogus, persistence, search, affiliate-attributie en partner-adapterarchitectuur
- M0.18–M0.24 — partnerreadiness, onboarding, scheduling, worker execution, production composition en feed safety
- M0.25–M0.30 — scalable catalog ranking, go-live readiness, partneracceptatie, bol-readiness en portfolio operations
- M0.31–M0.34 — secure internal operations, dashboard en menselijke Supabase Auth
- M0.35 — Operator Authorization Roles & Audit Boundary
- M0.36 — Audited Feed Recovery Actions & Safe Mutation Contracts
- M0.37 — Recovery Confirmation, Idempotency & Operator Feedback
- M0.38 — Operator Action History & Recovery Observability
- M0.39 — Operator Audit Filtering, Correlation & Incident Context
- M0.40 — Operational Timeline & Feed State Transition Context
- M0.41 — Import Run Evidence & Timeline Enrichment

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Operationslaag
`/intern/operations` combineert incidenten, role-gated recovery, append-only audit, server-side idempotency, filterbare operatorhistorie, veilige orchestrationcontext en recente import-run evidence.

M0.40 voegt veilige orchestration-signalen toe: laatste start, laatste succes, volgende run en alleen een boolean voor een actieve lease. Lease-token/owner, secret references, vrije auditmetadata en ruwe orchestration errors worden niet aan de timeline/UI blootgesteld.

M0.41 verrijkt dezelfde per-feed timeline met bounded import-run evidence: runstatus, timestamps, records seen/accepted/rejected, offers deactivated, review-required en correlation id. De reader haalt maximaal 100 recente runs op en de timeline gebruikt maximaal vijf runs per feed. `error_summary`, reject payloads en raw records blijven uitgesloten.

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

Zie [`docs/architecture/IMPORT_RUN_EVIDENCE_AND_TIMELINE_ENRICHMENT.md`](docs/architecture/IMPORT_RUN_EVIDENCE_AND_TIMELINE_ENRICHMENT.md), [`docs/architecture/OPERATIONAL_TIMELINE_AND_FEED_STATE_TRANSITION_CONTEXT.md`](docs/architecture/OPERATIONAL_TIMELINE_AND_FEED_STATE_TRANSITION_CONTEXT.md), [`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`](docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md) en [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Volgende technische fase
**M0.42 — Import Quality Drilldown & Reject/Review Summaries**: aggregate reject/review evidence toevoegen zonder raw feed records of gevoelige payloads bloot te stellen.
