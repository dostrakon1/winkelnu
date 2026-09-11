# Daisycon activation hardening M1

Status: repository hardening before the first real Daisycon feed is approved and available.

This step does not activate a partner or recurring production import. The existing first-partner acceptance gate remains authoritative.

## Edge-case matrix

| Case | Repository behavior |
| --- | --- |
| Duplicate merchant product ID in one import | Reject the duplicate row and retain import diagnostics. |
| Two merchant rows mapping to one canonical product | Preserve the records but require product-match review before production acceptance. |
| Missing GTIN | Allowed. Brand + MPN may provide a strong identity; otherwise source identity is preserved and manual review is required. |
| Invalid GTIN shape | Reject values that are not a GTIN-8, GTIN-12, GTIN-13 or GTIN-14 digit shape. Feed-specific checksum policy is verified against the sanitized real partner sample before activation. |
| Missing shipping cost | Preserve as unknown. Never convert missing shipping to confirmed zero/free shipping. |
| Malformed supplied shipping cost | Reject the row rather than allowing invalid money into ranking. |
| Explicitly unavailable offer | Suppress from public offer ranking. |
| Unknown/provider-specific availability | Keep eligible but do not claim it is in stock; the storefront must ask the visitor to verify availability. |
| Offer disappears after a successful full import | Deactivate the missing offer. Failed or partial traversal must not trigger mass deactivation. |
| Stale offer | Fresh through 24h, stale but visible through 72h, then suppressed from storefront/ranking. |

## Ranking rule for unknown shipping

When at least one eligible offer has a supplied shipping cost, offers with a known shipping amount rank before offers whose shipping is unknown. Known offers are ordered on item price + shipping. Offers with unknown shipping remain visible and may be ordered by item price within the unknown-shipping group, but they must not receive a label that implies free shipping or a confirmed total price.

This is intentionally conservative: completeness of price information beats an apparently cheaper but incomplete amount.

## Availability normalization boundary

The repository recognizes a small set of explicit, common availability signals (`in_stock`, `available`, `out_of_stock`, `unavailable`, and equivalent simple values). Any provider-specific value that is not explicitly recognized remains `unknown`.

Do not broaden this mapping from assumptions. When Daisycon grants the real feed, capture a sanitized sample and verify the actual availability vocabulary before adding provider-specific mappings.

## Database migration

Migration `0018_offer_ranking_hardening.sql` mirrors the application rule in the Supabase `catalog_ranked_products` read model. It is intentionally not applied merely by opening this PR. Apply it through the normal linked Supabase migration workflow only after review and before switching the public catalog to the Supabase commerce path.

## Production activation remains blocked until

- Daisycon media/partner access is approved;
- a sanitized actual feed sample verifies the field mapping;
- the real feed credential is configured through the existing secret reference;
- non-destructive preview import passes with at least 95% acceptance and zero unresolved product-match reviews;
- ranking, freshness and redirect evidence pass;
- the existing production acceptance gate returns `production_approved`.
