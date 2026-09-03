create index if not exists products_title_lower_idx on products (lower(title));
create index if not exists products_brand_lower_idx on products (lower(brand)) where brand is not null;
create index if not exists offers_active_last_seen_total_idx on offers (product_id, last_seen_at desc, (price + coalesce(shipping_cost, 0))) where is_active = true;

create or replace function catalog_ranked_products(
  p_now timestamptz,
  p_category_slug text default null,
  p_term text default null,
  p_brand text default null,
  p_min_total numeric default null,
  p_max_total numeric default null,
  p_in_stock_only boolean default false,
  p_sort text default 'price_asc',
  p_limit integer default 24,
  p_offset integer default 0
)
returns table (
  product_external_key text,
  product_slug text,
  product_title text,
  product_description text,
  product_brand text,
  product_gtin text,
  product_mpn text,
  product_image_url text,
  category_external_key text,
  offer_external_key text,
  merchant_external_key text,
  merchant_slug text,
  merchant_name text,
  merchant_website_url text,
  merchant_product_id text,
  price numeric,
  shipping_cost numeric,
  total_amount numeric,
  availability text,
  product_url text,
  affiliate_url text,
  source_updated_at timestamptz,
  imported_at timestamptz,
  last_seen_at timestamptz,
  freshness text,
  offer_count bigint,
  relevance integer
)
language sql
stable
security definer
set search_path = public
as $$
  with candidate_products as (
    select
      p.*,
      c.external_key as category_external_key,
      case
        when p_term is null or btrim(p_term) = '' then 0
        when lower(p.title) like lower(p_term) || '%' then 4
        when lower(p.title) like '%' || lower(p_term) || '%' then 3
        when lower(coalesce(p.brand, '')) like '%' || lower(p_term) || '%' then 2
        when lower(coalesce(p.description, '')) like '%' || lower(p_term) || '%' then 1
        else -1
      end as relevance
    from products p
    left join categories c on c.id = p.category_id
    where p.status = 'published'
      and (p_category_slug is null or c.slug = p_category_slug)
      and (p_brand is null or lower(coalesce(p.brand, '')) = lower(p_brand))
  ), ranked as (
    select
      cp.*,
      bo.offer_external_key,
      bo.merchant_external_key,
      bo.merchant_slug,
      bo.merchant_name,
      bo.merchant_website_url,
      bo.merchant_product_id,
      bo.price,
      bo.shipping_cost,
      bo.total_amount,
      bo.availability,
      bo.product_url,
      bo.affiliate_url,
      bo.source_updated_at,
      bo.imported_at,
      bo.last_seen_at,
      bo.freshness,
      bo.offer_count
    from candidate_products cp
    join lateral (
      select
        o.external_key as offer_external_key,
        m.external_key as merchant_external_key,
        m.slug as merchant_slug,
        m.name as merchant_name,
        m.website_url as merchant_website_url,
        o.merchant_product_id,
        o.price,
        o.shipping_cost,
        o.price + coalesce(o.shipping_cost, 0) as total_amount,
        o.availability,
        o.product_url,
        o.affiliate_url,
        o.source_updated_at,
        o.imported_at,
        o.last_seen_at,
        case when o.last_seen_at >= p_now - interval '24 hours' then 'fresh' else 'stale' end as freshness,
        count(*) over () as offer_count
      from offers o
      join merchants m on m.id = o.merchant_id and m.is_active = true
      where o.product_id = cp.id
        and o.is_active = true
        and o.last_seen_at >= p_now - interval '72 hours'
      order by o.price + coalesce(o.shipping_cost, 0), o.id
      limit 1
    ) bo on true
    where cp.relevance >= 0
      and (not p_in_stock_only or bo.availability = 'in_stock')
      and (p_min_total is null or bo.total_amount >= p_min_total)
      and (p_max_total is null or bo.total_amount <= p_max_total)
  )
  select
    r.external_key,
    r.slug,
    r.title,
    r.description,
    r.brand,
    r.primary_gtin,
    r.mpn,
    r.primary_image_url,
    r.category_external_key,
    r.offer_external_key,
    r.merchant_external_key,
    r.merchant_slug,
    r.merchant_name,
    r.merchant_website_url,
    r.merchant_product_id,
    r.price,
    r.shipping_cost,
    r.total_amount,
    r.availability,
    r.product_url,
    r.affiliate_url,
    r.source_updated_at,
    r.imported_at,
    r.last_seen_at,
    r.freshness,
    r.offer_count,
    r.relevance
  from ranked r
  order by
    case when p_sort = 'relevance' then r.relevance end desc,
    case when p_sort = 'price_desc' then r.total_amount end desc,
    case when p_sort = 'title_asc' then lower(r.title) end asc,
    case when p_sort in ('price_asc', 'relevance') then r.total_amount end asc,
    lower(r.title) asc,
    r.id asc
  limit greatest(1, least(p_limit, 49))
  offset greatest(0, p_offset);
$$;

revoke all on function catalog_ranked_products(timestamptz, text, text, text, numeric, numeric, boolean, text, integer, integer) from public;
grant execute on function catalog_ranked_products(timestamptz, text, text, text, numeric, numeric, boolean, text, integer, integer) to service_role;
