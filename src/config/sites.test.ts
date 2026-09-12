import { describe, expect, it } from 'vitest'
import { activeSite, isProductionHostForSite, resolveSiteOrigin, sites } from './sites'

describe('site foundation config', () => {
  it('registers Winkelnu as the current first storefront', () => {
    expect(activeSite).toBe(sites['winkelnu-nl'])
    expect(activeSite).toMatchObject({
      id: 'winkelnu-nl',
      brandName: 'Winkelnu',
      domain: 'winkelnu.nl',
      market: 'NL',
      locale: 'nl-NL',
      currency: 'EUR',
    })
  })

  it('uses the canonical origin by default and accepts a deployment override', () => {
    expect(resolveSiteOrigin()).toBe('https://winkelnu.nl')
    expect(resolveSiteOrigin('https://preview.example.com/')).toBe('https://preview.example.com')
    expect(resolveSiteOrigin('http://localhost:3000/path')).toBe('http://localhost:3000')
  })

  it('matches only configured production hosts case-insensitively', () => {
    expect(isProductionHostForSite('winkelnu.nl')).toBe(true)
    expect(isProductionHostForSite('WWW.WINKELNU.NL')).toBe(true)
    expect(isProductionHostForSite('winkelnu-git-feature-test.vercel.app')).toBe(false)
  })
})
