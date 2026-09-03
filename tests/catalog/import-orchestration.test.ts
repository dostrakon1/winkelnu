import { describe, expect, it } from 'vitest'
import { ImportOrchestrationService } from '@/application/catalog/import-orchestration-service'
import { InMemoryImportOrchestrationRepository } from '@/infrastructure/catalog/in-memory-import-orchestration-repository'

const source = { merchantId: 'merchant:shop', sourceKey: 'daisycon:shop' }

function clock(...values: string[]) {
  let index = 0
  return () => values[Math.min(index++, values.length - 1)]
}

describe('ImportOrchestrationService', () => {
  it('allows only one active lease for a feed source', async () => {
    const repository = new InMemoryImportOrchestrationRepository()
    const acquired = await repository.acquireLease({ ...source, owner: 'worker-a', token: 'token-a', acquiredAt: '2026-09-03T06:00:00.000Z', expiresAt: '2026-09-03T06:15:00.000Z' })
    expect(acquired?.leaseOwner).toBe('worker-a')

    const service = new ImportOrchestrationService(repository)
    const result = await service.runExclusive({ ...source, owner: 'worker-b', execute: async () => 'should-not-run', now: () => '2026-09-03T06:01:00.000Z', token: () => 'token-b' })
    expect(result.status).toBe('skipped_locked')
  })

  it('allows recovery after an abandoned lease expires', async () => {
    const repository = new InMemoryImportOrchestrationRepository()
    await repository.acquireLease({ ...source, owner: 'dead-worker', token: 'dead-token', acquiredAt: '2026-09-03T06:00:00.000Z', expiresAt: '2026-09-03T06:15:00.000Z' })

    const service = new ImportOrchestrationService(repository)
    const result = await service.runExclusive({ ...source, owner: 'recovery-worker', execute: async () => 42, now: clock('2026-09-03T06:16:00.000Z', '2026-09-03T06:16:01.000Z'), token: () => 'recovery-token' })
    expect(result).toEqual({ status: 'completed', value: 42 })
    expect((await repository.getState(source))?.lastSucceededAt).toBe('2026-09-03T06:16:01.000Z')
  })

  it('schedules the next successful run and blocks premature execution', async () => {
    const repository = new InMemoryImportOrchestrationRepository()
    const service = new ImportOrchestrationService(repository)
    await service.runExclusive({ ...source, owner: 'worker-a', execute: async () => 'ok', now: clock('2026-09-03T06:00:00.000Z', '2026-09-03T06:00:01.000Z'), token: () => 'token-a', successDelayMs: 60 * 60_000 })

    expect((await repository.getState(source))?.nextRunAt).toBe('2026-09-03T07:00:01.000Z')
    const early = await service.runExclusive({ ...source, owner: 'worker-b', execute: async () => 'too-early', now: () => '2026-09-03T06:30:00.000Z', token: () => 'token-b' })
    expect(early.status).toBe('skipped_locked')
  })

  it('uses bounded exponential backoff and resets failures after success', async () => {
    const repository = new InMemoryImportOrchestrationRepository()
    const service = new ImportOrchestrationService(repository)

    const first = await service.runExclusive({ ...source, owner: 'worker-a', execute: async () => { throw new Error('temporary') }, now: clock('2026-09-03T06:00:00.000Z', '2026-09-03T06:00:01.000Z'), token: () => 'token-a' })
    expect(first.status).toBe('failed')
    if (first.status === 'failed') expect(first.retryAt).toBe('2026-09-03T06:05:01.000Z')
    expect((await repository.getState(source))?.failureCount).toBe(1)

    const second = await service.runExclusive({ ...source, owner: 'worker-b', execute: async () => { throw new Error('still temporary') }, now: clock('2026-09-03T06:05:01.000Z', '2026-09-03T06:05:02.000Z'), token: () => 'token-b' })
    expect(second.status).toBe('failed')
    if (second.status === 'failed') expect(second.retryAt).toBe('2026-09-03T06:15:02.000Z')
    expect((await repository.getState(source))?.failureCount).toBe(2)

    const success = await service.runExclusive({ ...source, owner: 'worker-c', execute: async () => 'recovered', now: clock('2026-09-03T06:15:02.000Z', '2026-09-03T06:15:03.000Z'), token: () => 'token-c' })
    expect(success.status).toBe('completed')
    expect((await repository.getState(source))?.failureCount).toBe(0)
    expect((await repository.getState(source))?.lastError).toBeUndefined()
  })

  it('rejects completion from a stale lease token', async () => {
    const repository = new InMemoryImportOrchestrationRepository()
    await repository.acquireLease({ ...source, owner: 'worker-a', token: 'token-a', acquiredAt: '2026-09-03T06:00:00.000Z', expiresAt: '2026-09-03T06:15:00.000Z' })
    await expect(repository.completeSuccess({ ...source, token: 'wrong-token', finishedAt: '2026-09-03T06:01:00.000Z', nextRunAt: '2026-09-03T07:01:00.000Z' })).rejects.toThrow('lease token')
  })
})
