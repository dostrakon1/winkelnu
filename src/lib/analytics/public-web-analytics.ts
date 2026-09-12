import { activeSite, isProductionHostForSite } from '@/config/sites'

export type PublicWebAnalyticsEvent = {
  url: string
  [key: string]: unknown
}

const BLOCKED_PREFIXES = ['/intern', '/api', '/uit'] as const

export function isPublicAnalyticsPath(pathname: string | null | undefined): boolean {
  if (!pathname || !pathname.startsWith('/')) return false

  return !BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function isProductionAnalyticsHost(hostname: string): boolean {
  return isProductionHostForSite(hostname, activeSite)
}

export function getPublicAnalyticsRoute(pathname: string): string {
  if (/^\/product\/[^/]+$/.test(pathname)) return '/product/[slug]'
  if (/^\/categorie\/[^/]+$/.test(pathname)) return '/categorie/[slug]'
  if (/^\/koopgidsen\/categorie\/[^/]+$/.test(pathname)) return '/koopgidsen/categorie/[slug]'
  if (/^\/koopgidsen\/[^/]+$/.test(pathname)) return '/koopgidsen/[slug]'
  return pathname
}

export function sanitizePublicWebAnalyticsEvent<T extends PublicWebAnalyticsEvent>(event: T): T | null {
  try {
    const url = new URL(event.url)
    if (!isPublicAnalyticsPath(url.pathname)) return null

    url.search = ''
    url.hash = ''

    return {
      ...event,
      url: url.toString(),
    }
  } catch {
    return null
  }
}
