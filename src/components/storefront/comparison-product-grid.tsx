'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ProductVisualKind } from '@/domain/catalog/types'
import { MAX_COMPARISON_PRODUCTS, MIN_COMPARISON_PRODUCTS } from '@/domain/catalog/comparison'
import { ProductCard } from './product-card'

export type ComparisonProductGridItem = {
  id: string
  slug: string
  title: string
  brand?: string | null
  description?: string | null
  imageUrl?: string | null
  visualKind?: ProductVisualKind
  price?: string | null
  merchantName?: string | null
  offerCount: number
  availability?: string | null
  shippingKnown?: boolean
}

type ComparisonProductGridProps = {
  items: ComparisonProductGridItem[]
}

export function ComparisonProductGrid({ items }: ComparisonProductGridProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const selectedSet = useMemo(() => new Set(selectedSlugs), [selectedSlugs])
  const compareHref = `/vergelijken?producten=${encodeURIComponent(selectedSlugs.join(','))}`

  function toggle(slug: string) {
    setSelectedSlugs((current) => {
      if (current.includes(slug)) return current.filter((candidate) => candidate !== slug)
      if (current.length >= MAX_COMPARISON_PRODUCTS) return current
      return [...current, slug]
    })
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {items.map((item) => {
          const selected = selectedSet.has(item.slug)
          const limitReached = selectedSlugs.length >= MAX_COMPARISON_PRODUCTS && !selected

          return (
            <div key={item.id} className="flex min-w-0 flex-col gap-2">
              <ProductCard
                slug={item.slug}
                title={item.title}
                brand={item.brand}
                description={item.description}
                imageUrl={item.imageUrl}
                visualKind={item.visualKind}
                price={item.price}
                merchantName={item.merchantName}
                offerCount={item.offerCount}
                availability={item.availability}
                shippingKnown={item.shippingKnown}
              />
              <button
                type="button"
                aria-pressed={selected}
                disabled={limitReached}
                onClick={() => toggle(item.slug)}
                className={`min-h-11 rounded-[var(--wn-radius-lg)] border px-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-petrol)] disabled:cursor-not-allowed disabled:opacity-45 ${selected ? 'border-[var(--wn-petrol)] bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol-deep)]' : 'border-[var(--wn-border)] bg-white text-[var(--wn-petrol)] hover:border-[var(--wn-petrol)]'}`}
              >
                {selected ? '✓ Geselecteerd voor vergelijking' : limitReached ? 'Maximaal 4 producten' : '+ Toevoegen aan vergelijking'}
              </button>
            </div>
          )
        })}
      </div>

      {selectedSlugs.length > 0 ? (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.14)] bg-white/95 p-3 shadow-[var(--wn-shadow-md)] backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-4" role="status" aria-live="polite">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-[var(--wn-ink)]">{selectedSlugs.length} van maximaal {MAX_COMPARISON_PRODUCTS} geselecteerd</p>
              <p className="mt-1 text-xs leading-5 text-[var(--wn-text-muted)]">
                {selectedSlugs.length < MIN_COMPARISON_PRODUCTS
                  ? 'Selecteer nog één product om de verschillen naast elkaar te zien.'
                  : 'Klaar om productspecificaties naast elkaar te zetten.'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedSlugs([])}
                className="wn-button wn-button-secondary flex-1 sm:flex-none"
              >
                Wissen
              </button>
              {selectedSlugs.length >= MIN_COMPARISON_PRODUCTS ? (
                <Link href={compareHref} className="wn-button wn-button-primary flex-1 sm:flex-none">
                  Vergelijk {selectedSlugs.length} producten →
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
