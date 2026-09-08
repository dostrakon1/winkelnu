import type { Metadata } from 'next'
import { LegalPage } from '@/components/storefront/legal-page'
import { OperatorDetails } from '@/components/storefront/operator-details'
import { operator } from '@/content/operator'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Privacy-informatie over gegevensverwerking op Winkelnu.nl.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy"
      intro="Winkelnu verwerkt zo min mogelijk persoonsgegevens. Deze pagina legt uit welke gegevensstromen onderdeel zijn van de huidige technische baseline en waar externe partijen hun eigen verantwoordelijkheid hebben."
    >
      <section>
        <h2 className="text-xl font-bold">Verantwoordelijke</h2>
        <p className="mt-3">Winkelnu.nl wordt geëxploiteerd door {operator.tradeName}, de eenmanszaak van {operator.legalName}. Voor vragen over onze verwerking van persoonsgegevens kun je ons bereiken via de onderstaande gegevens.</p>
        <OperatorDetails />
        <p className="wn-body-muted mt-3 text-sm">Het adres is een correspondentieadres en geen bezoekadres.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Bezoeken, zoeken en vergelijken</h2>
        <p className="mt-3">Wanneer je Winkelnu bezoekt, verwerkt de website normale technische verzoekgegevens die nodig zijn om pagina’s te leveren. Zoektermen en filters worden gebruikt om resultaten te tonen. Winkelnu heeft momenteel geen openbaar klantaccount of persoonlijk winkelprofiel.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Affiliate-clicks</h2>
        <p className="mt-3">Wanneer je via een aanbieding naar een webwinkel gaat, registreert Winkelnu op applicatieniveau een beperkte clickgebeurtenis met de aanbieding, het product, de webwinkel, eventueel de interne bronpagina en het tijdstip. In deze clickregistratie bewaren we geen raw IP-adres, user-agent fingerprint, willekeurige externe referrer of persoonlijk advertentieprofiel.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Hosting en technische logs</h2>
        <p className="mt-3">Hosting-, database- en beveiligingsdiensten kunnen technische loggegevens verwerken die nodig zijn voor beschikbaarheid, beveiliging en foutanalyse. De exacte productie-instellingen en bewaartermijnen worden als onderdeel van de live-controle geverifieerd en deze privacy-informatie wordt aangepast wanneer de feitelijke verwerking wijzigt.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Interne toegang</h2>
        <p className="mt-3">Winkelnu gebruikt een afgeschermde interne operatoromgeving voor beheer en operationele controles. Die omgeving kan account- en auditgegevens van bevoegde beheerders verwerken. Dit is geen openbaar klantaccount.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Als je Winkelnu verlaat</h2>
        <p className="mt-3">Na een klik op een aanbieding ga je naar een externe webwinkel of affiliateroute. Vanaf dat moment kunnen die externe partijen persoonsgegevens, cookies en bestelgegevens verwerken volgens hun eigen privacy- en cookiebeleid.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Bewaren</h2>
        <p className="mt-3">We bewaren gegevens niet langer dan nodig is voor het doel waarvoor ze worden verwerkt, rekening houdend met beveiliging, operationele controle en wettelijke verplichtingen. Waar specifieke bewaartermijnen technisch of juridisch worden vastgesteld, verwerken we die in deze pagina.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Jouw privacyrechten</h2>
        <p className="mt-3">Heb je een vraag over persoonsgegevens of wil je een privacyrecht uitoefenen, neem dan contact op via <a className="font-semibold underline underline-offset-4" href={`mailto:${operator.email}`}>{operator.email}</a>. Omdat Winkelnu geen openbaar klantaccount heeft en clickattributie bewust beperkt houdt, kan het voorkomen dat we weinig of geen gegevens hebben die rechtstreeks aan jou te koppelen zijn.</p>
      </section>
    </LegalPage>
  )
}
