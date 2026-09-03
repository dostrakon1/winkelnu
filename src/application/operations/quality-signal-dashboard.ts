import type { FeedQualityAttentionSignal, FeedQualityAttentionLevel } from '@/application/operations/feed-quality-attention'

export type QualitySignalDashboardSummary = {
  total: number
  healthy: number
  watch: number
  attention: number
  critical: number
  prioritized: FeedQualityAttentionSignal[]
}

const weight: Record<FeedQualityAttentionLevel, number> = {
  healthy: 0,
  watch: 1,
  attention: 2,
  critical: 3,
}

export function buildQualitySignalDashboardSummary(
  signals: FeedQualityAttentionSignal[],
  limit = 8,
): QualitySignalDashboardSummary {
  const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), 20)
  const prioritized = signals
    .filter((signal) => signal.level !== 'healthy')
    .sort((a, b) => {
      const severity = weight[b.level] - weight[a.level]
      if (severity !== 0) return severity
      const observed = Date.parse(b.observedAt ?? '') - Date.parse(a.observedAt ?? '')
      if (Number.isFinite(observed) && observed !== 0) return observed
      return `${a.merchantId}:${a.sourceKey}`.localeCompare(`${b.merchantId}:${b.sourceKey}`)
    })
    .slice(0, boundedLimit)

  return {
    total: signals.length,
    healthy: signals.filter((signal) => signal.level === 'healthy').length,
    watch: signals.filter((signal) => signal.level === 'watch').length,
    attention: signals.filter((signal) => signal.level === 'attention').length,
    critical: signals.filter((signal) => signal.level === 'critical').length,
    prioritized,
  }
}
