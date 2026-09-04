# Winkelnu Design System v1.6 — Trust, Comparison Signals & Microcopy

Status: implemented

## Purpose

This step makes comparison logic understandable at the exact moments where a visitor evaluates price, availability and merchant choice. The design must build trust through precise wording rather than through unsupported ratings, badges or urgency.

## Shared comparison signals

Path: `src/components/storefront/comparison-signals.tsx`

A shared three-part trust pattern now explains:

1. **Prijs met context** — known shipping costs are included; missing shipping data is explicitly disclosed.
2. **Actuele winkelstatus** — availability and offers originate from product feeds and can change.
3. **Je koopt bij de winkel** — Winkelnu compares; payment, delivery, returns and warranty remain with the chosen merchant.

The homepage uses the compact version in its hero. The product-detail page uses the full horizontal version below product information.

## Removal of unsupported comparison visuals

The previous homepage comparison panel used decorative percentage bars for price, shipping and availability. Those bars did not represent measured scores and could therefore be misread as factual comparison metrics.

They have been replaced by explicit comparison signals. Winkelnu should not visualize a score unless there is a real metric behind it.

## Price-language contract

Price wording now depends on whether shipping is known.

### When shipping is known

- `Beste bekende totaalprijs`
- `Laagste bekende totaalprijs`
- `Bekende totaalprijs`

### When shipping is not known

- `Beste bekende productprijs`
- `Laagste bekende productprijs`
- `Productprijs`
- explicit warning that shipping costs are still unknown or must be checked at the merchant

This prevents a product-only price from being presented as a complete checkout total.

## Product cards

`ProductCard` now accepts `shippingKnown`.

When the selected offer has a shipping cost in the catalog:

- the displayed comparison amount is labelled as a known total price.

When shipping is missing:

- the amount is labelled as product price;
- the card states `Verzendkosten nog niet bekend.`

Availability wording is now `Controleer voorraad` when the feed does not provide a clear in-stock state. This is more precise than a generic status badge.

## Offer cards

`OfferCard` now accepts `shippingKnown` and adapts its labels accordingly.

Each merchant offer communicates:

- merchant name;
- product price;
- shipping information or an explicit missing-shipping warning;
- feed availability state;
- known total price only when supported by shipping data;
- a reminder that price and stock can change at the merchant;
- sponsored outbound CTA semantics via `rel="nofollow sponsored"`.

The highlighted comparison badge is descriptive, not promotional. It says which known price currently sorts first without implying market-wide superiority.

## Product-detail trust context

The comparison panel now tells visitors that Winkelnu compares available feed information and that the final price, stock and conditions should be checked at the webwinkel.

The merchant-of-record statement has been strengthened:

- Winkelnu is not the seller;
- the merchant determines the final price;
- payment, delivery, returns and warranty remain with the merchant.

## Search and category microcopy

Search and category surfaces now use `known price` language instead of suggesting that every result has a fully known total price.

Search filters and sort options use:

- `Min. bekende prijs`
- `Max. bekende prijs`
- `Laagste bekende prijs`
- `Hoogste bekende prijs`

The result explanation states that known shipping is included and missing shipping is disclosed on the product card.

## Trust constraints

Winkelnu must not introduce trust theatre. The design system therefore continues to prohibit:

- fake star ratings;
- fabricated review counts;
- unsupported merchant quality scores;
- arbitrary percentage comparison bars;
- countdown timers;
- fake stock scarcity;
- `beste deal` or `goedkoopste van Nederland` claims without complete evidence;
- calling a product-only price a total price when shipping is unknown.

## Affiliate transparency

The existing footer disclosure remains active across public storefront surfaces. Affiliate compensation does not change Winkelnu's obligation to describe price, availability and merchant role accurately.

## Data-model impact

No database migration is required for v1.6. Shipping-known state is derived from the existing optional `Offer.shippingCost` field.

## Next design-system step

The next logical design step is v1.7 — responsive discovery and conversion polish: mobile search/filter ergonomics, product-grid density, offer-card CTA hierarchy and touch-target refinement while preserving the trust and comparison rules established in v1.6.
