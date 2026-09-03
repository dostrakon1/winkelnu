import { createClient } from '@supabase/supabase-js'

function required(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

const client = createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

const { data: readiness, error: readinessError } = await client.rpc('winkelnu_production_readiness')
if (readinessError) throw new Error(`Production readiness RPC failed: ${readinessError.message}`)
const row = Array.isArray(readiness) ? readiness[0] : readiness
if (!row) throw new Error('Production readiness RPC returned no row.')
if (Number(row.rls_enabled_tables) !== 13) {
  throw new Error(`Expected RLS on 13 protected tables, found ${row.rls_enabled_tables}.`)
}

const { error: rankingError } = await client.rpc('catalog_ranked_products', {
  p_now: new Date().toISOString(),
  p_category_slug: null,
  p_term: null,
  p_brand: null,
  p_min_total: null,
  p_max_total: null,
  p_in_stock_only: false,
  p_sort: 'price_asc',
  p_limit: 1,
  p_offset: 0,
})
if (rankingError) throw new Error(`Catalog ranking RPC failed: ${rankingError.message}`)

console.log(JSON.stringify({
  ok: true,
  rlsEnabledTables: Number(row.rls_enabled_tables),
  publishedProducts: Number(row.published_products),
  activeOffers: Number(row.active_offers),
  activeMerchants: Number(row.active_merchants),
  activeFeedSources: Number(row.active_feed_sources),
  latestSuccessfulImportAt: row.latest_successful_import_at ?? null,
}, null, 2))
