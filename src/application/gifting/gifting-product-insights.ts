import 'server-only'

import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'

export type GiftingProductOverview = {
  nativeProductSaves: number
  externalLinkWishes: number
  textWishes: number
  giftingAffiliateClicks: number
  activeReservations: number
  averageNativePriceCents: number
}

export type GiftingProductRanking = {
  productExternalKey: string
  productTitle: string
  productSlug: string
  categoryName?: string
  savedCount: number
  giftingClickCount: number
  activeReservationCount: number
  averageSavedPriceCents: number
}

export type GiftingProductOccasion = {
  occasion: 'sinterklaas' | 'kerst' | 'verjaardag' | 'anders'
  itemsAdded: number
  nativeProductSaves: number
}

export type GiftingProductInsightsSnapshot = {
  generatedAt: string
  overview: GiftingProductOverview
  rankings: GiftingProductRanking[]
  byOccasion: GiftingProductOccasion[]
}

export interface GiftingProductInsightsRepository {
  readOverview(range: GiftingInsightsRange): Promise<GiftingProductOverview>
  readRankings(range: GiftingInsightsRange): Promise<GiftingProductRanking[]>
  readByOccasion(range: GiftingInsightsRange): Promise<GiftingProductOccasion[]>
}

export class GiftingProductInsightsReadService {
  constructor(private readonly repository: GiftingProductInsightsRepository) {}

  async read(range: GiftingInsightsRange): Promise<GiftingProductInsightsSnapshot> {
    const [overview, rankings, byOccasion] = await Promise.all([
      this.repository.readOverview(range),
      this.repository.readRankings(range),
      this.repository.readByOccasion(range),
    ])

    return {
      generatedAt: new Date().toISOString(),
      overview,
      rankings,
      byOccasion,
    }
  }
}
