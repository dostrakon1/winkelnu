import type { Metadata } from 'next'
import { LegalPage } from '@/components/storefront/legal-page'

export const metadata: Metadata = {
  title: 'Hoe Winkelnu werkt',
  description: 'Hoe Winkelnu vergelijkt, hoe commerciële links werken en waar je een product koopt.',
  alternates: { canonical: '/affiliate-en-vergelijking' },
}

export default function AffiliateComparisonPage() {
  return (
    <LegalPage
      eyebrow="Onze werkwijze"
      title="Hoe Winkelnu werkt"
      intro="Winkelnu helpt je producten en aanbiedingen te ontdekken en te vergelijken. Je kiest zelf bij welke webwinkel je koopt."
    >
      <section>
        <h2 className="text-xl font-bold">Zo vergelijken we</h2>
        <p className="mt-3">Onze koopgidsen helpen je bij het kiezen van eigenschappen die voor jou belangrijk zijn. Ze zijn geen eigen laboratoriumtests of actuele productranglijsten.</p>
        <p className="mt-3">Wanneer actuele aanbiedingen beschikbaar zijn, vergelijken we op basis van onder meer prijs, bekende verzendkosten, beschikbaarheid en de filters of sortering die je kiest. We vermelden wanneer verzendkosten onbekend zijn. De definitieve prijs en voorwaarden controleer je bij de webwinkel.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Hoe Winkelnu geld verdient</h2>
        <p className="mt-3">Winkelnu kan een vergoeding ontvangen wanneer je via een commerciële link doorklikt of een aankoop doet. Zo kunnen we het platform onderhouden. Bij commerciële aanbevelingen maken we duidelijk dat er een affiliate-relatie is. De hoogte van de vergoeding bepaalt niet de normale volgorde van onze vergelijkingsresultaten.</p>
        <p className="mt-3">Betaalde plaatsingen, als we die later introduceren, worden herkenbaar als gesponsord aangeduid. Ze worden niet als onafhankelijke resultaten gepresenteerd.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Je koopt bij de webwinkel</h2>
        <p className="mt-3">Winkelnu is geen verkoper van de producten waarnaar we verwijzen. Bestellen, betalen, levering, retour, garantie en klantenservice verlopen via de gekozen webwinkel.</p>
      </section>
    </LegalPage>
  )
}
