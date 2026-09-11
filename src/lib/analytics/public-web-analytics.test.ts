import { describe, expect, it } from 'vitest'
import {
  getPublicAnalyticsRoute,
  isProductionAnalyticsHost,
  isPublicAnalyticsPath,
  sanitizePublicWebAnalyticsEvent,
} from './public-web-analytics'

describe('public web analytics privacy boundary', () => {
  it('only enables measurement on Winkelnu production hosts', () => {
    expect(isProductionAnalyticsHost('winkelnu.nl')).toBe(true)
    expect(isProductionAnalyticsHost('www.winkelnu.nl')).toBe(true)
    expect(isProductionAnalyticsHost('WINKELNU.NL')).toBe(true)
    expect(isProductionAnalyticsHost('winkelnu-git-feature-test.vercel.app')).toBe(false)
    expect(isProductionAnalyticsHost('localhost')).toBe(false)
  })

  it('blocks internal, API and affiliate redirect routes', () => {
    expect(isPublicAnalyticsPath('/')).toBe(true)
    expect(isPublicAnalyticsPath('/zoeken')).toBe(true)
    expect(isPublicAnalyticsPath('/product/example')).toBe(true)
    expect(isPublicAnalyticsPath('/intern')).toBe(false)
    expect(isPublicAnalyticsPath('/intern/operations')).toBe(false)
    expect(isPublicAnalyticsPath('/api/health')).toBe(false)
    expect(isPublicAnalyticsPath('/uit/offer-123')).toBe(false)
  })

  it('removes every query parameter and fragment before sending', () => {
    expect(
      sanitizePublicWebAnalyticsEvent({
        type: 'pageview',
        url: 'https://winkelnu.nl/zoeken?q=persoonlijk%20zoekwoord&type=laptops#resultaten',
      }),
    ).toEqual({
      type: 'pageview',
      url: 'https://winkelnu.nl/zoeken',
    })
  })

  it('drops blocked or malformed events instead of sending them', () => {
    expect(
      sanitizePublicWebAnalyticsEvent({
        type: 'pageview',
        url: 'https://winkelnu.nl/intern/operations?tab=feeds',
      }),
    ).toBeNull()
    expect(sanitizePublicWebAnalyticsEvent({ type: 'pageview', url: 'not-a-url' })).toBeNull()
  })

  it('groups dynamic storefront and editorial routes without hiding the clean path', () => {
    expect(getPublicAnalyticsRoute('/product/sony-wh-1000xm6')).toBe('/product/[slug]')
    expect(getPublicAnalyticsRoute('/categorie/elektronica')).toBe('/categorie/[slug]')
    expect(getPublicAnalyticsRoute('/koopgidsen/laptop-kopen')).toBe('/koopgidsen/[slug]')
    expect(getPublicAnalyticsRoute('/koopgidsen/categorie/elektronica')).toBe('/koopgidsen/categorie/[slug]')
    expect(getPublicAnalyticsRoute('/vergelijken')).toBe('/vergelijken')
  })
})
