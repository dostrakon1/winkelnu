export type ImportQualitySummary = {
  merchantId: string
  sourceKey: string
  runsObserved: number
  rejectsObserved: number
  reviewsPending: number
  reviewsApproved: number
  reviewsRejected: number
  reviewConfidence: number
  noMatchConfidence: number
  latestEvidenceAt?: string
}

export interface ImportQualitySummaryRepository {
  listRecent(limit: number): Promise<ImportQualitySummary[]>
}

export class ImportQualitySummaryService {
  constructor(private readonly repository: ImportQualitySummaryRepository) {}

  listRecent(limit = 50): Promise<ImportQualitySummary[]> {
    return this.repository.listRecent(Math.min(Math.max(Math.trunc(limit), 1), 100))
  }
}
