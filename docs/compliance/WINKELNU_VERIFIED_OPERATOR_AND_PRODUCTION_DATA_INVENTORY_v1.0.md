# Winkelnu Verified Operator & Production Data Inventory v1.1

Status: **legal operator confirmed; production runtime/company-detail verification still open**

Date: 2026-09-04

## Purpose

This document records the factual production and compliance inventory for Winkelnu. It separates confirmed facts from production details that still require evidence before the public-launch gate is passed.

## 1. Legal operator inventory

| Item | Current status | Evidence / rule |
| --- | --- | --- |
| Public brand | Verified | `Winkelnu` / `winkelnu.nl` |
| Domain | Verified | `winkelnu.nl` registered on 2026-09-03 |
| Repository | Verified | `dostrakon1/winkelnu` |
| Legal operator | **VERIFIED** | Project owner explicitly confirmed on 2026-09-04 that Winkelnu.nl is operated by **Akflow** |
| Public contact email | Verified existing Akflow channel | `info@akflow.nl` |
| Exact KvK number to publish | **VERIFY BEFORE FINAL LAUNCH** | Do not copy an unverified number into public legal text |
| VAT identification number | **VERIFY BEFORE FINAL LAUNCH** | Publish only when verified and relevant |
| Registered/business address | **VERIFY PUBLICATION DETAILS** | Do not invent or expose an address automatically |
| Public telephone number for Winkelnu | Optional / not selected | Do not publish merely because Akflow has a phone channel |

### Operator rule

Public legal pages may now state: **Winkelnu.nl wordt geëxploiteerd door Akflow.**

The operator decision is resolved. Exact statutory company-detail fields remain a separate verification task.

## 2. Current application data flows verified from the repository

### Public catalog browsing

The public storefront reads product, category, merchant and offer information. This is catalog/commercial data rather than visitor personal data.

### Search and filters

Search terms and filter values are transmitted as ordinary web request/query data to render results. The repository contains no separate first-party public search-history database or shopper profile.

Hosting/access layers may still process request metadata such as IP address, timestamp, path and user-agent. Exact production logging and retention must be verified against the deployed environment.

### Affiliate outbound click attribution

Verified application-level click event fields:

- stable event external key;
- offer relation;
- product relation;
- merchant relation;
- optional internal Winkelnu source path;
- occurrence timestamp.

The application-level click event explicitly does **not** store:

- raw IP address;
- user-agent fingerprint;
- arbitrary inbound referrer URL;
- third-party tracking identifier.

Flow:

`Winkelnu product page → /uit/<offer-id> → destination resolution → click event → merchant/affiliate destination`

Storefront affiliate CTAs retain `rel="nofollow sponsored"`.

### Internal operator accounts

The repository contains a Supabase Auth based operator boundary. Operator email/session information can be processed for authorised internal users. This is not a public shopper account system.

### Operations and audit records

The application records import runs, feed states, recovery actions, audit events, idempotency requests and correlation identifiers. Human operator actions can contain internal operator identity/email. These are operational/security records, not shopper profiling.

## 3. Storage and cookie inventory from the codebase

Verified repository baseline:

- no public customer login/account system;
- no dedicated web analytics package declared in `package.json`;
- no advertising pixel SDK declared;
- no session replay or heatmap SDK declared;
- no A/B testing SDK declared;
- Supabase SSR/Auth dependencies are used for the internal operator area.

Important limitation: absence from `package.json` does not prove that platform-level analytics, logging or cookies are disabled in Vercel or another production service. Runtime verification is still required.

## 4. Infrastructure / processor inventory

| Service / party | Role | Public legal status |
| --- | --- | --- |
| Akflow | Legal operator of Winkelnu | **Confirmed** |
| GitHub | Source repository and CI | Development service; not ordinary storefront visitor processing merely because source is hosted there |
| Vercel | Planned/expected Next.js production hosting | **Verify actual production project, logging, analytics and retention** |
| Supabase | Database/server data access/internal Auth | Project use established; **verify exact production region/logging/retention** |
| Vimexx | Registrar for `winkelnu.nl` | Registration established; verify whether DNS/email/hosting beyond registration is used |
| Daisycon | Prepared affiliate/feed integration | Do not describe as active until enabled |
| Bol affiliate | Prepared affiliate/feed integration | Do not describe as active until enabled |
| Other networks/merchants | Future | Add only after activation and review |

