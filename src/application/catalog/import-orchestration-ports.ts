import type { FeedImportLease, FeedImportOrchestrationState } from '@/domain/catalog/import-orchestration'

export interface ImportOrchestrationRepository {
  getState(input: { merchantId: string; sourceKey: string }): Promise<FeedImportOrchestrationState | null>
  acquireLease(input: {
    merchantId: string
    sourceKey: string
    owner: string
    token: string
    acquiredAt: string
    expiresAt: string
  }): Promise<FeedImportLease | null>
  renewLease(input: {
    merchantId: string
    sourceKey: string
    token: string
    renewedAt: string
    expiresAt: string
  }): Promise<void>
  completeSuccess(input: {
    merchantId: string
    sourceKey: string
    token: string
    finishedAt: string
    nextRunAt: string
  }): Promise<void>
  completeFailure(input: {
    merchantId: string
    sourceKey: string
    token: string
    finishedAt: string
    nextRunAt: string
    error: string
  }): Promise<void>
}
