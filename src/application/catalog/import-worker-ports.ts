import type { DueFeedSource } from '@/domain/catalog/import-worker'

export interface DueFeedDiscoveryRepository {
  listDue(input: { now: string; limit: number }): Promise<DueFeedSource[]>
}
