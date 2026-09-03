import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const db = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const tables = [
  'merchants', 'categories', 'products', 'offers', 'feed_sources', 'import_runs', 'import_rejects',
  'product_match_reviews', 'affiliate_click_events', 'affiliate_networks', 'merchant_affiliate_integrations',
  'feed_import_orchestration',
]

const failures = []

for (const table of tables) {
  const { error } = await db.from(table).select('*', { head: true, count: 'exact' }).limit(1)
  if (error) failures.push(`${table}: ${error.message}`)
}

if (failures.length > 0) {
  console.error('Supabase smoke test failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Supabase connection OK: ${tables.length} required tables are readable.`)
