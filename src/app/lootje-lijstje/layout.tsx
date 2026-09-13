import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { isGiftingEnabled } from '@/application/gifting/gifting-release'

export default function GiftLayout({ children }: { children: ReactNode }) {
  if (!isGiftingEnabled()) notFound()
  return children
}
