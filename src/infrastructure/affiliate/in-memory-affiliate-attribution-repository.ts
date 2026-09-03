import type { AffiliateAttributionRepository } from '@/application/affiliate/ports'
import type { CatalogReadRepository } from '@/application/catalog/ports'
import type { AffiliateClickEvent, AffiliateRedirectTarget } from '@/domain/affiliate/types'

export class InMemoryAffiliateAttributionRepository implements AffiliateAttributionRepository {
  private readonly clicks = new Map<string, AffiliateClickEvent>()

  constructor(private readonly catalog: CatalogReadRepository) {}

  async getRedirectTarget(offerId: string): Promise<AffiliateRedirectTarget | null> {
    const products = await this.catalog.listProducts({ limit: 500, offset: 0 })

    for (const product of products) {
      const detail = await this.catalog.getProductBySlug(product.slug)
      const offer = detail?.offers.find((item) => item.id === offerId)
      if (!offer) continue

      return {
        offerId: offer.id,
        productId: offer.productId,
        merchantId: offer.merchantId,
        affiliateUrl: offer.affiliateUrl,
        isActive: offer.isActive,
      }
    }

    return null
  }

  async recordClick(event: AffiliateClickEvent): Promise<void> {
    this.clicks.set(event.id, event)
  }

  async listClicks(): Promise<AffiliateClickEvent[]> {
    return [...this.clicks.values()]
  }
}
