import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('Lootje & Lijstje GI5 health and retention', () => {
  it('keeps the health dashboard protected and non-indexable', () => {
    const page = source('src/app/intern/operations/gifting/health/page.tsx')

    expect(page).toContain("requireOperatorPermission('read_gifting_insights')")
    expect(page).toContain("title: 'Lootje & Lijstje Health'")
    expect(page).not.toContain("title: 'Lootje & Lijstje Health | Winkelnu.nl'")
    expect(page).toContain('index: false')
    expect(page).toContain('follow: false')
    expect(page).toContain('nocache: true')
  })

  it('retains raw events for 90 days and product-level daily detail for 25 months', () => {
    const migration = source('supabase/migrations/0034_gifting_insights_health_retention.sql')

    expect(migration).toMatch(/delete from gifting_insight_events[\s\S]*interval '90 days'/)
    expect(migration).toMatch(/delete from gifting_daily_metrics[\s\S]*dimension_key = 'product_external_key'[\s\S]*interval '25 months'/)
  })

  it('records only aggregate rate-limit rejection actions', () => {
    const migration = source('supabase/migrations/0034_gifting_insights_health_retention.sql')
    const metricCalls = [...migration.matchAll(/increment_gifting_daily_metric\(([\s\S]*?)\);/g)].map((match) => match[1])

    expect(migration).toContain("'rate_limit_rejected'")
    expect(migration).toContain("'action'")
    expect(metricCalls.length).toBeGreaterThan(0)
    expect(metricCalls.some((call) => call.includes('p_bucket_key'))).toBe(false)
  })

  it('checks draw integrity, expiry consistency and participant limits without exposing records', () => {
    const migration = source('supabase/migrations/0034_gifting_insights_health_retention.sql')
    const repository = source('src/infrastructure/gifting/supabase-gifting-health-insights-repository.ts')

    expect(migration).toContain('drawn_assignment_mismatches')
    expect(migration).toContain('expiry_mismatches')
    expect(migration).toContain('participant_count > 50')
    expect(repository).not.toContain('display_name')
    expect(repository).not.toContain('share_code')
    expect(repository).not.toContain('group_code')
  })

  it('observes the existing database-local cleanup job instead of adding a new scheduler', () => {
    const migration = source('supabase/migrations/0034_gifting_insights_health_retention.sql')

    expect(migration).toContain("'winkelnu-gifting-retention'")
    expect(migration).not.toContain('cron.schedule(')
  })
})
