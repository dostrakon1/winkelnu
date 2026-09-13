'use client'

import { useState } from 'react'

type GiftRevealCardProps = {
  recipientName: string
  budgetLabel?: string
  dateLabel?: string
}

export function GiftRevealCard({ recipientName, budgetLabel, dateLabel }: GiftRevealCardProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <section className="overflow-hidden rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-petrol-deep)] p-6 text-white shadow-[var(--wn-shadow-sm)] sm:p-9">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/65">Jouw geheime lootje</p>
        {!revealed ? (
          <>
            <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl" aria-hidden="true">✦</div>
            <h2 className="wn-heading mt-6 text-3xl text-white sm:text-4xl">Klaar om te kijken?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">Alleen jij kunt deze uitkomst via jouw persoonlijke deelnemerstoegang bekijken.</p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="wn-button mt-7 bg-white text-[var(--wn-petrol-deep)] hover:bg-[var(--wn-cream)]"
            >
              Onthul mijn lootje ✦
            </button>
          </>
        ) : (
          <div className="motion-safe:animate-[fadeIn_.35s_ease-out]">
            <p className="mt-8 text-sm font-bold text-white/70">Jij hebt...</p>
            <h2 className="wn-heading mt-3 break-words text-5xl text-white sm:text-6xl">{recipientName}</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-semibold text-white/80">
              {budgetLabel ? <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{budgetLabel}</span> : null}
              {dateLabel ? <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{dateLabel}</span> : null}
            </div>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/75">Bekijk hieronder de wensen. Wat jij als geregeld markeert, blijft verborgen voor {recipientName}.</p>
          </div>
        )}
      </div>
    </section>
  )
}
