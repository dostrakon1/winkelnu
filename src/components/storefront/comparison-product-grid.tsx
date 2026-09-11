'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { currentSearchQuery, sendSearchFeedback } from '@/components/analytics/search-feedback-client'
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
  comparisonGroup?: string | null
  price?: string | null
  merchantName?: string | null
  offerCount: number
  availability?: string | null
  shippingKnown?: boolean
}

type ComparisonProductGridProps = {
  items: ComparisonProductGridItem[]
  showIntro?: boolean
  gridClassName?: string
}

export function ComparisonProductGrid({
  items,
  showIntro = true,
  gridClassName = 'grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3',
}: ComparisonProductGridProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const selectedSet = useMemo(() => new Set(selectedSlugs), [selectedSlugs])
  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) {
      if (!item.comparisonGroup) continue
      counts.set(item.comparisonGroup, (counts.get(item.comparisonGroup) ?? 0) + 1)
    }
    return counts
  }, [items])
  const comparableGroups = useMemo(
    () => Array.from(groupCounts.values()).filter((count) => count >= MIN_COMPARISON_PRODUCTS).length,
    [groupCounts],
  )
  const comparableItems = useMemo(
    () => items.filter((item) => Boolean(item.comparisonGroup && (groupCounts.get(item.comparisonGroup) ?? 0) >= MIN_COMPARISON_PRODUCTS)).length,
    [groupCounts, items],
  )
  const selectedGroup = selectedSlugs.length > 0
    ? items.find((item) => item.slug === selectedSlugs[0])?.comparisonGroup ?? null
    : null
  const compareHref = `/vergelijken?producten=${encodeURIComponent(selectedSlugs.join(','))}`

  function toggle(slug: string) {
    setSelectedSlugs((current) => {
      if (current.includes(slug)) return current.filter((candidate) => candidate !== slug)
      const item = items.find((candidate) => candidate.slug === slug)
      if (!item?.comparisonGroup || (groupCounts.get(item.comparisonGroup) ?? 0) < MIN_COMPARISON_PRODUCTS) return current
      const currentGroup = current.length > 0
        ? items.find((candidate) => candidate.slug === current[0])?.comparisonGroup ?? null
        : null
      if (currentGroup && currentGroup !== item.comparisonGroup) return current
      if (current.length >= MAX_COMPARISON_PRODUCTS) return current
      return [...current, slug]
    })
  }

  return (
    <>
      {showIntro ? (
        comparableGroups > 0 ? (
          <div className="mb-7 rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.16)] bg-[var(--wn-petrol-soft)] px-5 py-4 sm:px-6 sm:py-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="wn-eyebrow">Producten vergelijken</p>
                <h2 className="wn-heading mt-2 text-2xl">Zet vergelijkbare modellen direct naast elkaar.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--wn-text-muted)]">
                  In deze categorie zijn {comparableItems} producten van {comparableGroups === 1 ? 'één vergelijkbaar producttype' : `${comparableGroups} vergelijkbare producttypen`} beschikbaar. Kies minimaal twee modellen van hetzelfde type; daarna verschijnt de vergelijkknop onder in beeld.
                </p>
              </div>
              <div className="grid gap-2 text-xs font-semibold text-[var(--wn-petrol-deep)] sm:grid-cols-3 lg:grid-cols-1">
                <span className="rounded-full bg-white/80 px-3 py-2">1. Kies een model</span>
                <span className="rounded-full bg-white/80 px-3 py-2">2. Kies hetzelfde type</span>
                <span className="rounded-full bg-white/80 px-3 py-2">3. Vergelijk verschillen</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-7 rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-white px-5 py-4 text-sm leading-6 text-[var(--wn-text-muted)]">
            Productvergelijking wordt hier automatisch beschikbaar zodra minimaal twee modellen van hetzelfde producttype in de catalogus staan.
          </div>
        )
      ) : null}

      <div className={gridClassName}>
        {items.map((item, itemIndex) => {
          const selected = selectedSet.has(item.slug)
          const hasComparablePeer = Boolean(item.comparisonGroup && (groupCounts.get(item.comparisonGroup) ?? 0) >= MIN_COMPARISON_PRODUCTS)
          const wrongGroup = Boolean(selectedGroup && item.comparisonGroup !== selectedGroup)
          const limitReached = selectedSlugs.length >= MAX_COMPARISON_PRODUCTS && !selected
          const disabled = !selected && (!hasComparablePeer || wrongGroup || limitReached)
          const buttonLabel = selected
            ? '✓ Geselecteerd voor vergelijking'
            : !hasComparablePeer
              ? 'Vergelijken nog niet beschikbaar'
              : wrongGroup
                ? 'Kies hetzelfde producttype'
                : limitReached
                  ? 'Maximaal 4 geselecteerd'
                  : '+ Toevoegen aan vergelijking'

          const comparisonAction = (
            <button
              type="button"
              aria-pressed={selected}
              aria-label={`${buttonLabel}: ${item.title}`}
              disabled={disabled}
              onClick={() => toggle(item.slug)}
              className={`min-h-11 w-full rounded-[var(--wn-radius-lg)] border px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-petrol)] disabled:cursor-not-allowed ${selected ? 'border-[var(--wn-petrol)] bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol-deep)]' : disabled ? 'border-[var(--wn-border)] bg-[var(--wn-cream)] text-[var(--wn-text-muted)] opacity-60' : 'border-[color:rgba(18,59,58,0.28)] bg-transparent text-[var(--wn-petrol)] hover:border-[var(--wn-petrol)] hover:bg-[var(--wn-petrol-soft)]'}`}
            >
              {buttonLabel}
            </button>
          )

          return (
            <div
              key={item.id}
              className="h-full"
              onClickCapture={(event) => {
                if (!(event.target instanceof Element)) return
                if (!event.target.closest('a[href^="/product/"]')) return
                const query = currentSearchQuery()
                if (!query || window.location.pathname !== '/zoeken') return
                sendSearchFeedback({
                  eventType: 'product_clicked',
                  query,
                  targetKind: 'product',
                  targetKey: item.slug,
                  targetPosition: itemIndex + 1,
                })
              }}
            >
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
                secondaryAction={comparisonAction}
              />
            </div>
          )
        })}
      </div>

      {selectedSlugs.length > 0 ? (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.14)] bg-white/95 p-3 shadow-[var(--wn-shadow-md)] backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite" aria-atomic="true">
              <p className="font-bold text-[var(--wn-ink)]">{selectedSlugs.length} van maximaal {MAX_COMPARISON_PRODUCTS} geselecteerd</p>
              <p className="mt-1 text-xs leading-5 text-[var(--wn-text-muted)]">
                {selectedSlugs.length < MIN_COMPARISON_PRODUCTS
                  ? 'Selecteer nog één product van hetzelfde type om de verschillen te zien.'
                  : 'Klaar om vergelijkbare productspecificaties naast elkaar te zetten.'}
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
