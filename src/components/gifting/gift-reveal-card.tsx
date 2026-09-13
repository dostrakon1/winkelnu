'use client'

import { useState, type ReactNode } from 'react'

type GiftRevealCardProps = {
  recipientName: string
  budgetLabel?: string
  dateLabel?: string
  children?: ReactNode
}

export function GiftRevealCard({ recipientName, budgetLabel, dateLabel, children }: GiftRevealCardProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="overflow-hidden rounded-[var(--wn-radius-xl)] border border-white/10 bg-[image:var(--wn-gradient-card-petrol)] p-6 text-white shadow-[var(--wn-shadow-md)] sm:p-9">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/70">Jouw geheime lootje</p>
          {!revealed ? (
            <>
              <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl text-white" aria-hidden="true">✦</div>
              <h2 className="wn-display mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Klaar om je lootje te onthullen?</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/78 sm:text-base">De naam en het verlanglijstje blijven verborgen tot jij op de knop drukt.</p>
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="wn-button wn-button-warm mt-7 min-w-48 shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
              >
                Onthul mijn lootje ✦
              </button>
            </>
          ) : (
            <div className="motion-safe:animate-[fadeIn_.35s_ease-out]" aria-live="polite">
              <p className="mt-8 text-sm font-bold text-white/75">Jij hebt...</p>
              <h2 className="wn-display mt-3 break-words text-5xl font-semibold tracking-[-0.035em] text-white sm:text-6xl">{recipientName}</h2>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-semibold text-white/85">
                {budgetLabel ? <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{budgetLabel}</span> : null}
                {dateLabel ? <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{dateLabel}</span> : null}
              </div>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/78">Bekijk hieronder de wensen. Wat jij als geregeld markeert, blijft verborgen voor {recipientName}.</p>
            </div>
          )}
        </div>
      </section>

      {revealed ? children : null}
    </div>
  )
}
