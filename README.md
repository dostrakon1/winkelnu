# Winkelnu.nl

Winkelnu.nl is een multi-merchant affiliate- en vergelijkingsplatform dat producten en aanbiedingen van meerdere webwinkels samenbrengt in één duidelijke, snelle en betrouwbare winkelervaring.

## Status

De repository bevat inmiddels de technische fundering, catalogus/importkwaliteit, Supabase-persistence, discovery/search, affiliate-attributie, partnerintegraties, importorchestration, production readiness en een beveiligde interne operationslaag met auth, rollen, audit, idempotente recovery, observability, per-feed timelines, bounded import-run evidence, importkwaliteitssamenvattingen, read-only quality-attention signalen, dashboardprioritering, operations-security readiness verification, geharde recovery-foutgrenzen, een fail-closed Supabase activation environment contract en een CI-afgedwongen preview migration runbook.

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
- M0.46 — Operator Recovery Hardening & Safe Error Boundary
- M0.47 — Live Supabase Activation Preparation & Environment Contract
- M0.48 — Preview Supabase Provisioning & Migration Runbook

## Stack
Next.js 16 App Router, React 19, Node.js 22+, TypeScript strict, Tailwind CSS v4, Vitest, GitHub Actions, Supabase/Postgres voorbereid en Vercel gepland.

## Operationslaag
`/intern/operations` combineert incidenten, role-gated recovery, append-only audit, server-side idempotency, filterbare operatorhistorie, veilige orchestrationcontext, recente import-run evidence, geaggregeerde importkwaliteit en read-only quality-prioritering.

M0.45 breidt production readiness uit naar de volledige operations-security boundary. `winkelnu_production_readiness()` verwacht alle 15 RLS-tabellen en `winkelnu_operations_security_readiness()` controleert operator-table RLS/policies/grants, het exacte service-role privilegecontract, service-role-only recovery-RPC execution en de append-only audittrigger. `npm run check:db-contract` bewaakt daarnaast de kritieke revoke/grant-contracten statisch in CI.

M0.46 controleert operatorrechten vóór de idempotency-claim, terwijl de auditlaag dezelfde permission-check als defense in depth behoudt. Recoveryfouten worden naar één veilige operator-facing melding vertaald; ruwe Supabase-, RPC-, SQL- of relation-details worden niet naar de UI teruggegeven. `operator_action_requests` heeft een expliciet retentionbeleid van minimaal 90 dagen, zonder automatische delete-job of nieuwe delete-RPC.

M0.47 maakt de live Supabase-handoff expliciet. `npm run verify:activation-env` valideert project URL/project ref, key separation, operator allowlist/rollen en persistence-modus zonder secrets te printen. Preview blijft op `CATALOG_PERSISTENCE=memory` totdat migrations `0001`–`0015`, live connection/readiness, project-derived types en preview acceptance zijn geslaagd.

M0.48 legt de complete preview provisioning- en migrationprocedure vast. `npm run check:migration-manifest` verifieert dat exact migrations `0001`–`0015` aanwezig zijn en in de bedoelde volgorde staan; GitHub Actions voert deze check vóór het databasecontract uit. Het runbook definieert preflight, migration apply, live verification, type generation, bootstrap, operator acceptance, persistence switch en rollback/stop-momenten.

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

Voor preview/live activation:
```bash
npm run verify:activation-env
npm run verify:supabase
npm run verify:production-readiness
```

Live Supabase production readiness is nog niet geclaimd: migrations `0001`–`0015` moeten eerst op een echt preview/production project worden toegepast en de live verification moet daar succesvol draaien.

Zie [`docs/operations/PREVIEW_SUPABASE_PROVISIONING_AND_MIGRATION_RUNBOOK.md`](docs/operations/PREVIEW_SUPABASE_PROVISIONING_AND_MIGRATION_RUNBOOK.md), [`docs/architecture/LIVE_SUPABASE_ACTIVATION_PREPARATION_AND_ENVIRONMENT_CONTRACT.md`](docs/architecture/LIVE_SUPABASE_ACTIVATION_PREPARATION_AND_ENVIRONMENT_CONTRACT.md), [`docs/operations/SUPABASE_SETUP.md`](docs/operations/SUPABASE_SETUP.md) en [`docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md`](docs/operations/PRODUCTION_GO_LIVE_CHECKLIST.md).

## Volgende technische fase
**M0.49 — Preview Activation Evidence Pack & Handoff Checklist**: één compact bewijs- en overdrachtsdocument voorbereiden waarin de echte preview-activatie straks consequent wordt vastgelegd: commit SHA, migration state, readiness-resultaten, gegenereerde types, importbewijs en operator acceptance.
