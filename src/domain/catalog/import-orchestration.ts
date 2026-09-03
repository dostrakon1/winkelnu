export type FeedImportOrchestrationState = {
  merchantId: string
  sourceKey: string
  nextRunAt?: string
  failureCount: number
  lastError?: string
  lastStartedAt?: string
  lastSucceededAt?: string
  leaseOwner?: string
  leaseToken?: string
  leaseExpiresAt?: string
}

export type FeedImportLease = FeedImportOrchestrationState & {
  leaseOwner: string
  leaseToken: string
  leaseExpiresAt: string
}

export type FeedImportExecutionResult<T> =
  | { status: 'skipped_locked'; value?: never }
  | { status: 'completed'; value: T }
  | { status: 'failed'; error: Error; retryAt: string }
