import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const expected = [
  '0001_catalog_foundation.sql',
  '0002_catalog_quality_observability.sql',
  '0003_domain_external_keys.sql',
  '0004_affiliate_click_attribution.sql',
  '0005_affiliate_integration_registry.sql',
  '0006_import_orchestration.sql',
  '0007_import_heartbeat_and_correlation.sql',
  '0008_catalog_ranking_read_model.sql',
  '0009_production_security_and_readiness.sql',
  '0010_due_feed_discovery_bootstrap.sql',
  '0011_operator_roles_and_audit_boundary.sql',
  '0012_feed_recovery_actions.sql',
  '0013_operator_action_idempotency.sql',
  '0014_operations_security_readiness.sql',
  '0015_operator_action_retention_policy.sql',
  '0016_explicit_data_api_service_role_grants.sql',
  '0017_external_key_unique_constraints.sql',
  '0018_offer_ranking_hardening.sql',
  '0019_security_hardening_and_fk_indexes.sql',
]

const actual = (await readdir(resolve('supabase/migrations')))
  .filter((name) => /^\d{4}_.*\.sql$/.test(name))
  .sort()

const failures = []
if (actual.length !== expected.length) {
  failures.push(`Expected ${expected.length} numbered migrations, found ${actual.length}.`)
}

for (let index = 0; index < Math.max(actual.length, expected.length); index += 1) {
  if (actual[index] !== expected[index]) {
    failures.push(`Migration manifest mismatch at position ${index + 1}: expected ${expected[index] ?? '<none>'}, found ${actual[index] ?? '<none>'}.`)
  }
}

if (failures.length > 0) {
  console.error('Preview migration manifest verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Preview migration manifest OK: ${expected.length} migrations in exact order (${expected[0]} through ${expected.at(-1)}).`)
