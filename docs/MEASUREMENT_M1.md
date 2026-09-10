# M1.10 — Privacy-safe measurement

Status: implementation in Draft PR. Production collection starts only after Vercel Web Analytics is enabled for the project and this change is explicitly approved and merged.

## Purpose

Measure whether visitors move through the useful parts of Winkelnu without building a visitor profile or forwarding search queries to the analytics layer.

The first measurement layer is intentionally pageview-based. It answers questions such as:

- Which public pages and categories are visited?
- Do visitors reach product detail pages after discovery?
- Is the comparison page being reached?
- Which koopgidsen and editorial rubrics attract visits?

It does not attempt to reconstruct an individual visitor journey.

## Public funnel signals

Use aggregate pageview volumes for these route families:

1. Entry: `/`
2. Discovery: `/zoeken`, `/categorie/[slug]`, `/koopgidsen`, `/koopgidsen/categorie/[slug]`, `/koopgidsen/[slug]`
3. Product consideration: `/product/[slug]`
4. Comparison: `/vergelijken`
5. Commercial outbound: remains the existing server-side `/uit/[offerId]` attribution flow once real offers exist; the redirect route itself is excluded from Web Analytics.

Because search query parameters are deliberately removed, Web Analytics cannot report the words a visitor searched for or the selected filter values. Product and content decisions should therefore use aggregate page/route evidence, not personal search histories.

## Privacy boundary

The client integration:

- runs only on `winkelnu.nl` and `www.winkelnu.nl`;
- never runs on Vercel preview URLs or localhost;
- excludes `/intern`, `/api` and `/uit` plus all descendants;
- removes the complete query string and URL fragment in a `beforeSend` boundary;
- also sends manual pageviews using `usePathname()`, which never contains the query string;
- disables automatic pageview tracking to prevent duplicate or unsanitized route events;
- sends no custom analytics events in M1.10;
- adds no localStorage, sessionStorage, visitor cookie or custom device identifier;
- does not alter the existing minimal affiliate-click attribution record.

## Technical integration

Winkelnu uses Vercel's documented Web Analytics browser protocol directly instead of adding another npm dependency. The production analytics script is loaded from `/_vercel/insights/script.js`; the `window.va` queue is initialized first and all pageviews are explicitly emitted after App Router pathname changes.

Dynamic pages retain their clean public path while also reporting a normalized route, for example `/product/[slug]` or `/categorie/[slug]`. This allows route-family analysis without forwarding query parameters.

## Activation gate

Do not describe analytics as operational until all of these are true:

1. Vercel Web Analytics is enabled for the Winkelnu project.
2. M1.10 has passed lint, typecheck, tests and production build.
3. The preview/legal copy has been reviewed.
4. The change is explicitly approved for merge.
5. Production confirms that `/_vercel/insights/script.js` loads on `winkelnu.nl`.
6. A production request from a URL containing test query parameters is confirmed to appear without those parameters in analytics.
7. `/intern`, `/api`, `/uit` and preview domains produce no Web Analytics pageview from the Winkelnu integration.

## Cost and scope guardrail

Use the included Vercel Web Analytics allowance first and monitor actual usage before adding richer analytics. M1.10 intentionally avoids a new database, custom event stream, session replay, heatmaps, advertising pixels or Google Analytics.

If later evidence shows that button-level events are necessary, treat that as a separate milestone with a fresh privacy, plan-cost and consent review.
