import type { ImportOrchestrationRepository } from './import-orchestration-ports'
import type { FeedImportExecutionResult } from '@/domain/catalog/import-orchestration'

function isoAfter(iso: string, milliseconds: number): string {
  return new Date(Date.parse(iso) + milliseconds).toISOString()
}

function retryDelay(failureCount: number, baseMs: number, maxMs: number): number {
  const exponent = Math.max(0, failureCount - 1)
  return Math.min(maxMs, baseMs * 2 ** exponent)
}

export class ImportOrchestrationService {
  constructor(private readonly repository: ImportOrchestrationRepository) {}

  async runExclusive<T>(input: {
    merchantId: string
    sourceKey: string
    owner: string
    execute: () => Promise<T>
    now?: () => string
    token?: () => string
    leaseDurationMs?: number
    successDelayMs?: number
    retryBaseMs?: number
    retryMaxMs?: number
  }): Promise<FeedImportExecutionResult<T>> {
    const now = input.now ?? (() => new Date().toISOString())
    const token = input.token ?? (() => globalThis.crypto.randomUUID())
    const leaseDurationMs = input.leaseDurationMs ?? 15 * 60_000
    const successDelayMs = input.successDelayMs ?? 60 * 60_000
    const retryBaseMs = input.retryBaseMs ?? 5 * 60_000
    const retryMaxMs = input.retryMaxMs ?? 6 * 60 * 60_000

    const startedAt = now()
    const lease = await this.repository.acquireLease({
      merchantId: input.merchantId,
      sourceKey: input.sourceKey,
      owner: input.owner,
      token: token(),
      acquiredAt: startedAt,
      expiresAt: isoAfter(startedAt, leaseDurationMs),
    })

    if (!lease) return { status: 'skipped_locked' }

    try {
      const value = await input.execute()
      const finishedAt = now()
      await this.repository.completeSuccess({
        merchantId: input.merchantId,
        sourceKey: input.sourceKey,
        token: lease.leaseToken,
        finishedAt,
        nextRunAt: isoAfter(finishedAt, successDelayMs),
      })
      return { status: 'completed', value }
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error('Unknown import orchestration failure.')
      const finishedAt = now()
      const nextFailureCount = lease.failureCount + 1
      const retryAt = isoAfter(finishedAt, retryDelay(nextFailureCount, retryBaseMs, retryMaxMs))
      await this.repository.completeFailure({
        merchantId: input.merchantId,
        sourceKey: input.sourceKey,
        token: lease.leaseToken,
        finishedAt,
        nextRunAt: retryAt,
        error: error.message,
      })
      return { status: 'failed', error, retryAt }
    }
  }
}
