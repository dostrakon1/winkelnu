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
  'supabase/migrations/0010_due_feed_discovery_bootstrap.sql',
  'supabase/migrations/0011_operator_roles_and_audit_boundary.sql',
  'supabase/migrations/0012_feed_recovery_actions.sql',
  'supabase/migrations/0013_operator_action_idempotency.sql',
  'supabase/migrations/0014_operations_security_readiness.sql',
  'supabase/migrations/0015_operator_action_retention_policy.sql',
]

const migrations = (await Promise.all(migrationPaths.map((path) => readFile(resolve(path), 'utf8')))).join('\n')

const requiredTables = [
  'merchants', 'categories', 'products', 'feed_sources', 'import_runs', 'offers', 'product_identifiers',
  'import_rejects', 'product_match_reviews', 'affiliate_click_events', 'affiliate_networks',
  'merchant_affiliate_integrations', 'feed_import_orchestration', 'operator_audit_events', 'operator_action_requests',
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
  ['operator_audit_events', 'actor_user_id'], ['operator_audit_events', 'actor_email'],
  ['operator_audit_events', 'actor_role'], ['operator_audit_events', 'action'],
  ['operator_audit_events', 'target_type'], ['operator_audit_events', 'status'],
  ['operator_audit_events', 'correlation_id'], ['operator_audit_events', 'metadata'],
  ['operator_audit_events', 'occurred_at'],
  ['operator_action_requests', 'request_key'], ['operator_action_requests', 'actor_user_id'],
  ['operator_action_requests', 'action'], ['operator_action_requests', 'target_type'],
  ['operator_action_requests', 'target_id'], ['operator_action_requests', 'status'],
  ['operator_action_requests', 'error_message'], ['operator_action_requests', 'created_at'],
  ['operator_action_requests', 'completed_at'],
]

const requiredFunctions = [
  'try_acquire_feed_import_lease',
  'renew_feed_import_lease',
  'complete_feed_import_success',
  'complete_feed_import_failure',
  'list_due_feed_imports',
  'catalog_ranked_products',
  'winkelnu_production_readiness',
  'winkelnu_operations_security_readiness',
  'deny_operator_audit_event_mutation',
  'operator_retry_feed',
  'operator_pause_feed',
  'operator_resume_feed',
]

const requiredSecurityPatterns = [
  ['operator audit table untrusted revoke', /revoke\s+all\s+on\s+table\s+operator_audit_events\s+from\s+public[\s\S]*?anon[\s\S]*?authenticated/i],
  ['operator audit table service-role grant', /grant\s+select\s*,\s*insert\s+on\s+table\s+operator_audit_events\s+to\s+service_role/i],
  ['operator idempotency table untrusted revoke', /revoke\s+all\s+on\s+table\s+operator_action_requests\s+from\s+public[\s\S]*?anon[\s\S]*?authenticated/i],
  ['operator idempotency service-role grant', /grant\s+select\s*,\s*insert\s*,\s*update\s+on\s+table\s+operator_action_requests\s+to\s+service_role/i],
  ['audit append-only trigger', /create\s+trigger\s+operator_audit_events_append_only[\s\S]*?before\s+update\s+or\s+delete\s+on\s+operator_audit_events/i],
  ['retry RPC untrusted revoke', /revoke\s+all\s+on\s+function\s+operator_retry_feed\(text\s*,\s*text\s*,\s*timestamptz\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['pause RPC untrusted revoke', /revoke\s+all\s+on\s+function\s+operator_pause_feed\(text\s*,\s*text\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['resume RPC untrusted revoke', /revoke\s+all\s+on\s+function\s+operator_resume_feed\(text\s*,\s*text\s*,\s*timestamptz\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['operations readiness service-role grant', /grant\s+execute\s+on\s+function\s+winkelnu_operations_security_readiness\(\)\s+to\s+service_role/i],
  ['operator action retention policy', /retain\s+records\s+for\s+at\s+least\s+90\s+days/i],
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

for (const [label, pattern] of requiredSecurityPatterns) {
  if (!pattern.test(migrations)) failures.push(`Missing required security contract: ${label}`)
}

if (failures.length > 0) {
  console.error('Database contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Database contract OK: ${requiredTables.length} RLS-protected tables, ${requiredColumns.length} critical columns, ${requiredFunctions.length} functions and ${requiredSecurityPatterns.length} security contracts verified.`)
