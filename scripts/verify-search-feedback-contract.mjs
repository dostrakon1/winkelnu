import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const migration = await readFile(resolve('supabase/migrations/0021_search_feedback_learning_signals.sql'), 'utf8')

const checks = [
  ['search feedback table', /create\s+table\s+if\s+not\s+exists\s+search_feedback_events\b/i],
  ['event type column', /\bevent_type\s+text\s+not\s+null/i],
  ['normalized query column', /\bquery_normalized\s+text\s+not\s+null/i],
  ['previous query column', /\bprevious_query_normalized\s+text/i],
  ['zero result signal', /\bzero_results\s+boolean\s+not\s+null/i],
  ['target kind', /\btarget_kind\s+text/i],
  ['target position', /\btarget_position\s+integer/i],
  ['created timestamp', /\bcreated_at\s+timestamptz\s+not\s+null\s+default\s+now\(\)/i],
  ['RLS enabled', /alter\s+table\s+search_feedback_events\s+enable\s+row\s+level\s+security/i],
  ['untrusted roles revoked', /revoke\s+all\s+on\s+table\s+search_feedback_events\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['service role limited table grant', /grant\s+select\s*,\s*insert\s*,\s*delete\s+on\s+table\s+search_feedback_events\s+to\s+service_role/i],
  ['90 day summary boundary', /created_at\s*>=\s*now\(\)\s*-\s*interval\s+'90 days'/i],
  ['query learning summary view', /create\s+or\s+replace\s+view\s+search_feedback_query_summary/i],
  ['summary view untrusted roles revoked', /revoke\s+all\s+on\s+search_feedback_query_summary\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['summary view service role grant', /grant\s+select\s+on\s+search_feedback_query_summary\s+to\s+service_role/i],
  ['privacy-minimal table comment', /no\s+ip\s+address[\s\S]*?user-agent\s+fingerprint[\s\S]*?visitor\s+id[\s\S]*?cookie\s+id/i],
]

const failures = checks
  .filter(([, pattern]) => !pattern.test(migration))
  .map(([label]) => label)

if (failures.length > 0) {
  console.error('Search feedback database contract verification failed:')
  for (const failure of failures) console.error(`- Missing contract: ${failure}`)
  process.exit(1)
}

console.log(`Search feedback database contract OK: ${checks.length} privacy, access and learning-summary checks passed.`)
