# Lootje & Lijstje — L2 Catalog Integration

Status: **L2 implementation contract**

Date: 2026-09-13

Issue: #98 — `Winkelnu Lootje & Lijstje MVP`

## Purpose

L2 connects standalone wish lists to the existing Winkelnu product catalogue without creating a second product database.

A list owner can now:

1. search the currently public Winkelnu catalogue;
2. select a canonical Winkelnu product;
3. optionally add a personal note;
4. save that product as a wish;
5. share a list that resolves current product data whenever possible.

Text wishes and external HTTPS links remain available as fallbacks.

## Identity contract

`gift_list_items.product_external_key` is the canonical product identity.

L2 also stores `product_slug_snapshot` as a navigation/resolution snapshot. It is not trusted as identity on its own.

When a stored Winkelnu wish is rendered, the application:

1. resolves the current product through the same storefront `CatalogService` used elsewhere by Winkelnu;
2. loads the product by the stored slug snapshot;
3. verifies that the resolved product ID equals `product_external_key`;
4. only then treats the product as the current canonical match.

This prevents an old or reused slug from silently pointing a wish at a different product.

## Snapshot contract

When a product is added, the gifting table stores a small presentation fallback:

- product title;
- image URL when available;
- current best known total price in cents when available;
- currency;
- product slug snapshot.

Snapshots are not a duplicate catalogue and are never used to rank products. They exist so a wish remains understandable if the canonical product later disappears from the active catalogue.

If the product still resolves, current catalogue data wins over the snapshot. If it no longer resolves, the shared list keeps the saved title/price context and offers a neutral Winkelnu search for an alternative.

## Search contract

Gift product search reuses `createStorefrontCatalogService()` and `CatalogService.searchProducts()`.

Therefore:

- before real commerce release, L2 searches the curated public product catalogue;
- after the public Supabase catalogue is deliberately released, the same gifting UI automatically searches the persistent catalogue;
- gifting never bypasses the existing catalogue release gates;
- gifting never reads raw test/merchant data directly.

The list search returns a bounded first page of up to eight products per query.

## Add contract

The browser submits only:

- list capability context;
- canonical product slug selected from the UI;
- optional personal note.

The server performs a fresh canonical catalogue lookup and constructs the persisted product identity/snapshot itself.

The browser cannot supply or override:

- `product_external_key`;
- product title snapshot;
- price snapshot;
- currency snapshot;
- image snapshot.

The same Winkelnu product may only occur once on a standalone list in L2.

## Edit contract

A stored Winkelnu product wish is deliberately less editable than a free-text wish.

The owner may:

- edit the personal note;
- delete the wish.

The owner may not manually rewrite the product identity, title, slug or price. To choose another product, remove the old wish and add the intended canonical product.

## Shared-list contract

For a verified current product the list shows:

- current product title/brand;
- current best known price when available;
- a link to the canonical Winkelnu product page.

If the current catalogue no longer contains the product, the list shows the stored fallback and a neutral `Zoek een alternatief` link into Winkelnu search.

No affiliate destination URL is stored in gift tables. Merchant/affiliate routing remains exclusively inside the existing Winkelnu product/offer flow.

## Database extension

Migration `0025_gifting_product_slug_snapshot.sql` adds:

- `gift_list_items.product_slug_snapshot text`.

The existing item-shape constraint is tightened so a `winkelnu_product` requires both:

- `product_external_key`;
- `product_slug_snapshot`.

All L1 security boundaries remain unchanged:

- RLS enabled;
- no anon/authenticated direct CRUD;
- service-role server boundary only;
- gifting feature still protected by `WINKELNU_GIFTING_ENABLED`.

## Deliberate non-scope

L2 does not add:

- groups or participants;
- draw logic;
- reservations/`geregeld` state;
- product recommendations beyond normal catalogue search;
- wish-based ranking changes;
- direct merchant/affiliate URLs in gifting storage;
- a second catalogue.

Those remain later milestones.
