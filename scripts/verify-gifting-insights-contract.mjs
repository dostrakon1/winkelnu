import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const foundation = await readFile(resolve('supabase/migrations/0030_gifting_insights_foundation.sql'), 'utf8')
const lifecycle = await readFile(resolve('supabase/migrations/0031_gifting_insights_lifecycle_rollups.sql'), 'utf8')
const interaction = await readFile(resolve('supabase/migrations/0032_gifting_insights_interaction_funnel.sql'), 'utf8')
const authorization = await readFile(resolve('src/application/auth/operator-authorization.ts'), 'utf8')
const dashboard = await readFile(resolve('src/app/intern/operations/gifting/page.tsx'), 'utf8')
const funnelDashboard = await readFile(resolve('src/app/intern/operations/gifting/funnel/page.tsx'), 'utf8')
const repository = await readFile(resolve('src/infrastructure/gifting/supabase-gifting-insights-repository.ts'), 'utf8')
const funnelRepository = await readFile(resolve('src/infrastructure/gifting/supabase-gifting-funnel-insights-repository.ts'), 'utf8')
const endpoint = await readFile(resolve('src/app/api/gifting/insights/route.ts'), 'utf8')
const beacon = await readFile(resolve('src/components/gifting/gifting-insight-beacon.tsx'), 'utf8')
const shareActions = await readFile(resolve('src/components/gifting/gift-share-actions.tsx'), 'utf8')
const rateLimit = await readFile(resolve('src/application/gifting/gifting-rate-limit.ts'), 'utf8')
const landing = await readFile(resolve('src/app/lootje-lijstje/page.tsx'), 'utf8')
const groupCreate = await readFile(resolve('src/app/lootje-lijstje/groep/nieuw/page.tsx'), 'utf8')
const listCreate = await readFile(resolve('src/app/lootje-lijstje/lijstje/nieuw/page.tsx'), 'utf8')
const groupInvite = await readFile(resolve('src/app/lootje-lijstje/groep/[groupCode]/page.tsx'), 'utf8')
const sharedList = await readFile(resolve('src/app/lootje-lijstje/lijstje/[shareCode]/page.tsx'), 'utf8')

