# Winkelnu — Minimal Legal Disclosure Decision v1.0

Date: 2026-09-09
Status: proposed implementation; statutory and production privacy verification remain open.
Related: issue #9 and the existing Compliance, Privacy & Affiliate Policy Architecture v1.0.

## Purpose and owner decision

Winkelnu must present itself primarily as a useful product-discovery and comparison brand, not as a collection of legal disclaimers. The owner requested substantially less repetition of personal/business details and affiliate notices while preserving applicable transparency duties. This decision refines presentation, not the underlying legal responsibilities, data protection or commercial release gates.

The existing architecture remains the baseline for seller separation, commission-independent organic ranking, genuine data, consent, security, and affiliate activation. Where it previously prescribed repetitive disclosure copy or a fixed page label, this decision permits equivalent, concise and accessible presentation. It does not waive a statutory disclosure.

## 1. Company identity and contact details

The current legal operator is Akflow, a sole proprietorship. Winkelnu is a brand operated by that business, not a separate legal entity. The owner-confirmed identity values remain centralised in `src/content/operator.ts`; they must not be duplicated in separate hardcoded page tables.

Public presentation:

- About page: natural brand story followed by one `Bedrijfsgegevens` section with a short operator line, KVK and direct email contact.
- The full legal name, VAT identification number and correspondence address remain accessible within an HTML details element on that same page. The address is explicitly identified as a correspondence address, not a visiting address.
- Privacy: identify Akflow as controller, provide a direct privacy email and link to the full company details. Do not duplicate the complete company table.
- Footer: short brand/operator identity, KVK, contact and a clear link to the company details. Other pages link to the canonical section where appropriate.
- Akflow.nl may provide additional background, but it is not the sole substitute for the information Winkelnu itself must make easily, directly and permanently accessible.

The legal basis for this approach is the distinction between access to required information and unnecessary repetition. Article 5 of Directive 2000/31/EC and Dutch Civil Code article 3:15d require accessible service-provider information; they do not prescribe a separate large identity table on every page. GDPR article 13 requires the controller's identity and contact details as part of a transparent privacy notice. An accessible linked section can avoid unnecessary duplication, provided the visitor can actually reach the information.

**Open statutory checks:** verify the exact registered establishment/publication address against official business records, the VAT identifier, and the contact details required for Winkelnu's actual service and future contractual model. A correspondence address must not be relabelled as a registered establishment address without evidence. The applicability of a telephone/contact requirement under the electronic-service rules and any future consumer distance-contract rules remains to be assessed; an email address alone is not asserted to discharge every possible obligation. Do not invent a visiting address or publish an unapproved telephone number.

## 2. Affiliate disclosure without repetitive notices

The commercial relationship must be recognisable before a visitor makes a relevant commercial decision. A footer disclosure alone is not a universal substitute for contextual disclosure in a commercial recommendation, paid placement or misleadingly neutral presentation.

Presentation contract:

1. A concise site-wide disclosure and link to the full methodology remains available in the footer.
2. The `Hoe Winkelnu werkt` page explains remuneration, seller roles, ranking parameters, known/unknown shipping costs and any sponsored-placement model in ordinary language.
3. A commercial recommendation, affiliate offer or sponsored placement must disclose its commercial nature clearly in its own context where the average visitor would not otherwise recognise it. Use a short label or sentence, not a large legal warning on every card. Do not rely on a hidden hover, a remote legal page or an ambiguous icon alone.
4. A neutral editorial link to a guide is not automatically a commercial recommendation merely because the platform has an affiliate business model. Remove repetitive future-affiliate warnings from ordinary guide cards and editorial notices while keeping factual source and testing information.
5. Existing outbound CTAs continue to identify the merchant, use `Bekijk aanbieding`, and retain `rel="nofollow sponsored"` where applicable. This technical link attribute is not a visitor-facing disclosure substitute.
6. Actual paid placement or commercial influence on ranking requires a distinct, visible sponsored label and truthful methodology before launch. Affiliate commission must not silently affect the ordinary organic ranking.

Avoid an unconditional claim that every affiliate purchase always has the same or lower price. Explain that Winkelnu may earn a commission and that the merchant determines the final price and conditions. Merchant-specific statements about extra charges must be supported by the actual programme and offer.

Relevant legal framework: Dutch Civil Code articles 6:193b–193e (unfair/misleading commercial practices), Directive 2000/31/EC article 6 (commercial communications), and applicable advertising/self-regulatory rules. The precise application depends on the content and commercial relationship, not on a fixed required number of repeated warning blocks.

## 3. Privacy and cookie information

The public privacy and cookie texts must describe actual processing, not the internal development roadmap. They may be readable, layered and concise but may not omit required information merely to shorten the page.

Before final privacy acceptance, establish the actual purposes and lawful bases, categories of personal data, recipients/processors, transfers, retention periods or criteria, data-subject rights and complaint route. Verify Vercel/Supabase runtime settings and browser storage. Do not invent retention periods or claim no tracking, no IP processing or EEA-only processing without evidence. A data-minimal application click event does not prove the absence of infrastructure logs or third-party tracking.

No optional consent-required tracking may run before valid consent. No decorative consent banner is needed when no technology requiring consent is used, but an actual consent requirement cannot be removed by changing the copy. Future affiliate programmes, postbacks, sub-identifiers or analytics must be assessed before activation.

## 4. Implementation scope

The branch `fix/m1-2-minimal-legal-disclosure` revises About, Privacy, Disclaimer, the methodology, shared operator details, footer and editorial copy. It removes repetitive notices but preserves the source section in each guide. The canonical routes remain unchanged, including `/affiliate-en-vergelijking` and `/over-winkelnu#exploitant`.

The full legal values stay accessible on Winkelnu; no data is removed from the central record. No database migration, authentication change, feed import, analytics activation, dependency change, payment feature or catalogue release is part of this change. Existing release-gate and affiliate-routing behaviour remain unchanged.

## 5. Verification and release

The source contract test `tests/editorial/minimal-legal-disclosure.test.ts` checks centralisation, linked identity, concise contextual policy, editorial source transparency, and preserved release boundaries. It is a structural test, not proof of legal compliance.

Before merge, run lint, typecheck, tests and build on the exact branch head. Review the complete diff for unintended changes. Inspect the About details element, privacy link, footer and responsive layout. Confirm the legal address/contact requirements with authoritative records. Complete the separate factual privacy/runtime assessment before declaring the legal pack fully accepted.

GitHub Actions is subject to the existing $0 paid-budget restriction. Do not rerun budget-blocked jobs, increase spending, bypass required checks or merge solely because a preview is ready. A draft PR may be reviewed without treating skipped CI as a pass. Production promotion requires a separate explicit decision. The catalogue remains fail-closed, and Daisycon reapproval/commercial work remains deferred by the owner.

## Source references

- Directive 2000/31/EC, articles 5 and 6: https://eur-lex.europa.eu/eli/dir/2000/31/oj
- Dutch Civil Code, Book 3 article 15d: https://wetten.overheid.nl/BWBR0005291/
- Dutch Civil Code, Book 6 articles 193b–193e: https://wetten.overheid.nl/BWBR0005289/
- GDPR, articles 12–14: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Dutch Telecommunications Act, article 11.7a: https://wetten.overheid.nl/BWBR0009950/

This is an implementation decision record, not an independent legal opinion or a declaration of completed compliance.
