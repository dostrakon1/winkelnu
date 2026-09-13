import type { Metadata } from 'next'
import { CommerceEventPage } from '@/components/storefront/commerce-event-page'
import { getCommerceEventCampaignByKind } from '@/content/commerce-event-campaigns'
import { getAmsterdamDateKey } from '@/content/seasonal-campaigns'

export const metadata: Metadata = {
  title: 'Black Friday',
  description: 'Black Friday bij Winkelnu: vergelijk categorieën, keuzehulpen en straks gecontroleerde aanbiedingen voordat je koopt.',
  alternates: { canonical: '/collecties/black-friday' },
  openGraph: {
    title: 'Black Friday | Winkelnu.nl',
    description: 'Vergelijk slimmer tijdens Black Friday. Winkelnu helpt je eerst bepalen wat bij je past.',
    url: '/collecties/black-friday',
  },
}

export default function BlackFridayCollectionPage() {
  const year = Number(getAmsterdamDateKey().slice(0, 4))
  const campaign = getCommerceEventCampaignByKind('black-friday', year)
  if (!campaign) return null
  return <CommerceEventPage campaign={campaign} />
}
