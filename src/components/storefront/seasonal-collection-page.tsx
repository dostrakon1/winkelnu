import type { EditorialCollection } from '@/content/collections/types'
import type { SeasonalCampaign } from '@/content/seasonal-campaigns'
import { GenericSeasonalCollectionPage } from './generic-seasonal-collection-page'
import { HalloweenCollectionPage } from './halloween-collection-page'

export function SeasonalCollectionPage({
  collection,
  campaign,
}: {
  collection: EditorialCollection
  campaign: SeasonalCampaign
}) {
  if (collection.slug === 'halloween') {
    return <HalloweenCollectionPage collection={collection} campaign={campaign} />
  }

  return <GenericSeasonalCollectionPage collection={collection} campaign={campaign} />
}
