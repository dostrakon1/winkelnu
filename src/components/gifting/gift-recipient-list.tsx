import type { GiftCatalogProductView } from '@/application/gifting/gift-catalog'
import type { GiftListItem } from '@/domain/gifting/types'
import { GiftListItemCard } from './gift-list-item-card'

type GiftRecipientListProps = {
  groupCode: string
  recipientName: string
  items: GiftListItem[]
  productViews: Record<string, GiftCatalogProductView>
  reservedItemIds: string[]
  reservationAction: (formData: FormData) => void | Promise<void>
}

export function GiftRecipientList({
  groupCode,
  recipientName,
  items,
  productViews,
  reservedItemIds,
  reservationAction,
}: GiftRecipientListProps) {
  const reserved = new Set(reservedItemIds)

  if (items.length === 0) {
    return (
      <section className="rounded-[var(--wn-radius-xl)] border border-dashed border-[color:rgba(18,59,58,0.24)] bg-white/75 p-7 text-center sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]" aria-hidden="true">?</div>
        <h2 className="wn-heading mt-4 text-3xl">{recipientName} heeft nog geen wensen ingevuld.</h2>
        <p className="wn-body-muted mx-auto mt-3 max-w-xl leading-7">Geen probleem. Gebruik Winkelnu om zelf een cadeau te vinden dat binnen jullie budget past.</p>
        <a href="/zoeken" className="wn-button wn-button-primary mt-6">Zoek een cadeau op Winkelnu →</a>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-5">
        <p className="wn-eyebrow">Verlanglijstje</p>
        <h2 className="wn-heading mt-2 text-3xl">Wensen van {recipientName}</h2>
        <p className="wn-body-muted mt-3">Markeer een wens als geregeld zodra jij die hebt gekozen. Die status is alleen voor jou zichtbaar.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {items.map((item) => {
          const isReserved = reserved.has(item.id)
          return (
            <div key={item.id} className="space-y-3">
              <GiftListItemCard item={item} productView={productViews[item.id]} />
              <form action={reservationAction} className="rounded-xl border border-[var(--wn-border)] bg-white px-4 py-3 shadow-[var(--wn-shadow-xs)]">
                <input type="hidden" name="groupCode" value={groupCode} />
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="reserved" value={isReserved ? 'false' : 'true'} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[var(--wn-petrol-deep)]">{isReserved ? 'Geregeld ✓' : 'Nog niet geregeld'}</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--wn-text-muted)]">{isReserved ? 'Alleen jij ziet deze markering.' : 'Markeer dit zodra jij deze wens op je neemt.'}</p>
                  </div>
                  <button type="submit" className={isReserved ? 'wn-button wn-button-secondary' : 'wn-button wn-button-primary'}>
                    {isReserved ? 'Maak weer vrij' : 'Markeer als geregeld'}
                  </button>
                </div>
              </form>
            </div>
          )
        })}
      </div>
    </section>
  )
}
