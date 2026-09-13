import 'server-only'

import { parseCatalogSearchQuery } from '@/application/catalog/search-query'
import { normalizeGiftText } from '@/domain/gifting/validation'
import type { GiftListItem } from '@/domain/gifting/types'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'
import type { CatalogProductDetail, CatalogProductListItem } from '@/application/catalog/catalog-service'

export type GiftCatalogProductView = {
  productExternalKey: string
  slug: string
  title: string
  brand?: string
  imageUrl?: string
  priceCents?: number
  currency?: 'EUR'
  offerCount: number
  bestOfferId?: string
}

function amountToCents(amount: string): number | undefined {
  const normalized = amount.trim()
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return undefined
  const [euros = '0', decimals = ''] = normalized.split('.')
  const cents = Number(euros) * 100 + Number(decimals.padEnd(2, '0').slice(0, 2))
  return Number.isSafeInteger(cents) && cents >= 0 ? cents : undefined
}

function fromListItem(item: CatalogProductListItem): GiftCatalogProductView {
  const priceCents = item.bestOffer ? amountToCents(item.bestOffer.totalAmount) : undefined
  return {
    productExternalKey: item.product.id,
    slug: item.product.slug,
    title: item.product.title,
    brand: item.product.brand,
    imageUrl: item.product.imageUrl,
    priceCents,
    currency: priceCents === undefined ? undefined : 'EUR',
    offerCount: item.offerCount,
    bestOfferId: item.bestOffer?.offer.id,
  }
}

function fromDetail(detail: CatalogProductDetail): GiftCatalogProductView {
  const bestOffer = detail.offers[0]
  const priceCents = bestOffer ? amountToCents(bestOffer.totalAmount) : undefined
  return {
    productExternalKey: detail.product.id,
    slug: detail.product.slug,
    title: detail.product.title,
    brand: detail.product.brand,
    imageUrl: detail.product.imageUrl,
    priceCents,
    currency: priceCents === undefined ? undefined : 'EUR',
    offerCount: detail.offers.length,
    bestOfferId: bestOffer?.offer.id,
  }
}

export async function searchGiftCatalogProducts(rawTerm: string): Promise<GiftCatalogProductView[]> {
  const term = normalizeGiftText(rawTerm).slice(0, 120)
  if (term.length < 2) return []

  const catalog = await createStorefrontCatalogService()
  const query = parseCatalogSearchQuery({ q: term, perPagina: '8' })
  const result = await catalog.searchProducts(query)
  return result.products.map(fromListItem)
}

export async function getGiftCatalogProductBySlug(rawSlug: string): Promise<GiftCatalogProductView | null> {
  const slug = rawSlug.trim().toLowerCase()
  if (!/^[a-z0-9][a-z0-9-]{0,159}$/.test(slug)) return null

  const catalog = await createStorefrontCatalogService()
  const detail = await catalog.getProduct(slug)
  return detail ? fromDetail(detail) : null
}

export async function resolveGiftCatalogProductViews(
  items: GiftListItem[],
): Promise<Record<string, GiftCatalogProductView>> {
  const catalogItems = items.filter(
    (item) => item.itemType === 'winkelnu_product' && item.productExternalKey && item.productSlugSnapshot,
  )
  if (catalogItems.length === 0) return {}

  const catalog = await createStorefrontCatalogService()
  const pairs = await Promise.all(
    catalogItems.map(async (item) => {
      const detail = await catalog.getProduct(item.productSlugSnapshot!)
      if (!detail || detail.product.id !== item.productExternalKey) return null
      return [item.id, fromDetail(detail)] as const
    }),
  )

  return Object.fromEntries(pairs.filter((pair): pair is readonly [string, GiftCatalogProductView] => Boolean(pair)))
}
