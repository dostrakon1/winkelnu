import { WinkelnuBadge } from './winkelnu-badge'
import { WinkelnuButton } from './winkelnu-button'

type OfferCardProps = {
  merchantName: string
  itemPrice: string
  totalPrice: string
  shippingLabel?: string
  shippingKnown?: boolean
  availability: string
  href: string
  isBest?: boolean
}

export function OfferCard({
  merchantName,
  itemPrice,
  totalPrice,
  shippingLabel,
  shippingKnown = false,
  availability,
  href,
  isBest = false,
}: OfferCardProps) {
  const inStock = availability === 'in_stock'
  const bestLabel = shippingKnown ? 'Laagste bekende totaalprijs' : 'Laagste bekende productprijs'
  const totalLabel = shippingKnown ? 'Bekende totaalprijs' : 'Productprijs'

  return (
    <article className={`wn-surface p-4 sm:p-5 ${isBest ? 'border-[color:rgba(18,59,58,0.28)] ring-1 ring-[color:rgba(18,59,58,0.08)]' : ''}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--wn-ink)]">{merchantName}</h3>
            {isBest ? <WinkelnuBadge>{bestLabel}</WinkelnuBadge> : null}
          </div>
          <p className="wn-body-muted mt-2 text-sm">Productprijs: {itemPrice}</p>
          {shippingLabel ? <p className="wn-body-muted mt-1 text-sm">{shippingLabel}</p> : null}
          {!shippingKnown ? <p className="mt-1 text-xs font-medium text-[var(--wn-warm)]">Controleer verzendkosten bij de webwinkel.</p> : null}
        </div>
        <div className="shrink-0">
          <WinkelnuBadge variant={inStock ? 'success' : 'warning'}>{inStock ? 'Op voorraad' : 'Controleer voorraad'}</WinkelnuBadge>
        </div>
      </div>
      <div className="mt-5 border-t border-[color:rgba(18,59,58,0.09)] pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[color:rgba(30,36,35,0.52)]">{totalLabel}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--wn-ink)]">{totalPrice}</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--wn-text-muted)]">Prijs en voorraad kunnen bij de winkel wijzigen.</p>
          </div>
          <WinkelnuButton href={href} rel="nofollow sponsored" variant="warm" className="w-full sm:w-auto">
            Bekijk aanbieding ↗
          </WinkelnuButton>
        </div>
      </div>
    </article>
  )
}