const requiredFoundationPatterns = [
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

const requiredLifecyclePatterns = [
  ['idempotent event recorder', /create\s+or\s+replace\s+function\s+record_gifting_insight_event\b[\s\S]*?on\s+conflict\s*\(event_key\)\s+do\s+nothing/i],
  ['daily metric incrementer', /create\s+or\s+replace\s+function\s+increment_gifting_daily_metric\b/i],
  ['participant lifecycle trigger', /create\s+trigger\s+gifting_participant_lifecycle_insight[\s\S]*?after\s+insert\s+or\s+delete\s+on\s+gift_group_participants/i],
  ['standalone list create trigger', /create\s+trigger\s+gifting_standalone_list_created_insight[\s\S]*?after\s+insert\s+on\s+gift_lists/i],
  ['standalone list delete trigger', /create\s+trigger\s+gifting_standalone_list_deleted_insight[\s\S]*?before\s+delete\s+on\s+gift_lists/i],
  ['gift item lifecycle trigger', /create\s+trigger\s+gifting_item_lifecycle_insight[\s\S]*?after\s+insert\s+or\s+delete\s+on\s+gift_list_items/i],
  ['draw lifecycle trigger', /create\s+trigger\s+gifting_draw_lifecycle_insight[\s\S]*?after\s+update\s+of\s+status\s*,\s*draw_version\s+on\s+gift_groups/i],
  ['reservation lifecycle trigger', /create\s+trigger\s+gifting_reservation_lifecycle_insight[\s\S]*?after\s+insert\s+or\s+delete\s+on\s+gift_item_reservations/i],
  ['group deletion trigger', /create\s+trigger\s+gifting_group_deleted_insight[\s\S]*?before\s+delete\s+on\s+gift_groups/i],
  ['three participant milestone', /group_three_participants_reached/i],
  ['historical backfill', /--\s*Backfill the current retained source records/i],
  ['rollup-backed overview', /create\s+or\s+replace\s+function\s+gifting_insights_overview[\s\S]*?from\s+gifting_daily_metrics/i],
  ['rollup-backed daily activity', /create\s+or\s+replace\s+function\s+gifting_insights_daily_activity[\s\S]*?join\s+gifting_daily_metrics/i],
  ['90-day raw event cleanup', /where\s+occurred_at\s*<\s*now\(\)\s*-\s*interval\s+'90 days'/i],
  ['daily cleanup cron', /cron\.schedule\([\s\S]*?'winkelnu-gifting-insight-retention'[\s\S]*?'23 3 \* \* \*'/i],
  ['analytics must not block core flow', /exception\s+when\s+others\s+then[\s\S]*?GIFTING_INSIGHT_CAPTURE_FAILED/i],
]

const requiredInteractionPatterns = [
  ['surface-aware recorder', /record_gifting_insight_event[\s\S]*?increment_gifting_daily_metric\(v_metric_date,\s*p_event_type,\s*1,\s*'source_surface',\s*p_source_surface\)/i],
  ['surface rollup backfill', /insert\s+into\s+gifting_daily_metrics[\s\S]*?'source_surface'[\s\S]*?from\s+gifting_insight_events/i],
  ['funnel function', /create\s+or\s+replace\s+function\s+gifting_insights_funnel\(\s*p_from\s+date\s*,\s*p_to\s+date\s*\)/i],
  ['funnel untrusted revoke', /revoke\s+all\s+on\s+function\s+gifting_insights_funnel\(date\s*,\s*date\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['funnel service role grant', /grant\s+execute\s+on\s+function\s+gifting_insights_funnel\(date\s*,\s*date\)\s+to\s+service_role/i],
  ['surface function', /create\s+or\s+replace\s+function\s+gifting_insights_interactions_by_surface\(\s*p_from\s+date\s*,\s*p_to\s+date\s*\)/i],
  ['surface untrusted revoke', /revoke\s+all\s+on\s+function\s+gifting_insights_interactions_by_surface\(date\s*,\s*date\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['surface service role grant', /grant\s+execute\s+on\s+function\s+gifting_insights_interactions_by_surface\(date\s*,\s*date\)\s+to\s+service_role/i],
]

const failures = []
for (const [label, pattern] of requiredFoundationPatterns) {
  if (!pattern.test(foundation)) failures.push(`Missing GI1 migration contract: ${label}`)
}
for (const [label, pattern] of requiredLifecyclePatterns) {
  if (!pattern.test(lifecycle)) failures.push(`Missing GI2 lifecycle contract: ${label}`)
}
for (const [label, pattern] of requiredInteractionPatterns) {
  if (!pattern.test(interaction)) failures.push(`Missing GI3 interaction contract: ${label}`)
}

const eventTableDeclaration = foundation.match(/create\s+table\s+gifting_insight_events\s*\(([\s\S]*?)\n\);/i)?.[1] ?? ''
for (const forbidden of ['participant_id', 'display_name', 'email', 'share_code', 'token_hash', 'external_url', 'recipient_participant_id', 'giver_participant_id', 'ip_address', 'user_agent']) {
  if (new RegExp(`\\b${forbidden}\\b`, 'i').test(eventTableDeclaration)) {
    failures.push(`Insight event table must not contain sensitive field: ${forbidden}`)
  }
}

const eventWrites = `${lifecycle}\n${interaction}`.match(/insert\s+into\s+gifting_insight_events[\s\S]*?on\s+conflict\s*\(event_key\)\s+do\s+nothing/i)?.[0] ?? ''
for (const forbidden of ['display_name', 'email', 'share_code', 'token_hash', 'external_url', 'recipient_participant_id', 'giver_participant_id', 'ip_address', 'user_agent']) {
  if (new RegExp(`\\b${forbidden}\\b`, 'i').test(eventWrites)) {
    failures.push(`Insight event recorder must not write sensitive field: ${forbidden}`)
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
if (!/requireOperatorPermission\(['"]read_gifting_insights['"]\)/.test(funnelDashboard)) {
  failures.push('Gifting funnel dashboard must require the dedicated gifting insights permission.')
}
if (/display_name|share_code|token_hash|recipient_participant_id|giver_participant_id/i.test(`${repository}\n${funnelRepository}`)) {
  failures.push('Gifting insights repositories must not map secret/private gifting fields.')
}

const expectedEndpointEvents = [
  'gifting_landing_viewed',
  'group_create_form_viewed',
  'list_create_form_viewed',
  'group_invite_viewed',
  'shared_list_viewed',
  'share_link_copied',
  'whatsapp_share_clicked',
  'native_share_invoked',
]
for (const eventType of expectedEndpointEvents) {
  if (!new RegExp(`\\b${eventType}\\b`).test(endpoint)) failures.push(`GI3 endpoint must allow ${eventType}.`)
}
if (!/EVENT_SURFACES/.test(endpoint) || !/allowed\.includes\(body\.sourceSurface\)/.test(endpoint)) {
  failures.push('GI3 endpoint must enforce event-to-surface allowlists.')
}
if (!/enforceGiftingRateLimit\(['"]record-insight['"]\)/.test(endpoint)) {
  failures.push('GI3 endpoint must enforce the gifting insight rate limit.')
}
if (!/p_group_id:\s*null/.test(endpoint) || !/p_list_id:\s*null/.test(endpoint)) {
  failures.push('GI3 public endpoint must not attach group or list identity to interaction events.')
}
for (const forbidden of ['groupCode', 'shareCode', 'displayName', 'email', 'participantId', 'tokenHash', 'externalUrl']) {
  if (new RegExp(`\\b${forbidden}\\b`).test(endpoint)) {
    failures.push(`GI3 endpoint must not accept or use private field: ${forbidden}`)
  }
}

if (/localStorage|sessionStorage|document\.cookie/i.test(beacon)) {
  failures.push('GI3 beacon must not create persistent browser identity or cookies.')
}
if (!/crypto\.randomUUID\(\)/.test(beacon)) {
  failures.push('GI3 beacon must use an ephemeral random event id for idempotency.')
}
if (!/keepalive:\s*true/.test(beacon)) {
  failures.push('GI3 beacon must be fire-and-forget safe during navigation.')
}

const pageContracts = [
  [landing, 'gifting_landing_viewed', 'landing'],
  [groupCreate, 'group_create_form_viewed', 'group_create'],
  [listCreate, 'list_create_form_viewed', 'list_create'],
  [groupInvite, 'group_invite_viewed', 'group_invite'],
  [sharedList, 'shared_list_viewed', 'shared_list'],
]
for (const [source, eventType, surface] of pageContracts) {
  if (!new RegExp(`GiftingInsightBeacon[\\s\\S]*?eventType=[\"']${eventType}[\"'][\\s\\S]*?sourceSurface=[\"']${surface}[\"']`).test(source)) {
    failures.push(`Missing GI3 page beacon: ${eventType} on ${surface}.`)
  }
}

for (const eventType of ['share_link_copied', 'whatsapp_share_clicked', 'native_share_invoked']) {
  if (!new RegExp(`recordGiftingInteraction\\(['\"]${eventType}['\"]`).test(shareActions)) {
    failures.push(`Share actions must record ${eventType}.`)
  }
}
if (!/record-insight/.test(rateLimit) || !/600/.test(rateLimit)) {
  failures.push('GI3 public insight endpoint must have a dedicated bounded rate limit.')
}

if (failures.length > 0) {
  console.error('Lootje & Lijstje Insights contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Lootje & Lijstje Insights GI1+GI2+GI3 contract OK: ${requiredFoundationPatterns.length + requiredLifecyclePatterns.length + requiredInteractionPatterns.length} database/lifecycle/interaction safeguards plus authorization, rate limiting and secret-field isolation verified.`)
