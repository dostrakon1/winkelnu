import Link from 'next/link'
import { WinkelnuBadge } from './winkelnu-badge'
import { WinkelnuButton } from './winkelnu-button'

type ProductCardProps = {
  slug: string
  title: string
  brand?: string | null
  description?: string | null
  price: string
  merchantName?: string | null
  offerCount: number
  availability: string
}

export function ProductCard({ slug, title, brand, description, price, merchantName, offerCount, availability }: ProductCardProps) {
  const inStock = availability === 'in_stock'

  return (
    <article className="wn-surface wn-card-interactive group flex flex-col p-5">
      <Link href={`/product/${slug}`} className="flex min-h-40 items-center justify-center rounded-[var(--wn-radius-lg)] bg-[#f0ebe2] px-5 text-center text-sm font-medium text-[color:rgba(30,36,35,0.48)] transition group-hover:bg-[#ebe4d8]">
        Productafbeelding volgt uit merchantfeed
      </Link>
      <div className="mt-5 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:rgba(18,59,58,0.64)]">{brand ?? 'Merk onbekend'}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--wn-ink)]">
          <Link href={`/product/${slug}`} className="decoration-[var(--wn-warm)] decoration-2 underline-offset-4 hover:underline">{title}</Link>
        </h3>
        {description ? <p className="wn-body-muted mt-3 line-clamp-2 text-sm leading-6">{description}</p> : null}
      </div>
      <div className="mt-5 border-t border-[color:rgba(18,59,58,0.09)] pt-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[color:rgba(30,36,35,0.56)]">Vanaf {merchantName ?? 'webwinkel'} · {offerCount} {offerCount === 1 ? 'aanbieding' : 'aanbiedingen'}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--wn-ink)]">{price}</p>
          </div>
          <WinkelnuBadge variant={inStock ? 'success' : 'warning'}>{inStock ? 'Op voorraad' : 'Bekijk status'}</WinkelnuBadge>
        </div>
        <WinkelnuButton href={`/product/${slug}`} className="mt-4 w-full">Vergelijk aanbiedingen</WinkelnuButton>
      </div>
    </article>
  )
}
