import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { isGiftingEnabled } from '@/application/gifting/gifting-release'
import { GiftExperienceFooter } from '@/components/gifting/gift-experience-footer'
import { GiftExperienceHeader } from '@/components/gifting/gift-experience-header'
import './gift-experience.css'
import './premium-onboarding.css'

export const dynamic = 'force-dynamic'

export default function GiftLayout({ children }: { children: ReactNode }) {
  if (!isGiftingEnabled()) notFound()

  return (
    <div className="gift-experience-root">
      <GiftExperienceHeader />
      <div className="gift-experience-content">{children}</div>
      <GiftExperienceFooter />
    </div>
  )
}
