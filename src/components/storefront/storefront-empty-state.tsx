'use client'

import { useEffect } from 'react'
import { currentSearchQuery, sendSearchFeedback } from '@/components/analytics/search-feedback-client'
import { WinkelnuMark } from './winkelnu-brand'
import { WinkelnuButton } from './winkelnu-button'

type StorefrontEmptyStateProps = {
  eyebrow?: string
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  headingLevel?: 'h1' | 'h2' | 'h3'
}

export function StorefrontEmptyState({
  eyebrow = 'Nog niets gevonden',
  title,
  description,
  actionHref,
  actionLabel,
  headingLevel = 'h2',
}: StorefrontEmptyStateProps) {
  const Heading = headingLevel

  useEffect(() => {
    const isSearchZeroState = actionHref === '/zoeken' && actionLabel === 'Nieuwe zoekopdracht'
    if (!isSearchZeroState) return
    if (document.querySelector('[data-search-feedback-impression="1"]')) return

    const query = currentSearchQuery()
    if (!query) return

    sendSearchFeedback({
      eventType: 'search_performed',
      query,
      zeroResults: true,
      bestMatchCount: 0,
    })
  }, [actionHref, actionLabel])

  return (
    <section className="wn-surface relative overflow-hidden p-7 sm:p-9">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color:rgba(233,120,61,0.10)]" aria-hidden="true" />
      <div className="absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-[color:rgba(18,59,58,0.05)]" aria-hidden="true" />
      <div className="relative max-w-xl">
        <WinkelnuMark className="mb-5" />
        <p className="wn-eyebrow">{eyebrow}</p>
        <Heading className="wn-heading mt-3 text-2xl sm:text-3xl">{title}</Heading>
        <p className="wn-body-muted mt-3 leading-7">{description}</p>
        {actionHref && actionLabel ? (
          <WinkelnuButton href={actionHref} variant="secondary" className="mt-6">
            {actionLabel}
          </WinkelnuButton>
        ) : null}
      </div>
    </section>
  )
}
