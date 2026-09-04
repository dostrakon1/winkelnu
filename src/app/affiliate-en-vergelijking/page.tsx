import type { Metadata } from 'next'
import { LegalPage } from '@/components/storefront/legal-page'

export const metadata: Metadata = {
  title: 'Affiliate & vergelijking',
  description: 'Hoe Winkelnu aanbiedingen vergelijkt, affiliate-links gebruikt en gesponsorde plaatsingen behandelt.',
  alternates: { canonical: '/affiliate-en-vergelijking' },
}

export default function AffiliateComparisonPage() {
  return (
    <LegalPage
      eyebrow="Transparantie"
      title="Affiliate & vergelijking"
      intro="Winkelnu helpt je producten en aanbiedingen van verschillende webwinkels te vergelijken. We verkopen de producten niet zelf en verdienen in sommige gevallen een vergoeding wanneer je via Winkelnu naar een webwinkel gaat en daar iets koopt."
    >
      <section>
        <h2 className="text-xl font-bold">Hoe Winkelnu geld verdient</h2>
        <p className="mt-3">Sommige links op Winkelnu zijn affiliate-links. Als je via zo’n link iets koopt, kan Winkelnu een vergoeding ontvangen van de webwinkel of het affiliatenetwerk. Dat verhoogt jouw prijs niet.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Hoe aanbiedingen worden vergeleken</h2>
        <p className="mt-3">Waar mogelijk vergelijken we op de laagste bekende totaalprijs: productprijs plus bekende verzendkosten. Zijn verzendkosten niet bekend, dan tonen we dat expliciet en noemen we de prijs geen volledige totaalprijs.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Ranking en commerciële invloed</h2>
        <p className="mt-3">Affiliatevergoeding is geen normaal organisch rankingcriterium. Als Winkelnu later betaalde of gesponsorde plaatsingen introduceert, worden die duidelijk als gesponsord of gepromoot aangeduid en niet gepresenteerd als neutrale organische ranking.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Prijs en beschikbaarheid kunnen veranderen</h2>
        <p className="mt-3">Aanbiedingen komen uit externe feeds en kunnen wijzigen. Controleer daarom altijd de definitieve prijs, voorraad, verzendkosten en voorwaarden bij de webwinkel voordat je bestelt.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Wie verkoopt het product?</h2>
        <p className="mt-3">De betreffende webwinkel is verantwoordelijk voor aankoop, betaling, levering, retour, garantie en klantenservice. Winkelnu is de vergelijkings- en doorverwijslaag en niet de verkoper.</p>
      </section>
    </LegalPage>
  )
}
