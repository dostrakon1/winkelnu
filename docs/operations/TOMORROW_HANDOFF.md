# Tomorrow Handoff

## Repository work already completed
- M0.1 repository alignment
- M0.2 tooling/application scaffold
- M0.3 foundation architecture
- M0.4 persistence/catalog schema foundation
- M0.5 integration boundaries and deployment readiness

## First external actions when continuing
1. Run `npm install` once locally or via a development environment and commit the generated `package-lock.json`.
2. Run `npm run check` and resolve any version-specific bootstrap issues if dependencies selected by npm have changed.
3. Import the GitHub repository into Vercel.
4. Deploy the current shell and verify `/api/health`, `/robots.txt`, and `/sitemap.xml`.
5. Connect `winkelnu.nl` after the Vercel project is healthy.
6. Create a Supabase project when ready, apply the migration in development, then add RLS before exposing any database access.

## Recommended next repository milestone
M0.6 — Synthetic Catalog Vertical Slice.

Build one completely fake/test merchant feed through the full architecture:
`adapter -> validation -> normalization -> matching -> persistence interface -> storefront read model`.

This validates architecture without waiting for affiliate programme approval or real feed credentials.

## Product architecture continuation
After technical bootstrap is proven, return to the previously established product roadmap and Step 11 — Compliance, Privacy & Affiliate Policy Architecture v1.0 before production affiliate traffic is activated.
