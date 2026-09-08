# Winkelnu Verified Operator & Production Data Inventory v1.3

Status: **Public operator details owner-confirmed; independent registry/tax reconciliation and production privacy inventory still open.**

Date: 2026-09-08

## Purpose and evidence standard

This document records factual production and compliance evidence for Winkelnu. It separates owner-confirmed public statements, repository evidence and independently verified production facts. A published statement is not by itself an official registry or tax verification. No unresolved item may be presented as completed merely because the website is live.

The existing Compliance, Privacy & Affiliate Policy Architecture v1.0 remains authoritative. This inventory records implementation evidence; it does not replace legal review.

## 1. Legal operator inventory

| Item | Current status | Evidence / rule |
| --- | --- | --- |
| Public brand | Confirmed | Winkelnu / winkelnu.nl |
| Domain | Confirmed | Registered on 2026-09-03 |
| Repository | Confirmed | dostrakon1/winkelnu |
| Operator | Owner-confirmed | Akflow operates Winkelnu; Winkelnu is not a separate legal entity |
| Full legal name | Owner-confirmed public statement | Dogan Akgun |
| Legal form | Owner-confirmed public statement | Eenmanszaak |
| Trade name | Owner-confirmed public statement | Akflow |
| KVK number | Previously verified public fact | 42111391 |
| VAT identification number | Owner-confirmed public statement; independent reconciliation open | NL005502289B09 |
| Correspondence address | Owner-confirmed public statement | Prinsen Hoven 16, 8331 JS Steenwijk, Nederland |
| Address role | Confirmed publication wording | Correspondentieadres, geen bezoekadres; do not claim it is a registered visiting address |
| Public email | Confirmed existing channel | info@akflow.nl |
| Public telephone for Winkelnu | Not selected | Do not publish another brand's telephone number without a deliberate contact decision |

### Evidence and publication decision

On 2026-09-08 the project owner requested reuse of the business details published on Akflow.nl and approved proceeding with their publication on Winkelnu. The source pages are https://www.akflow.nl/privacybeleid (identity, legal form, correspondence address and contact) and https://www.akflow.nl/ (footer including VAT ID). The previously confirmed KVK number and operator decision remain in force.

The approved public wording is: **Winkelnu.nl wordt geëxploiteerd door Akflow, de eenmanszaak van Dogan Akgun.** Use the correspondence address with its explicit no-visits qualification. The public data module is `src/content/operator.ts`; the shared presentation is `src/components/storefront/operator-details.tsx`.

Before declaring statutory verification complete, reconcile the name, legal form, KVK registration, VAT ID and address against authoritative business/tax records and confirm any additional applicable publication/contact duties. Do not invent a visiting address or imply independent verification has occurred.

## 2. Current application data flows verified from the repository

### Public catalog browsing

The storefront reads product, category, merchant and offer information. This is catalog/commercial data rather than visitor personal data. The editorial release is separate: public commerce requires exactly `WINKELNU_PUBLIC_CATALOG_ENABLED=true` and `CATALOG_PERSISTENCE=supabase`. The request-boundary gate is implemented in `proxy.ts`. The production switch and actual runtime blocking still require evidence; do not activate it as part of legal publication.

### Search and filters

Search terms and filter values are transmitted as ordinary web request/query data to render results. The repository contains no separate first-party public search-history database or shopper profile. Hosting/access layers may still process request metadata such as IP address, timestamp, path and user-agent. Exact production logging and retention remain to be verified.

### Affiliate outbound click attribution

The application-level click event contains a stable external key, offer relation, product relation, merchant relation, optional internal Winkelnu source path and occurrence timestamp. It explicitly does not store raw IP address, user-agent fingerprint, arbitrary inbound referrer URL or a third-party tracking identifier.

Flow: `Winkelnu product page → /uit/<offer-id> → destination resolution → click event → merchant/affiliate destination`.

Storefront affiliate CTAs retain `rel="nofollow sponsored"`. Prepared code is not evidence of active affiliate traffic; public redirects remain behind the release gate.

### Internal operator accounts

The repository contains a Supabase Auth-based operator boundary. Operator email/session information can be processed for authorised internal users. This is not a public shopper account system.

### Operations and audit records

The application records import runs, feed states, recovery actions, audit events, idempotency requests and correlation identifiers. Human operator actions can contain internal operator identity/email. These are operational/security records, not shopper profiling.

## 3. Storage and cookie inventory from the codebase

The repository baseline has no public customer login/account system, no dedicated web analytics package declared in `package.json`, no advertising pixel SDK, no session replay or heatmap SDK, and no A/B-testing SDK declared. Supabase SSR/Auth dependencies support the internal operator area.

Absence from `package.json` does not prove platform-level analytics, logging or cookies are disabled. Actual browser and production configuration evidence remains required.

## 4. Infrastructure / processor inventory

| Service / party | Role | Evidence status |
| --- | --- | --- |
| Akflow | Legal operator | Owner-confirmed; public identity details above |
| GitHub | Source repository and CI | Development service; not ordinary storefront visitor processing merely because source is hosted there |
| Vercel | Next.js hosting | Live deployment confirmed by owner and GitHub status; exact project settings, region, logs, analytics and retention remain open |
| Supabase | Database/server access/internal Auth | Project use established; verify exact production project, region, settings, logging and retention |
| Vimexx | Registrar | Domain registration established; verify any DNS/email/hosting role beyond registration |
| Daisycon | Prepared affiliate/feed integration | Media previously rejected; no active approval or feed use may be claimed |
| Bol affiliate | Prepared affiliate/feed integration | Do not describe as active until approved and enabled |
| Other networks/merchants | Future | Add only after activation and review |

