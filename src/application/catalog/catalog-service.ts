import type { CatalogReadRepository } from './ports'
import type { CatalogSearchQuery } from './search-query'
import { getProductComparisonGroup } from '@/domain/catalog/comparison'
import { classifyOfferAvailability } from '@/domain/catalog/offer-availability'
import { classifyOfferFreshness, type OfferFreshnessStatus } from '@/domain/catalog/offer-freshness'
import type { Category, Merchant, Offer, Product } from '@/domain/catalog/types'
import { rankConstraintAwareCandidates } from '@/application/search/constraint-aware-candidate-ranking'

export type RankedOffer = {
  offer: Offer
  merchant?: Merchant
  totalAmount: string
  freshness: OfferFreshnessStatus
}

export type CatalogProductListItem = {
  product: Product
  bestOffer?: RankedOffer
  offerCount: number
}

export type CatalogProductDetail = {
  product: Product
  offers: RankedOffer[]
}

export type CatalogCategoryDiscovery = {
  category: Category
  parentCategory?: Category
  subcategories: Category[]
  items: CatalogProductListItem[]
  page: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type CatalogSearchResult = {
  query: CatalogSearchQuery
  products: CatalogProductListItem[]
  page: number
  pageSize: number
  hasPrevious: boolean
  hasNext: boolean
}

function cents(amount: string): number {
  const [euros = '0', decimals = '00'] = amount.split('.')
  return Number(euros) * 100 + Number(decimals.padEnd(2, '0').slice(0, 2))
}

function amountFromCents(value: number): string {
  return `${Math.floor(value / 100)}.${String(value % 100).padStart(2, '0')}`
}

function totalOfferAmount(offer: Offer): string {
  const shipping = offer.shippingCost ? cents(offer.shippingCost.amount) : 0
  return amountFromCents(cents(offer.price.amount) + shipping)
}

function searchScore(product: Product, term?: string): number {
  if (!term) return 0
  const needle = term.toLocaleLowerCase('nl-NL')
  const title = product.title.toLocaleLowerCase('nl-NL')
  const brand = product.brand?.toLocaleLowerCase('nl-NL') ?? ''
  const description = product.description?.toLocaleLowerCase('nl-NL') ?? ''

  if (title.startsWith(needle)) return 4
  if (title.includes(needle)) return 3
  if (brand.includes(needle)) return 2
  if (description.includes(needle)) return 1
  return -1
}

export class CatalogService {
  constructor(
    private readonly repository: CatalogReadRepository,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  private rankOffers(offers: Offer[], merchantById: Map<string, Merchant>): RankedOffer[] {
    const now = this.now()
    return offers
      .filter((offer) => offer.isActive && classifyOfferAvailability(offer.availability) !== 'unavailable')
      .map((offer) => ({
        offer,
        merchant: merchantById.get(offer.merchantId),
        totalAmount: totalOfferAmount(offer),
        freshness: classifyOfferFreshness(offer, now),
      }))
      .filter((item) => item.freshness !== 'expired')
      .sort((a, b) => {
        const aShippingKnown = Boolean(a.offer.shippingCost)
        const bShippingKnown = Boolean(b.offer.shippingCost)
        if (aShippingKnown !== bShippingKnown) return aShippingKnown ? -1 : 1
        return cents(a.totalAmount) - cents(b.totalAmount)
      })
  }

  async listProducts(input?: {
    categorySlug?: string
    limit?: number
    offset?: number
  }): Promise<CatalogProductListItem[]> {
    const [products, merchants] = await Promise.all([
      this.repository.listProducts(input),
      this.repository.listActiveMerchants(),
    ])
    const merchantById = new Map(merchants.map((merchant) => [merchant.id, merchant]))

    return Promise.all(
      products.map(async (product) => {
        const detail = await this.repository.getProductBySlug(product.slug)
        const ranked = this.rankOffers(detail?.offers ?? [], merchantById)

        return {
          product,
          bestOffer: ranked[0],
          offerCount: ranked.length,
        }
      }),
    )
  }

  async getProduct(slug: string): Promise<CatalogProductDetail | null> {
    const [detail, merchants] = await Promise.all([
      this.repository.getProductBySlug(slug),
      this.repository.listActiveMerchants(),
    ])
    if (!detail) return null

    const merchantById = new Map(merchants.map((merchant) => [merchant.id, merchant]))
    return { product: detail.product, offers: this.rankOffers(detail.offers, merchantById) }
  }

  async listCategories(): Promise<Category[]> {
    return this.repository.listCategories()
  }

  async listRootCategories(): Promise<Category[]> {
    const categories = await this.repository.listCategories()
    return categories.filter((category) => !category.parentId)
  }

  async getCategory(slug: string): Promise<Category | null> {
    const categories = await this.repository.listCategories()
    return categories.find((item) => item.slug === slug) ?? null
  }

  async getCategoryDiscovery(input: {
    categorySlug: string
    page?: number
    pageSize?: number
  }): Promise<CatalogCategoryDiscovery | null> {
    const categories = await this.repository.listCategories()
    const category = categories.find((item) => item.slug === input.categorySlug)
    if (!category) return null

    const parentCategory = category.parentId
      ? categories.find((item) => item.id === category.parentId)
      : undefined
    const subcategories = categories
      .filter((item) => item.parentId === category.id)
      .sort((a, b) => a.name.localeCompare(b.name, 'nl-NL'))

    const page = Math.max(1, Math.floor(input.page ?? 1))
    const pageSize = Math.min(48, Math.max(1, Math.floor(input.pageSize ?? 24)))
    const offset = (page - 1) * pageSize
    const products = await this.listProducts({
      categorySlug: category.slug,
      limit: pageSize + 1,
      offset,
    })
    const hasNextPage = products.length > pageSize

    return {
      category,
      parentCategory,
      subcategories,
      items: products
        .slice(0, pageSize)
        .sort((a, b) => Number(Boolean(b.bestOffer)) - Number(Boolean(a.bestOffer)) || cents(a.bestOffer?.totalAmount ?? '9999999.99') - cents(b.bestOffer?.totalAmount ?? '9999999.99')),
      page,
      pageSize,
      hasPreviousPage: page > 1,
      hasNextPage,
    }
  }

  async searchProducts(query: CatalogSearchQuery): Promise<CatalogSearchResult> {
    const candidates = await this.listProducts({
      categorySlug: query.categorySlug,
      limit: 240,
      offset: 0,
    })

    const normalizedBrand = query.brand?.toLocaleLowerCase('nl-NL')
    const requiresOffer = query.minPrice != null
      || query.maxPrice != null
      || query.inStockOnly
      || query.sort === 'price_asc'
      || query.sort === 'price_desc'

    let filtered = candidates
      .map((item) => ({ item, score: searchScore(item.product, query.term) }))
      .filter(({ item, score }) => {
        if (score < 0) return false
        if (query.productType && getProductComparisonGroup(item.product) !== query.productType) return false
        if (normalizedBrand && item.product.brand?.toLocaleLowerCase('nl-NL') !== normalizedBrand) return false
        if (!item.bestOffer) return !requiresOffer

        const total = cents(item.bestOffer.totalAmount)
        if (query.minPrice != null && total < Math.round(query.minPrice * 100)) return false
        if (query.maxPrice != null && total > Math.round(query.maxPrice * 100)) return false
        if (query.inStockOnly && classifyOfferAvailability(item.bestOffer.offer.availability) !== 'available') return false
        return true
      })

    filtered = filtered.sort((a, b) => {
      if (query.sort === 'price_asc') return cents(a.item.bestOffer!.totalAmount) - cents(b.item.bestOffer!.totalAmount)
      if (query.sort === 'price_desc') return cents(b.item.bestOffer!.totalAmount) - cents(a.item.bestOffer!.totalAmount)
      if (query.sort === 'title_asc') return a.item.product.title.localeCompare(b.item.product.title, 'nl-NL')
      return b.score - a.score || a.item.product.title.localeCompare(b.item.product.title, 'nl-NL')
    })

    const orderedItems = query.sort === 'relevance' && query.contextTerm
      ? rankConstraintAwareCandidates(filtered.map(({ item }) => item), query.contextTerm).map((candidate) => candidate.item)
      : filtered.map(({ item }) => item)

    const offset = (query.page - 1) * query.pageSize
    const pageItems = orderedItems.slice(offset, offset + query.pageSize + 1)

    return {
      query,
      products: pageItems.slice(0, query.pageSize),
      page: query.page,
      pageSize: query.pageSize,
      hasPrevious: query.page > 1,
      hasNext: pageItems.length > query.pageSize,
    }
  }
}
