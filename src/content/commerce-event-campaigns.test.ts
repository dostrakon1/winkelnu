import { describe, expect, it } from 'vitest'
import { getBlackFridayCycle, getBlackFridayDateKey, getCommerceEventCampaigns, getCyberMondayDateKey } from './commerce-event-campaigns'

describe('Black Friday and Cyber Monday calendar rules', () => {
  it('resolves the 2026 dates correctly', () => {
    expect(getBlackFridayDateKey(2026)).toBe('2026-11-27')
    expect(getCyberMondayDateKey(2026)).toBe('2026-11-30')

    expect(getBlackFridayCycle(2026)).toEqual({
      year: 2026,
      previewStartsOn: '2026-11-16',
      blackFridayWeekStartsOn: '2026-11-23',
      blackFridayOn: '2026-11-27',
      blackFridayWeekendEndsOn: '2026-11-29',
      cyberMondayOn: '2026-11-30',
      endsOn: '2026-11-30',
    })
  })

  it('keeps calculating future years instead of hard-coding 2026', () => {
    expect(getBlackFridayDateKey(2027)).toBe('2027-11-26')
    expect(getCyberMondayDateKey(2027)).toBe('2027-11-29')
    expect(getBlackFridayDateKey(2028)).toBe('2028-11-24')
    expect(getCyberMondayDateKey(2028)).toBe('2028-11-27')
  })

  it('uses collection URLs as the canonical public campaign routes', () => {
    const campaigns = getCommerceEventCampaigns(2026)
    expect(campaigns.find((campaign) => campaign.kind === 'black-friday')?.href).toBe('/collecties/black-friday')
    expect(campaigns.find((campaign) => campaign.kind === 'cyber-monday')?.href).toBe('/collecties/cyber-monday')
  })
})
