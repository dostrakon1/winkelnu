import { describe, expect, it } from 'vitest'
import { AffiliateRedirectService, validateAffiliateDestination } from '@/application/affiliate/affiliate-redirect-service'
import type { AffiliateAttributionRepository } from '@/application/affiliate/ports'
import type { AffiliateClickEvent, AffiliateRedirectTarget } from '@/domain/affiliate/types'

function repository(target: AffiliateRedirectTarget | null) {
  const clicks: AffiliateClickEvent[] = []

  const value: AffiliateAttributionRepository & { clicks: AffiliateClickEvent[] } = {
    clicks,
    async getRedirectTarget() {
      return target
    },
    async recordClick(event) {
      clicks.push(event)
    },
  }

  return value
}

const activeTarget: AffiliateRedirectTarget = {
  offerId: 'offer:test',
  productId: 'product:test',
  merchantId: 'merchant:test',
  affiliateUrl: 'https://merchant.example/affiliate/product',
  isActive: true,
}

describe('AffiliateRedirectService', () => {
  it('records one privacy-minimal click before returning the destination', async () => {
    const repo = repository(activeTarget)
    const service = new AffiliateRedirectService(repo, () => '2026-09-03T06:00:00.000Z', () => 'event-1')

    const result = await service.resolve({ offerId: activeTarget.offerId, sourcePath: '/product/test' })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.destination).toBe(activeTarget.affiliateUrl)
    expect(repo.clicks).toEqual([
      {
        id: 'click:event-1',
        offerId: 'offer:test',
        productId: 'product:test',
        merchantId: 'merchant:test',
        sourcePath: '/product/test',
        occurredAt: '2026-09-03T06:00:00.000Z',
      },
    ])
  })

  it('does not redirect or record a click for an inactive offer', async () => {
    const repo = repository({ ...activeTarget, isActive: false })
    const service = new AffiliateRedirectService(repo)

    await expect(service.resolve({ offerId: activeTarget.offerId })).resolves.toEqual({ ok: false, reason: 'offer_inactive' })
    expect(repo.clicks).toHaveLength(0)
  })

  it('rejects unsafe destinations', async () => {
    const repo = repository({ ...activeTarget, affiliateUrl: 'http://merchant.example/product' })
    const service = new AffiliateRedirectService(repo)

    await expect(service.resolve({ offerId: activeTarget.offerId })).resolves.toEqual({ ok: false, reason: 'invalid_destination' })
    expect(repo.clicks).toHaveLength(0)
  })

  it('drops an external source value instead of persisting it', async () => {
    const repo = repository(activeTarget)
    const service = new AffiliateRedirectService(repo, () => '2026-09-03T06:00:00.000Z', () => 'event-2')

    await service.resolve({ offerId: activeTarget.offerId, sourcePath: 'https://external.example/path' })

    expect(repo.clicks[0]?.sourcePath).toBeUndefined()
  })
})

describe('validateAffiliateDestination', () => {
  it('accepts HTTPS destinations and rejects unsafe URL forms', () => {
    expect(validateAffiliateDestination('https://merchant.example/product')).toBe(true)
    expect(validateAffiliateDestination('http://merchant.example/product')).toBe(false)
    expect(validateAffiliateDestination('https://user:pass@merchant.example/product')).toBe(false)
    expect(validateAffiliateDestination('https://localhost/product')).toBe(false)
    expect(validateAffiliateDestination('not-a-url')).toBe(false)
  })
})
