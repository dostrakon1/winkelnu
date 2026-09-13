import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const migration = await readFile(resolve('supabase/migrations/0030_gifting_insights_foundation.sql'), 'utf8')
const authorization = await readFile(resolve('src/application/auth/operator-authorization.ts'), 'utf8')
const dashboard = await readFile(resolve('src/app/intern/operations/gifting/page.tsx'), 'utf8')
const repository = await readFile(resolve('src/infrastructure/gifting/supabase-gifting-insights-repository.ts'), 'utf8')

const requiredMigrationPatterns = [
  ['insight event table', /create\s+table\s+gifting_insight_events\b/i],
  ['daily metric table', /create\s+table\s+gifting_daily_metrics\b/i],
  ['event RLS', /alter\s+table\s+gifting_insight_events\s+enable\s+row\s+level\s+security/i],
  ['daily metric RLS', /alter\s+table\s+gifting_daily_metrics\s+enable\s+row\s+level\s+security/i],
  ['event untrusted revoke', /revoke\s+all\s+on\s+table\s+gifting_insight_events\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['daily metric untrusted revoke', /revoke\s+all\s+on\s+table\s+gifting_daily_metrics\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['overview function', /create\s+or\s+replace\s+function\s+gifting_insights_overview\b/i],
  ['daily activity function', /create\s+or\s+replace\s+function\s+gifting_insights_daily_activity\b/i],
  ['recent groups function', /create\s+or\s+replace\s+function\s+gifting_insights_recent_groups\b/i],
  ['overview untrusted revoke', /revoke\s+all\s+on\s+function\s+gifting_insights_overview\(timestamptz\s*,\s*timestamptz\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['overview service role grant', /grant\s+execute\s+on\s+function\s+gifting_insights_overview\(timestamptz\s*,\s*timestamptz\)\s+to\s+service_role/i],
  ['daily activity untrusted revoke', /revoke\s+all\s+on\s+function\s+gifting_insights_daily_activity\(date\s*,\s*date\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['recent groups untrusted revoke', /revoke\s+all\s+on\s+function\s+gifting_insights_recent_groups\(integer\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['delete-safe group link', /group_id\s+uuid\s+references\s+gift_groups\(id\)\s+on\s+delete\s+set\s+null/i],
  ['delete-safe list link', /list_id\s+uuid\s+references\s+gift_lists\(id\)\s+on\s+delete\s+set\s+null/i],
]

const failures = []
for (const [label, pattern] of requiredMigrationPatterns) {
  if (!pattern.test(migration)) failures.push(`Missing GI1 migration contract: ${label}`)
}

const eventTableDeclaration = migration.match(/create\s+table\s+gifting_insight_events\s*\(([\s\S]*?)\n\);/i)?.[1] ?? ''
for (const forbidden of ['participant_id', 'display_name', 'email', 'share_code', 'token_hash', 'external_url', 'recipient_participant_id', 'giver_participant_id', 'ip_address', 'user_agent']) {
  if (new RegExp(`\\b${forbidden}\\b`, 'i').test(eventTableDeclaration)) {
    failures.push(`Insight event table must not contain sensitive field: ${forbidden}`)
  }
}

if (!/\|\s*'read_gifting_insights'/i.test(authorization)) {
  failures.push('Operator authorization must define read_gifting_insights.')
}
if (!/operator:\s*\[[^\]]*'read_gifting_insights'/s.test(authorization)) {
  failures.push('Operator role must be allowed to read gifting insights.')
}
if (/read_only:\s*\[[^\]]*'read_gifting_insights'/s.test(authorization)) {
  failures.push('Read-only role must not receive gifting insights permission by default.')
}
if (!/requireOperatorPermission\(['"]read_gifting_insights['"]\)/.test(dashboard)) {
  failures.push('Gifting dashboard must require the dedicated gifting insights permission.')
}
if (/display_name|share_code|token_hash|recipient_participant_id|giver_participant_id/i.test(repository)) {
  failures.push('Gifting insights repository must not map secret/private gifting fields.')
}

if (failures.length > 0) {
  console.error('Lootje & Lijstje Insights GI1 contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Lootje & Lijstje Insights GI1 contract OK: ${requiredMigrationPatterns.length} database safeguards plus authorization and secret-field isolation verified.`)
