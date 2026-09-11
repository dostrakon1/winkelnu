'use client'

import { useId, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import Link from 'next/link'
import {
  analyzePredictiveSearch,
  type PredictiveSearchIndexItem,
} from '@/application/search/predictive-search-core'

type Props = {
  defaultValue?: string
  index: readonly PredictiveSearchIndexItem[]
}

export function PredictiveSearchBox({ defaultValue = '', index }: Props) {
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const listboxId = useId()

  const analysis = useMemo(
    () => analyzePredictiveSearch(value, index, 6),
    [value, index],
  )
  const suggestions = analysis.suggestions
  const showPanel = open && value.trim().length >= 2

  function moveActive(direction: 1 | -1) {
    if (suggestions.length === 0) return
    setActiveIndex((current) => {
      if (current < 0) return direction === 1 ? 0 : suggestions.length - 1
      return (current + direction + suggestions.length) % suggestions.length
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveActive(1)
      setOpen(true)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveActive(-1)
      setOpen(true)
      return
    }
    if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    if (event.key === 'Enter' && showPanel && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault()
      window.location.assign(suggestions[activeIndex].href)
    }
  }

  return (
    <form action="/zoeken" method="get" role="search" className="mx-auto mt-9 max-w-5xl">
      <div className="relative">
        <div className="flex items-center gap-2 rounded-[2rem] bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.20)] sm:p-3">
          <span className="hidden pl-3 text-2xl text-[var(--wn-petrol)] sm:block" aria-hidden="true">⌕</span>
          <input
            type="search"
            name="q"
            value={value}
            autoComplete="off"
            placeholder="Zoek bijvoorbeeld laptop voor studie, koffer handbagage of cadeau voor vader…"
            aria-label="Zoek op Winkelnu"
            aria-autocomplete="list"
            aria-controls={showPanel ? listboxId : undefined}
            aria-expanded={showPanel}
            aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            onChange={(event) => {
              setValue(event.target.value)
              setActiveIndex(-1)
              setOpen(true)
            }}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base font-medium text-[var(--wn-ink)] outline-none placeholder:text-[var(--wn-text-muted)] sm:px-4 sm:py-4 sm:text-xl"
          />
          <button type="submit" className="wn-button wn-button-primary min-h-12 shrink-0 rounded-full px-5 sm:min-h-14 sm:px-8">
            Zoeken →
          </button>
        </div>

        {showPanel ? (
          <div
            id={listboxId}
            role="listbox"
            aria-label="Winkelnu Zoeksuggesties"
            className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded-[1.6rem] border border-white/25 bg-white text-left text-[var(--wn-ink)] shadow-[0_30px_90px_rgba(0,0,0,0.24)]"
          >
            <div className="border-b border-[var(--wn-border)] bg-[var(--wn-petrol-soft)] px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[var(--wn-petrol)]">Zoekkompas live</span>
                {analysis.correctedTerm ? (
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[var(--wn-petrol-deep)]">
                    Bedoel je: {analysis.correctedTerm}?
                  </span>
                ) : null}
                {analysis.intents.slice(0, 3).map((intent) => (
                  <span key={intent.key} className="rounded-full border border-[color:rgba(18,59,58,0.10)] bg-white/75 px-2.5 py-1 text-xs font-semibold text-[var(--wn-text-muted)]">
                    {intent.label}
                  </span>
                ))}
              </div>
              {analysis.productTerm && analysis.productTerm !== analysis.normalizedTerm ? (
                <p className="mt-2 text-xs leading-5 text-[var(--wn-text-muted)]">
                  Productzoekterm: <strong className="text-[var(--wn-petrol-deep)]">{analysis.productTerm}</strong>
                </p>
              ) : null}
            </div>

            {suggestions.length > 0 ? (
              <div className="max-h-[min(62vh,29rem)] overflow-y-auto p-2">
                {suggestions.map((suggestion, indexPosition) => (
                  <Link
                    key={`${suggestion.kind}:${suggestion.href}`}
                    id={`${listboxId}-${indexPosition}`}
                    role="option"
                    aria-selected={activeIndex === indexPosition}
                    href={suggestion.href}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(indexPosition)}
                    className={`flex items-start justify-between gap-4 rounded-[1.15rem] px-4 py-3.5 transition ${activeIndex === indexPosition ? 'bg-[var(--wn-petrol-soft)]' : 'hover:bg-[color:rgba(18,59,58,0.045)]'}`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[var(--wn-petrol)]">{suggestion.eyebrow}</span>
                        {suggestion.reason === 'fuzzy' ? <span className="text-[0.65rem] font-semibold text-[var(--wn-text-muted)]">typo herkend</span> : null}
                        {suggestion.reason === 'intent' ? <span className="text-[0.65rem] font-semibold text-[var(--wn-text-muted)]">past bij je vraag</span> : null}
                      </div>
                      <p className="mt-1 truncate font-black tracking-[-0.015em] text-[var(--wn-ink)]">{suggestion.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--wn-text-muted)]">{suggestion.description}</p>
                    </div>
                    <span className="mt-1 shrink-0 text-lg text-[var(--wn-petrol)]" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-5 sm:px-6">
                <p className="font-bold">Geen directe route gevonden.</p>
                <p className="mt-1 text-sm leading-6 text-[var(--wn-text-muted)]">Druk op Enter om gewoon door de productcatalogus te zoeken.</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-t border-[var(--wn-border)] bg-[color:rgba(248,249,247,0.82)] px-5 py-3 text-xs text-[var(--wn-text-muted)] sm:px-6">
              <span>↑ ↓ kiezen · Enter openen · Esc sluiten</span>
              <button type="submit" className="font-bold text-[var(--wn-petrol)] hover:underline">Zoek “{value.trim()}”</button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  )
}
