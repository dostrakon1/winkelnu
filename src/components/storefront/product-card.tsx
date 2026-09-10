import Link from 'next/link'
import type { ProductVisualKind } from '@/domain/catalog/types'
import { ProductMedia } from './product-media'
import { WinkelnuBadge } from './winkelnu-badge'
import { WinkelnuButton } from './winkelnu-button'

type ProductCardProps = {
  slug: string
  title: string
  brand?: string | null
  description?: string | null
  imageUrl?: string | null
  visualKind?: ProductVisualKind
  price?: string | null
  merchantName?: string | null
  offerCount: number
  availability?: string | null
  shippingKnown?: boolean
}

export function ProductCard({
  slug,
  title,
  brand,
  description,
  imageUrl,
  visualKind,
  price,
  merchantName,
  offerCount,
  availability,
  shippingKnown = false,
}: ProductCardProps) {
  const hasOffer = Boolean(price)
  const inStock = availability === 'in_stock'
  const priceLabel = shippingKnown ? 'Beste bekende totaalprijs' : 'Beste bekende productprijs'

  return (
    <article className="wn-surface wn-card-interactive group flex h-full flex-col p-4 sm:p-5">
      <Link href={`/product/${slug}`} aria-label={`Bekijk ${title}`} className="block overflow-hidden rounded-[var(--wn-radius-lg)]">
        <ProductMedia src={imageUrl} alt={title} visualKind={visualKind} />
      </Link>
      <div className="mt-4 flex-1 sm:mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:rgba(18,59,58,0.64)]">{brand ?? 'Merk onbekend'}</p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-[var(--wn-ink)] sm:text-xl">
          <Link href={`/product/${slug}`} className="decoration-[var(--wn-warm)] decoration-2 underline-offset-4 hover:underline">{title}</Link>
        </h3>
        {description ? <p className="wn-body-muted mt-3 line-clamp-2 text-sm leading-6">{description}</p> : null}
      </div>
      <div className="mt-5 border-t border-[color:rgba(18,59,58,0.09)] pt-4">
        {hasOffer ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--wn-text-muted)]">{priceLabel}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--wn-ink)]">{price}</p>
              <p className="mt-1 text-xs leading-5 text-[color:rgba(30,36,35,0.56)]">Bij {merchantName ?? 'webwinkel'} · {offerCount} {offerCount === 1 ? 'aanbieding' : 'aanbiedingen'}</p>
              {!shippingKnown ? <p className="mt-1 text-xs font-medium text-[var(--wn-warm)]">Verzendkosten nog niet bekend.</p> : null}
            </div>
            <div className="shrink-0">
              <WinkelnuBadge variant={inStock ? 'success' : 'warning'}>{inStock ? 'Op voorraad' : 'Controleer voorraad'}</WinkelnuBadge>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-[var(--wn-petrol-deep)]">Nog geen winkelprijzen gekoppeld.</p>
            <p className="wn-body-muted mt-1 text-xs leading-5">De productinformatie kun je alvast bekijken.</p>
          </div>
        )}
        <WinkelnuButton href={`/product/${slug}`} className="mt-4 w-full">
          {hasOffer ? 'Vergelijk aanbiedingen' : 'Bekijk product'}
        </WinkelnuButton>
      </div>
    </article>
  )
}
