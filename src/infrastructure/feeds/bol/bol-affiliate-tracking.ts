export type BolAffiliateTrackingInput = {
  siteId: string
  productUrl: string
  name: string
  subId?: string
  format?: 'PF' | 'TXL'
}

function requireHttpsBolProductUrl(value: string): URL {
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error('bol product URL must use HTTPS.')
  if (url.hostname !== 'www.bol.com' && url.hostname !== 'bol.com') {
    throw new Error('bol product URL must target bol.com.')
  }
  return url
}

export function buildBolAffiliateTrackingUrl(input: BolAffiliateTrackingInput): string {
  const siteId = input.siteId.trim()
  const name = input.name.trim()
  if (!/^\d+$/.test(siteId)) throw new Error('bol Site_ID must contain digits only.')
  if (!name) throw new Error('bol affiliate link name is required.')

  const productUrl = requireHttpsBolProductUrl(input.productUrl)
  const tracking = new URL('https://partner.bol.com/click/click')
  tracking.searchParams.set('p', '1')
  tracking.searchParams.set('t', 'url')
  tracking.searchParams.set('s', siteId)
  tracking.searchParams.set('url', productUrl.toString())
  tracking.searchParams.set('f', input.format ?? 'PF')
  tracking.searchParams.set('name', name.slice(0, 120))
  if (input.subId?.trim()) tracking.searchParams.set('subid', input.subId.trim().slice(0, 120))
  return tracking.toString()
}

export function isBolAffiliateTrackingUrl(value: string, siteId?: string): boolean {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.hostname !== 'partner.bol.com' || url.pathname !== '/click/click') return false
    if (url.searchParams.get('p') !== '1' || url.searchParams.get('t') !== 'url') return false
    if (siteId && url.searchParams.get('s') !== siteId) return false
    return Boolean(url.searchParams.get('s') && url.searchParams.get('url'))
  } catch {
    return false
  }
}
