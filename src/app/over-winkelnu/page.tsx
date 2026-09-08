import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/storefront/legal-page'
import { OperatorDetails } from '@/components/storefront/operator-details'

export const metadata: Metadata = {
  title: 'Over Winkelnu',
  description: 'Ontdek hoe Winkelnu je helpt kiezen en hoe ons platform werkt.',
  alternates: { canonical: '/over-winkelnu' },
}

export default function AboutWinkelnuPage() {
  return (
    <LegalPage
      eyebrow="Over ons"
      title="Over Winkelnu"
      intro="Winkelnu helpt je met praktische keuzehulpen om producten te vinden die passen bij jouw wensen. We bouwen aan een plek waar je ook aanbiedingen van verschillende webwinkels kunt vergelijken."
    >
      <section>
        <h2 className="text-xl font-bold">Kies met meer kennis</h2>
        <p className="mt-3">Onze koopgidsen maken eigenschappen, gebruiksgemak en kosten begrijpelijk. Zo ontdek je wat voor jou belangrijk is voordat je een aankoop doet.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Vergelijken bij Winkelnu</h2>
        <p className="mt-3">We werken aan de koppeling met webwinkels voor actuele aanbiedingen. Zodra die beschikbaar zijn, kun je aanbiedingen vergelijken en voor je aankoop doorgaan naar de gekozen webwinkel.</p>
        <p className="mt-3">Meer over onze werkwijze lees je op <Link href="/affiliate-en-vergelijking" className="font-semibold text-[var(--wn-petrol)] underline underline-offset-4">Hoe Winkelnu werkt</Link>.</p>
      </section>
      <section id="exploitant" className="scroll-mt-8 border-t border-[var(--wn-border)] pt-8">
        <h2 className="text-xl font-bold">Bedrijfsgegevens</h2>
        <p className="mt-3">Winkelnu is een initiatief van Akflow.</p>
        <OperatorDetails />
      </section>
    </LegalPage>
  )
}
