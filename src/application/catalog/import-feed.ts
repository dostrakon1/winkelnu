import type { CatalogWriteRepository } from './ports'
import { FeedTraversalGuard, type FeedTraversalLimits } from './feed-traversal-guard'
import type { FeedAdapter } from '@/infrastructure/feeds/adapter'
import type { ImportReject, ImportRun, MatchReviewItem } from '@/domain/catalog/import-observability'
import { decideStrongProductIdentity, type ProductMatchDecision } from '@/domain/catalog/matching'
import { validateFeedCandidate } from '@/domain/catalog/validate-feed-candidate'
import type { Merchant, Offer, Product } from '@/domain/catalog/types'

function slugify(value: string): string {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
function safeIdPart(value: string): string { return value.toLowerCase().replace(/[^a-z0-9:_-]+/g, '-') }

export type FeedCategoryIdResolverInput = {
  sourceKey: string
  sourceCategory: string
  title: string
}

export type FeedCategoryIdResolver = (input: FeedCategoryIdResolverInput) => string | undefined

export type ImportFeedResult = {
  importRun: ImportRun
  imported: number
  rejected: number
  offersDeactivated: number
  reviewRequired: number
  issues: Array<{ merchantProductId: string; messages: string[] }>
  matches: ProductMatchDecision[]
}

export async function importFeed(input: {
  adapter: FeedAdapter
  repository: CatalogWriteRepository
  merchant: Merchant
  categoryIdBySourceCategory?: Record<string, string>
  categoryIdResolver?: FeedCategoryIdResolver
  now?: () => string
  deactivateMissingOffers?: boolean
  correlationId?: string
  onPageFetched?: () => Promise<void>
  traversalLimits?: FeedTraversalLimits
}): Promise<ImportFeedResult> {
  const now = input.now ?? (() => new Date().toISOString())
  const traversal = new FeedTraversalGuard(input.traversalLimits)
  const startedAt = now()
  const importRunId = `import:${safeIdPart(input.adapter.sourceKey)}:${safeIdPart(input.merchant.id)}:${Date.parse(startedAt)}`
  let importRun: ImportRun = { id: importRunId, correlationId: input.correlationId, sourceKey: input.adapter.sourceKey, merchantId: input.merchant.id, status: 'running', startedAt, recordsSeen: 0, recordsAccepted: 0, recordsRejected: 0, offersDeactivated: 0, reviewRequired: 0, errorSummary: [] }

  await input.repository.upsertMerchant(input.merchant)
  await input.repository.createImportRun(importRun)

  let cursor: string | undefined
  let imported = 0, rejected = 0, offersDeactivated = 0, reviewRequired = 0
  const issues: ImportFeedResult['issues'] = []
  const matches: ProductMatchDecision[] = []
  const seenMerchantProductIds = new Set<string>()
  const canonicalProductSources = new Map<string, string>()

  const rejectRecord = async (merchantProductId: string, messages: string[]) => {
    rejected += 1; issues.push({ merchantProductId, messages })
    const reject: ImportReject = { id: `reject:${importRunId}:${safeIdPart(merchantProductId)}:${rejected}`, importRunId, sourceKey: input.adapter.sourceKey, merchantProductId, reasons: messages, rejectedAt: now() }
    await input.repository.addImportReject(reject)
  }

  try {
    do {
      traversal.beforeFetch()
      const page = await input.adapter.fetchPage({ cursor })
      traversal.afterFetch(page.nextCursor)
      await input.onPageFetched?.()
      for (const candidate of page.items) {
        importRun = { ...importRun, recordsSeen: importRun.recordsSeen + 1 }
        if (seenMerchantProductIds.has(candidate.merchantProductId)) { await rejectRecord(candidate.merchantProductId, ['Duplicate merchant product ID encountered in the same import run.']); continue }
        seenMerchantProductIds.add(candidate.merchantProductId)
        const validation = validateFeedCandidate(candidate)
        if (!validation.ok) { await rejectRecord(candidate.merchantProductId, validation.issues.map((issue) => issue.message)); continue }

        let match = decideStrongProductIdentity({ sourceKey: candidate.sourceKey, merchantProductId: candidate.merchantProductId, gtin: candidate.gtin, mpn: candidate.mpn, brand: candidate.brand, decidedAt: now() })
        const canonicalProductId = match.canonicalProductId
        if (!canonicalProductId) { matches.push(match); await rejectRecord(candidate.merchantProductId, ['No canonical product identity could be determined.']); continue }
        const existingSourceProductId = canonicalProductSources.get(canonicalProductId)
        if (existingSourceProductId && existingSourceProductId !== candidate.merchantProductId) match = { ...match, reasons: [...match.reasons, 'Multiple merchant records in this import map to the same canonical product.'], requiresReview: true, confidence: match.confidence === 'certain' ? 'high' : 'review' }
        else canonicalProductSources.set(canonicalProductId, candidate.merchantProductId)
        matches.push(match)

        if (match.requiresReview) {
          reviewRequired += 1
          const review: MatchReviewItem = { id: `review:${importRunId}:${safeIdPart(candidate.merchantProductId)}`, importRunId, merchantId: input.merchant.id, sourceKey: input.adapter.sourceKey, decision: match, status: 'pending', createdAt: now() }
          await input.repository.addMatchReview(review)
        }

        const categoryId = candidate.sourceCategory
          ? input.categoryIdBySourceCategory?.[candidate.sourceCategory] ?? input.categoryIdResolver?.({ sourceKey: candidate.sourceKey, sourceCategory: candidate.sourceCategory, title: candidate.title })
          : undefined
        const productId = canonicalProductId
        const product: Product = { id: productId, slug: `${slugify(candidate.title)}-${candidate.merchantProductId.toLowerCase()}`, title: candidate.title, description: candidate.description, brand: candidate.brand, gtin: candidate.gtin, mpn: candidate.mpn, imageUrl: candidate.imageUrls[0], categoryId }
        const offer: Offer = { id: `offer:${input.merchant.id}:${candidate.merchantProductId}`, productId, merchantId: input.merchant.id, merchantProductId: candidate.merchantProductId, price: candidate.price, shippingCost: candidate.shippingCost, availability: candidate.availability, productUrl: candidate.productUrl, affiliateUrl: candidate.affiliateUrl, sourceUpdatedAt: candidate.sourceUpdatedAt, importedAt: candidate.importedAt, lastSeenAt: startedAt, isActive: true }
        await input.repository.upsertProduct(product); await input.repository.upsertOffer(offer); imported += 1
      }
      cursor = page.nextCursor
    } while (cursor)

    if (input.deactivateMissingOffers !== false) offersDeactivated = await input.repository.deactivateMissingOffers({ merchantId: input.merchant.id, seenBefore: startedAt })
    importRun = { ...importRun, status: rejected > 0 || reviewRequired > 0 ? 'completed_with_errors' : 'completed', finishedAt: now(), recordsAccepted: imported, recordsRejected: rejected, offersDeactivated, reviewRequired, errorSummary: issues.flatMap((issue) => issue.messages).slice(0, 25) }
    await input.repository.updateImportRun(importRun)
    return { importRun, imported, rejected, offersDeactivated, reviewRequired, issues, matches }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown import failure.'
    importRun = { ...importRun, status: 'failed', finishedAt: now(), recordsAccepted: imported, recordsRejected: rejected, offersDeactivated, reviewRequired, errorSummary: [...importRun.errorSummary, message] }
    await input.repository.updateImportRun(importRun); throw error
  }
}
