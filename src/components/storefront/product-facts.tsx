type ProductFactsProps = {
  brand?: string | null
  gtin?: string | null
  mpn?: string | null
  offerCount: number
}

type Fact = {
  label: string
  value: string
}

export function ProductFacts({ brand, gtin, mpn, offerCount }: ProductFactsProps) {
  const facts: Fact[] = [
    ...(brand ? [{ label: 'Merk', value: brand }] : []),
    ...(gtin ? [{ label: 'EAN / GTIN', value: gtin }] : []),
    ...(mpn ? [{ label: 'Fabrikantnummer', value: mpn }] : []),
    { label: 'Aanbiedingen', value: String(offerCount) },
  ]

  return (
    <section aria-labelledby="product-facts-heading" className="mt-8">
      <h2 id="product-facts-heading" className="text-sm font-bold text-[var(--wn-ink)]">
        Productinformatie
      </h2>
      <dl className="mt-3 grid overflow-hidden rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.10)] bg-white sm:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="border-b border-[color:rgba(18,59,58,0.08)] px-4 py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r"
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">{fact.label}</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-[var(--wn-ink)]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
