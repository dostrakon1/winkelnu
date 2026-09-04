# Winkelnu Public Legal Pages & Footer Legal Navigation v1.3

Status: **implemented; final launch verification still required**

Date: 2026-09-04

## Confirmed operator decision

The project owner explicitly confirmed that **Winkelnu.nl is legally operated by Akflow**.

This resolves the operator-identity decision that previously blocked public legal copy. It does not by itself verify every company-detail field such as public address, KvK number, VAT ID or production processor settings.

## Implemented public routes

- `/privacy`
- `/cookies`
- `/affiliate-en-vergelijking`
- `/over-winkelnu`
- `/disclaimer`

All pages use the shared Winkelnu storefront header, legal-content layout and footer.

## Footer legal navigation

The storefront footer now includes permanent links to:

- Over Winkelnu
- Affiliate & vergelijking
- Disclaimer
- Privacy
- Cookies

The footer also states that Akflow is the exploitant of Winkelnu and retains the existing affiliate disclosure and merchant-of-record clarification.

## Policy principles reflected in the pages

### Affiliate transparency

The public methodology page explains that:

- Winkelnu can earn affiliate compensation;
- this does not increase the visitor's price;
- affiliate compensation is not an ordinary organic ranking criterion;
- future paid placements must be explicitly labeled;
- known shipping can be included in a known total price;
- unknown shipping must remain disclosed as unknown.

### Merchant boundary

The pages consistently explain that Winkelnu is not the seller and that purchase, payment, delivery, return, warranty and merchant customer service belong to the chosen web shop.

### Privacy-minimal click attribution

The privacy page reflects the committed application baseline: outbound affiliate click events contain offer/product/merchant context, an optional internal source path and timestamp, but no raw IP address, user-agent fingerprint, arbitrary external referrer or personal advertising profile in the application-level click record.

### Cookie policy

The cookie page follows the architecture rule that Winkelnu will not show a cosmetic consent banner for trackers that do not exist. Optional analytics/marketing technology must be reviewed before activation and gated by consent where legally required.

## Remaining launch-verification items

The public legal surface is now implemented, but the following facts still require production verification before Winkelnu is declared fully launch-ready:

1. exact public Akflow company details to display where legally required (including KvK/address and VAT information where applicable);
2. actual production Vercel logging/analytics configuration;
3. actual production Supabase region/logging/retention configuration;
4. browser cookie/storage observation on the deployed production origin;
5. final visitor-data retention periods where a more specific period is required;
6. active affiliate networks and merchants actually used at launch.

The pages must be updated if the verified runtime differs from the current application baseline.

## Implementation files

- `src/components/storefront/legal-page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/cookies/page.tsx`
- `src/app/affiliate-en-vergelijking/page.tsx`
- `src/app/over-winkelnu/page.tsx`
- `src/app/disclaimer/page.tsx`
- `src/components/storefront/winkelnu-footer.tsx`

## Next step

**Launch Readiness v1.4 — Production Compliance Verification & Company Detail Completion**

Verify the actual deployed runtime and complete the remaining public company-detail fields before marking the legal/compliance gate fully passed.