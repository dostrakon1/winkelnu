import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Aanbieding niet beschikbaar',
  robots: { index: false, follow: true },
}

export default function OfferUnavailablePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Winkelnu.nl</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
          Deze aanbieding is niet meer beschikbaar.
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600">
          De aanbieding kan zijn verlopen of tijdelijk niet beschikbaar zijn. Bekijk het product opnieuw om actuele aanbiedingen te vergelijken.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Terug naar Winkelnu
        </Link>
      </section>
    </main>
  )
}
