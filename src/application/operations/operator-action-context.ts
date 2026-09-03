import type { OperationsIncident } from '@/application/affiliate/operations-dashboard'
import type { OperatorActionHistoryItem, OperatorActionOutcome } from '@/application/operations/operator-action-history'

export type OperatorActionHistoryFilters = {
  actor?: string
  action?: string
  outcome?: OperatorActionOutcome
  merchantId?: string
  sourceKey?: string
}

function includesInsensitive(value: string | undefined, query: string | undefined): boolean {
  if (!query) return true
  return Boolean(value?.toLocaleLowerCase('en-US').includes(query.toLocaleLowerCase('en-US')))
}

export function filterOperatorActionHistory(
  history: OperatorActionHistoryItem[],
  filters: OperatorActionHistoryFilters,
): OperatorActionHistoryItem[] {
  return history.filter((item) =>
    includesInsensitive(item.actorEmail, filters.actor)
    && includesInsensitive(item.action, filters.action)
    && (!filters.outcome || item.outcome === filters.outcome)
    && includesInsensitive(item.merchantId, filters.merchantId)
    && includesInsensitive(item.sourceKey, filters.sourceKey),
  )
}

export function relevantActionsForIncident(
  history: OperatorActionHistoryItem[],
  incident: Pick<OperationsIncident, 'merchantId' | 'sourceKey'>,
  limit = 3,
): OperatorActionHistoryItem[] {
  if (!incident.sourceKey) return []
  const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), 10)
  return history
    .filter((item) => item.merchantId === incident.merchantId && item.sourceKey === incident.sourceKey)
    .slice(0, boundedLimit)
}
