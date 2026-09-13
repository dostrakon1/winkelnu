-- L2: retain the Winkelnu product route used when a wish is added.
-- product_external_key remains the canonical identity; the slug is only a navigation snapshot.

alter table gift_list_items
  add column product_slug_snapshot text;

alter table gift_list_items
  drop constraint gift_list_items_shape_check;

alter table gift_list_items
  add constraint gift_list_items_shape_check check (
    (item_type = 'winkelnu_product' and product_external_key is not null and product_slug_snapshot is not null)
    or (item_type = 'external_link' and external_url is not null)
    or (item_type = 'text')
  );
