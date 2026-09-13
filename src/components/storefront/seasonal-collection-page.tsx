import type { EditorialCollection } from '@/content/collections/types'
import type { SeasonalCampaign } from '@/content/seasonal-campaigns'
import { HalloweenCollectionPage } from './halloween-collection-page'

export function SeasonalCollectionPage({
  collection,
  campaign,
}: {
  collection: EditorialCollection
  campaign: SeasonalCampaign
}) {
  // Kerst en Sinterklaas worden al vóór deze fallback apart gerouteerd.
  // De enige resterende Seasonal Campaign is op dit moment Halloween.
  return <HalloweenCollectionPage collection={collection} campaign={campaign} />
}
