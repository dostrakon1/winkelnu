# Winkelnu Verified Operator & Production Data Inventory v1.0

Status: **evidence-based inventory; legal operator identity still requires explicit confirmation before publication**

Date: 2026-09-04

## Purpose

This document converts the compliance architecture into a factual production inventory. It deliberately separates:

- facts verified from the Winkelnu repository or established project state;
- infrastructure that is technically prepared but not yet proven to be active in production;
- facts that must be explicitly confirmed before public legal pages are published.

No legal page may silently promote a `to confirm` item into a factual statement.

## 1. Legal operator inventory

| Item | Current status | Evidence / rule |
| --- | --- | --- |
| Public brand | Verified | `Winkelnu` / `winkelnu.nl` |
| Domain | Verified | `winkelnu.nl` registered on 2026-09-03 |
| Repository | Verified | `dostrakon1/winkelnu` |
| Existing business entity available to user | Verified background fact | Akflow was registered with the Dutch Chamber of Commerce on 2026-07-20 |
| Is Akflow the legal operator of Winkelnu? | **TO CONFIRM** | Do not infer this merely because both projects belong to the same owner |
| Exact legal/trade name to publish | **TO CONFIRM** | Required before `/over-winkelnu`, `/privacy`, `/disclaimer` |
| KvK number to publish | **TO CONFIRM** | Do not copy from another project without explicit confirmation |
| VAT identification number | **TO CONFIRM** | Publish only when verified and relevant |
| Registered/business address | **TO CONFIRM** | Required legal/contact decision; do not invent or expose a private address automatically |
| Public support/privacy email | **TO CONFIRM** | A dedicated Winkelnu address is preferable if one is actually configured |
| Public telephone number | Optional / **TO CONFIRM** | Only publish if intentionally used for Winkelnu |

### Publication rule

Until the operator row above is explicitly confirmed, public legal pages may not claim that Akflow or any other entity operates Winkelnu.

## 2. Current application data flows verified from the repository

### Public catalog browsing

The public storefront reads product, category, merchant and offer information. This is catalog/commercial data rather than visitor personal data.

### Search and filters

Search terms and filter values are transmitted as normal web request/query data to the application. The current repository contains no separate first-party search-history database or user-profile feature.

Production hosting/access logs may nevertheless process request data such as IP address, timestamp, path and user-agent. The exact hosting log behavior and retention must be verified against the final production host before the privacy notice is published.

### Affiliate outbound click attribution

Verified application-level click event fields:

- stable event external key;
- offer relation;
- product relation;
- merchant relation;
- optional internal Winkelnu source path;
- occurrence timestamp.

The application baseline explicitly does **not** store in this click event:

- raw IP address;
- user-agent fingerprint;
- arbitrary inbound referrer URL;
- third-party tracking identifier.

The click flow is:

`Winkelnu product page → /uit/<offer-id> → server-side destination resolution → click event → merchant/affiliate destination`

Storefront affiliate CTAs retain `rel="nofollow sponsored"`.

### Internal operator accounts

The repository contains a Supabase Auth based operator boundary. Depending on actual production use, Supabase Auth can process operator email/session information. This concerns internal users, not public shoppers, unless public accounts are later introduced.

### Operations and audit records

The application records operational evidence such as import runs, feed state, recovery actions, audit events, idempotency requests and correlation identifiers. These may contain an internal operator identity/email where a human operator performs an action.

They are operational/security records and must not be described as shopper profiling.

## 3. Storage and cookie inventory from the codebase

### Verified current application behavior

The repository does not include a public customer login/account system.

The repository does not currently declare a dedicated web analytics package in `package.json`.

The repository does not currently declare advertising pixels, session replay, heatmap, marketing automation or A/B testing SDKs in `package.json`.

Supabase SSR/Auth dependencies are present for the internal operator area. Authentication/session cookies used there are functional/security cookies for authenticated operators, not marketing cookies.

### Not safe to conclude from source code alone

The absence of an analytics dependency in `package.json` does **not** prove that no analytics or platform-level measurement is enabled in Vercel or another deployment dashboard. Production settings must be checked separately.

Likewise, hosting/CDN/security layers can set or process request metadata without being represented as a JavaScript dependency.

## 4. Infrastructure / processor inventory

The following table distinguishes repository evidence from actual production activation.

| Service / party | Role indicated by project | Production status for public legal disclosure |
| --- | --- | --- |
| GitHub | Source repository and CI | Active for development; normally not a processor of ordinary public storefront visitors merely because source code is hosted there |
| Vercel | Planned/expected Next.js hosting and deployment | **VERIFY ACTUAL PRODUCTION PROJECT, region/logging/analytics settings and retention before publication** |
| Supabase | Database, server data access and internal Auth | Preview/project use established; **verify exact production project, region, auth/logging and retention before publication** |
| Vimexx | Domain registrar for `winkelnu.nl` | Domain registration established; verify whether any DNS/hosting/email service beyond registration is used |
| Daisycon | Prepared affiliate/feed integration | Code/env contract exists; **do not list as active processor/recipient until a real integration is enabled** |
| Bol affiliate | Prepared affiliate/feed integration profile | **do not list as active until partnership/feed/tracking is actually enabled** |
| Other merchants/networks | Future integration class | Add only after activation and data-flow review |

## 5. Environment-variable evidence

The repository environment contract contains:

