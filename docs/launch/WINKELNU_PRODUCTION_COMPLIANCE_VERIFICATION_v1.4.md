# Winkelnu Production Compliance Verification v1.4

Status: **partially verified; runtime settings still require direct production-environment evidence**

Date: 2026-09-04

## Purpose

This step verifies public company details that can be established from current evidence and narrows the remaining production-compliance work to facts that cannot be proven from the repository or public storefront source alone.

## 1. Operator verification

Confirmed by project owner:

- Winkelnu.nl is operated by **Akflow**.

Publicly verified from Akflow's own current privacy page:

- handelsnaam: **Akflow**;
- KVK-nummer: **42111391**.

Existing verified contact channel:

- `info@akflow.nl`.

The following Akflow fields are still not safely verified for Winkelnu publication from the current public source because Akflow's own privacy page still marks them as incomplete/placeholders:

- full legal name;
- legal form;
- public correspondence/business address;
- dedicated privacy address;
- VAT identification number.

Therefore Winkelnu now publishes Akflow + KVK + email, but does not invent the unresolved fields.

## 2. Storefront changes in v1.4

The verified KVK number is now shown in:

- `/over-winkelnu`;
- `/privacy`;
- the shared storefront footer.

This gives visitors a concrete operator registration reference without publishing an unverified address or legal-form statement.

## 3. Production-runtime verification

Repository evidence confirms the technical architecture, but the following cannot be conclusively verified without direct access to the actual production deployment settings or a deployed production origin:

### Vercel

Still verify directly in the production project:

- whether Vercel Analytics is enabled;
- whether Speed Insights or another measurement feature is enabled;
- request/function log behavior and retention;
- production region/settings relevant to visitor data;
- custom domain/canonical configuration.

### Supabase

Still verify directly in the production project:

- exact production project used by Winkelnu;
- region;
- Auth/session configuration;
- platform/database log retention;
- backup retention where applicable;
- production data-retention behavior for affiliate click events and operational records.

### Browser runtime

On the actual production origin, inspect:

- cookies before interaction;
- cookies after search/browse;
- localStorage/sessionStorage;
- network requests to analytics/measurement services;
- cookies/storage after an affiliate click initiation;
- consent behavior if any optional tracking is present.

## 4. Public-domain state

At the time of this verification step, no publicly indexed `winkelnu.nl` storefront result was available through normal web search. That means production browser/runtime evidence cannot yet be treated as verified merely from the public web.

This is not itself a defect: the project can remain pre-launch. It does mean the final live compliance audit must happen after the intended production deployment is reachable.

## 5. Current compliance state

| Item | Status |
| --- | --- |
| Akflow confirmed as operator | Verified |
| Akflow KVK 42111391 | Verified from Akflow's current public privacy page |
| Public contact `info@akflow.nl` | Verified existing channel |
| Affiliate/comparison explanation | Implemented |
| Privacy page | Implemented, production-runtime caveat retained |
| Cookie page | Implemented, runtime-first policy retained |
| Disclaimer | Implemented |
| Footer legal navigation | Implemented |
| Full legal name/legal form | Pending verification |
| Public address | Pending publication decision/verification |
| VAT ID | Pending verification if publication is required/relevant |
| Production Vercel privacy settings | Pending direct evidence |
| Production Supabase privacy settings | Pending direct evidence |
| Live browser cookie/storage audit | Pending deployed origin |
| Visitor-data retention schedule | Partially defined; final production evidence pending |

## 6. Launch rule

Do not weaken the public legal pages by filling unknown fields with assumptions. The correct launch sequence is:

1. keep the verified Akflow/KVK/contact facts published;
2. deploy the intended production runtime;
3. inspect real browser/storage/network behavior;
4. inspect Vercel and Supabase project settings directly;
5. confirm any remaining statutory company fields;
6. update privacy/cookie copy if runtime evidence differs;
7. only then mark the compliance gate fully passed.

## Next step

**Launch Readiness v1.5 — Live Runtime, SEO & Accessibility Acceptance**

Once the production/preview deployment is reachable, validate canonical domain behavior, robots/sitemap/metadata, legal routes, browser storage, keyboard/mobile accessibility and the first production-shaped feed journey end to end.