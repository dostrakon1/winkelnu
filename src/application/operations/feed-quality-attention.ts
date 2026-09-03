import type { ImportQualitySummary } from '@/application/operations/import-quality-summary'
import type { ImportRunEvidence } from '@/application/operations/import-run-evidence'

export type FeedQualityAttentionLevel = 'healthy' | 'watch' | 'attention' | 'critical'

export type FeedQualityAttentionSignal = {
  merchantId: string
  sourceKey: string
  level: FeedQualityAttentionLevel
  recordsSeen: number
  rejectRatio: number
  reviewRatio: number
  pendingReviews: number
  observedAt?: string
  reasons: string[]
}

const MIN_RECORDS_FOR_RATIO = 100

export function buildFeedQualityAttentionSignals(
  summaries: ImportQualitySummary[],
  runs: ImportRunEvidence[],
): FeedQualityAttentionSignal[] {
  return summaries.map((summary) => {
    const feedRuns = runs.filter((run) => run.merchantId === summary.merchantId && run.sourceKey === summary.sourceKey)
    const recordsSeen = feedRuns.reduce((total, run) => total + run.recordsSeen, 0)
    const rejected = feedRuns.reduce((total, run) => total + run.recordsRejected, 0)
    const reviewLoad = summary.reviewsPending + summary.noMatchConfidence
    const rejectRatio = recordsSeen > 0 ? rejected / recordsSeen : 0
    const reviewRatio = recordsSeen > 0 ? reviewLoad / recordsSeen : 0
    const reasons: string[] = []
    let level: FeedQualityAttentionLevel = 'healthy'

    if (recordsSeen >= MIN_RECORDS_FOR_RATIO) {
      if (rejectRatio >= 0.15) {
        level = 'critical'
        reasons.push(`rejectratio ${(rejectRatio * 100).toFixed(1)}%`)
      } else if (rejectRatio >= 0.05) {
        level = 'attention'
        reasons.push(`rejectratio ${(rejectRatio * 100).toFixed(1)}%`)
      }

      if (reviewRatio >= 0.20) {
        level = 'critical'
        reasons.push(`reviewbelasting ${(reviewRatio * 100).toFixed(1)}%`)
      } else if (reviewRatio >= 0.10 && level !== 'critical') {
        level = 'attention'
        reasons.push(`reviewbelasting ${(reviewRatio * 100).toFixed(1)}%`)
      }
    }

    if (summary.reviewsPending >= 25 && level === 'healthy') {
      level = 'watch'
      reasons.push(`${summary.reviewsPending} openstaande reviews`)
    }

    return {
      merchantId: summary.merchantId,
      sourceKey: summary.sourceKey,
      level,
      recordsSeen,
      rejectRatio,
      reviewRatio,
      pendingReviews: summary.reviewsPending,
      observedAt: summary.latestEvidenceAt,
      reasons,
    }
  })
}
