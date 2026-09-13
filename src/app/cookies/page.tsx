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
      intro="Winkelnu gebruikt geen marketing- of trackingcookies. Voor Lootje & Lijstje gebruiken we alleen een strikt noodzakelijke first-party cookie om no-login beheer-toegang veilig te onthouden."
    >
      <section>
        <h2 className="text-xl font-bold">Huidige productieconfiguratie</h2>
        <p className="mt-3">Winkelnu gebruikt geen marketingpixels, session-replaytools, heatmaps of advertentietrackers voor openbare bezoekers. We gebruiken ook geen browseropslag om een persoonlijk advertentie- of winkelprofiel op te bouwen.</p>
        <p className="mt-3">Vercel Web Analytics wordt uitsluitend op het publieke domein winkelnu.nl geladen. Previewomgevingen en de routes <code>/intern</code>, <code>/api</code>, <code>/uit</code> en <code>/lootje-lijstje</code> zijn uitgesloten. Zoekparameters, filters en URL-fragmenten worden vóór verzending uit de gemeten pagina-URL verwijderd.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Noodzakelijke cookie voor Lootje &amp; Lijstje</h2>
        <p className="mt-3">Wanneer je zonder account een verlanglijstje beheert, kan Winkelnu de first-party cookie <code>wn_gift_access</code> plaatsen. Deze cookie bevat geen naam, wens, productlink of andere lijstinhoud. Hij bevat alleen ondertekende technische toegangsgegevens waarmee de applicatie kan herkennen welke lijstjes deze browser mag beheren.</p>
        <p className="mt-3">De cookie is <code>HttpOnly</code>, wordt in productie alleen via HTTPS verzonden en gebruikt <code>SameSite=Lax</code>. De maximale geldigheidsduur is 180 dagen, maar toegang kan eerder vervallen wanneer het bijbehorende lijstje vervalt of wordt verwijderd. De cookie is noodzakelijk voor de gevraagde no-login beheerfunctie en wordt niet gebruikt voor analytics, advertenties of cross-siteprofilering.</p>
        <p className="mt-3">Voor herstel op een ander apparaat kan de eigenaar zelf een geheime herstel-link maken. Die link staat los van de gedeelde alleen-lezen lijstlink. Winkelnu bewaart het geheime token uit zo’n herstel-link niet leesbaar in de database.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Zoekkompas verbeteren zonder bezoekerscookie</h2>
        <p className="mt-3">Winkelnu gebruikt daarnaast een eigen first-party zoekleerlaag om te zien welke zoekvragen geen resultaat geven, welke interne suggesties worden gekozen en wanneer een zoekvraag direct wordt herformuleerd. Deze meting gebruikt geen cookie, localStorage, sessionStorage, persistent bezoekers-ID of cross-site identifier.</p>
        <p className="mt-3">De zoekleerlaag staat los van Vercel Web Analytics. Zoektekst wordt vóór opslag genormaliseerd en waarschijnlijke directe identifiers zoals e-mailadressen, URL’s en langere telefoonnummers worden geredigeerd. Meer informatie staat in de privacyverklaring.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Waarom geen marketing-cookiebanner?</h2>
        <p className="mt-3">De huidige analysemethode plaatst volgens de gebruikte configuratie geen marketing- of trackingcookies en wordt niet ingezet voor advertenties of cross-siteprofilering. De noodzakelijke Lootje &amp; Lijstje-cookie dient uitsluitend om een door jou gevraagde beheerfunctie zonder account te laten werken. Daarom tonen we voor deze huidige configuratie geen marketing-cookiekeuze. Als techniek of doel verandert, beoordelen we opnieuw welke informatie en eventuele toestemming nodig zijn voordat zo’n wijziging openbaar wordt geactiveerd.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Andere noodzakelijke techniek</h2>
        <p className="mt-3">Hosting- en beveiligingsdiensten kunnen technische verwerking uitvoeren die nodig is om Winkelnu beschikbaar en veilig te houden. De afgeschermde interne operatoromgeving staat los van gewone bezoekers en kan eigen authenticatiesessies gebruiken om bevoegde beheerders ingelogd te houden.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Web Analytics</h2>
        <p className="mt-3">De overige openbare Winkelnu-pagina’s gebruiken Vercel Web Analytics om op geaggregeerd niveau te begrijpen welke pagina’s worden bezocht. We sturen vanuit onze integratie geen zoektermen, filterwaarden of URL-fragmenten mee. Lootje &amp; Lijstje is volledig van deze Web Analytics-meting uitgesloten. De meting is bedoeld voor product- en contentverbetering, niet voor het opbouwen van persoonlijke advertentieprofielen.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Externe webwinkels</h2>
        <p className="mt-3">Wanneer je via Winkelnu of een door iemand toegevoegd verlanglijstje naar een externe website gaat, verlaat je Winkelnu. Die externe partij kan eigen cookies en trackingtechnieken gebruiken volgens haar eigen cookie- en privacybeleid.</p>
      </section>
      <p className="wn-body-muted text-sm">Laatst inhoudelijk gecontroleerd: 13 september 2026.</p>
    </LegalPage>
  )
}
