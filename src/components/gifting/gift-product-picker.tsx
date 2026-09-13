import Link from 'next/link'
import type { GiftCatalogProductView } from '@/application/gifting/gift-catalog'

type GiftProductPickerProps = {
  shareCode: string
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
  query,
  products,
  addedProductKeys,
  addAction,
}: GiftProductPickerProps) {
  const added = new Set(addedProductKeys)
  const hasQuery = Boolean(query && query.trim().length >= 2)

  return (
    <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)] sm:p-6">
      <div>
        <p className="wn-eyebrow">Zoek op Winkelnu</p>
        <h2 className="wn-heading mt-2 text-2xl">Zet een Winkelnu-product op je lijstje.</h2>
        <p className="wn-body-muted mt-2 text-sm leading-6">
          Zoek in dezelfde productcatalogus als de rest van Winkelnu. De productidentiteit wordt server-side gecontroleerd voordat de wens wordt opgeslagen.
        </p>
      </div>

      <form method="get" className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Zoek een product op Winkelnu</span>
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
        <button type="submit" className="wn-button wn-button-primary shrink-0">
          Zoeken
        </button>
      </form>

      {!hasQuery ? (
        <div className="mt-5 rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4 text-sm leading-6 text-[var(--wn-text-muted)]">
          Typ minimaal twee tekens om producten te vinden.
        </div>
      ) : products.length === 0 ? (
        <div className="mt-5 rounded-[var(--wn-radius-lg)] border border-dashed border-[color:rgba(18,59,58,0.24)] bg-[var(--wn-cream)] p-5 text-sm leading-6 text-[var(--wn-text-muted)]">
          Geen passend Winkelnu-product gevonden voor <strong className="text-[var(--wn-petrol-deep)]">{query}</strong>. Je kunt hieronder nog steeds zelf een wens of externe productlink toevoegen.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {products.map((product) => {
            const isAdded = added.has(product.productExternalKey)
            return (
              <article
                key={product.productExternalKey}
                className="flex min-h-full flex-col rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-[var(--wn-cream)] p-5"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--wn-text-muted)]">
                      {product.brand ?? 'Winkelnu-product'}
                    </p>
                    <h3 className="wn-ui-heading mt-1 text-lg leading-6">{product.title}</h3>
                    <p className="mt-2 text-sm font-bold text-[var(--wn-petrol-deep)]">
                      {product.priceCents !== undefined
                        ? `Vanaf ${money(product.priceCents)}`
                        : 'Nog geen gecontroleerde winkelprijs'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/product/${encodeURIComponent(product.slug)}`}
                    className="inline-flex min-h-10 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline"
                  >
                    Bekijk product →
                  </Link>
                  {product.offerCount > 0 ? (
                    <span className="text-xs font-semibold text-[var(--wn-text-muted)]">
                      {product.offerCount === 1 ? '1 gecontroleerde aanbieding' : `${product.offerCount} gecontroleerde aanbiedingen`}
                    </span>
                  ) : null}
                </div>

                <form action={addAction} className="mt-auto pt-5">
                  <input type="hidden" name="shareCode" value={shareCode} />
                  <input type="hidden" name="productSlug" value={product.slug} />
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[var(--wn-petrol-deep)]">
                      Toelichting <span className="font-normal text-[var(--wn-text-muted)]">(optioneel)</span>
                    </span>
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
                    className="wn-button wn-button-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-55"
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
