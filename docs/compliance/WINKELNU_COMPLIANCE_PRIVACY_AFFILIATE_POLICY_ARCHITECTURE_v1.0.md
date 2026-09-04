# Winkelnu Compliance, Privacy & Affiliate Policy Architecture v1.0

Status: **authoritative policy architecture baseline; public legal pages still to be published from verified operator facts**

Date: 2026-09-04

## 1. Purpose

This document defines the compliance architecture for Winkelnu.nl before final public legal pages are written.

Winkelnu is a multi-merchant affiliate and comparison platform. It does not sell the compared merchant products itself. It helps visitors discover products, compare available merchant offers and continue to a merchant through a sponsored affiliate redirect.

The policy architecture therefore has to keep four roles visibly separate:

1. Winkelnu as comparison/discovery service.
2. The merchant as seller and checkout party.
3. The affiliate network or direct affiliate programme as commercial attribution layer.
4. Infrastructure/processors used to operate Winkelnu.

No public legal page may blur these roles.

This document is an implementation architecture, not a substitute for final legal review. Where the exact legal operator identity, contact data, processor terms or production analytics configuration is not yet verified in the repository, this document deliberately records a verification gate rather than inventing facts.

## 2. Fixed compliance principles

The following are product rules, not optional copy preferences.

- Affiliate relationships must be recognisable and never disguised as neutral merchant links.
- A visitor must be able to understand that Winkelnu can receive compensation after an outbound click or purchase.
- Compensation must not silently determine ordinary organic ranking.
- Any paid placement, promoted offer or sponsored ranking influence introduced later must be separately identified at the point where it affects presentation.
- Winkelnu must not imply that it is the seller when the transaction takes place at a merchant.
- Price and availability must be presented as time-sensitive merchant data.
- Known shipping cost may be included in the displayed comparison total; unknown shipping cost must remain explicitly unknown.
- No fabricated reviews, popularity, scarcity, discount percentages, merchant scores or trust claims.
- Privacy collection should remain data-minimised by default.
- Tracking or analytics requiring consent must not run before valid consent.
- Rejecting optional tracking must not make the storefront unusable.
- Internal operations/security logging and public marketing analytics are separate purposes and must not be merged casually.

## 3. Public role statement

The public legal model should consistently communicate the following substance:

> Winkelnu vergelijkt producten en aanbiedingen van externe webwinkels. Winkelnu is voor deze aanbiedingen niet de verkoper. Als je via Winkelnu naar een webwinkel gaat, sluit je een eventuele koopovereenkomst met die webwinkel. Winkelnu kan een vergoeding ontvangen wanneer je via een affiliate-link doorklikt of een aankoop doet.

Exact wording may be refined for public pages, but the meaning must not change.

## 4. Merchant-of-record boundary

For merchant offers shown on Winkelnu:

### Winkelnu is responsible for

- operating the comparison/discovery interface;
- deciding which eligible catalogue data is displayed;
- explaining comparison/ranking logic;
- maintaining Winkelnu product/category URLs;
- operating the internal outbound redirect and first-party click attribution baseline;
- explaining affiliate compensation and any sponsored placement;
- handling privacy requests concerning data controlled by Winkelnu.

### The merchant is responsible for

- the final product page and checkout;
- the final price shown at checkout;
- payment;
- delivery;
- merchant terms;
- statutory seller obligations;
- cancellation/return processes;
- warranties and customer service concerning the sale.

Winkelnu must never publish copy that transfers a merchant obligation to Winkelnu merely because the offer is displayed on Winkelnu.

## 5. Affiliate disclosure architecture

Affiliate disclosure exists at three levels.

### Level A — persistent site disclosure

The footer must contain a concise disclosure that some outbound links are affiliate links and that Winkelnu may receive compensation without that necessarily changing the visitor's price.

This baseline already exists in the storefront footer.

### Level B — contextual offer disclosure

Merchant CTAs and comparison surfaces must remain visually understandable as links that leave Winkelnu. Current CTA wording such as `Bekijk aanbieding` is appropriate because it does not imply an on-site checkout.

Affiliate CTA links must retain `rel="nofollow sponsored"` at the storefront link layer where applicable, even when the immediate destination is the internal `/uit/<offerId>` route.

### Level C — full methodology page

A dedicated public page must explain:

- what an affiliate relationship is;
- that Winkelnu may earn commission;
- whether commission can differ per merchant/network;
- that ordinary ranking is not purchased unless a placement is explicitly marked sponsored/promoted;
- how outbound click attribution works at a high level;
- that purchase/checkout remains with the merchant.

Proposed canonical route: `/affiliate-en-vergelijking`.

