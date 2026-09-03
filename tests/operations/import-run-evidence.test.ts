import { describe, expect, it } from 'vitest'
import { ImportRunEvidenceService, type ImportRunEvidenceRepository } from '@/application/operations/import-run-evidence'

class MemoryRepository implements ImportRunEvidenceRepository {
  seenLimit = 0
  async listRecent(limit: number) {
    this.seenLimit = limit
    return []
  }
}

describe('ImportRunEvidenceService', () => {
  it('bounds requested history to 100 runs', async () => {
    const repository = new MemoryRepository()
    await new ImportRunEvidenceService(repository).listRecent(999)
    expect(repository.seenLimit).toBe(100)
  })

  it('enriches the matching feed timeline with bounded run evidence', async () => {
    const { buildFeedOperationalTimelines } = await import('@/application/operations/feed-operational-timeline')
    const timelines = buildFeedOperationalTimelines({
      generatedAt: '2026-09-03T10:00:00Z',
      integrations: [{ integrationId: 'i', merchantId: 'm', merchantName: 'Merchant', integrationKind: 'direct', integrationStatus: 'active', hasSecretReference: true, feeds: [{ sourceKey: 'feed', sourceType: 'csv', isActive: true }] }],
    }, [], [{
      runId: 'run-1', merchantId: 'm', sourceKey: 'feed', status: 'completed_with_errors', startedAt: '2026-09-03T09:00:00Z', finishedAt: '2026-09-03T09:05:00Z', recordsSeen: 100, recordsAccepted: 92, recordsRejected: 8, offersDeactivated: 3, reviewRequired: 2, correlationId: 'corr-1',
    }])

    const runEvent = timelines[0].events.find((event) => event.kind === 'import_run')
    expect(runEvent?.label).toBe('Import voltooid met fouten')
    expect(runEvent?.detail).toContain('geaccepteerd 92')
    expect(runEvent?.detail).toContain('correlatie corr-1')
  })
})
