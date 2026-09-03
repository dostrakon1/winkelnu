import type { CatalogReadRepository } from './ports'
import type { CatalogSearchQuery } from './search-query'
import type { Category, Merchant, Offer, Product } from '@/domain/catalog/types'

export type RankedOffer = {
  offer: Offer
  merchant?: Merchant
  totalAmount: string
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

export type CatalogCategoryPage = {
  category: Category
  products: CatalogProductListItem[]
  page: number
  pageSize: number
  hasPrevious: boolean
  hasNext: boolean
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
  constructor(private readonly repository: CatalogReadRepository) {}

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
        const ranked = (detail?.offers ?? [])
          .filter((offer) => offer.isActive)
          .map((offer) => ({
            offer,
            merchant: merchantById.get(offer.merchantId),
            totalAmount: totalOfferAmount(offer),
          }))
          .sort((a, b) => cents(a.totalAmount) - cents(b.totalAmount))

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
    const offers = detail.offers
      .filter((offer) => offer.isActive)
      .map((offer) => ({
        offer,
        merchant: merchantById.get(offer.merchantId),
        totalAmount: totalOfferAmount(offer),
      }))
      .sort((a, b) => cents(a.totalAmount) - cents(b.totalAmount))

    return { product: detail.product, offers }
  }

  async listCategories(): Promise<Category[]> {
    return this.repository.listCategories()
  }

  async getCategory(slug: string): Promise<Category | null> {
    const categories = await this.repository.listCategories()
    return categories.find((category) => category.slug === slug) ?? null
  }

  async getCategoryPage(input: {
    slug: string
    page?: number
    pageSize?: number
  }): Promise<CatalogCategoryPage | null> {
    const category = await this.getCategory(input.slug)
    if (!category) return null

    const page = Math.max(1, Math.floor(input.page ?? 1))
    const pageSize = Math.min(48, Math.max(1, Math.floor(input.pageSize ?? 24)))
    const offset = (page - 1) * pageSize
    const products = await this.listProducts({
      categorySlug: category.slug,
      limit: pageSize + 1,
      offset,
    })
    const hasNext = products.length > pageSize

    return {
      category,
      products: products
        .slice(0, pageSize)
        .sort((a, b) => Number(Boolean(b.bestOffer)) - Number(Boolean(a.bestOffer)) || cents(a.bestOffer?.totalAmount ?? '9999999.99') - cents(b.bestOffer?.totalAmount ?? '9999999.99')),
      page,
      pageSize,
      hasPrevious: page > 1,
      hasNext,
    }
  }

  async searchProducts(query: CatalogSearchQuery): Promise<CatalogSearchResult> {
    // M0.13 deliberately keeps the public query contract inside the application layer.
    // The current repository fetch cap is a safe bootstrap for the synthetic/small catalog.
    // A later scale milestone can push these filters into Postgres without changing routes.
    const candidates = await this.listProducts({
      categorySlug: query.categorySlug,
      limit: 240,
      offset: 0,
    })

    const normalizedBrand = query.brand?.toLocaleLowerCase('nl-NL')
    let filtered = candidates
      .map((item) => ({ item, score: searchScore(item.product, query.term) }))
      .filter(({ item, score }) => {
        if (score < 0) return false
        if (normalizedBrand && item.product.brand?.toLocaleLowerCase('nl-NL') !== normalizedBrand) return false
        if (!item.bestOffer) return false

        const total = cents(item.bestOffer.totalAmount)
        if (query.minPrice != null && total < Math.round(query.minPrice * 100)) return false
        if (query.maxPrice != null && total > Math.round(query.maxPrice * 100)) return false
        if (query.inStockOnly && item.bestOffer.offer.availability !== 'in_stock') return false
        return true
      })

    filtered = filtered.sort((a, b) => {
      if (query.sort === 'price_asc') return cents(a.item.bestOffer!.totalAmount) - cents(b.item.bestOffer!.totalAmount)
      if (query.sort === 'price_desc') return cents(b.item.bestOffer!.totalAmount) - cents(a.item.bestOffer!.totalAmount)
      if (query.sort === 'title_asc') return a.item.product.title.localeCompare(b.item.product.title, 'nl-NL')
      return b.score - a.score || a.item.product.title.localeCompare(b.item.product.title, 'nl-NL')
    })

    const offset = (query.page - 1) * query.pageSize
    const pageItems = filtered.slice(offset, offset + query.pageSize + 1)

    return {
      query,
      products: pageItems.slice(0, query.pageSize).map(({ item }) => item),
      page: query.page,
      pageSize: query.pageSize,
      hasPrevious: query.page > 1,
      hasNext: pageItems.length > query.pageSize,
    }
  }
}