## 6. Ranking and comparison transparency

### Baseline organic ranking

The current catalog architecture ranks eligible offers using the known purchase total where shipping cost is known. Where shipping is unknown, the UI must not represent the product price as a fully known total.

The public methodology should explain the important ranking parameters in plain language, including at minimum:

- product/offer eligibility and freshness;
- price;
- known shipping cost;
- availability where used as an eligibility/filter signal;
- requested visitor sort/filter choices;
- deterministic tie-breaking where relevant to consistent output.

The public page does not need to reveal anti-abuse logic, secrets, source code or internal scoring constants that would create security/manipulation risk. It must reveal enough for a normal visitor to understand why one offer can appear before another.

### Commission independence rule

The baseline rule is:

**affiliate commission is not an ordinary organic ranking parameter.**

If Winkelnu later chooses to sell placement or boost a merchant/offer for commercial consideration, that feature requires a new explicit policy decision and visible sponsored/promoted labelling before launch.

### Sorting claims

Copy such as `laagste prijs` may only be used when the actual sort semantics support it.

Where shipping is known, Winkelnu may describe a ranked value as a known total price. Where shipping is unknown, it must say product price or otherwise disclose that shipping is not yet included.

## 7. Advertising and sponsored placements

Winkelnu currently uses affiliate monetisation but does not have a separate paid-placement advertising product in the documented storefront baseline.

If sponsored placements are introduced later:

1. Sponsored status must be stored as explicit data, not inferred from styling.
2. The visitor must be able to recognise the placement as commercial/sponsored at the point of display.
3. The party on whose behalf the promotion is shown must be identifiable where applicable.
4. Sponsored placement must not be visually disguised as an organic ranking result.
5. The methodology page must explain how sponsored content relates to organic results.
6. Profiling-based ad targeting must not be added silently to the current privacy-minimal model.

No sponsored-placement feature is approved by this v1.0 architecture merely because the data model could support one later.

## 8. Privacy data inventory

### A. Ordinary storefront requests

The hosting/runtime layer will necessarily process network/request data to serve the site. Exact production logging, retention and processor details must be verified from the deployed hosting configuration before the final privacy statement is published.

Potential operational data can include request metadata such as IP address, timestamp, requested URL, response/security information and platform logs depending on the provider configuration.

Do not promise `we slaan nooit IP-adressen op` globally unless the production infrastructure evidence supports that statement. The existing click-event application table itself intentionally does not store raw IP addresses, but infrastructure logs are a separate layer.

### B. Affiliate click attribution

The current application-level click event baseline stores:

- a stable event key;
- offer relation;
- product relation;
- merchant relation;
- optional relative internal source path;
- occurrence timestamp.

The baseline intentionally does **not** store:

- raw IP address in the click event;
- user-agent fingerprint in the click event;
- third-party tracking identifier in the click event;
- arbitrary inbound referrer URL in the click event.

This is a first-party, data-minimised attribution baseline.

### C. Search and catalogue interaction

Search terms submitted through Winkelnu may be present in request URLs because the search route uses query parameters. Production hosting/logging behavior must therefore be assessed before claiming search terms are never logged.

The architecture must not encourage visitors to submit sensitive personal data into the product search field.

### D. Internal operator accounts

Internal operator authentication and authorization may process account identifiers, email addresses, role assignments, session information and audit events.

These are operational/admin purposes and must not be repurposed for consumer marketing.

### E. Import/operations data

Feed import logs, operator audit trails, idempotency records and incident evidence are operational records. They may contain identifiers relating to authorised operators and system actions. Their retention rules belong to security/operations governance and must be represented accurately in the privacy documentation where personal data is involved.

### F. Analytics

No analytics provider is approved by this document by default.

Before adding analytics, document:

- provider;
- exact events/fields;
- cookies or other local storage;
- IP handling;
- cross-site tracking behavior;
- retention;
- data residency/transfers;
- processor agreement;
- consent requirement;
- deletion/opt-out behavior.

Only then may production analytics be enabled and described publicly.

## 9. Purpose and lawful-basis decision register

Final legal pages must state the actual lawful basis used for each personal-data purpose. The implementation team must not copy a generic list of every possible AVG basis.

Architecture decision register:

| Processing purpose | Baseline decision | Final verification required |
| --- | --- | --- |
| Serve and secure the website | Necessary operational processing / legitimate security and service interests are the expected baseline | Confirm actual hosting logs and processor contract |
| Privacy-minimal affiliate click attribution | Intended to operate without marketing cookies and without raw-IP/fingerprint storage in the application click event | Final lawful-basis assessment before publication |
| Optional analytics with negligible privacy impact | May be possible without consent only if the exact implementation actually qualifies | Technical + legal assessment required |
| Tracking/advertising cookies or comparable tracking | Consent-gated | Must not run before consent |
| Operator authentication and audit | Necessary for secure administration and accountability | Confirm retention and role model |
| Contact/privacy-rights correspondence | Needed to answer requests and maintain required records | Define mailbox/process before public launch |

