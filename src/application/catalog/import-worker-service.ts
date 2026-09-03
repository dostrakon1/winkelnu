import type { DueFeedDiscoveryRepository } from './import-worker-ports'
import type { ImportOrchestrationService } from './import-orchestration-service'
import type { DueFeedSource, FeedBatchResult } from '@/domain/catalog/import-worker'

export class ImportWorkerService {
  constructor(
    private readonly discovery: DueFeedDiscoveryRepository,
    private readonly orchestration: ImportOrchestrationService,
  ) {}

  async runBatch<T>(input: {
    owner: string
    execute: (source: DueFeedSource) => Promise<T>
    now?: () => string
    limit?: number
    successDelayMs?: number
  }): Promise<FeedBatchResult<T>> {
    const now = input.now ?? (() => new Date().toISOString())
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 50)
    const due = await this.discovery.listDue({ now: now(), limit })
    const items: FeedBatchResult<T>['items'] = []

    for (const source of due) {
      const execution = await this.orchestration.runExclusive({
        merchantId: source.merchantId,
        sourceKey: source.sourceKey,
        owner: input.owner,
        execute: () => input.execute(source),
        now,
        successDelayMs: input.successDelayMs,
      })
      items.push({ ...source, execution })
    }

    return {
      discovered: due.length,
      completed: items.filter((item) => item.execution.status === 'completed').length,
      failed: items.filter((item) => item.execution.status === 'failed').length,
      skipped: items.filter((item) => item.execution.status === 'skipped_locked').length,
      items,
    }
  }
}
