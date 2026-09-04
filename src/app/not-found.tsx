import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <section className="wn-container wn-section">
        <StorefrontEmptyState
          eyebrow="Niet gevonden"
          title="Deze pagina of dit product bestaat niet meer."
          description="De link kan verouderd zijn of het product is niet langer beschikbaar in Winkelnu. Zoek opnieuw of ga terug naar het productoverzicht."
          actionHref="/zoeken"
          actionLabel="Bekijk producten"
          headingLevel="h1"
        />
      </section>
      <WinkelnuFooter />
    </main>
  )
}
