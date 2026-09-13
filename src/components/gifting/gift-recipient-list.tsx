import Link from 'next/link'
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
  const reservedCount = items.filter((item) => reserved.has(item.id)).length

  if (items.length === 0) {
    return (
      <section className="gift-recipient-empty">
        <span aria-hidden="true">?</span>
        <p className="gift-kicker mt-5">Nog geen lijstje</p>
        <h2>{recipientName} heeft nog geen wensen ingevuld.</h2>
        <p>Geen probleem. Gebruik Winkelnu om zelf een cadeau te vinden dat binnen jullie budget past.</p>
        <Link href="/zoeken" className="wn-button wn-button-primary mt-6">Zoek een cadeau op Winkelnu →</Link>
      </section>
    )
  }

  return (
    <section className="gift-recipient-wishes">
      <div className="gift-recipient-wishes-head">
        <div>
          <p className="gift-kicker">Verlanglijstje</p>
          <h2>Wensen van {recipientName}</h2>
          <p>Kies een wens of gebruik het lijstje als inspiratie. Je eigen geregeld-status blijft privé.</p>
        </div>
        <div className="gift-recipient-progress" aria-label={`${reservedCount} van ${items.length} wensen gemarkeerd als geregeld`}>
          <strong>{reservedCount}/{items.length}</strong>
          <span>geregeld</span>
        </div>
      </div>

      <div className="gift-recipient-grid">
        {items.map((item) => {
          const isReserved = reserved.has(item.id)
          return (
            <div key={item.id} className="gift-recipient-wish" data-reserved={isReserved ? 'true' : 'false'}>
              <GiftListItemCard item={item} productView={productViews[item.id]} />
              <form action={reservationAction} className="gift-reservation-bar">
                <input type="hidden" name="groupCode" value={groupCode} />
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="reserved" value={isReserved ? 'false' : 'true'} />
                <div className="gift-reservation-copy">
                  <span className="gift-reservation-status" aria-hidden="true">{isReserved ? '✓' : '○'}</span>
                  <div>
                    <strong>{isReserved ? 'Voor mij geregeld' : 'Nog beschikbaar voor mij'}</strong>
                    <p>{isReserved ? 'Alleen jij ziet deze markering.' : 'Markeer dit zodra jij deze wens op je neemt.'}</p>
                  </div>
                </div>
                <button type="submit" className={isReserved ? 'wn-button wn-button-secondary' : 'wn-button wn-button-primary'}>
                  {isReserved ? 'Maak weer vrij' : 'Ik regel deze'}
                </button>
              </form>
            </div>
          )
        })}
      </div>

      <div className="gift-recipient-search-cta">
        <div>
          <p className="gift-kicker">Liever iets anders?</p>
          <h3>Gebruik de wensen als inspiratie.</h3>
          <p>Zoek zelf verder op Winkelnu als je een alternatief wilt vinden dat beter past.</p>
        </div>
        <Link href="/zoeken" className="wn-button wn-button-secondary">Cadeau zoeken →</Link>
      </div>
    </section>
  )
}
