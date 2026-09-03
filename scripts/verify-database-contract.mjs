import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const migrationPaths = [
  'supabase/migrations/0001_catalog_foundation.sql',
  'supabase/migrations/0002_catalog_quality_observability.sql',
  'supabase/migrations/0003_domain_external_keys.sql',
  'supabase/migrations/0004_affiliate_click_attribution.sql',
  'supabase/migrations/0005_affiliate_integration_registry.sql',
  'supabase/migrations/0006_import_orchestration.sql',
  'supabase/migrations/0007_import_heartbeat_and_correlation.sql',
  'supabase/migrations/0008_catalog_ranking_read_model.sql',
  'supabase/migrations/0009_production_security_and_readiness.sql',
]

const migrations = (await Promise.all(migrationPaths.map((path) => readFile(resolve(path), 'utf8')))).join('\n')

const requiredTables = [
  'merchants', 'categories', 'products', 'feed_sources', 'import_runs', 'offers', 'product_identifiers',
  'import_rejects', 'product_match_reviews', 'affiliate_click_events', 'affiliate_networks',
  'merchant_affiliate_integrations', 'feed_import_orchestration',
]

const requiredColumns = [
  ['merchants', 'external_key'], ['categories', 'external_key'], ['products', 'external_key'], ['offers', 'external_key'],
  ['import_runs', 'external_key'], ['import_runs', 'offers_deactivated'], ['import_runs', 'review_required'], ['import_runs', 'correlation_id'],
  ['affiliate_click_events', 'external_key'], ['affiliate_click_events', 'offer_id'], ['affiliate_click_events', 'product_id'],
  ['affiliate_click_events', 'merchant_id'], ['affiliate_click_events', 'source_path'], ['affiliate_click_events', 'occurred_at'],
  ['affiliate_networks', 'external_key'], ['affiliate_networks', 'kind'],
  ['merchant_affiliate_integrations', 'external_key'], ['merchant_affiliate_integrations', 'merchant_id'],
  ['merchant_affiliate_integrations', 'affiliate_network_id'], ['merchant_affiliate_integrations', 'secret_ref'],
  ['merchant_affiliate_integrations', 'tracking_config'], ['feed_sources', 'affiliate_integration_id'],
  ['feed_import_orchestration', 'feed_source_id'], ['feed_import_orchestration', 'next_run_at'],
  ['feed_import_orchestration', 'failure_count'], ['feed_import_orchestration', 'lease_token'],
  ['feed_import_orchestration', 'lease_expires_at'], ['feed_import_orchestration', 'last_succeeded_at'],
]

const requiredFunctions = [
  'try_acquire_feed_import_lease',
  'renew_feed_import_lease',
  'complete_feed_import_success',
  'complete_feed_import_failure',
  'catalog_ranked_products',
  'winkelnu_production_readiness',
]

const failures = []

for (const table of requiredTables) {
  const pattern = new RegExp(`(?:create\\s+table\\s+if\\s+not\\s+exists\\s+${table}\\b|create\\s+table\\s+${table}\\b)`, 'i')
  if (!pattern.test(migrations)) failures.push(`Missing required table declaration: ${table}`)
  const rls = new RegExp(`alter\\s+table\\s+${table}\\s+enable\\s+row\\s+level\\s+security`, 'i')
  if (!rls.test(migrations)) failures.push(`Missing RLS enablement: ${table}`)
}

for (const [table, column] of requiredColumns) {
  const createTableBlock = new RegExp(`create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?${table}\\s*\\([\\s\\S]*?\\);`, 'i')
  const alterTableColumn = new RegExp(`alter\\s+table\\s+${table}[\\s\\S]*?add\\s+column\\s+(?:if\\s+not\\s+exists\\s+)?${column}\\b`, 'i')
  const block = migrations.match(createTableBlock)?.[0] ?? ''
  const inCreate = new RegExp(`\\b${column}\\b`, 'i').test(block)
  if (!inCreate && !alterTableColumn.test(migrations)) failures.push(`Missing required column: ${table}.${column}`)
}

for (const functionName of requiredFunctions) {
  const pattern = new RegExp(`create\\s+or\\s+replace\\s+function\\s+${functionName}\\b`, 'i')
  if (!pattern.test(migrations)) failures.push(`Missing required function: ${functionName}`)
}

if (failures.length > 0) {
  console.error('Database contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Database contract OK: ${requiredTables.length} RLS-protected tables, ${requiredColumns.length} critical columns and ${requiredFunctions.length} functions verified.`)
