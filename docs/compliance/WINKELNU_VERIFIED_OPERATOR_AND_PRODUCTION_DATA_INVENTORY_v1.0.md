# Winkelnu Verified Operator & Production Data Inventory v1.2

Status: **operator and KVK verified; production runtime and remaining statutory details still open**

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
| KVK number | **VERIFIED** | Akflow's own current public privacy page states KVK **42111391** |
| Public contact email | Verified existing Akflow channel | `info@akflow.nl` |
| Full legal name | **VERIFY BEFORE FINAL LAUNCH** | Akflow's current public privacy page still contains a placeholder for this field |
| Legal form | **VERIFY BEFORE FINAL LAUNCH** | Current public source still contains a placeholder |
| VAT identification number | **VERIFY BEFORE FINAL LAUNCH** | Publish only when verified and relevant |
| Registered/business address | **VERIFY PUBLICATION DETAILS** | Current public Akflow privacy source does not provide a confirmed public address |
| Public telephone number for Winkelnu | Optional / not selected | Do not publish merely because Akflow has a phone channel |

### Operator rule

Public legal pages may state: **Winkelnu.nl wordt geëxploiteerd door Akflow, KVK 42111391.**

The operator and KVK decision are resolved. Remaining statutory fields are separate verification tasks.

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
| Akflow | Legal operator of Winkelnu | **Confirmed; KVK 42111391 verified** |
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

Akflow is the confirmed operator, KVK 42111391 is verified, and `info@akflow.nl` is the current verified contact channel available for Winkelnu privacy questions.

The public privacy page should keep data-minimisation expectations realistic: because Winkelnu currently has no shopper account and application-level click attribution is intentionally limited, Akflow may have little or no data that can be directly associated with a particular visitor.

## 9. Affiliate network and merchant boundary

When a visitor leaves through `/uit/<offer-id>`:

1. Winkelnu records its own privacy-minimal click event.
2. The visitor is redirected to an external merchant/affiliate destination.
3. The external merchant/network may process data under its own privacy/cookie terms.
4. Winkelnu/Akflow does not control that merchant's checkout, payment, delivery, return, warranty or external cookie processing.

Additional sub-IDs, conversion postbacks or attribution identifiers require a new data-flow/compliance review before activation.

## 10. Public legal pages

Implemented:

- `/privacy`
- `/cookies`
- `/affiliate-en-vergelijking`
- `/over-winkelnu`
- `/disclaimer`

Akflow and KVK 42111391 may now be shown as verified operator details. Full legal name, legal form, address and VAT ID remain subject to factual verification before publication where required.

## 11. Remaining blocker register

### Blocker A — remaining statutory company details

Operator identity and KVK are resolved. Full legal name, legal form, public address and VAT publication facts still require verification.

### Blocker B — actual production processors/settings

Vercel and Supabase production settings, logging, regions, analytics and retention must be checked against the deployed runtime.

### Blocker C — runtime cookie/storage observation

The production origin must be inspected for actual browser cookies/storage before the cookie baseline is frozen.

### Blocker D — visitor-data retention

Some retention behavior is known, but visitor-related periods are not fully defined.

## 12. Definition of inventory complete

This inventory becomes `verified-complete` when evidence exists for:

1. Akflow operator identity — **complete**;
2. KVK 42111391 — **complete**;
3. exact remaining company/address details intended for publication;
4. public privacy/contact channel — **current channel confirmed**;
5. production Vercel project/settings;
6. production Supabase project/region/settings;
7. all active affiliate networks/merchants;
8. actual browser cookies/storage on production;
9. analytics/measurement state;
10. visitor-related retention decisions;
11. any additional public contact/support processors.

## Next step

**Launch Readiness v1.5 — Live Runtime, SEO & Accessibility Acceptance**

Once the intended deployment is reachable, verify the actual production runtime, browser storage, canonical/SEO behavior and end-to-end public journeys. Remaining statutory company fields can be completed in parallel from authoritative business records.