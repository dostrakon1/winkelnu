import type { PartnerOperationsReadModel } from '@/application/affiliate/partner-operations-read-model'
import type { OperatorActionHistoryItem } from '@/application/operations/operator-action-history'

export type FeedTimelineEventKind = 'state' | 'started' | 'succeeded' | 'scheduled' | 'operator_action'

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
  events: FeedTimelineEvent[]
}

const actionLabel: Record<string, string> = {
  'feed.retry': 'Retry aangevraagd',
  'feed.pause': 'Feed gepauzeerd',
  'feed.resume': 'Feed hervat',
}

export function buildFeedOperationalTimelines(
  model: PartnerOperationsReadModel,
  history: OperatorActionHistoryItem[],
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

    if (orchestration?.lastStartedAt) events.push({
      id: `${integration.merchantId}:${feed.sourceKey}:started:${orchestration.lastStartedAt}`,
      kind: 'started',
      occurredAt: orchestration.lastStartedAt,
      label: 'Import gestart',
    })
    if (orchestration?.lastSucceededAt) events.push({
      id: `${integration.merchantId}:${feed.sourceKey}:succeeded:${orchestration.lastSucceededAt}`,
      kind: 'succeeded',
      occurredAt: orchestration.lastSucceededAt,
      label: 'Import geslaagd',
    })
    if (orchestration?.nextRunAt) events.push({
      id: `${integration.merchantId}:${feed.sourceKey}:scheduled:${orchestration.nextRunAt}`,
      kind: 'scheduled',
      occurredAt: orchestration.nextRunAt,
      label: 'Volgende import gepland',
    })

    history
      .filter((item) => item.merchantId === integration.merchantId && item.sourceKey === feed.sourceKey)
      .forEach((item) => events.push({
        id: `audit:${item.id}`,
        kind: 'operator_action',
        occurredAt: item.occurredAt,
        label: actionLabel[item.action] ?? item.action,
        detail: `${item.actorEmail} · ${item.actorRole}`,
        outcome: item.outcome,
      }))

    events.sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))

    return {
      merchantId: integration.merchantId,
      merchantName: integration.merchantName,
      sourceKey: feed.sourceKey,
      isActive: feed.isActive,
      healthStatus: feed.health?.status,
      failureCount: feed.health?.failureCount ?? orchestration?.failureCount ?? 0,
      hasActiveLease: orchestration?.leaseActive ?? false,
      events: events.slice(0, 12),
    }
  }))
}
