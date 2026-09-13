import type { Metadata } from 'next'
import { CommerceEventPage } from '@/components/storefront/commerce-event-page'
import { getCommerceEventCampaignByKind } from '@/content/commerce-event-campaigns'
import { getAmsterdamDateKey } from '@/content/seasonal-campaigns'

export const metadata: Metadata = {
  title: 'Cyber Monday',
  description: 'Cyber Monday bij Winkelnu: vergelijk elektronica, kantoor, wonen en andere online deals met praktische keuzehulp.',
  alternates: { canonical: '/cyber-monday' },
  openGraph: {
    title: 'Cyber Monday | Winkelnu.nl',
    description: 'De digitale finale van het dealweekend — met rustige vergelijking en keuzehulp van Winkelnu.',
    url: '/cyber-monday',
  },
}

export default function CyberMondayPage() {
  const year = Number(getAmsterdamDateKey().slice(0, 4))
  const campaign = getCommerceEventCampaignByKind('cyber-monday', year)
  if (!campaign) return null
  return <CommerceEventPage campaign={campaign} />
}
