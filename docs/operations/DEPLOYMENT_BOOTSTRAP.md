# Deployment Bootstrap

## Current repository state
The repository is ready to be connected to Vercel as a Next.js project. No `vercel.json` is required for the baseline because Vercel detects Next.js automatically.

## Required external steps
These actions require account access and cannot be completed from repository source alone:

1. Import `dostrakon1/winkelnu` into Vercel.
2. Confirm framework preset: Next.js.
3. Set production environment variable `NEXT_PUBLIC_SITE_URL=https://winkelnu.nl`.
4. After a Supabase project exists, add database variables from `.env.example` to Vercel without committing secrets.
5. Attach `winkelnu.nl` and the chosen `www` policy to the Vercel project.
6. Update DNS at Vimexx using the exact Vercel values shown for the project.

## Domain recommendation
Use `https://winkelnu.nl` as the primary canonical origin. Redirect `www.winkelnu.nl` to the apex domain unless a future infrastructure decision explicitly changes this.

## Verification after first deploy
- homepage responds successfully
- `/api/health` returns `{ status: "ok" }`
- `/robots.txt` resolves
- `/sitemap.xml` resolves
- canonical metadata uses the production origin
- GitHub production branch is `main`
- preview deployments are generated for pull requests

## Secrets policy
Never place production API keys, service-role keys, feed credentials or affiliate-network secrets in repository files. `.env.example` contains names only.
