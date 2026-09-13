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

  const hiddenContextFields = Object.entries(actionContext).map(([name, value]) => (
    <input key={name} type="hidden" name={name} value={value} />
  ))

  return (
    <article className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--wn-text-muted)]">
            {isWinkelnuProduct ? 'Winkelnu-product' : item.itemType === 'external_link' ? 'Productlink' : 'Wens'}
          </p>
          {isWinkelnuProduct && productView?.brand ? (
            <p className="mt-2 text-xs font-semibold text-[var(--wn-text-muted)]">{productView.brand}</p>
          ) : null}
          <h3 className="wn-ui-heading mt-1 text-lg leading-7">{displayTitle}</h3>
          {isWinkelnuProduct ? (
            <p className="mt-2 text-sm font-bold text-[var(--wn-petrol-deep)]">
              {currentPrice !== undefined
                ? `Vanaf ${money(currentPrice)}`
                : snapshotPrice !== undefined
                  ? `Prijs bij toevoegen: ${money(snapshotPrice)}`
                  : 'Nog geen gecontroleerde winkelprijs'}
            </p>
          ) : null}
          {item.note ? <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">{item.note}</p> : null}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-lg text-[var(--wn-petrol)]" aria-hidden="true">
          {item.itemType === 'external_link' ? '↗' : '✦'}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isWinkelnuProduct ? (
          productView ? (
            <Link
              href={`/product/${encodeURIComponent(productView.slug)}`}
              className="inline-flex min-h-10 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline"
            >
              Bekijk op Winkelnu →
            </Link>
          ) : (
            <Link
              href={`/zoeken?q=${encodeURIComponent(item.title)}`}
              className="inline-flex min-h-10 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline"
            >
              Zoek een alternatief →
            </Link>
          )
        ) : item.externalUrl ? (
          <Link
            href={item.externalUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex min-h-10 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline"
          >
            Bekijk productlink ↗
          </Link>
        ) : null}

        {isWinkelnuProduct && !productView ? (
          <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Niet meer in de huidige Winkelnu-catalogus.</span>
        ) : null}

        {editable && !isWinkelnuProduct && updateAction && hasActionContext ? (
          <details className="w-full border-t border-[var(--wn-border)] pt-3">
            <summary className="cursor-pointer text-sm font-bold text-[var(--wn-petrol)] hover:underline">Wens bewerken</summary>
            <form action={updateAction} className="mt-4 space-y-4">
              {hiddenContextFields}
              <input type="hidden" name="itemId" value={item.id} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[var(--wn-petrol-deep)]">Type</span>
                <select name="itemType" defaultValue={item.itemType} className="wn-input">
                  <option value="text">Zelf iets opschrijven</option>
                  <option value="external_link">Productlink</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[var(--wn-petrol-deep)]">Wens</span>
                <input name="title" required minLength={2} maxLength={120} defaultValue={item.title} className="wn-input" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[var(--wn-petrol-deep)]">Productlink</span>
                <input name="externalUrl" type="url" defaultValue={item.externalUrl} className="wn-input" placeholder="https://..." />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[var(--wn-petrol-deep)]">Toelichting</span>
                <textarea name="note" rows={3} maxLength={300} defaultValue={item.note} className="wn-input resize-y" />
              </label>
              <button type="submit" className="wn-button wn-button-primary">Wens opslaan</button>
            </form>
          </details>
        ) : null}

        {editable && isWinkelnuProduct && updateProductNoteAction && hasActionContext ? (
          <details className="w-full border-t border-[var(--wn-border)] pt-3">
            <summary className="cursor-pointer text-sm font-bold text-[var(--wn-petrol)] hover:underline">Toelichting bewerken</summary>
            <form action={updateProductNoteAction} className="mt-4 space-y-4">
              {hiddenContextFields}
              <input type="hidden" name="itemId" value={item.id} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[var(--wn-petrol-deep)]">Toelichting</span>
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
          <form action={deleteAction} className="ml-auto">
            {hiddenContextFields}
            <input type="hidden" name="itemId" value={item.id} />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-[var(--wn-text-muted)] transition hover:bg-[var(--wn-cream)] hover:text-[var(--wn-petrol-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-warm)]"
            >
              Verwijderen
            </button>
          </form>
        ) : null}
      </div>
    </article>
  )
}
