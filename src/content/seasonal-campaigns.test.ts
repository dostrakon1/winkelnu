import { describe, expect, it } from 'vitest'
import { getActiveSeasonalCampaign, getAmsterdamDateKey } from './seasonal-campaigns'

describe('Seasonal Campaign Engine', () => {
  it('gebruikt de kalenderdatum van Europe/Amsterdam', () => {
    expect(getAmsterdamDateKey(new Date('2026-10-01T00:30:00+02:00'))).toBe('2026-10-01')
  })

  it('toont nog geen campagne in september', () => {
    expect(getActiveSeasonalCampaign(new Date('2026-09-13T12:00:00Z'))).toBeUndefined()
  })

  it('activeert Halloween in oktober', () => {
    expect(getActiveSeasonalCampaign(new Date('2026-10-15T12:00:00Z'))?.collectionSlug).toBe('halloween')
  })

  it('activeert Sinterklaas van november tot en met 5 december', () => {
    expect(getActiveSeasonalCampaign(new Date('2026-11-20T12:00:00Z'))?.collectionSlug).toBe('sinterklaas')
    expect(getActiveSeasonalCampaign(new Date('2026-12-05T12:00:00Z'))?.collectionSlug).toBe('sinterklaas')
  })

  it('schakelt daarna over naar Kerst', () => {
    expect(getActiveSeasonalCampaign(new Date('2026-12-06T12:00:00Z'))?.collectionSlug).toBe('kerst')
    expect(getActiveSeasonalCampaign(new Date('2026-12-26T12:00:00Z'))?.collectionSlug).toBe('kerst')
  })
})
