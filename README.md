# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-persistence, discovery/search, affiliate-attributie, partnerintegraties, importorchestration, production readiness en een beveiligde interne operationslaag met auth, rollen, audit, idempotente recovery, observability, per-feed timelines, bounded import-run evidence, importkwaliteitssamenvattingen, read-only quality-attention signalen, dashboardprioritering en operations-security readiness verification.

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
- M0.42 — Import Quality Drilldown & Reject/Review Summaries
- M0.43 — Feed Quality Thresholds & Operator Attention Signals
- M0.44 — Quality Signal Prioritization & Dashboard Summary
- M0.45 — Production Operations Readiness & Security Verification v2

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Operationslaag
`/intern/operations` combineert incidenten, role-gated recovery, append-only audit, server-side idempotency, filterbare operatorhistorie, veilige orchestrationcontext, recente import-run evidence, geaggregeerde importkwaliteit en read-only quality-prioritering.

M0.43 leidt conservatieve read-only quality-signalen af. Ratio-alerts worden pas gebruikt vanaf 100 geobserveerde records. Rejectratio >=5% geeft attention en >=15% critical; review load >=10% geeft attention en >=20% critical. Een backlog van minimaal 25 pending reviews geeft `watch` wanneer geen sterker signaal geldt.

M0.44 vat deze signalen bovenin samen en sorteert de quality-prioriteitslijst deterministisch: `critical` voor `attention` voor `watch`, daarna nieuwste evidence.

M0.45 breidt production readiness uit naar de volledige operations-security boundary. `winkelnu_production_readiness()` verwacht nu alle 15 RLS-tabellen en `winkelnu_operations_security_readiness()` controleert operator-table RLS/policies/grants, het exacte service-role privilegecontract, service-role-only recovery-RPC execution en de append-only audittrigger. `npm run check:db-contract` bewaakt daarnaast de kritieke revoke/grant-contracten statisch in CI.

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

Live Supabase production readiness is nog niet geclaimd: migrations `0001`–`0014` moeten eerst op een echt preview/production project worden toegepast en de live verification moet daar succesvol draaien.

Zie [`docs/architecture/PRODUCTION_OPERATIONS_READINESS_AND_SECURITY_VERIFICATION_V2.md`](docs/architecture/PRODUCTION_OPERATIONS_READINESS_AND_SECURITY_VERIFICATION_V2.md), [`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`](docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md) en [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md).

## Volgende technische fase
**M0.46 — Operator Recovery Hardening & Safe Error Boundary**: authorization vóór idempotency-claim afdwingen, operator-facing recovery errors sanitiseren en een expliciet idempotency-retentionbeleid vastleggen zonder mutation scope uit te breiden.
