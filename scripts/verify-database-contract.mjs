import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const migrationPaths = [
  'supabase/migrations/0001_catalog_foundation.sql',
  'supabase/migrations/0002_catalog_quality_observability.sql',
  'supabase/migrations/0003_domain_external_keys.sql',
]

const migrations = (
  await Promise.all(migrationPaths.map((path) => readFile(resolve(path), 'utf8')))
).join('\n')

const requiredTables = [
  'merchants',
  'categories',
  'products',
  'feed_sources',
  'import_runs',
  'offers',
  'product_identifiers',
  'import_rejects',
  'product_match_reviews',
]

const requiredColumns = [
  ['merchants', 'external_key'],
  ['categories', 'external_key'],
  ['products', 'external_key'],
  ['offers', 'external_key'],
  ['import_runs', 'external_key'],
  ['import_runs', 'offers_deactivated'],
  ['import_runs', 'review_required'],
]

const failures = []

for (const table of requiredTables) {
  const pattern = new RegExp(`(?:create\\s+table\\s+if\\s+not\\s+exists\\s+${table}\\b|create\\s+table\\s+${table}\\b)`, 'i')
  if (!pattern.test(migrations)) failures.push(`Missing required table declaration: ${table}`)
}

for (const [table, column] of requiredColumns) {
  const createTableBlock = new RegExp(`create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?${table}\\s*\\([\\s\\S]*?\\);`, 'i')
  const alterTableColumn = new RegExp(`alter\\s+table\\s+${table}[\\s\\S]*?add\\s+column\\s+(?:if\\s+not\\s+exists\\s+)?${column}\\b`, 'i')
  const block = migrations.match(createTableBlock)?.[0] ?? ''
  const inCreate = new RegExp(`\\b${column}\\b`, 'i').test(block)
  if (!inCreate && !alterTableColumn.test(migrations)) {
    failures.push(`Missing required column: ${table}.${column}`)
  }
}

if (failures.length > 0) {
  console.error('Database contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Database contract OK: ${requiredTables.length} tables and ${requiredColumns.length} critical columns verified.`)