Where reliance on legitimate interests is selected, the final compliance pack should record the purpose, necessity and balancing assessment rather than merely naming the basis.

## 10. Cookie and tracking architecture

### Current preferred launch posture

Launch with the smallest possible tracking surface.

If Winkelnu can launch using only strictly necessary storage plus first-party server-side click attribution that does not depend on optional browser tracking, do not add a consent banner merely for appearance.

A cookie banner must describe and control real technology, not act as decorative compliance theatre.

### Consent-required technology

Any tracking cookie or comparable tracking technology that is not exempt must be blocked until valid consent has been obtained.

Consent UI must:

- provide clear information before consent;
- offer a real reject option;
- avoid preselected optional categories;
- avoid treating scrolling or continued browsing as consent;
- keep the storefront usable after rejection;
- make withdrawal of consent reasonably accessible;
- persist only the minimum state needed to respect the visitor's choice.

### Cookie declaration inventory

The public cookie page must be generated from an audited list containing for every cookie/storage item:

- name/key;
- provider/domain;
- purpose;
- category;
- lifetime;
- first/third party;
- whether consent is required;
- related processor/recipient where applicable.

Do not publish a generic cookie table that includes technologies Winkelnu does not use.

## 11. Retention architecture

Retention must be purpose-based and documented.

### Existing explicit operational rule

The current operator idempotency architecture has a minimum retention policy of 90 days and no automatic deletion unless separately reviewed.

### Affiliate click events

A final retention period is not yet fixed by repository evidence. It must be decided before public launch based on attribution/reporting need, accounting/commercial reconciliation needs and privacy minimisation.

The default design preference is not to retain granular click events indefinitely simply because storage is cheap.

### Hosting/security logs

Use the shortest retention compatible with security, abuse investigation and service operation, subject to the actual host configuration.

### Consent records

If consent-required technology is introduced, retain enough evidence to demonstrate the recorded choice while avoiding unnecessary enrichment of the consent record.

### Privacy requests/correspondence

Define a retention rule appropriate to handling and evidencing the request; do not keep request documents indefinitely by default.

## 12. Data recipients and processors

The final privacy page must list or clearly categorise actual recipients/processors used in production.

Expected categories can include:

- hosting/deployment provider;
- database/auth provider;
- affiliate networks and merchants involved in outbound transactions/attribution;
- email provider if a public contact channel is added;
- analytics provider only if actually enabled;
- security/monitoring processors only if actually enabled.

The repository must not publish guessed processor lists. Verify the production stack, contracts and transfer mechanisms first.

## 13. International transfers

Do not claim all data remains inside the EEA unless verified across every processor/subprocessor involved.

For each relevant provider before launch:

- identify processing locations;
- identify subprocessor model;
- establish the applicable transfer mechanism where processing leaves the EEA;
- reflect material transfer information in the privacy statement.

## 14. Privacy rights and contact route

Before public launch Winkelnu needs a verified contact channel through which a visitor can exercise applicable privacy rights.

The public privacy statement should explain, as applicable:

- access;
- rectification;
- erasure;
- restriction;
- objection;
- portability where relevant;
- withdrawal of consent where consent is used;
- complaint route to the competent supervisory authority.

The site must not publish an unmonitored mailbox merely to satisfy a page template.

Operator identity, postal/contact details and the responsible mailbox are a **launch gate** and must be verified before the final public pages are committed.

## 15. Legal operator identity gate

The repository currently does not contain a verified legal-operator record specifically approved for public Winkelnu legal pages.

Before publishing final legal pages, record and verify:

- legal/registered trading name that operates Winkelnu;
- business/trade-register number where required;
- VAT identification information where required for the public role;
- business/contact address appropriate for publication;
- privacy/contact email;
- any separate customer/contact channel that will actually be monitored.

Do not infer these values from another project, brand or website without explicit verification.

## 16. Public legal route contract

The launch legal pack should use stable, human-readable Dutch routes.

Required baseline:

- `/privacy` — privacy statement;
- `/cookies` — actual cookie/tracking declaration and preferences explanation;
- `/affiliate-en-vergelijking` — affiliate disclosure + comparison/ranking methodology;
- `/over-winkelnu` — role of Winkelnu, operator/company information and how the service works;
- `/disclaimer` — price/availability/external-link and informational boundaries where not already better placed in the methodology page.

