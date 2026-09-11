import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/storefront/legal-page'
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
      intro="Op deze pagina lees je hoe Winkelnu met persoonsgegevens en gebruiksgegevens omgaat."
    >
      <section>
        <h2 className="text-xl font-bold">Wie is verantwoordelijk?</h2>
        <p className="mt-3">Akflow is verantwoordelijk voor de verwerking van persoonsgegevens via Winkelnu.nl. Voor privacyvragen kun je contact opnemen via <a className="font-semibold underline underline-offset-4" href={`mailto:${operator.email}`}>{operator.email}</a>. De juridische en contactgegevens staan bij <Link href="/over-winkelnu#exploitant" className="font-semibold text-[var(--wn-petrol)] underline underline-offset-4">Bedrijfsgegevens</Link>.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Bezoeken, zoeken en vergelijken</h2>
        <p className="mt-3">Wanneer je Winkelnu bezoekt, verwerkt de website normale technische verzoekgegevens die nodig zijn om pagina’s te leveren. Zoektermen en filters worden gebruikt om resultaten te tonen. Winkelnu heeft momenteel geen openbaar klantaccount of persoonlijk winkelprofiel.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Zoekverbeteringssignalen</h2>
        <p className="mt-3">Om Zoekkompas te verbeteren registreert Winkelnu beperkte first-party signalen over het functioneren van de zoekmachine. Daarbij kunnen we een genormaliseerde zoekvraag, herkende zoekintentie, eventuele typefoutcorrectie, een 0-resultaatsignaal, een directe herformulering en de gekozen interne zoekroute of productpositie vastleggen.</p>
        <p className="mt-3">Deze zoekleerlaag gebruikt geen bezoekers-ID, cookie-ID, lokaal browserprofiel, raw IP-adres, user-agent fingerprint of cross-site identifier. Waarschijnlijke e-mailadressen, URL’s en langere telefoonnummers worden vóór opslag geredigeerd. Voor ruwe zoekevents hanteert Winkelnu een bewaartermijn van 90 dagen; oudere events worden bij nieuwe feedbackverwerking automatisch opgeschoond en de verbeteroverzichten kijken uitsluitend naar de laatste 90 dagen. Rankings worden hierdoor niet automatisch gewijzigd.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Geaggregeerde gebruiksstatistieken</h2>
        <p className="mt-3">Winkelnu gebruikt Vercel Web Analytics om op geaggregeerd niveau te begrijpen welke openbare pagina’s worden bezocht en zo de zoek-, vergelijk- en contentervaring te verbeteren. De integratie wordt alleen op winkelnu.nl geladen; previewomgevingen en de routes <code>/intern</code>, <code>/api</code> en <code>/uit</code> zijn uitgesloten.</p>
        <p className="mt-3">Voordat een paginaweergave wordt verzonden, verwijderen we alle queryparameters en URL-fragmenten. Daardoor sturen we via deze analyticsintegratie geen ingevoerde zoektermen, filterwaarden of andere querygegevens mee. De aparte first-party zoekleerlaag hierboven staat los van Vercel Web Analytics. We gebruiken deze metingen niet voor advertenties, cross-siteprofilering of een persoonlijk winkelprofiel. Vercel treedt hierbij op als technische dienstverlener voor de website-infrastructuur en analytics.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Affiliate-clicks</h2>
        <p className="mt-3">Wanneer je via een aanbieding naar een webwinkel gaat, registreert Winkelnu op applicatieniveau een beperkte clickgebeurtenis met de aanbieding, het product, de webwinkel, eventueel de interne bronpagina en het tijdstip. In deze clickregistratie bewaren we geen raw IP-adres, user-agent fingerprint, willekeurige externe referrer of persoonlijk advertentieprofiel. De affiliate-uitklikroute is bovendien uitgesloten van de openbare Web Analytics-meting.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Hosting en technische logs</h2>
        <p className="mt-3">Hosting-, database-, analytics- en beveiligingsdiensten kunnen technische log- of verzoekgegevens verwerken die nodig zijn voor beschikbaarheid, beveiliging, statistiek en foutanalyse. Bewaartermijnen kunnen per gebruikte dienst en configuratie verschillen. Waar Winkelnu die termijnen zelf kan instellen, beperken we de opslag tot wat voor het betreffende doel nodig is en werken we deze informatie bij wanneer de feitelijke verwerking wijzigt.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Interne toegang</h2>
        <p className="mt-3">Winkelnu gebruikt een afgeschermde interne operatoromgeving voor beheer en operationele controles. Die omgeving kan account- en auditgegevens van bevoegde beheerders verwerken. Dit is geen openbaar klantaccount en deze routes worden niet meegenomen in de openbare Web Analytics-meting.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Als je Winkelnu verlaat</h2>
        <p className="mt-3">Na een klik op een aanbieding ga je naar een externe webwinkel of affiliateroute. Vanaf dat moment kunnen die externe partijen persoonsgegevens, cookies en bestelgegevens verwerken volgens hun eigen privacy- en cookiebeleid.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Bewaren</h2>
        <p className="mt-3">We bewaren gegevens niet langer dan nodig is voor het doel waarvoor ze worden verwerkt, rekening houdend met beveiliging, operationele controle en wettelijke verplichtingen. Voor search-feedbackevents geldt een 90-dagenretentiegrens in de zoekleerlaag; bij nieuwe feedbackverwerking worden oudere events opgeschoond en de querysamenvatting gebruikt uitsluitend de laatste 90 dagen. Als de verwerking of technische configuratie verandert, beoordelen we ook opnieuw welke bewaartermijnen daarbij passend zijn.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Jouw privacyrechten</h2>
        <p className="mt-3">Heb je een vraag over persoonsgegevens of wil je een privacyrecht uitoefenen, neem dan contact op via <a className="font-semibold underline underline-offset-4" href={`mailto:${operator.email}`}>{operator.email}</a>. Omdat Winkelnu geen openbaar klantaccount heeft en zoek- en clickattributie bewust niet aan een persistent bezoekers-ID worden gekoppeld, kan het voorkomen dat we weinig of geen gegevens hebben die rechtstreeks aan jou te koppelen zijn.</p>
      </section>
      <p className="wn-body-muted text-sm">Laatst inhoudelijk gecontroleerd: 12 september 2026.</p>
    </LegalPage>
  )
}
