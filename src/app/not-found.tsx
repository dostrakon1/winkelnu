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
          title="Deze pagina is niet gevonden."
          description="De link kan verouderd zijn of de pagina bestaat niet meer. Bekijk onze koopgidsen om verder te zoeken naar informatie die bij je past."
          actionHref="/koopgidsen"
          actionLabel="Bekijk koopgidsen"
          headingLevel="h1"
        />
      </section>
      <WinkelnuFooter />
    </main>
  )
}