A separate terms-and-conditions page should only be added when Winkelnu has terms that genuinely govern a user-facing service/relationship; do not import merchant webshop terms into Winkelnu.

## 17. Footer legal-navigation contract

After the public pages exist, the footer must expose a dedicated legal/information group with at least:

- Privacy
- Cookies
- Affiliate & vergelijking
- Over Winkelnu
- Disclaimer

The persistent short affiliate disclosure should remain visible independently of the deeper legal links.

Legal links must not be hidden behind account login, cookie acceptance or JavaScript-only interaction.

## 18. Product-page disclosure contract

Product and offer surfaces should continue to communicate:

- comparison price context;
- whether shipping is known;
- availability uncertainty where applicable;
- merchant name;
- that checkout occurs at the merchant;
- external/sponsored nature of outbound affiliate navigation.

The product page should link to the full comparison/affiliate methodology where a visitor reasonably needs more explanation. This can be added when `/affiliate-en-vergelijking` is implemented.

## 19. Data-protection-by-design rules for future features

### Favourites / likes

Before persistent favourites are introduced, decide whether they are local-only, account-linked or server-side pseudonymous. Do not silently create cross-device behavioural profiles.

### Personalisation / recommendation engine

Before behavioural personalisation is introduced:

- define input data;
- define whether profiling occurs;
- explain main ranking/recommendation parameters where required;
- establish a lawful basis/consent model;
- avoid sensitive-category profiling;
- provide non-personalised discovery where appropriate to the product/legal model.

### Reviews

Do not add reviews until provenance, moderation, authenticity and disclosure rules are defined. Paid/incentivised reviews must never be presented as ordinary neutral reviews.

### Email/newsletter

Requires a separate consent/marketing architecture before launch of that feature.

### Price alerts

Requires contact data, notification preferences, retention and unsubscribe/delete flows before implementation.

## 20. Compliance QA evidence pack

Before public promotion, capture evidence for:

1. Exact production legal operator details.
2. Screenshots/HTML of the footer affiliate disclosure and legal navigation.
3. Current `/affiliate-en-vergelijking` methodology text.
4. Current privacy and cookie pages.
5. Browser storage/cookie audit before and after consent choices.
6. Network audit proving consent-gated scripts do not fire before consent.
7. Production processor/subprocessor inventory.
8. Hosting/log retention configuration evidence.
9. Affiliate click-event schema confirming no raw IP/user-agent fingerprint fields in the application event baseline.
10. Example product with known shipping and one with unknown shipping to validate price wording.
11. Example sponsored placement evidence if that feature ever exists; otherwise record `not implemented`.
12. Privacy contact route test.

## 21. Launch blockers created by this architecture

Winkelnu must not be marked public-launch-ready while any of these are unresolved:

- legal operator identity for Winkelnu is unverified;
- public privacy page is missing or does not match actual production processing;
- public cookie/tracking page is missing or inaccurate;
- affiliate/comparison methodology page is missing;
- footer legal navigation is missing;
- optional tracking runs before consent where consent is required;
- the cookie banner, if present, lacks a genuine reject/withdraw path;
- paid placement influences ranking without clear sponsored disclosure;
- production analytics differs materially from the published policy;
- no monitored privacy/contact route exists;
- processor/transfer facts are materially unknown;
- pricing/ranking copy implies certainty the underlying data does not support.

## 22. Implementation sequence from this architecture

### v1.2 — Verified operator & production data inventory

Collect the real operator identity, contact route, production processors, analytics/cookies, host logging and retention facts. This is a factual verification step; no placeholders in public pages.

### v1.3 — Public legal pages

Build `/privacy`, `/cookies`, `/affiliate-en-vergelijking`, `/over-winkelnu` and `/disclaimer` using the verified v1.2 facts and the existing storefront design system.

### v1.4 — Footer / contextual compliance integration

Add legal navigation, methodology deep-links and any necessary cookie-preference control to the shared storefront shell.

### v1.5 — Consent & live compliance QA

Only if the actual production stack requires a consent manager, implement it from the audited cookie inventory. Then run the production evidence pack and close the launch blocker.

## 23. Decision summary

Winkelnu's preferred launch compliance posture is deliberately simple:

- transparent affiliate business model;
- merchant remains seller;
- commission-independent organic ranking baseline;
- explicit methodology;
- minimal first-party click attribution;
- no unnecessary behavioural tracking;
- no decorative cookie banner;
- consent before tracking when consent is actually required;
- public legal text generated from verified production facts, never generic boilerplate.

This architecture becomes the policy source of truth for the next launch-readiness steps.