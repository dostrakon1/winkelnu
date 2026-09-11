'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  getPublicAnalyticsRoute,
  isProductionAnalyticsHost,
  isPublicAnalyticsPath,
  sanitizePublicWebAnalyticsEvent,
} from '@/lib/analytics/public-web-analytics'

declare global {
  interface Window {
    va?: (...args: unknown[]) => void
    vaq?: unknown[][]
  }
}

function initAnalyticsQueue() {
  if (window.va) return
  window.va = (...args: unknown[]) => {
    window.vaq = window.vaq ?? []
    window.vaq.push(args)
  }
}

function canMeasure(pathname: string | null): pathname is string {
  return Boolean(
    pathname &&
      isPublicAnalyticsPath(pathname) &&
      isProductionAnalyticsHost(window.location.hostname),
  )
}

export function WinkelnuWebAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!canMeasure(pathname)) return

    initAnalyticsQueue()
    window.va?.('beforeSend', sanitizePublicWebAnalyticsEvent)

    if (document.head.querySelector('script[data-wn-web-analytics]')) return

    const script = document.createElement('script')
    script.src = '/_vercel/insights/script.js'
    script.defer = true
    script.dataset.wnWebAnalytics = '1'
    script.dataset.sdkn = 'winkelnu/next'
    script.dataset.sdkv = '1'
    script.dataset.disableAutoTrack = '1'
    script.onerror = () => {
      console.info('[Winkelnu analytics] Web Analytics is niet actief voor deze deployment.')
    }
    document.head.appendChild(script)
  }, [pathname])

  useEffect(() => {
    if (!canMeasure(pathname)) return

    initAnalyticsQueue()
    window.va?.('pageview', {
      route: getPublicAnalyticsRoute(pathname),
      path: pathname,
    })
  }, [pathname])

  return null
}
