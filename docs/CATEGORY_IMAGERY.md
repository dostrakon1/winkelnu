# Winkelnu category imagery

This change uses the six owner-approved images from September 9, 2026. The final garden image is the sunny garden scene, not the earlier white-background product shot.

## Assets

Place all six files in `public/images/categories/`:

| Editorial category | Filename |
| --- | --- |
| Elektronica | `elektronica-hero.webp` |
| Wonen & huishouden | `wonen-huishouden-hero.webp` |
| Keuken & koffie | `keuken-koffie-hero.webp` |
| Huis, tuin & klussen | `huis-tuin-klussen-hero.webp` |
| Sport & outdoor | `sport-outdoor-hero.webp` |
| Speelgoed & hobby | `speelgoed-hobby-hero.webp` |

The source of truth for filenames, alternative text and focal positions is `src/content/category-images.ts`. The same image can be reused in the homepage card, the koopgidsen overview and its category hero. Images are local and rendered using Next.js Image with responsive sizes. Do not replace them with remote stock images or feed product imagery.

## Publication boundaries

The image registry contains six planned categories but does not publish them. The existing editorial content registry remains at three categories and six real guides until additional guides are written and reviewed. The existing commerce taxonomy, feed importer, affiliate release gate and legal pages are unchanged. Do not publish empty categories, demo offers or invented reviews for the purpose of partner approval.

## Verification and release

1. Add the six WebP files under the exact paths above. The image contract test intentionally fails if any file is missing or is not a WebP.
2. Run `npm ci --legacy-peer-deps`, `npm run lint`, `npm run typecheck`, `npm run test` and `npm run build` in an isolated checkout.
3. Inspect the homepage, `/koopgidsen` and all published `/koopgidsen/categorie/[slug]` pages at mobile and desktop widths. Check image crops, link destinations, accessible names and missing-image requests.
4. Confirm production and preview deployment settings and available build budget before running remote CI or merging. Draft PRs skip the repository Quality job, but Vercel preview deployments have separate settings.
5. Merge only when all six assets are committed, tests pass and the preview is accepted. This imagery update does not authorize activating the commerce catalog or requesting Daisycon reapproval by itself.
