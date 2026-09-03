import type { ImportOrchestrationRepository } from './import-orchestration-ports'
import type { FeedImportExecutionResult } from '@/domain/catalog/import-orchestration'

function isoAfter(iso: string, milliseconds: number): string {
  return new Date(Date.parse(iso) + milliseconds).toISOString()
}

function retryDelay(failureCount: number, baseMs: number, maxMs: number): number {
  const exponent = Math.max(0, failureCount - 1)
  return Math.min(maxMs, baseMs * 2 ** exponent)
}

export type ImportLeaseControl = { heartbeat: () => Promise<void> }

export class ImportOrchestrationService {
  constructor(private readonly repository: ImportOrchestrationRepository) {}

  async runExclusive<T>(input: {
    merchantId: string
    sourceKey: string
    owner: string
    execute: (control: ImportLeaseControl) => Promise<T>
    now?: () => string
    token?: () => string
    leaseDurationMs?: number
    heartbeatIntervalMs?: number
    successDelayMs?: number
    retryBaseMs?: number
    retryMaxMs?: number
  }): Promise<FeedImportExecutionResult<T>> {
    const now = input.now ?? (() => new Date().toISOString())
    const token = input.token ?? (() => globalThis.crypto.randomUUID())
    const leaseDurationMs = input.leaseDurationMs ?? 15 * 60_000
    const heartbeatIntervalMs = input.heartbeatIntervalMs ?? Math.min(5 * 60_000, Math.floor(leaseDurationMs / 3))
    const successDelayMs = input.successDelayMs ?? 60 * 60_000
    const retryBaseMs = input.retryBaseMs ?? 5 * 60_000
    const retryMaxMs = input.retryMaxMs ?? 6 * 60 * 60_000
    const startedAt = now()
    let lastHeartbeatAt = Date.parse(startedAt)
    const lease = await this.repository.acquireLease({ merchantId: input.merchantId, sourceKey: input.sourceKey, owner: input.owner, token: token(), acquiredAt: startedAt, expiresAt: isoAfter(startedAt, leaseDurationMs) })
    if (!lease) return { status: 'skipped_locked' }

    const heartbeat = async () => {
      const renewedAt = now()
      const renewedAtMs = Date.parse(renewedAt)
      if (renewedAtMs - lastHeartbeatAt < heartbeatIntervalMs) return
      await this.repository.renewLease({ merchantId: input.merchantId, sourceKey: input.sourceKey, token: lease.leaseToken, renewedAt, expiresAt: isoAfter(renewedAt, leaseDurationMs) })
      lastHeartbeatAt = renewedAtMs
    }

    try {
      const value = await input.execute({ heartbeat })
      const finishedAt = now()
      await this.repository.completeSuccess({ merchantId: input.merchantId, sourceKey: input.sourceKey, token: lease.leaseToken, finishedAt, nextRunAt: isoAfter(finishedAt, successDelayMs) })
      return { status: 'completed', value }
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error('Unknown import orchestration failure.')
      const finishedAt = now()
      const retryAt = isoAfter(finishedAt, retryDelay(lease.failureCount + 1, retryBaseMs, retryMaxMs))
      await this.repository.completeFailure({ merchantId: input.merchantId, sourceKey: input.sourceKey, token: lease.leaseToken, finishedAt, nextRunAt: retryAt, error: error.message })
      return { status: 'failed', error, retryAt }
    }
  }
}
