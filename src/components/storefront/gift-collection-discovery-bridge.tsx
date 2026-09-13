'use client'

import { usePathname } from 'next/navigation'
import { GiftDiscoverySpotlight } from './gift-discovery-spotlight'

export function GiftCollectionDiscoveryBridge() {
  const pathname = usePathname()
  if (pathname !== '/collecties/cadeaus-feest') return null

  return <GiftDiscoverySpotlight placement="collection" />
}
