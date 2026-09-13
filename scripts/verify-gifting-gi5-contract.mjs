import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const migration = await readFile(resolve('supabase/migrations/0034_gifting_insights_health_retention.sql'), 'utf8')
const dashboard = await readFile(resolve('src/app/intern/operations/gifting/health/page.tsx'), 'utf8')
const repository = await readFile(resolve('src/infrastructure/gifting/supabase-gifting-health-insights-repository.ts'), 'utf8')

const failures = []

const requiredMigrationPatterns = [
  ['health overview RPC', /create\s+or\s+replace\s+function\s+gifting_insights_health_overview\s*\(/i],
  ['rate-limit aggregate RPC', /create\s+or\s+replace\s+function\s+gifting_insights_rate_limit_rejections\s*\(/i],
  ['cleanup status RPC', /create\s+or\s+replace\s+function\s+gifting_insights_cleanup_status\s*\(/i],
  ['rate-limit rejection metric', /'rate_limit_rejected'[\s\S]*?'action'/i],
  ['raw event 90 day retention', /delete\s+from\s+gifting_insight_events[\s\S]*?interval\s+'90 days'/i],
  ['product detail 25 month retention', /delete\s+from\s+gifting_daily_metrics[\s\S]*?dimension_key\s*=\s*'product_external_key'[\s\S]*?interval\s+'25 months'/i],
  ['participant structural limit check', /participant_count\s*>\s*50/i],
  ['draw assignment integrity check', /assignment_count[\s\S]*?participant_count/i],
  ['retention cron observability', /winkelnu-gifting-retention/i],
]

for (const [label, pattern] of requiredMigrationPatterns) {
  if (!pattern.test(migration)) failures.push(`Missing GI5 migration contract: ${label}`)
}

for (const fn of [
  'gifting_insights_health_overview(date, date)',
  'gifting_insights_rate_limit_rejections(date, date)',
  'gifting_insights_cleanup_status()',
]) {
  const escaped = fn.replace(/[()]/g, (value) => `\\${value}`).replace(/, /g, '\\s*,\\s*')
  if (!new RegExp(`revoke\\s+all\\s+on\\s+function\\s+${escaped}\\s+from\\s+public\\s*,\\s*anon\\s*,\\s*authenticated`, 'i').test(migration)) {
    failures.push(`GI5 RPC must revoke untrusted execute: ${fn}`)
  }
  if (!new RegExp(`grant\\s+execute\\s+on\\s+function\\s+${escaped}\\s+to\\s+service_role`, 'i').test(migration)) {
    failures.push(`GI5 RPC must grant service_role execute: ${fn}`)
  }
}

if (!/requireOperatorPermission\(['"]read_gifting_insights['"]\)/.test(dashboard)) {
  failures.push('GI5 dashboard must require read_gifting_insights permission.')
}
if (!/robots:\s*\{\s*index:\s*false,\s*follow:\s*false,\s*nocache:\s*true\s*\}/.test(dashboard)) {
  failures.push('GI5 dashboard must remain noindex/nofollow/nocache.')
}

for (const forbidden of ['share_code', 'group_code', 'display_name', 'participant_token', 'organizer_token', 'owner_token', 'email', 'external_url', 'giver_participant_id', 'recipient_participant_id', 'ip_address', 'user_agent']) {
  if (new RegExp(`\\b${forbidden}\\b`, 'i').test(repository)) {
    failures.push(`GI5 repository must not map private gifting field: ${forbidden}`)
  }
}

if (/bucket_key[^\n]*dimension|dimension[^\n]*bucket_key/i.test(migration)) {
  failures.push('GI5 must not roll rate-limit bucket identifiers into durable metrics.')
}
if (/create\s+table/i.test(migration)) {
  failures.push('GI5 should use existing storage and must not introduce a new persistence table.')
}

if (failures.length > 0) {
  console.error('GI5 gifting health/retention contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('GI5 gifting health/retention contract OK: aggregate health, explicit retention, safe rate-limit metrics and protected dashboard verified.')
