import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = readFileSync(resolve('supabase/migrations/0031_gifting_insights_lifecycle_rollups.sql'), 'utf8')

describe('Lootje & Lijstje Insights GI2', () => {
  it('records lifecycle events idempotently before incrementing durable rollups', () => {
    expect(migration).toMatch(/insert\s+into\s+gifting_insight_events[\s\S]*?on\s+conflict\s*\(event_key\)\s+do\s+nothing/i)
    expect(migration).toMatch(/get\s+diagnostics\s+v_rows\s*=\s*row_count/i)
    expect(migration).toMatch(/if\s+v_rows\s*=\s*1\s+then[\s\S]*?increment_gifting_daily_metric/i)
  })

  it('keeps consumer actions working if analytics capture fails', () => {
    const failureGuards = migration.match(/exception\s+when\s+others\s+then[\s\S]{0,180}?GIFTING_INSIGHT_CAPTURE_FAILED/gi) ?? []
    expect(failureGuards.length).toBeGreaterThanOrEqual(6)
  })

  it('retains anonymous daily totals while raw insight events expire after 90 days', () => {
    expect(migration).toMatch(/delete\s+from\s+gifting_insight_events\s+where\s+occurred_at\s*<\s*now\(\)\s*-\s*interval\s+'90 days'/i)
    expect(migration).not.toMatch(/delete\s+from\s+gifting_daily_metrics/i)
    expect(migration).toMatch(/winkelnu-gifting-insight-retention/)
  })

  it('never persists participant names, emails, capability codes or draw pairings in insight rows', () => {
    const recorder = migration.match(/insert\s+into\s+gifting_insight_events[\s\S]*?on\s+conflict\s*\(event_key\)\s+do\s+nothing/i)?.[0] ?? ''
    for (const forbidden of ['display_name', 'email', 'share_code', 'token_hash', 'external_url', 'giver_participant_id', 'recipient_participant_id', 'ip_address', 'user_agent']) {
      expect(recorder.toLowerCase()).not.toContain(forbidden)
    }
  })
})
