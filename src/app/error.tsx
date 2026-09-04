'use client'

import Link from 'next/link'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] px-4 py-10 text-[var(--wn-ink)] sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-2xl font-bold tracking-tight text-[var(--wn-petrol)]">Winkelnu</Link>
        <section className="wn-surface relative mt-10 overflow-hidden p-7 sm:p-10">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[color:rgba(233,120,61,0.12)]" aria-hidden="true" />
          <div className="relative max-w-xl">
            <p className="wn-eyebrow">Er ging iets mis</p>
            <h1 className="wn-heading mt-3 text-3xl sm:text-4xl">Deze informatie kon niet worden geladen.</h1>
            <p className="wn-body-muted mt-4 leading-7">
              Probeer het opnieuw. Blijft het probleem bestaan, ga dan terug naar Winkelnu en start een nieuwe zoekopdracht.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={reset} className="wn-button wn-button-primary">Opnieuw proberen</button>
              <Link href="/zoeken" className="wn-button wn-button-secondary">Naar producten</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
