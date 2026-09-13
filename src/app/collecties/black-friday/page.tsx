import type { Metadata } from 'next'
import { CommerceEventPage } from '@/components/storefront/commerce-event-page'
import { getCommerceEventCampaignByKind } from '@/content/commerce-event-campaigns'
import { getAmsterdamDateKey } from '@/content/seasonal-campaigns'

export function generateMetadata(): Metadata {
  const year = Number(getAmsterdamDateKey().slice(0, 4))

  return {
    title: `Black Friday ${year} — slim vergelijken | Winkelnu`,
    description: 'Bereid Black Friday slim voor met productcategorieën, keuzehulpen en straks gecontroleerde aanbiedingen van verschillende winkels.',
    alternates: { canonical: '/collecties/black-friday' },
    openGraph: {
      title: `Black Friday ${year} — slim vergelijken | Winkelnu.nl`,
      description: 'Vergelijk slimmer tijdens Black Friday. Bepaal eerst wat bij je past en beoordeel daarna pas de aanbieding.',
      url: '/collecties/black-friday',
    },
  }
}

export default function BlackFridayCollectionPage() {
  const year = Number(getAmsterdamDateKey().slice(0, 4))
  const campaign = getCommerceEventCampaignByKind('black-friday', year)
  if (!campaign) return null
  return <CommerceEventPage campaign={campaign} />
}