## 5. Environment-variable evidence

Public/non-secret configuration includes:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only configuration includes:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`
- `CATALOG_PERSISTENCE`
- `WINKELNU_OPERATOR_EMAILS`
- `WINKELNU_OPERATOR_ROLES`
- `CRON_SECRET`
- `WINKELNU_IMPORT_TRIGGER_SECRET`

Prepared Daisycon configuration includes:

- `DAISYCON_PRODUCT_FEED_URL`
- `DAISYCON_CLIENT_ID`
- `DAISYCON_CLIENT_SECRET`
- `DAISYCON_PUBLISHER_ID`
- `DAISYCON_MEDIA_ID`

The presence of an environment-variable contract proves technical readiness, not active production processing.

## 6. Analytics / consent decision table

| Capability | Current verified state | Policy |
| --- | --- | --- |
| Essential storefront requests | Required | No optional consent gate |
| Affiliate click event described above | Application baseline | Privacy-minimal and transparently disclosed |
| Internal Supabase Auth | Internal operator function | Functional/security context |
| Public product/search analytics | Not verified as enabled | Do not claim enabled |
| Vercel Analytics | Not verified as enabled | Check deployment settings before final cookie decision |
| Advertising pixels | Not in repository baseline | Must not be added without compliance review |
| Session replay / heatmaps | Not in repository baseline | Must not be added silently |
| Personalised advertising | Not present | Separate future policy decision required |

## 7. Retention inventory

Verified:

- operator action idempotency records have a committed minimum retention policy of at least 90 days and no automatic cleanup baseline;
- affiliate click events are persisted when the persistent attribution implementation is enabled.

Still to define or verify:

- affiliate click-event retention period;
- hosting access-log retention;
- Supabase platform/database log retention;
- internal operator account retention after access removal;
- backup retention where applicable;
- support/privacy correspondence retention.

Do not invent exact durations for public copy.

## 8. Privacy rights and contact route

Akflow is the confirmed operator and `info@akflow.nl` is the currently verified contact channel available for Winkelnu privacy questions.

The public privacy page should keep data-minimisation expectations realistic: because Winkelnu currently has no shopper account and application-level click attribution is intentionally limited, Akflow may have little or no data that can be directly associated with a particular visitor.

## 9. Affiliate network and merchant boundary

When a visitor leaves through `/uit/<offer-id>`:

1. Winkelnu records its own privacy-minimal click event.
2. The visitor is redirected to an external merchant/affiliate destination.
3. The external merchant/network may process data under its own privacy/cookie terms.
4. Winkelnu/Akflow does not control that merchant's checkout, payment, delivery, return, warranty or external cookie processing.

Additional sub-IDs, conversion postbacks or attribution identifiers require a new data-flow/compliance review before activation.

## 10. Public legal pages

Implemented in Launch Readiness v1.3:

- `/privacy`
- `/cookies`
- `/affiliate-en-vergelijking`
- `/over-winkelnu`
- `/disclaimer`

They may identify Akflow as operator. Exact company-detail fields must still be completed from verified records before final public-launch sign-off where legally required.

## 11. Remaining blocker register

### Blocker A — exact statutory company details

Operator identity is resolved, but exact KvK/address/VAT publication facts still require verification.

### Blocker B — actual production processors/settings

Vercel and Supabase production settings, logging, regions, analytics and retention must be checked against the deployed runtime.

### Blocker C — runtime cookie/storage observation

The production origin must be inspected for actual browser cookies/storage before the cookie baseline is frozen.

### Blocker D — visitor-data retention

Some retention behavior is known, but visitor-related periods are not fully defined.

## 12. Definition of inventory complete

This inventory becomes `verified-complete` when evidence exists for:

1. Akflow operator identity — **complete**;
2. exact company/KvK/address details intended for publication;
3. public privacy/contact channel — **current channel confirmed**;
4. production Vercel project/settings;
5. production Supabase project/region/settings;
6. all active affiliate networks/merchants;
7. actual browser cookies/storage on production;
8. analytics/measurement state;
9. visitor-related retention decisions;
10. any additional public contact/support processors.

## Next step

**Launch Readiness v1.4 — Production Compliance Verification & Company Detail Completion**

Verify the deployed runtime and complete exact statutory company information before declaring the legal/compliance launch gate fully passed.