The successful Vercel build of PR #8 is not proof of the processor configuration, privacy compliance or all quality tests.

## 5. Environment-variable evidence

Public/non-secret configuration includes `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Server-only configuration includes `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID`, `CATALOG_PERSISTENCE`, `WINKELNU_PUBLIC_CATALOG_ENABLED`, `WINKELNU_OPERATOR_EMAILS`, `WINKELNU_OPERATOR_ROLES`, `CRON_SECRET` and `WINKELNU_IMPORT_TRIGGER_SECRET`.

Prepared Daisycon configuration includes `DAISYCON_PRODUCT_FEED_URL`, `DAISYCON_CLIENT_ID`, `DAISYCON_CLIENT_SECRET`, `DAISYCON_PUBLISHER_ID` and `DAISYCON_MEDIA_ID`.

An environment-variable contract proves technical readiness, not actual production values or active processing. Never publish secret values in this inventory.

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
| Personalised advertising | Not present in baseline | Separate future policy decision required |

## 7. Retention inventory

Verified repository policy: operator action idempotency records have a committed minimum retention of at least 90 days and no automatic cleanup baseline. Affiliate click events are persisted when persistent attribution is enabled.

Still to define or verify: affiliate click-event retention; hosting access-log retention; Supabase platform/database log retention; internal operator account retention after access removal; backup retention where applicable; and support/privacy correspondence retention. Do not invent exact durations for public copy. Review the purpose, legal basis and actual retention for each relevant data flow before freezing the privacy policy.

## 8. Privacy rights and contact route

Akflow is the confirmed operator. The public contact route is info@akflow.nl and the correspondence address is recorded above. The public privacy page should keep data-minimisation expectations realistic: without shopper accounts and with deliberately limited application-level click attribution, Akflow may have little or no data directly associated with a particular visitor.

The remaining privacy review must establish the actual purposes, legal bases, recipients/processors, applicable retention periods and rights information against the live configuration. Updating identity details alone does not complete the privacy policy.

## 9. Affiliate network and merchant boundary

When an eligible visitor leaves through `/uit/<offer-id>`:

1. Winkelnu records its privacy-minimal click event.
2. The visitor is redirected to the external merchant/affiliate destination.
3. The merchant/network may process data under its own privacy/cookie terms.
4. Winkelnu/Akflow does not control that merchant's checkout, payment, delivery, return, warranty or external cookie processing.

Additional sub-IDs, conversion postbacks or attribution identifiers require a new data-flow/compliance review before activation. No affiliate programme may be represented as approved solely because its integration is prepared.

## 10. Public legal pages

Implemented: `/privacy`, `/cookies`, `/affiliate-en-vergelijking`, `/over-winkelnu` and `/disclaimer`.

M1.2 prepares the owner-confirmed identity and contact details for `/over-winkelnu` and `/privacy`, provides a shared operator-details presentation and links from the footer/disclaimer. The exact PR must be reviewed, verified and merged before these changes are considered live. No new analytics, cookie tooling, feed imports or database changes are part of this update.

The existing legal pages remain subject to factual runtime and legal review. The publication of an accurate correspondence address does not establish a separate visiting address.

## 11. Remaining blocker register

### Blocker A — independent statutory reconciliation

Public identity fields are now owner-confirmed and available for publication. Independent KVK/tax reconciliation and the applicability of any additional statutory publication/contact details remain open. Do not revert to old placeholder claims, and do not mark official verification complete without evidence.

### Blocker B — actual production processors/settings

Vercel and Supabase project identity, regions, processing roles, logging, analytics, backups and retention must be checked against the deployed runtime. The owner confirmed the new editorial website is visible, not every underlying setting.

### Blocker C — runtime cookie/storage observation

Inspect the production origin for actual browser cookies/storage before finalising the cookie baseline. Enable no optional tracking to perform this review.

### Blocker D — visitor-data retention and privacy notice

Complete the remaining retention, purpose/legal-basis and recipient disclosures from actual processing evidence. No invented durations or generic claims of completed compliance.

### Blocker E — public acceptance and cost-controlled quality

Finish the M1.2 route, content, source-link, SEO, accessibility and closed-catalogue checks. Quality run #615 failed before runner allocation and is not passing evidence. Do not rerun paid workflows or increase limits without budget review. The known possible outdated Milieu Centraal coffee source remains tracked in issue #9.

## 12. Definition of inventory complete

The inventory becomes `verified-complete` when evidence exists for:

1. Akflow operator identity — owner-confirmed, independent reconciliation open;
2. KVK 42111391 — previously verified public fact, official reconciliation to be retained;
3. exact company/address/VAT details intended for publication — owner-confirmed, official reconciliation open;
4. public privacy/contact channel — confirmed;
5. production Vercel project/settings — open;
6. production Supabase project/region/settings — open;
7. all active affiliate networks/merchants — open until applicable activation;
8. actual browser cookies/storage — open;
9. analytics/measurement state — open;
10. visitor-related retention and legal-basis decisions — open;
11. additional public contact/support processors, if applicable — open.

## Next step

**M1.2 — Live Acceptance & Daisycon Reapproval Readiness**, tracked in issue #9. Review the proposed operator-details PR, verify the actual production runtime and resolve the remaining relevant legal/privacy/content blockers. Request reapproval only for the existing Winkelnu media after explicit release approval. The public catalogue remains closed until a separate approved-data activation decision.
