import type { Metadata } from 'next'
import { LegalPage } from '@/components/storefront/legal-page'

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'Informatie over cookies, browseropslag en tracking op Winkelnu.nl.',
  alternates: { canonical: '/cookies' },
}

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Cookies en browseropslag"
      intro="Op de openbare pagina’s van Winkelnu gebruiken we geen marketing- of trackingcookies. Voor geaggregeerde paginastatistieken gebruiken we Vercel Web Analytics in een cookie-vrije configuratie."
    >
      <section>
        <h2 className="text-xl font-bold">Huidige productieconfiguratie</h2>
        <p className="mt-3">Winkelnu gebruikt geen marketingpixels, session-replaytools, heatmaps of advertentietrackers voor openbare bezoekers. Ook gebruikt onze openbare applicatie geen eigen localStorage, sessionStorage of document.cookie voor bezoekersprofilering.</p>
        <p className="mt-3">Vercel Web Analytics wordt uitsluitend op het publieke domein winkelnu.nl geladen. Previewomgevingen en de routes <code>/intern</code>, <code>/api</code> en <code>/uit</code> zijn uitgesloten. Zoekparameters, filters en URL-fragmenten worden vóór verzending uit de gemeten pagina-URL verwijderd.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Waarom geen marketing-cookiebanner?</h2>
        <p className="mt-3">De huidige analysemethode plaatst volgens de gebruikte Vercel Web Analytics-configuratie geen cookies en wordt niet ingezet voor advertenties of cross-siteprofilering. Daarom tonen we voor deze configuratie geen marketing-cookiekeuze. Als de techniek of het doel verandert, beoordelen we opnieuw welke informatie en eventuele toestemming nodig zijn voordat zo’n wijziging openbaar wordt geactiveerd.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Noodzakelijke techniek</h2>
        <p className="mt-3">Hosting- en beveiligingsdiensten kunnen technische verwerking uitvoeren die nodig is om Winkelnu beschikbaar en veilig te houden. De afgeschermde interne operatoromgeving staat los van gewone bezoekers en kan authenticatiesessies gebruiken om bevoegde beheerders ingelogd te houden.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Web Analytics</h2>
        <p className="mt-3">De openbare Winkelnu-pagina’s gebruiken Vercel Web Analytics om op geaggregeerd niveau te begrijpen welke pagina’s worden bezocht. We sturen vanuit onze integratie geen zoektermen, filterwaarden of URL-fragmenten mee. De meting is bedoeld voor product- en contentverbetering, niet voor het opbouwen van persoonlijke advertentieprofielen.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Externe webwinkels</h2>
        <p className="mt-3">Wanneer je via Winkelnu naar een webwinkel gaat, verlaat je Winkelnu. Die externe partij kan eigen cookies en trackingtechnieken gebruiken volgens haar eigen cookie- en privacybeleid.</p>
      </section>
      <p className="wn-body-muted text-sm">Laatst inhoudelijk gecontroleerd: 11 september 2026.</p>
    </LegalPage>
  )
}
