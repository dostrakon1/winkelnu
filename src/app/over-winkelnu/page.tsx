import type { Metadata } from 'next'
import { LegalPage } from '@/components/storefront/legal-page'
import { OperatorDetails } from '@/components/storefront/operator-details'
import { operator } from '@/content/operator'

export const metadata: Metadata = {
  title: 'Over Winkelnu',
  description: 'Over Winkelnu.nl, onze redactionele keuzehulpen en Akflow als exploitant.',
  alternates: { canonical: '/over-winkelnu' },
}

export default function AboutWinkelnuPage() {
  return (
    <LegalPage
      eyebrow="Over ons"
      title="Over Winkelnu"
      intro="Winkelnu helpt je bewuster kiezen. We publiceren praktische koopgidsen en ontwikkelen daarnaast een platform om producten en aanbiedingen van verschillende webwinkels te vergelijken."
    >
      <section>
        <h2 className="text-xl font-bold">Wat Winkelnu nu doet</h2>
        <p className="mt-3">Onze redactionele koopgidsen helpen je bepalen welke eigenschappen, gebruikskosten en praktische verschillen belangrijk zijn. De gidsen zijn geen eigen laboratoriumtests of actuele productranglijsten. De koppeling met webwinkels voor actuele aanbiedingen is nog in ontwikkeling.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Wat Winkelnu niet doet</h2>
        <p className="mt-3">Winkelnu is geen verkoper van de externe producten en verwerkt daarvoor geen betaling. Wanneer aanbiedingen beschikbaar komen, vinden bestellen, betalen, levering, retour en garantie plaats bij de gekozen webwinkel. Winkelnu blijft de vergelijkings- en doorverwijslaag.</p>
      </section>
      <section id="exploitant" className="scroll-mt-8">
        <h2 className="text-xl font-bold">Exploitant en bedrijfsgegevens</h2>
        <p className="mt-3">Winkelnu.nl wordt geëxploiteerd door {operator.tradeName}, de eenmanszaak van {operator.legalName}. Winkelnu is een handelsplatform van deze onderneming en geen afzonderlijke rechtspersoon.</p>
        <OperatorDetails />
        <p className="wn-body-muted mt-3 text-sm">Het vermelde adres is een correspondentieadres en geen bezoekadres. Voor vragen of correspondentie kun je contact opnemen via het bovenstaande e-mailadres.</p>
      </section>
    </LegalPage>
  )
}
