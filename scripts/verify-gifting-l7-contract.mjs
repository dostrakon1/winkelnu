import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const migration = await readFile(resolve('supabase/migrations/0029_gifting_retention_rate_limits.sql'), 'utf8')
const releaseGate = await readFile(resolve('src/application/gifting/gifting-release.ts'), 'utf8')
const analytics = await readFile(resolve('src/lib/analytics/public-web-analytics.ts'), 'utf8')

const requiredMigrationPatterns = [
  ['pg_cron extension', /create\s+extension\s+if\s+not\s+exists\s+pg_cron/i],
  ['rate-limit table', /create\s+table\s+gifting_rate_limit_buckets\b/i],
  ['rate-limit RLS', /alter\s+table\s+gifting_rate_limit_buckets\s+enable\s+row\s+level\s+security/i],
  ['rate-limit untrusted revoke', /revoke\s+all\s+on\s+table\s+gifting_rate_limit_buckets\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['rate-limit service-role grant', /grant\s+select\s*,\s*insert\s*,\s*update\s*,\s*delete\s+on\s+table\s+gifting_rate_limit_buckets\s+to\s+service_role/i],
  ['rate-limit RPC', /create\s+or\s+replace\s+function\s+consume_gifting_rate_limit\b/i],
  ['rate-limit RPC untrusted revoke', /revoke\s+all\s+on\s+function\s+consume_gifting_rate_limit\(text\s*,\s*text\s*,\s*integer\s*,\s*integer\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['rate-limit RPC service-role grant', /grant\s+execute\s+on\s+function\s+consume_gifting_rate_limit\(text\s*,\s*text\s*,\s*integer\s*,\s*integer\)\s+to\s+service_role/i],
  ['group expiry normalizer', /create\s+or\s+replace\s+function\s+normalize_gift_group_expiry\b/i],
  ['group retention refresh', /create\s+or\s+replace\s+function\s+refresh_gift_group_retention\b/i],
  ['participant retention trigger', /create\s+trigger\s+gift_group_participant_retention_touch/i],
  ['wish retention trigger', /create\s+trigger\s+gift_list_item_group_retention_touch/i],
  ['group cascade deletion RPC', /create\s+or\s+replace\s+function\s+delete_gift_group_with_lists\b/i],
  ['cleanup RPC', /create\s+or\s+replace\s+function\s+cleanup_expired_gifting_data\b/i],
  ['cleanup RPC untrusted revoke', /revoke\s+all\s+on\s+function\s+cleanup_expired_gifting_data\(\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['cleanup service-role grant', /grant\s+execute\s+on\s+function\s+cleanup_expired_gifting_data\(\)\s+to\s+service_role/i],
  ['daily retention job', /cron\.schedule\([\s\S]*?'winkelnu-gifting-retention'[\s\S]*?'17 3 \* \* \*'/i],
  ['dated group 120-day retention', /event_date\s*\+\s*120/i],
  ['undated 180-day retention', /interval\s+'180 days'/i],
  ['rate bucket short retention', /gifting_rate_limit_buckets[\s\S]*?interval\s+'2 days'/i],
]

const failures = []
for (const [label, pattern] of requiredMigrationPatterns) {
  if (!pattern.test(migration)) failures.push(`Missing L7 migration contract: ${label}`)
}

if (!/WINKELNU_GIFTING_ENABLED\s*===\s*'true'/i.test(releaseGate)) {
  failures.push('Gifting release gate must require WINKELNU_GIFTING_ENABLED=true.')
}
if (!/WINKELNU_GIFT_SESSION_SECRET/i.test(releaseGate) || !/MIN_GIFT_SESSION_SECRET_BYTES\s*=\s*32/i.test(releaseGate)) {
  failures.push('Gifting release gate must require a 32+ byte session secret.')
}
if (!/BLOCKED_PREFIXES\s*=\s*\[[^\]]*['"]\/lootje-lijstje['"]/s.test(analytics)) {
  failures.push('Lootje & Lijstje must remain excluded from public Web Analytics.')
}

if (failures.length > 0) {
  console.error('Lootje & Lijstje L7 contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Lootje & Lijstje L7 contract OK: ${requiredMigrationPatterns.length} migration safeguards plus release-gate and analytics isolation verified.`)
