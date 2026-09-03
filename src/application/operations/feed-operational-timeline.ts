import type { PartnerOperationsReadModel } from '@/application/affiliate/partner-operations-read-model'
import type { OperatorActionHistoryItem } from '@/application/operations/operator-action-history'
import type { ImportRunEvidence } from '@/application/operations/import-run-evidence'
import type { ImportQualitySummary } from '@/application/operations/import-quality-summary'
import type { FeedQualityAttentionSignal } from '@/application/operations/feed-quality-attention'

export type FeedTimelineEventKind = 'state' | 'started' | 'succeeded' | 'scheduled' | 'operator_action' | 'import_run' | 'quality_summary' | 'quality_attention'

export type FeedTimelineEvent = {
  id: string
  kind: FeedTimelineEventKind
  occurredAt: string
  label: string
  detail?: string
  outcome?: OperatorActionHistoryItem['outcome']
}

export type FeedOperationalTimeline = {
  merchantId: string
  merchantName: string
  sourceKey: string
  isActive: boolean
  healthStatus?: string
  failureCount: number
  hasActiveLease: boolean
  qualityAttention?: FeedQualityAttentionSignal['level']
  events: FeedTimelineEvent[]
}

const actionLabel: Record<string, string> = {
  'feed.retry': 'Retry aangevraagd',
  'feed.pause': 'Feed gepauzeerd',
  'feed.resume': 'Feed hervat',
}

const runStatusLabel: Record<ImportRunEvidence['status'], string> = {
  running: 'Import draait',
  completed: 'Import voltooid',
  completed_with_errors: 'Import voltooid met fouten',
  failed: 'Import mislukt',
}

const attentionLabel: Record<FeedQualityAttentionSignal['level'], string> = {
  healthy: 'Importkwaliteit gezond',
  watch: 'Importkwaliteit volgen',
  attention: 'Importkwaliteit vraagt aandacht',
  critical: 'Importkwaliteit kritisch',
}

export function buildFeedOperationalTimelines(
  model: PartnerOperationsReadModel,
  history: OperatorActionHistoryItem[],
  importRuns: ImportRunEvidence[] = [],
  qualitySummaries: ImportQualitySummary[] = [],
  qualitySignals: FeedQualityAttentionSignal[] = [],
): FeedOperationalTimeline[] {
  return model.integrations.flatMap((integration) => integration.feeds.map((feed) => {
    const events: FeedTimelineEvent[] = []
    const snapshotAt = model.generatedAt
    const orchestration = feed.orchestration

    events.push({
      id: `${integration.merchantId}:${feed.sourceKey}:state:${snapshotAt}`,
      kind: 'state',
      occurredAt: snapshotAt,
      label: feed.isActive ? 'Feed actief' : 'Feed gepauzeerd',
      detail: feed.health ? `Health: ${feed.health.status}; failures: ${feed.health.failureCount}` : 'Nog geen orchestration health beschikbaar',
    })

    if (orchestration?.lastStartedAt) events.push({ id: `${integration.merchantId}:${feed.sourceKey}:started:${orchestration.lastStartedAt}`, kind: 'started', occurredAt: orchestration.lastStartedAt, label: 'Import gestart' })
    if (orchestration?.lastSucceededAt) events.push({ id: `${integration.merchantId}:${feed.sourceKey}:succeeded:${orchestration.lastSucceededAt}`, kind: 'succeeded', occurredAt: orchestration.lastSucceededAt, label: 'Import geslaagd' })
    if (orchestration?.nextRunAt) events.push({ id: `${integration.merchantId}:${feed.sourceKey}:scheduled:${orchestration.nextRunAt}`, kind: 'scheduled', occurredAt: orchestration.nextRunAt, label: 'Volgende import gepland' })

    history
      .filter((item) => item.merchantId === integration.merchantId && item.sourceKey === feed.sourceKey)
      .forEach((item) => events.push({ id: `audit:${item.id}`, kind: 'operator_action', occurredAt: item.occurredAt, label: actionLabel[item.action] ?? item.action, detail: `${item.actorEmail} · ${item.actorRole}`, outcome: item.outcome }))

    importRuns
      .filter((run) => run.merchantId === integration.merchantId && run.sourceKey === feed.sourceKey)
      .slice(0, 5)
      .forEach((run) => events.push({
        id: `run:${run.runId}`,
        kind: 'import_run',
        occurredAt: run.finishedAt ?? run.startedAt,
        label: runStatusLabel[run.status],
        detail: `Gezien ${run.recordsSeen} · geaccepteerd ${run.recordsAccepted} · afgewezen ${run.recordsRejected} · gedeactiveerd ${run.offersDeactivated} · review ${run.reviewRequired}${run.correlationId ? ` · correlatie ${run.correlationId}` : ''}`,
      }))

    const quality = qualitySummaries.find((item) => item.merchantId === integration.merchantId && item.sourceKey === feed.sourceKey)
    if (quality?.latestEvidenceAt) events.push({
      id: `quality:${integration.merchantId}:${feed.sourceKey}:${quality.latestEvidenceAt}`,
      kind: 'quality_summary',
      occurredAt: quality.latestEvidenceAt,
      label: 'Importkwaliteit samenvatting',
      detail: `Runs ${quality.runsObserved} · rejects ${quality.rejectsObserved} · reviews pending ${quality.reviewsPending} · approved ${quality.reviewsApproved} · rejected ${quality.reviewsRejected} · review-confidence ${quality.reviewConfidence} · geen match ${quality.noMatchConfidence}`,
    })

    const qualitySignal = qualitySignals.find((item) => item.merchantId === integration.merchantId && item.sourceKey === feed.sourceKey)
    if (qualitySignal && qualitySignal.level !== 'healthy' && qualitySignal.observedAt) events.push({
      id: `quality-attention:${integration.merchantId}:${feed.sourceKey}:${qualitySignal.observedAt}`,
      kind: 'quality_attention',
      occurredAt: qualitySignal.observedAt,
      label: attentionLabel[qualitySignal.level],
      detail: qualitySignal.reasons.join(' · '),
    })

    events.sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))

    return {
      merchantId: integration.merchantId,
      merchantName: integration.merchantName,
      sourceKey: feed.sourceKey,
      isActive: feed.isActive,
      healthStatus: feed.health?.status,
      failureCount: feed.health?.failureCount ?? orchestration?.failureCount ?? 0,
      hasActiveLease: orchestration?.leaseActive ?? false,
      qualityAttention: qualitySignal?.level,
      events: events.slice(0, 20),
    }
  }))
}
