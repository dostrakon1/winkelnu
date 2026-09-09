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
      intro="Op de openbare pagina’s van Winkelnu gebruiken we op dit moment geen marketing- of trackingcookies. Daarom tonen we geen toestemmingsbanner als er voor bezoekers niets te accepteren of te weigeren is."
    >
      <section>
        <h2 className="text-xl font-bold">Huidige productieconfiguratie</h2>
        <p className="mt-3">Bij onze technische controle van de huidige applicatiecode zijn geen marketingpixels, session-replaytools, heatmaps, advertentietrackers of A/B-testing SDK’s voor openbare bezoekers aangetroffen. Ook is geen eigen openbare code aangetroffen die localStorage, sessionStorage of document.cookie gebruikt.</p>
        <p className="mt-3">Bij controles van openbare productiepagina’s is daarnaast geen Set-Cookie-responseheader aangetroffen. Deze controle is uitgevoerd op 10 september 2026.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Waarom geen cookiebanner?</h2>
        <p className="mt-3">Een toestemmingsbanner is pas nodig wanneer Winkelnu technologie activeert waarvoor bezoekers vooraf een keuze moeten kunnen maken. Zolang zulke technologie niet actief is, tonen we geen acceptatie- of weigerbanner. Als dit verandert, beoordelen we de toestemmingsvereisten voordat die technologie op openbare pagina’s wordt geactiveerd en werken we deze pagina bij.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Noodzakelijke techniek</h2>
        <p className="mt-3">Hosting- en beveiligingsdiensten kunnen technische verwerking uitvoeren die nodig is om Winkelnu beschikbaar en veilig te houden. De afgeschermde interne operatoromgeving staat los van gewone bezoekers en kan authenticatiesessies gebruiken om bevoegde beheerders ingelogd te houden.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Analytics en marketing</h2>
        <p className="mt-3">Op de openbare Winkelnu-pagina’s is momenteel geen optionele marketing- of gedragsmeting in de applicatie geïntegreerd. Als we later analytics, advertentietracking of vergelijkbare technologie toevoegen, beoordelen we eerst of daarvoor toestemming nodig is en passen we deze informatie aan.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Externe webwinkels</h2>
        <p className="mt-3">Wanneer je via Winkelnu naar een webwinkel gaat, verlaat je Winkelnu. Die externe partij kan eigen cookies en trackingtechnieken gebruiken volgens haar eigen cookie- en privacybeleid.</p>
      </section>
    </LegalPage>
  )
}
