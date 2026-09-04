import type { Metadata } from 'next'
import { LegalPage } from '@/components/storefront/legal-page'

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'Informatie over cookies, browseropslag en tracking op Winkelnu.nl.',
}

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Cookies en browseropslag"
      intro="Winkelnu wil alleen cookies of vergelijkbare technieken gebruiken wanneer daar een duidelijke technische of functionele reden voor is. We plaatsen geen cosmetische cookiebanner voor trackers die niet bestaan."
    >
      <section>
        <h2 className="text-xl font-bold">Huidige technische baseline</h2>
        <p className="mt-3">De huidige applicatiecode bevat geen marketingpixel, session-replaytool, heatmap, advertentietracker of A/B-testing SDK voor openbare bezoekers. Winkelnu heeft ook geen openbaar klantaccount.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Noodzakelijke techniek</h2>
        <p className="mt-3">Technische diensten voor hosting, beveiliging en de interne beheeromgeving kunnen noodzakelijke cookies of vergelijkbare opslag gebruiken. De afgeschermde interne operatoromgeving gebruikt authenticatiesessies om bevoegde beheerders ingelogd te houden.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Analytics en marketing</h2>
        <p className="mt-3">Optionele analytics of marketingtracking wordt niet stilzwijgend toegevoegd. Als Winkelnu later technologie activeert waarvoor toestemming nodig is, wordt die technologie pas na de vereiste toestemming geactiveerd en wordt deze pagina bijgewerkt.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Externe webwinkels</h2>
        <p className="mt-3">Wanneer je via Winkelnu naar een webwinkel gaat, verlaat je Winkelnu. Die externe partij kan eigen cookies en trackingtechnieken gebruiken volgens haar eigen cookie- en privacybeleid.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Productiecontrole</h2>
        <p className="mt-3">Voor de publieke lancering controleren we de daadwerkelijke productieomgeving op cookies, browseropslag en platformniveau-analytics. Als de runtime afwijkt van deze technische baseline, wordt de cookie-informatie aangepast voordat die configuratie als definitief wordt beschouwd.</p>
      </section>
    </LegalPage>
  )
}
