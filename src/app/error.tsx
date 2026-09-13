'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ErrorPage() {
  const pathname = usePathname()
  const isGiftingRoute = pathname.startsWith('/lootje-lijstje')

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
              Probeer de pagina opnieuw te laden. Blijft het probleem bestaan, ga dan veilig terug en probeer het later nog een keer.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => window.location.reload()} className="wn-button wn-button-primary">Nogmaals laden</button>
              <Link href={isGiftingRoute ? '/lootje-lijstje' : '/zoeken'} className="wn-button wn-button-secondary">
                {isGiftingRoute ? 'Naar Lootje & Lijstje' : 'Naar producten'}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
