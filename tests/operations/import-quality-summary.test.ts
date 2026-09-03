import { describe, expect, it } from 'vitest'
import { ImportQualitySummaryService, type ImportQualitySummaryRepository } from '@/application/operations/import-quality-summary'

class CaptureRepository implements ImportQualitySummaryRepository {
  limit = 0
  async listRecent(limit: number) {
    this.limit = limit
    return []
  }
}

describe('import quality summary service', () => {
  it('bounds quality reads to one hundred recent runs', async () => {
    const repository = new CaptureRepository()
    await new ImportQualitySummaryService(repository).listRecent(500)
    expect(repository.limit).toBe(100)
  })

  it('normalizes non-positive limits', async () => {
    const repository = new CaptureRepository()
    await new ImportQualitySummaryService(repository).listRecent(0)
    expect(repository.limit).toBe(1)
  })
})
