import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/storefront/legal-page'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Informatie over de inhoud van Winkelnu en links naar externe webwinkels.',
  alternates: { canonical: '/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Informatie"
      title="Disclaimer"
      intro="Winkelnu biedt keuzehulpen en werkt aan een platform voor het vergelijken van aanbiedingen. We streven naar duidelijke en betrouwbare informatie."
    >
      <section>
        <h2 className="text-xl font-bold">Informatie en bronnen</h2>
        <p className="mt-3">Onze koopgidsen zijn bedoeld als algemene keuzehulp. Controleer productspecificaties en voorwaarden bij de fabrikant of webwinkel voordat je een aankoop doet.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Externe websites</h2>
        <p className="mt-3">Winkelnu verwijst naar websites van derden. De inhoud, beschikbaarheid en voorwaarden van die websites kunnen veranderen. De gekozen webwinkel is verantwoordelijk voor de aankoop en de bijbehorende klantenservice.</p>
      </section>
      <p className="wn-body-muted">Meer informatie over onze vergelijking en commerciële links vind je op <Link href="/affiliate-en-vergelijking" className="font-semibold text-[var(--wn-petrol)] underline underline-offset-4">Hoe Winkelnu werkt</Link>.</p>
    </LegalPage>
  )
}
