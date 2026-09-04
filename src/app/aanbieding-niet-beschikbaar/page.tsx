import type { Metadata } from 'next'
import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Aanbieding niet beschikbaar',
  description: 'Deze aanbieding is verlopen of tijdelijk niet beschikbaar. Bekijk Winkelnu voor actuele product- en winkelinformatie.',
  robots: { index: false, follow: true },
}

export default function OfferUnavailablePage() {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="bg-[image:var(--wn-gradient-morning)]">
        <div className="wn-container wn-section">
          <StorefrontEmptyState
            eyebrow="Aanbieding verlopen"
            title="Deze aanbieding is niet meer beschikbaar."
            description="De prijs, voorraad of affiliate-link kan inmiddels zijn gewijzigd. Bekijk de actuele producten en vergelijk opnieuw welke winkelinformatie nu beschikbaar is."
            actionHref="/zoeken"
            actionLabel="Bekijk actuele producten"
          />
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}