Public/non-secret configuration:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only application configuration:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`
- `CATALOG_PERSISTENCE`
- `WINKELNU_OPERATOR_EMAILS`
- `WINKELNU_OPERATOR_ROLES`
- `CRON_SECRET`
- `WINKELNU_IMPORT_TRIGGER_SECRET`

Prepared partner secrets/configuration:

- `DAISYCON_PRODUCT_FEED_URL`
- `DAISYCON_CLIENT_ID`
- `DAISYCON_CLIENT_SECRET`
- `DAISYCON_PUBLISHER_ID`
- `DAISYCON_MEDIA_ID`

Policy rule: the presence of an environment variable contract proves technical readiness, not that the corresponding service is active in production.

## 6. Analytics / consent decision table

| Capability | Current verified state | Consent implication |
| --- | --- | --- |
| Essential storefront requests | Required | No optional consent gate; privacy disclosure still applies where personal data is processed |
| Affiliate click event described above | Application baseline active by design | Keep privacy-minimal; disclose transparently |
| Internal Supabase Auth | Internal operator function | Functional/security context |
| First-party product/search analytics | Not verified as enabled | Do not claim enabled |
| Vercel Analytics | Not verified as enabled | Verify deployment settings before deciding cookie/consent treatment |
| Advertising pixels | Not present in repository baseline | Must not be added without compliance review and consent logic where required |
| Session replay / heatmaps | Not present | Must not be added silently |
| Personalised advertising/profile building | Not present | Separate future policy decision required |

## 7. Retention inventory

### Verified application retention rules

- Operator action idempotency records have a committed minimum retention policy of at least 90 days and no automatic cleanup baseline.
- Affiliate click events are persisted by the attribution repository when the persistent implementation is enabled.

### Still to define/verify

Before public privacy text is final, define or verify:

- affiliate click-event retention period;
- hosting access-log retention;
- Supabase platform/database log retention;
- internal operator account retention after access removal;
- operational audit retention beyond the already documented idempotency minimum;
- backup retention where applicable;
- support/privacy correspondence retention if a public contact channel is introduced.

Do not publish invented exact durations merely to make a privacy policy look complete.

## 8. Data subject rights / contact route

The public privacy page must provide a real channel through which a visitor can exercise applicable privacy rights or ask a data-processing question.

Still required:

- verified public privacy/contact email;
- verified legal operator identity;
- process for matching a request to the limited data Winkelnu actually holds;
- internal instruction not to request unnecessary identity documents for low-risk requests.

Because the baseline has no shopper account and intentionally minimal click attribution, Winkelnu may have little data capable of being linked back to a specific visitor. The privacy page should explain this plainly rather than imply a rich customer profile exists.

## 9. Affiliate network and merchant data boundary

When the visitor leaves through `/uit/<offer-id>`:

1. Winkelnu records its own privacy-minimal click event.
2. The visitor is redirected to an external merchant/affiliate destination.
3. From that point the external merchant/network can process data under its own privacy/cookie terms.
4. Winkelnu must not imply it controls the merchant's checkout, cookies, payment, delivery, return or warranty processing.

If a network later requires sub-IDs, conversion postbacks or additional attribution identifiers, the data inventory and privacy policy must be reviewed before activation.

## 10. Public legal page evidence requirements

### `/privacy`
May be published only after verifying:

- operator identity;
- privacy contact route;
- actual production host/database/processors;
- analytics state;
- meaningful retention rules.

### `/cookies`
Must reflect actual browser storage/cookies in the production deployment. A consent banner is required only for technologies/use cases that actually require consent; do not create cosmetic consent UX for non-existent trackers.

### `/affiliate-en-vergelijking`
Can be substantially drafted from verified architecture now because ranking and affiliate-role rules are known. Final publication should name active network/merchant relationships only where useful and accurate.

### `/over-winkelnu`
Requires the verified legal operator and contact information.

### `/disclaimer`
Can explain price/availability freshness, external merchant responsibility and no seller role, but the operator identity must still be correct.

## 11. Current blocker register

### Blocker A — legal operator

The user has an existing registered business, Akflow, but the repository and project evidence reviewed in this step do not establish that Akflow is legally the operator of Winkelnu. Explicit confirmation is required.

### Blocker B — public contact identity

No verified Winkelnu privacy/support email, company address or publication decision is recorded in the repository.

### Blocker C — actual production processors/settings

Vercel and Supabase are architectural components, but final production project settings, log behavior, regions, analytics and retention must be verified before they are described as facts to visitors.

### Blocker D — retention

Some application-level retention is known, but public-facing retention periods for visitor-related data are not yet fully defined.

## 12. Items that are NOT blockers for drafting

The following are sufficiently established to draft their substantive wording in the next phase:

- Winkelnu is not the seller/merchant of record;
- checkout takes place at the selected merchant;
- affiliate compensation can be earned;
- affiliate compensation must not silently determine ordinary organic ranking;
- promoted placements, if ever introduced, require explicit labeling;
- known shipping can be included in comparison price and unknown shipping must remain disclosed as unknown;
- availability and price are time-sensitive;
- the application-level affiliate click event is privacy-minimal;
- the visitor should verify final price, availability and conditions at the merchant.

## 13. Definition of inventory complete

This inventory becomes `verified-complete` only when all of the following have evidence:

1. legal operator name and entity;
2. KvK/public company details intended for publication;
3. public privacy/contact channel;
4. production Vercel project and relevant privacy/logging/analytics settings;
5. production Supabase project, region and relevant logging/retention settings;
6. all active affiliate networks/merchant integrations;
7. actual browser cookies/storage observed on production;
8. analytics/measurement state;
9. retention decisions for visitor-related data;
10. any additional processors used by public contact/support flows.

## Next step

**Launch Readiness v1.3 — Public Legal Pages & Footer Legal Navigation**

The public pages can now be built from the verified architecture, but all operator-specific fields must remain blocked until the legal operator/contact facts above are explicitly confirmed. The next implementation should therefore either use confirmed facts or deliberately stop before publishing incomplete identity information.