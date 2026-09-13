import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { isGiftingEnabled } from '@/application/gifting/gifting-release'

export default function GiftLayout({ children }: { children: ReactNode }) {
  if (!isGiftingEnabled()) {
    const rawFlag = process.env.WINKELNU_GIFTING_ENABLED
    const trimmedSecret = process.env.WINKELNU_GIFT_SESSION_SECRET?.trim()

    console.warn('[gifting-release-diagnostic]', {
      flagPresent: rawFlag !== undefined,
      flagExactTrue: rawFlag === 'true',
      secretPresent: Boolean(trimmedSecret),
      secretBytes: trimmedSecret ? Buffer.byteLength(trimmedSecret, 'utf8') : 0,
      secretAtLeast32Bytes: Boolean(trimmedSecret && Buffer.byteLength(trimmedSecret, 'utf8') >= 32),
    })

    notFound()
  }

  return children
}
