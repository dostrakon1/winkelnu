# First Partner Production Acceptance Gate — M0.27

## Purpose

M0.27 prevents a partner integration from being called production-ready merely because an adapter compiles or a synthetic fixture imports. The activation decision is evidence-based and fail-closed.

Daisycon is the first candidate partner because the generic partner adapter, onboarding and product-feed transport were prepared in M0.18–M0.22.

## Activation states

### blocked
At least one repository-side blocking check fails. Production activation is forbidden.

### repository_ready
The complete repository path has been proven, but one or more live/external checks remain outstanding. Production activation is still forbidden.

### production_approved
All repository-side and live/external evidence is present. Only this state may authorize production activation.

## Blocking repository checks

1. Partner mapping contract is verified.
2. Preview import contains records and passes.
3. Preview acceptance rate is at least 95%.
4. No product matches require manual review.
5. Imported products are visible through the catalog read path.
6. Best-offer ranking is verified.
7. Freshness behavior is verified.
8. Affiliate destination is a valid public HTTPS URL.
9. Affiliate redirect behavior is verified.

Any failure keeps the gate in `blocked`.

## Live evidence required for production approval

Repository proof is not enough. Production approval additionally requires:

- the mapper verified against a sanitized sample from the actual partner feed, not only a synthetic fixture;
- `npm run verify:production-readiness` passing against the live/preview Supabase project;
- real partner credential/feed access verified;
- a non-destructive preview using the actual partner feed passing in the live/preview environment.

Until all four are true, the maximum state is `repository_ready`.

## Daisycon acceptance sequence

1. Affiliate account/program is approved externally.
2. Obtain a generated product-feed URL through the approved Daisycon account.
3. Capture a small sanitized sample without secrets.
4. Verify the sample's actual field names against the mapper. The bootstrap `mapDaisyconStandardProductRecord` must not be assumed universal.
5. Register the merchant, integration and feed source using secret references only.
6. Run onboarding assessment.
7. Run non-destructive preview (`deactivateMissingOffers=false`).
8. Require >=95% accepted records and zero manual match reviews.
9. Verify at least representative imported products through catalog ranking/freshness.
10. Verify the stored affiliate URL through the same redirect validation used by `/uit/[offerId]`.
11. Verify live Supabase readiness/RLS.
12. Re-run the acceptance gate with live evidence.
13. Only `production_approved` permits changing the source to active recurring production import.

## Security constraints

- Real feed URLs and credentials never belong in fixtures, documentation or commits.
- A sanitized sample must remove account/media identifiers if they are sensitive.
- Production activation does not weaken M0.26 RLS or service-role boundaries.
- Preview imports never deactivate missing offers.
- An acceptance failure must not mutate the public catalog into a production-active state.

## External completion gates

As of the repository implementation of M0.27, Winkelnu has no supplied live Daisycon feed credential and no supplied live Supabase project connection. Therefore the repository can prove the gate behavior, but cannot truthfully mark Daisycon `production_approved` yet.
