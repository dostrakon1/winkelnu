import type { OperatorRole } from '@/application/auth/operator-authorization'

export type OperatorActionOutcome = 'succeeded' | 'failed'

export type OperatorActionHistoryItem = {
  id: string
  actorEmail: string
  actorRole: OperatorRole
  action: string
  targetType: string
  targetId?: string
  merchantId?: string
  sourceKey?: string
  outcome: OperatorActionOutcome
  occurredAt: string
}

export interface OperatorActionHistoryRepository {
  listRecent(limit: number): Promise<OperatorActionHistoryItem[]>
}

export class OperatorActionHistoryService {
  constructor(private readonly repository: OperatorActionHistoryRepository) {}

  async listRecent(limit = 20): Promise<OperatorActionHistoryItem[]> {
    const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), 50)
    return this.repository.listRecent(boundedLimit)
  }
}
