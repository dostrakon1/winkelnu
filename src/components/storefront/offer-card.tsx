import { WinkelnuBadge } from './winkelnu-badge'
import { WinkelnuButton } from './winkelnu-button'

type OfferCardProps = {
  merchantName: string
  price: string
  shippingLabel?: string
  availability: string
  href: string
  isBest?: boolean
}

export function OfferCard({ merchantName, price, shippingLabel, availability, href, isBest = false }: OfferCardProps) {
  const inStock = availability === 'in_stock'

  return (
    <article className={`wn-surface p-5 ${isBest ? 'border-[color:rgba(18,59,58,0.28)] ring-1 ring-[color:rgba(18,59,58,0.08)]' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--wn-ink)]">{merchantName}</h3>
            {isBest ? <WinkelnuBadge>Beste bekende aanbod</WinkelnuBadge> : null}
          </div>
          {shippingLabel ? <p className="wn-body-muted mt-1 text-sm">{shippingLabel}</p> : null}
        </div>
        <WinkelnuBadge variant={inStock ? 'success' : 'warning'}>{inStock ? 'Op voorraad' : 'Bekijk status'}</WinkelnuBadge>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[color:rgba(18,59,58,0.09)] pt-4">
        <p className="text-2xl font-bold text-[var(--wn-ink)]">{price}</p>
        <WinkelnuButton href={href}>Bekijk aanbieding</WinkelnuButton>
      </div>
    </article>
  )
}
