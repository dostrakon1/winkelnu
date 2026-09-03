import type { ProductMatchDecision } from './matching'

export type ImportRunStatus = 'running' | 'completed' | 'completed_with_errors' | 'failed'

export type ImportRun = {
  id: string
  correlationId?: string
  sourceKey: string
  merchantId: string
  status: ImportRunStatus
  startedAt: string
  finishedAt?: string
  recordsSeen: number
  recordsAccepted: number
  recordsRejected: number
  offersDeactivated: number
  reviewRequired: number
  errorSummary: string[]
}

export type ImportReject = {
  id: string
  importRunId: string
  sourceKey: string
  merchantProductId: string
  reasons: string[]
  rejectedAt: string
}

export type MatchReviewItem = {
  id: string
  importRunId: string
  merchantId: string
  sourceKey: string
  decision: ProductMatchDecision
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  resolvedAt?: string
}
