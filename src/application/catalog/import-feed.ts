import type { CatalogWriteRepository } from './ports'
import type { FeedAdapter } from '@/infrastructure/feeds/adapter'
import { validateFeedCandidate } from '@/domain/catalog/validate-feed-candidate'
import type { Merchant, Offer, Product } from '@/domain/catalog/types'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export type ImportFeedResult = {
  imported: number
  rejected: number
  issues: Array<{ merchantProductId: string; messages: string[] }>
}

export async function importFeed(input: {
  adapter: FeedAdapter
  repository: CatalogWriteRepository
  merchant: Merchant
  categoryIdBySourceCategory?: Record<string, string>
}): Promise<ImportFeedResult> {
  await input.repository.upsertMerchant(input.merchant)

  let cursor: string | undefined
  let imported = 0
  let rejected = 0
  const issues: ImportFeedResult['issues'] = []

  do {
    const page = await input.adapter.fetchPage({ cursor })

    for (const candidate of page.items) {
      const validation = validateFeedCandidate(candidate)
      if (!validation.ok) {
        rejected += 1
        issues.push({
          merchantProductId: candidate.merchantProductId,
          messages: validation.issues.map((issue) => issue.message),
        })
        continue
      }

      const productIdentity = candidate.gtin ?? `${candidate.sourceKey}:${candidate.merchantProductId}`
      const productId = `product:${productIdentity}`
      const offerId = `offer:${input.merchant.id}:${candidate.merchantProductId}`

      const product: Product = {
        id: productId,
        slug: `${slugify(candidate.title)}-${candidate.merchantProductId.toLowerCase()}`,
        title: candidate.title,
        description: candidate.description,
        brand: candidate.brand,
        gtin: candidate.gtin,
        mpn: candidate.mpn,
        imageUrl: candidate.imageUrls[0],
        categoryId: candidate.sourceCategory
          ? input.categoryIdBySourceCategory?.[candidate.sourceCategory]
          : undefined,
      }

      const offer: Offer = {
        id: offerId,
        productId,
        merchantId: input.merchant.id,
        merchantProductId: candidate.merchantProductId,
        price: candidate.price,
        shippingCost: candidate.shippingCost,
        availability: candidate.availability,
        productUrl: candidate.productUrl,
        affiliateUrl: candidate.affiliateUrl,
        sourceUpdatedAt: candidate.sourceUpdatedAt,
        importedAt: candidate.importedAt,
        lastSeenAt: candidate.importedAt,
        isActive: true,
      }

      await input.repository.upsertProduct(product)
      await input.repository.upsertOffer(offer)
      imported += 1
    }

    cursor = page.nextCursor
  } while (cursor)

  return { imported, rejected, issues }
}
