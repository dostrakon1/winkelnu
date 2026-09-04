import type { Metadata } from 'next'
import { LegalPage } from '@/components/storefront/legal-page'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer over prijzen, beschikbaarheid, externe webwinkels en informatie op Winkelnu.',
}

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Juridisch"
      title="Disclaimer"
      intro="Winkelnu doet zijn best om product- en aanbiedingsinformatie duidelijk en actueel te tonen, maar externe webwinkels blijven de bron van de definitieve commerciële voorwaarden."
    >
      <section>
        <h2 className="text-xl font-bold">Geen verkoper</h2>
        <p className="mt-3">Winkelnu verkoopt geen producten namens de aangesloten webwinkels. Een aankoop komt tot stand bij de gekozen webwinkel. Die webwinkel is verantwoordelijk voor betaling, levering, retour, garantie en klantenservice.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Prijzen en beschikbaarheid</h2>
        <p className="mt-3">Prijzen, verzendkosten en voorraad kunnen wijzigen tussen het moment waarop Winkelnu gegevens ontvangt en het moment waarop je de webwinkel bezoekt. De informatie op de website van de webwinkel is daarom leidend voor de uiteindelijke bestelling.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Externe links</h2>
        <p className="mt-3">Winkelnu verwijst naar websites van derden. We zijn niet verantwoordelijk voor de inhoud, beveiliging, beschikbaarheid of voorwaarden van die externe websites.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Affiliate-relaties</h2>
        <p className="mt-3">Sommige uitgaande links zijn affiliate-links. Winkelnu kan een vergoeding ontvangen wanneer je na zo’n verwijzing een aankoop doet. Meer uitleg staat op de pagina Affiliate & vergelijking.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Exploitant</h2>
        <p className="mt-3">Winkelnu.nl wordt geëxploiteerd door Akflow.</p>
      </section>
    </LegalPage>
  )
}
