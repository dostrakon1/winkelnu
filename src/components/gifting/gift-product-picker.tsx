import Link from 'next/link'
import type { GiftCatalogProductView } from '@/application/gifting/gift-catalog'

type GiftProductPickerProps = {
  shareCode?: string
  contextFields?: Record<string, string>
  query?: string
  products: GiftCatalogProductView[]
  addedProductKeys: string[]
  addAction: (formData: FormData) => void | Promise<void>
}

function money(cents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

export function GiftProductPicker({
  shareCode,
  contextFields,
  query,
  products,
  addedProductKeys,
  addAction,
}: GiftProductPickerProps) {
  const added = new Set(addedProductKeys)
  const hasQuery = Boolean(query && query.trim().length >= 2)
  const hiddenFields = contextFields ?? (shareCode ? { shareCode } : {})

  return (
    <section id="zoeken" className="gift-wishlist-panel gift-product-picker">
      <div className="gift-wishlist-panel-head">
        <div>
          <p className="gift-kicker">Zoek op Winkelnu</p>
          <h2>Vind een product en zet het direct op je lijst.</h2>
          <p>Zoek op product, merk of type cadeau. Je kunt daarna nog een persoonlijke toelichting toevoegen.</p>
        </div>
        <span className="gift-product-picker-badge">Winkelnu</span>
      </div>

      <form method="get" className="gift-product-search">
        <label>
          <span className="sr-only">Zoek een product op Winkelnu</span>
          <span className="gift-product-search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            name="productZoek"
            defaultValue={query}
            minLength={2}
            maxLength={120}
            className="wn-input"
            placeholder="Bijvoorbeeld koptelefoon, airfryer of Bosch"
          />
        </label>
        <button type="submit" className="wn-button wn-button-primary">Zoeken</button>
      </form>

      {!hasQuery ? (
        <div className="gift-product-picker-hint">
          <span aria-hidden="true">✦</span>
          <p><strong>Begin met zoeken.</strong> Typ minimaal twee tekens om passende producten te vinden.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="gift-product-picker-empty">
          <span aria-hidden="true">?</span>
          <div>
            <strong>Geen passend Winkelnu-product gevonden voor “{query}”.</strong>
            <p>Geen probleem — hieronder kun je nog steeds zelf een wens of externe productlink toevoegen.</p>
          </div>
        </div>
      ) : (
        <div className="gift-product-results">
          {products.map((product) => {
            const isAdded = added.has(product.productExternalKey)
            return (
              <article key={product.productExternalKey} className="gift-product-result" data-added={isAdded ? 'true' : 'false'}>
                <div className="gift-product-result-top">
                  <span className="gift-product-result-mark" aria-hidden="true">✦</span>
                  <div className="min-w-0">
                    <p className="gift-product-result-brand">{product.brand ?? 'Winkelnu-product'}</p>
                    <h3>{product.title}</h3>
                    <p className="gift-product-result-price">
                      {product.priceCents !== undefined
                        ? `Vanaf ${money(product.priceCents)}`
                        : 'Nog geen gecontroleerde winkelprijs'}
                    </p>
                  </div>
                </div>

                <div className="gift-product-result-meta">
                  <Link href={`/product/${encodeURIComponent(product.slug)}`}>Bekijk product →</Link>
                  {product.offerCount > 0 ? (
                    <span>{product.offerCount === 1 ? '1 aanbieding' : `${product.offerCount} aanbiedingen`}</span>
                  ) : <span>Productinformatie</span>}
                </div>

                <form action={addAction} className="gift-product-result-form">
                  {Object.entries(hiddenFields).map(([name, value]) => (
                    <input key={name} type="hidden" name={name} value={value} />
                  ))}
                  <input type="hidden" name="productSlug" value={product.slug} />
                  <label>
                    <span>Persoonlijke toelichting <small>optioneel</small></span>
                    <input
                      name="note"
                      maxLength={300}
                      className="wn-input"
                      placeholder="Bijvoorbeeld: liefst zwart"
                      disabled={isAdded}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isAdded}
                    className="wn-button wn-button-primary disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {isAdded ? 'Staat al op mijn lijstje ✓' : '+ Zet op mijn lijstje'}
                  </button>
                </form>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
