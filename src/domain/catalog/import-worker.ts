import type { FeedImportExecutionResult, FeedImportOrchestrationState } from './import-orchestration'

export type DueFeedSource = {
  merchantId: string
  sourceKey: string
  nextRunAt?: string
}

export type FeedHealthStatus = 'healthy' | 'delayed' | 'failing' | 'attention_required'

export type FeedHealth = {
  merchantId: string
  sourceKey: string
  status: FeedHealthStatus
  failureCount: number
  lastError?: string
  lastSucceededAt?: string
  nextRunAt?: string
}

export type FeedBatchItemResult<T> = DueFeedSource & {
  execution: FeedImportExecutionResult<T>
}

export type FeedBatchResult<T> = {
  discovered: number
  completed: number
  failed: number
  skipped: number
  items: FeedBatchItemResult<T>[]
}

export function classifyFeedHealth(state: FeedImportOrchestrationState, now: string): FeedHealth {
  const overdueMs = state.nextRunAt ? Date.parse(now) - Date.parse(state.nextRunAt) : 0
  let status: FeedHealthStatus = 'healthy'
  if (state.failureCount >= 3) status = 'attention_required'
  else if (state.failureCount > 0) status = 'failing'
  else if (overdueMs > 30 * 60_000) status = 'delayed'

  return {
    merchantId: state.merchantId,
    sourceKey: state.sourceKey,
    status,
    failureCount: state.failureCount,
    lastError: state.lastError,
    lastSucceededAt: state.lastSucceededAt,
    nextRunAt: state.nextRunAt,
  }
}
