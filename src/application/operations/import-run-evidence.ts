export type ImportRunEvidenceStatus = 'running' | 'completed' | 'completed_with_errors' | 'failed'

export type ImportRunEvidence = {
  runId: string
  merchantId: string
  sourceKey: string
  status: ImportRunEvidenceStatus
  startedAt: string
  finishedAt?: string
  recordsSeen: number
  recordsAccepted: number
  recordsRejected: number
  offersDeactivated: number
  reviewRequired: number
  correlationId?: string
}

export interface ImportRunEvidenceRepository {
  listRecent(limit: number): Promise<ImportRunEvidence[]>
}

export class ImportRunEvidenceService {
  constructor(private readonly repository: ImportRunEvidenceRepository) {}

  listRecent(limit = 50): Promise<ImportRunEvidence[]> {
    return this.repository.listRecent(Math.min(Math.max(Math.trunc(limit), 1), 100))
  }
}
