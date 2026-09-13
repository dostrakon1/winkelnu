import Link from 'next/link'
import type { GiftCatalogProductView } from '@/application/gifting/gift-catalog'
import type { GiftListItem } from '@/domain/gifting/types'

type GiftListItemCardProps = {
  item: GiftListItem
  productView?: GiftCatalogProductView
  editable?: boolean
  updateAction?: (formData: FormData) => void | Promise<void>
  updateProductNoteAction?: (formData: FormData) => void | Promise<void>
  deleteAction?: (formData: FormData) => void | Promise<void>
  shareCode?: string
  contextFields?: Record<string, string>
}

function money(cents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

export function GiftListItemCard({
  item,
  productView,
  editable = false,
  updateAction,
  updateProductNoteAction,
  deleteAction,
  shareCode,
  contextFields,
}: GiftListItemCardProps) {
  const isWinkelnuProduct = item.itemType === 'winkelnu_product'
  const currentPrice = productView?.priceCents
  const snapshotPrice = item.priceCentsSnapshot
  const displayTitle = productView?.title ?? item.title
  const actionContext = contextFields ?? (shareCode ? { shareCode } : {})
  const hasActionContext = Object.keys(actionContext).length > 0
  const typeLabel = isWinkelnuProduct ? 'Winkelnu-product' : item.itemType === 'external_link' ? 'Productlink' : 'Eigen wens'
  const giftingAffiliateHref = productView?.bestOfferId
    ? `/uit/${encodeURIComponent(productView.bestOfferId)}?from=${encodeURIComponent('/lootje-lijstje')}`
    : undefined

  const hiddenContextFields = Object.entries(actionContext).map(([name, value]) => (
    <input key={name} type="hidden" name={name} value={value} />
  ))

  return (
    <article className="gift-wish-card" data-kind={item.itemType} data-editable={editable ? 'true' : 'false'}>
      <div className="gift-wish-card-top">
        <span className="gift-wish-card-icon" aria-hidden="true">
          {item.itemType === 'external_link' ? '↗' : isWinkelnuProduct ? '✦' : '♡'}
        </span>
        <span className="gift-wish-card-type">{typeLabel}</span>
      </div>

      <div className="gift-wish-card-content">
        {isWinkelnuProduct && productView?.brand ? <p className="gift-wish-card-brand">{productView.brand}</p> : null}
        <h3>{displayTitle}</h3>

        {isWinkelnuProduct ? (
          <p className="gift-wish-card-price">
            {currentPrice !== undefined
              ? `Vanaf ${money(currentPrice)}`
              : snapshotPrice !== undefined
                ? `Prijs bij toevoegen: ${money(snapshotPrice)}`
                : 'Nog geen gecontroleerde winkelprijs'}
          </p>
        ) : null}

        {item.note ? (
          <div className="gift-wish-card-note">
            <span>Toelichting</span>
            <p>{item.note}</p>
          </div>
        ) : null}
      </div>

      <div className="gift-wish-card-actions">
        {isWinkelnuProduct ? (
          productView ? (
            <>
              <Link href={`/product/${encodeURIComponent(productView.slug)}`} className="gift-wish-link">
                Bekijk op Winkelnu <span aria-hidden="true">→</span>
              </Link>
              {giftingAffiliateHref ? (
                <Link href={giftingAffiliateHref} rel="nofollow sponsored" className="gift-wish-link">
                  Bekijk aanbieding <span aria-hidden="true">↗</span>
                </Link>
              ) : null}
            </>
          ) : (
            <Link href={`/zoeken?q=${encodeURIComponent(item.title)}`} className="gift-wish-link">
              Zoek een alternatief <span aria-hidden="true">→</span>
            </Link>
          )
        ) : item.externalUrl ? (
          <Link href={item.externalUrl} target="_blank" rel="nofollow noopener noreferrer" className="gift-wish-link">
            Bekijk productlink <span aria-hidden="true">↗</span>
          </Link>
        ) : (
          <span className="gift-wish-card-text-only">Vrije wens</span>
        )}

        {isWinkelnuProduct && !productView ? (
          <span className="gift-wish-card-unavailable">Niet meer in de huidige catalogus</span>
        ) : null}
      </div>

      {editable && !isWinkelnuProduct && updateAction && hasActionContext ? (
        <details className="gift-wish-editor">
          <summary>Wens bewerken</summary>
          <form action={updateAction} className="gift-wish-editor-form">
            {hiddenContextFields}
            <input type="hidden" name="itemId" value={item.id} />
            <label>
              <span>Type</span>
              <select name="itemType" defaultValue={item.itemType} className="wn-input">
                <option value="text">Zelf iets opschrijven</option>
                <option value="external_link">Productlink</option>
              </select>
            </label>
            <label>
              <span>Wens</span>
              <input name="title" required minLength={2} maxLength={120} defaultValue={item.title} className="wn-input" />
            </label>
            <label>
              <span>Productlink</span>
              <input name="externalUrl" type="url" defaultValue={item.externalUrl} className="wn-input" placeholder="https://..." />
            </label>
            <label>
              <span>Toelichting</span>
              <textarea name="note" rows={3} maxLength={300} defaultValue={item.note} className="wn-input resize-y" />
            </label>
            <button type="submit" className="wn-button wn-button-primary">Wens opslaan</button>
          </form>
        </details>
      ) : null}

      {editable && isWinkelnuProduct && updateProductNoteAction && hasActionContext ? (
        <details className="gift-wish-editor">
          <summary>Toelichting bewerken</summary>
          <form action={updateProductNoteAction} className="gift-wish-editor-form">
            {hiddenContextFields}
            <input type="hidden" name="itemId" value={item.id} />
            <label>
              <span>Toelichting</span>
              <textarea
                name="note"
                rows={3}
                maxLength={300}
                defaultValue={item.note}
                className="wn-input resize-y"
                placeholder="Bijvoorbeeld: liefst zwart"
              />
            </label>
            <button type="submit" className="wn-button wn-button-primary">Toelichting opslaan</button>
          </form>
        </details>
      ) : null}

      {editable && deleteAction && hasActionContext ? (
        <form action={deleteAction} className="gift-wish-card-delete">
          {hiddenContextFields}
          <input type="hidden" name="itemId" value={item.id} />
          <button type="submit">Verwijderen</button>
        </form>
      ) : null}
    </article>
  )
}
