import type { ProductSource, ProductSpecification } from '@/domain/catalog/types'

type ProductFactsProps = {
  brand?: string | null
  gtin?: string | null
  mpn?: string | null
  offerCount: number
  specifications?: ProductSpecification[]
  source?: ProductSource
}

type Fact = {
  label: string
  value: string
}

function formatCheckedAt(value?: string): string | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export function ProductFacts({ brand, gtin, mpn, offerCount, specifications = [], source }: ProductFactsProps) {
  const facts: Fact[] = [
    ...(brand ? [{ label: 'Merk', value: brand }] : []),
    ...(gtin ? [{ label: 'EAN / GTIN', value: gtin }] : []),
    ...(mpn ? [{ label: 'Fabrikantnummer', value: mpn }] : []),
    ...specifications,
    { label: 'Aanbiedingen', value: String(offerCount) },
  ]
  const checkedAt = formatCheckedAt(source?.checkedAt)

  return (
    <section aria-labelledby="product-facts-heading" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="product-facts-heading" className="text-sm font-bold text-[var(--wn-ink)]">
          Productinformatie
        </h2>
        {source ? (
          <p className="text-xs leading-5 text-[var(--wn-text-muted)]">
            Bron:{' '}
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--wn-petrol)] underline decoration-[color:rgba(18,59,58,0.25)] underline-offset-4 hover:decoration-current">
              {source.label}
            </a>
            {checkedAt ? ` · gecontroleerd ${checkedAt}` : ''}
          </p>
        ) : null}
      </div>
      <dl className="mt-3 grid overflow-hidden rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.10)] bg-white sm:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={`${fact.label}:${fact.value}`}
            className="border-b border-[color:rgba(18,59,58,0.08)] px-4 py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r"
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">{fact.label}</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-[var(--wn-ink)]">{fact.value}</dd>
          </div>
        ))}
      </dl>
      {source ? <p className="mt-3 text-xs leading-5 text-[var(--wn-text-muted)]">Specificaties zijn informatief en kunnen per uitvoering verschillen. Controleer bij aankoop altijd de exacte modelcode bij de webwinkel.</p> : null}
    </section>
  )
}
