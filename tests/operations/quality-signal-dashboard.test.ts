import { describe, expect, it } from 'vitest'
import { buildQualitySignalDashboardSummary } from '@/application/operations/quality-signal-dashboard'

const signal = (level: 'healthy' | 'watch' | 'attention' | 'critical', sourceKey: string, observedAt: string) => ({
  merchantId: 'merchant', sourceKey, level, recordsSeen: 1000, rejectRatio: 0, reviewRatio: 0, pendingReviews: 0, observedAt, reasons: [level],
})

describe('quality signal dashboard summary', () => {
  it('counts all quality levels and prioritizes strongest signals first', () => {
    const summary = buildQualitySignalDashboardSummary([
      signal('watch', 'watch', '2026-09-03T09:00:00Z'),
      signal('critical', 'critical-old', '2026-09-03T08:00:00Z'),
      signal('healthy', 'healthy', '2026-09-03T10:00:00Z'),
      signal('attention', 'attention', '2026-09-03T11:00:00Z'),
      signal('critical', 'critical-new', '2026-09-03T12:00:00Z'),
    ])

    expect(summary).toMatchObject({ total: 5, healthy: 1, watch: 1, attention: 1, critical: 2 })
    expect(summary.prioritized.map((item) => item.sourceKey)).toEqual(['critical-new', 'critical-old', 'attention', 'watch'])
  })

  it('bounds dashboard priority rows', () => {
    const summary = buildQualitySignalDashboardSummary([
      signal('critical', 'one', '2026-09-03T10:00:00Z'),
      signal('attention', 'two', '2026-09-03T09:00:00Z'),
    ], 1)
    expect(summary.prioritized).toHaveLength(1)
  })
})
