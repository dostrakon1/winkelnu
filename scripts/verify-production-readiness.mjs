import { createClient } from '@supabase/supabase-js'

function required(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function requireTrue(value, message) {
  if (value !== true) throw new Error(message)
}

const client = createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

const { data: readiness, error: readinessError } = await client.rpc('winkelnu_production_readiness')
if (readinessError) throw new Error(`Production readiness RPC failed: ${readinessError.message}`)
const row = Array.isArray(readiness) ? readiness[0] : readiness
if (!row) throw new Error('Production readiness RPC returned no row.')
if (Number(row.rls_enabled_tables) !== 15) {
  throw new Error(`Expected RLS on 15 protected tables, found ${row.rls_enabled_tables}.`)
}

const { data: operationsReadiness, error: operationsReadinessError } = await client.rpc('winkelnu_operations_security_readiness')
if (operationsReadinessError) throw new Error(`Operations security readiness RPC failed: ${operationsReadinessError.message}`)
const operations = Array.isArray(operationsReadiness) ? operationsReadiness[0] : operationsReadiness
if (!operations) throw new Error('Operations security readiness RPC returned no row.')

if (Number(operations.operator_rls_tables) !== 2) {
  throw new Error(`Expected RLS on 2 operator tables, found ${operations.operator_rls_tables}.`)
}
if (Number(operations.operator_tables_without_policies) !== 0) {
  throw new Error(`Expected zero operator RLS policies, found ${operations.operator_tables_without_policies}.`)
}
if (Number(operations.untrusted_operator_table_grants) !== 0) {
  throw new Error(`Found ${operations.untrusted_operator_table_grants} untrusted operator table grants.`)
}
requireTrue(operations.service_role_table_contract, 'Service-role operator table privileges do not match the production contract.')
requireTrue(operations.recovery_functions_service_role, 'Service role cannot execute every recovery RPC.')
requireTrue(operations.recovery_functions_anon_denied, 'Anonymous role can execute one or more recovery RPCs.')
requireTrue(operations.recovery_functions_authenticated_denied, 'Authenticated role can execute one or more recovery RPCs.')
requireTrue(operations.audit_append_only_trigger, 'Operator audit append-only trigger is missing.')

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
  operatorRlsTables: Number(operations.operator_rls_tables),
  operatorTablesWithoutPolicies: Number(operations.operator_tables_without_policies),
  untrustedOperatorTableGrants: Number(operations.untrusted_operator_table_grants),
  serviceRoleTableContract: operations.service_role_table_contract,
  recoveryFunctionsServiceRole: operations.recovery_functions_service_role,
  recoveryFunctionsAnonDenied: operations.recovery_functions_anon_denied,
  recoveryFunctionsAuthenticatedDenied: operations.recovery_functions_authenticated_denied,
  auditAppendOnlyTrigger: operations.audit_append_only_trigger,
  publishedProducts: Number(row.published_products),
  activeOffers: Number(row.active_offers),
  activeMerchants: Number(row.active_merchants),
  activeFeedSources: Number(row.active_feed_sources),
  latestSuccessfulImportAt: row.latest_successful_import_at ?? null,
}, null, 2))
