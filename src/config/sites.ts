export type SiteConfig = {
  id: string
  slug: string
  brandName: string
  siteName: string
  domain: string
  canonicalOrigin: string
  market: string
  locale: string
  openGraphLocale: string
  htmlLang: string
  currency: string
  productionHosts: readonly string[]
  seo: {
    defaultTitle: string
    titleTemplate: string
    description: string
    socialDescription: string
  }
  editorial: {
    authorName: string
    publisherName: string
  }
}

export const sites = {
  'winkelnu-nl': {
    id: 'winkelnu-nl',
    slug: 'winkelnu',
    brandName: 'Winkelnu',
    siteName: 'Winkelnu.nl',
    domain: 'winkelnu.nl',
    canonicalOrigin: 'https://winkelnu.nl',
    market: 'NL',
    locale: 'nl-NL',
    openGraphLocale: 'nl_NL',
    htmlLang: 'nl',
    currency: 'EUR',
    productionHosts: ['winkelnu.nl', 'www.winkelnu.nl'],
    seo: {
      defaultTitle: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
      titleTemplate: '%s | Winkelnu.nl',
      description: 'Ontdek producten, lees praktische keuzehulpen en vergelijk gecontroleerde winkelprijzen zodra die beschikbaar zijn.',
      socialDescription: 'Ontdek producten en praktische koopgidsen. Gecontroleerde winkelprijzen worden toegevoegd zodra ze beschikbaar zijn.',
    },
    editorial: {
      authorName: 'Redactie Winkelnu',
      publisherName: 'Winkelnu',
    },
  },
} as const satisfies Record<string, SiteConfig>

export type SiteId = keyof typeof sites

export const activeSite: SiteConfig = sites['winkelnu-nl']

export function resolveSiteOrigin(override?: string, site: SiteConfig = activeSite): string {
  const candidate = override?.trim() || site.canonicalOrigin
  const url = new URL(candidate)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Site origin must use HTTP or HTTPS.')
  }
  return url.origin
}

export function isProductionHostForSite(hostname: string, site: SiteConfig = activeSite): boolean {
  const normalized = hostname.trim().toLowerCase()
  return site.productionHosts.some((host) => host.toLowerCase() === normalized)
}
