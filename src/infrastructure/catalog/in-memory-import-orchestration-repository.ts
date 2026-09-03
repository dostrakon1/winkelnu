import type { ImportOrchestrationRepository } from '@/application/catalog/import-orchestration-ports'
import type { FeedImportLease, FeedImportOrchestrationState } from '@/domain/catalog/import-orchestration'

function key(merchantId: string, sourceKey: string): string {
  return `${merchantId}:${sourceKey}`
}

export class InMemoryImportOrchestrationRepository implements ImportOrchestrationRepository {
  private readonly states = new Map<string, FeedImportOrchestrationState>()

  async getState(input: { merchantId: string; sourceKey: string }): Promise<FeedImportOrchestrationState | null> {
    return this.states.get(key(input.merchantId, input.sourceKey)) ?? null
  }

  async acquireLease(input: {
    merchantId: string
    sourceKey: string
    owner: string
    token: string
    acquiredAt: string
    expiresAt: string
  }): Promise<FeedImportLease | null> {
    const stateKey = key(input.merchantId, input.sourceKey)
    const current = this.states.get(stateKey)
    const acquiredAt = Date.parse(input.acquiredAt)
    if (current?.nextRunAt && Date.parse(current.nextRunAt) > acquiredAt) return null
    if (current?.leaseExpiresAt && Date.parse(current.leaseExpiresAt) > acquiredAt) return null

    const lease: FeedImportLease = {
      merchantId: input.merchantId,
      sourceKey: input.sourceKey,
      nextRunAt: current?.nextRunAt,
      failureCount: current?.failureCount ?? 0,
      lastError: current?.lastError,
      lastStartedAt: input.acquiredAt,
      lastSucceededAt: current?.lastSucceededAt,
      leaseOwner: input.owner,
      leaseToken: input.token,
      leaseExpiresAt: input.expiresAt,
    }
    this.states.set(stateKey, lease)
    return lease
  }

  async completeSuccess(input: { merchantId: string; sourceKey: string; token: string; finishedAt: string; nextRunAt: string }): Promise<void> {
    const stateKey = key(input.merchantId, input.sourceKey)
    const current = this.states.get(stateKey)
    if (!current || current.leaseToken !== input.token) throw new Error('Import lease token no longer owns this source.')
    this.states.set(stateKey, { ...current, nextRunAt: input.nextRunAt, failureCount: 0, lastError: undefined, lastSucceededAt: input.finishedAt, leaseOwner: undefined, leaseToken: undefined, leaseExpiresAt: undefined })
  }

  async completeFailure(input: { merchantId: string; sourceKey: string; token: string; finishedAt: string; nextRunAt: string; error: string }): Promise<void> {
    const stateKey = key(input.merchantId, input.sourceKey)
    const current = this.states.get(stateKey)
    if (!current || current.leaseToken !== input.token) throw new Error('Import lease token no longer owns this source.')
    this.states.set(stateKey, { ...current, nextRunAt: input.nextRunAt, failureCount: current.failureCount + 1, lastError: input.error, leaseOwner: undefined, leaseToken: undefined, leaseExpiresAt: undefined })
  }
}
