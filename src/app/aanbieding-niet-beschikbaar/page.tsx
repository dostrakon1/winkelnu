import type { Metadata } from 'next'
import Link from 'next/link'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Aanbieding niet beschikbaar',
  description: 'Deze aanbieding is momenteel niet beschikbaar. Lees onze koopgidsen of zoek verder naar een passend product.',
  robots: { index: false, follow: true },
}

export default function UnavailableOfferPage() {
  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main className="wn-container wn-section">
        <div className="wn-surface mx-auto max-w-2xl p-8 sm:p-12">
          <p className="wn-eyebrow">Nog niet beschikbaar</p>
          <h1 className="wn-heading mt-4 text-3xl sm:text-4xl">Deze aanbieding is momenteel niet beschikbaar.</h1>
          <p className="wn-body-muted mt-5 leading-8">
            Winkelnu toont alleen aanbiedingen wanneer de prijs- en winkelgegevens voldoende betrouwbaar zijn. Daarom laten we hier nu geen actuele prijs of voorraadstatus zien.
          </p>
          <p className="wn-body-muted mt-4 leading-8">
            Gebruik onze koopgidsen om te bepalen welke eigenschappen belangrijk zijn, of zoek verder naar een ander product dat bij je past.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/koopgidsen" className="wn-button wn-button-primary">Lees de koopgidsen</Link>
            <Link href="/zoeken" className="wn-button wn-button-secondary">Verder zoeken</Link>
          </div>
        </div>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
