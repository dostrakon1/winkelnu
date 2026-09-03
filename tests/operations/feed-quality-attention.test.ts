import { describe, expect, it } from 'vitest'
import { buildFeedQualityAttentionSignals } from '@/application/operations/feed-quality-attention'

const summary = {
  merchantId: 'm', sourceKey: 'feed', runsObserved: 2, rejectsObserved: 0, reviewsPending: 0, reviewsApproved: 0, reviewsRejected: 0, reviewConfidence: 0, noMatchConfidence: 0, latestEvidenceAt: '2026-09-03T10:00:00Z',
}

describe('feed quality attention thresholds', () => {
  it('does not raise ratio alerts below the minimum sample size', () => {
    const result = buildFeedQualityAttentionSignals([{ ...summary, reviewsPending: 10, noMatchConfidence: 10 }], [{ runId: 'r', merchantId: 'm', sourceKey: 'feed', status: 'completed', startedAt: '2026-09-03T09:00:00Z', recordsSeen: 50, recordsAccepted: 30, recordsRejected: 20, offersDeactivated: 0, reviewRequired: 20 }])
    expect(result[0].level).toBe('healthy')
  })

  it('raises critical attention for a high reject ratio with sufficient volume', () => {
    const result = buildFeedQualityAttentionSignals([summary], [{ runId: 'r', merchantId: 'm', sourceKey: 'feed', status: 'completed_with_errors', startedAt: '2026-09-03T09:00:00Z', recordsSeen: 200, recordsAccepted: 160, recordsRejected: 40, offersDeactivated: 0, reviewRequired: 0 }])
    expect(result[0].level).toBe('critical')
    expect(result[0].rejectRatio).toBeCloseTo(0.2)
  })

  it('raises watch for a meaningful pending-review backlog even without ratio evidence', () => {
    const result = buildFeedQualityAttentionSignals([{ ...summary, reviewsPending: 30 }], [])
    expect(result[0].level).toBe('watch')
    expect(result[0].reasons[0]).toContain('30')
  })
})
