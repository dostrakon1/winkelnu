import type { Metadata } from 'next'
import { LegalPage } from '@/components/storefront/legal-page'

export const metadata: Metadata = {
  title: 'Over Winkelnu',
  description: 'Over Winkelnu.nl en de rol van Akflow als exploitant van het vergelijkingsplatform.',
}

export default function AboutWinkelnuPage() {
  return (
    <LegalPage
      eyebrow="Over ons"
      title="Over Winkelnu"
      intro="Winkelnu.nl is een onafhankelijk opgezet vergelijkings- en discoveryplatform dat producten en aanbiedingen van verschillende webwinkels overzichtelijk bij elkaar brengt."
    >
      <section>
        <h2 className="text-xl font-bold">Wat Winkelnu doet</h2>
        <p className="mt-3">Winkelnu helpt bezoekers ontdekken, vergelijken en vervolgens zelf een webwinkel kiezen. We bouwen rond een merchant-onafhankelijke productlaag zodat meerdere aanbiedingen bij hetzelfde product kunnen worden vergeleken.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Wat Winkelnu niet doet</h2>
        <p className="mt-3">Winkelnu is geen verkoper en verwerkt geen betaling voor de externe aanbiedingen die we tonen. Bestellen, betalen, levering, retour en garantie verlopen bij de gekozen webwinkel.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Exploitant</h2>
        <p className="mt-3">Winkelnu.nl wordt geëxploiteerd door Akflow. Akflow staat ingeschreven bij de Kamer van Koophandel onder nummer 42111391.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Contact</h2>
        <p className="mt-3">Voor algemene vragen over Winkelnu of vragen over privacy kun je contact opnemen via <a className="font-semibold underline underline-offset-4" href="mailto:info@akflow.nl">info@akflow.nl</a>.</p>
      </section>
    </LegalPage>
  )
}
