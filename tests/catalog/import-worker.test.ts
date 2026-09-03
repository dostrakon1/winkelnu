import { describe, expect, it } from 'vitest'
import { ImportOrchestrationService } from '@/application/catalog/import-orchestration-service'
import { ImportWorkerService } from '@/application/catalog/import-worker-service'
import type { DueFeedDiscoveryRepository } from '@/application/catalog/import-worker-ports'
import { classifyFeedHealth, type DueFeedSource } from '@/domain/catalog/import-worker'
import { InMemoryImportOrchestrationRepository } from '@/infrastructure/catalog/in-memory-import-orchestration-repository'

class StaticDiscovery implements DueFeedDiscoveryRepository {
  constructor(private readonly sources: DueFeedSource[]) {}
  async listDue(input: { now: string; limit: number }): Promise<DueFeedSource[]> {
    void input.now
    return this.sources.slice(0, input.limit)
  }
}

const NOW = '2026-09-03T07:00:00.000Z'

describe('ImportWorkerService', () => {
  it('executes due feeds as an isolated batch and summarizes results', async () => {
    const repository = new InMemoryImportOrchestrationRepository()
    const worker = new ImportWorkerService(
      new StaticDiscovery([
        { merchantId: 'merchant:a', sourceKey: 'feed:a' },
        { merchantId: 'merchant:b', sourceKey: 'feed:b' },
      ]),
      new ImportOrchestrationService(repository),
    )

    const result = await worker.runBatch({
      owner: 'worker-1',
      now: () => NOW,
      execute: async (source) => {
        if (source.sourceKey === 'feed:b') throw new Error('provider unavailable')
        return source.sourceKey
      },
    })

    expect(result).toMatchObject({ discovered: 2, completed: 1, failed: 1, skipped: 0 })
  })

  it('still skips a discovered source when another worker already owns its lease', async () => {
    const repository = new InMemoryImportOrchestrationRepository()
    await repository.acquireLease({ merchantId: 'merchant:a', sourceKey: 'feed:a', owner: 'other', token: 'held', acquiredAt: NOW, expiresAt: '2026-09-03T07:15:00.000Z' })
    const worker = new ImportWorkerService(new StaticDiscovery([{ merchantId: 'merchant:a', sourceKey: 'feed:a' }]), new ImportOrchestrationService(repository))
    const result = await worker.runBatch({ owner: 'worker-2', now: () => NOW, execute: async () => 'never' })
    expect(result).toMatchObject({ discovered: 1, completed: 0, failed: 0, skipped: 1 })
  })

  it('caps batch discovery at fifty sources', async () => {
    const sources = Array.from({ length: 60 }, (_, index) => ({ merchantId: `merchant:${index}`, sourceKey: `feed:${index}` }))
    const worker = new ImportWorkerService(new StaticDiscovery(sources), new ImportOrchestrationService(new InMemoryImportOrchestrationRepository()))
    const result = await worker.runBatch({ owner: 'worker', limit: 500, now: () => NOW, execute: async () => true })
    expect(result.discovered).toBe(50)
  })
})

describe('classifyFeedHealth', () => {
  it('classifies healthy, delayed, failing and attention-required states', () => {
    expect(classifyFeedHealth({ merchantId: 'm', sourceKey: 'healthy', failureCount: 0, nextRunAt: '2026-09-03T07:30:00.000Z' }, NOW).status).toBe('healthy')
    expect(classifyFeedHealth({ merchantId: 'm', sourceKey: 'delayed', failureCount: 0, nextRunAt: '2026-09-03T06:00:00.000Z' }, NOW).status).toBe('delayed')
    expect(classifyFeedHealth({ merchantId: 'm', sourceKey: 'failing', failureCount: 1 }, NOW).status).toBe('failing')
    expect(classifyFeedHealth({ merchantId: 'm', sourceKey: 'attention', failureCount: 3 }, NOW).status).toBe('attention_required')
  })
})
