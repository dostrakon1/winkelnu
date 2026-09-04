import Link from 'next/link'
import { ProductMedia } from './product-media'
import { WinkelnuBadge } from './winkelnu-badge'
import { WinkelnuButton } from './winkelnu-button'

type ProductCardProps = {
  slug: string
  title: string
  brand?: string | null
  description?: string | null
  imageUrl?: string | null
  price?: string | null
  merchantName?: string | null
  offerCount: number
  availability?: string | null
}

export function ProductCard({
  slug,
  title,
  brand,
  description,
  imageUrl,
  price,
  merchantName,
  offerCount,
  availability,
}: ProductCardProps) {
  const hasOffer = Boolean(price)
  const inStock = availability === 'in_stock'

  return (
    <article className="wn-surface wn-card-interactive group flex flex-col p-5">
      <Link href={`/product/${slug}`} aria-label={`Bekijk ${title}`}>
        <ProductMedia src={imageUrl} alt={title} />
      </Link>
      <div className="mt-5 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:rgba(18,59,58,0.64)]">{brand ?? 'Merk onbekend'}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--wn-ink)]">
          <Link href={`/product/${slug}`} className="decoration-[var(--wn-warm)] decoration-2 underline-offset-4 hover:underline">{title}</Link>
        </h3>
        {description ? <p className="wn-body-muted mt-3 line-clamp-2 text-sm leading-6">{description}</p> : null}
      </div>
      <div className="mt-5 border-t border-[color:rgba(18,59,58,0.09)] pt-4">
        {hasOffer ? (
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[var(--wn-text-muted)]">Beste bekende totaalprijs</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--wn-ink)]">{price}</p>
              <p className="mt-1 text-xs text-[color:rgba(30,36,35,0.56)]">Bij {merchantName ?? 'webwinkel'} · {offerCount} {offerCount === 1 ? 'aanbieding' : 'aanbiedingen'}</p>
            </div>
            <WinkelnuBadge variant={inStock ? 'success' : 'warning'}>{inStock ? 'Op voorraad' : 'Bekijk status'}</WinkelnuBadge>
          </div>
        ) : (
          <p className="wn-body-muted text-sm">Momenteel geen actieve aanbieding.</p>
        )}
        <WinkelnuButton href={`/product/${slug}`} className="mt-4 w-full">
          {hasOffer ? 'Vergelijk aanbiedingen' : 'Bekijk product'}
        </WinkelnuButton>
      </div>
    </article>
  )
}
