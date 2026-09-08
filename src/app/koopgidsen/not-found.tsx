import { Breadcrumbs, EditorialShell } from '@/components/storefront/editorial-shell'
import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'

export default function EditorialNotFound() {
  return (
    <EditorialShell>
      <div className="wn-container pt-6">
        <Breadcrumbs items={[{ label: 'Koopgidsen', href: '/koopgidsen' }, { label: 'Niet gevonden' }]} />
      </div>
      <section className="wn-container wn-section">
        <StorefrontEmptyState
          eyebrow="Koopgids niet gevonden"
          title="Deze keuzehulp is niet gevonden."
          description="De link kan verouderd zijn of de keuzehulp bestaat niet meer. Bekijk het overzicht voor onze beschikbare koopgidsen en rubrieken."
          actionHref="/koopgidsen"
          actionLabel="Alle koopgidsen"
          headingLevel="h1"
        />
      </section>
    </EditorialShell>
  )
}
