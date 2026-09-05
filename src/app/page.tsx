import type { Metadata } from 'next'
import Link from 'next/link'
import { WinkelnuBrand } from '@/components/storefront/winkelnu-brand'

export const metadata: Metadata = {
  title: 'Binnenkort online',
  description:
    'Winkelnu.nl wordt een onafhankelijk product- en vergelijkingsplatform voor het ontdekken en vergelijken van aanbiedingen van verschillende webwinkels.',
}

const principles = [
  {
    number: '01',
    title: 'Ontdek producten',
    description: 'Zoek straks gericht of ontdek producten en categorieën op één overzichtelijke plek.',
  },
  {
    number: '02',
    title: 'Vergelijk aanbiedingen',
    description: 'Bekijk prijzen, bekende verzendkosten, beschikbaarheid en verschillende webwinkels naast elkaar.',
  },
  {
    number: '03',
    title: 'Kies je winkel',
    description: 'Winkelnu helpt je vergelijken. Je koopt en rekent altijd rechtstreeks af bij de gekozen webwinkel.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <section className="relative min-h-[76vh] overflow-hidden border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
        <div
          className="absolute -right-28 top-20 h-80 w-80 rounded-full border border-[color:rgba(18,59,58,0.07)]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-4 top-44 h-52 w-52 rounded-full border border-[color:rgba(233,120,61,0.14)]"
          aria-hidden="true"
        />

        <div className="wn-container relative flex min-h-[76vh] flex-col py-8 sm:py-10">
          <header className="flex items-center justify-between gap-6">
            <WinkelnuBrand href="" />
            <span className="rounded-full border border-[color:rgba(18,59,58,0.12)] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-[var(--wn-petrol)] shadow-[var(--wn-shadow-xs)] backdrop-blur">
              Binnenkort online
            </span>
          </header>

          <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-20">
            <div className="max-w-3xl">
              <p className="wn-eyebrow">Ontdek. Vergelijk. Kies je winkel.</p>
              <h1 className="wn-heading mt-4 max-w-3xl text-4xl sm:text-6xl lg:text-[4.7rem] lg:leading-[0.98]">
                Een rustigere manier om online te vergelijken komt eraan.
              </h1>
              <p className="wn-body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                Winkelnu.nl wordt een Nederlands product- en vergelijkingsplatform dat producten en aanbiedingen van verschillende webwinkels overzichtelijk samenbrengt.
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--wn-text-muted)] sm:text-base">
                We bouwen momenteel aan de eerste versie. Winkelnu verkoopt zelf geen producten: zodra het platform live is, kies je hier een aanbieding en ga je voor aankoop, betaling, levering en service rechtstreeks naar de betreffende webwinkel.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="mailto:info@akflow.nl?subject=Winkelnu.nl"
                  className="inline-flex min-h-12 items-center justify-center rounded-[var(--wn-radius-md)] bg-[var(--wn-petrol)] px-6 py-3 text-sm font-bold text-white shadow-[var(--wn-shadow-sm)] transition hover:bg-[var(--wn-petrol-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--wn-warm)] focus:ring-offset-2"
                >
                  Contact opnemen
                </a>
                <span className="text-sm text-[var(--wn-text-muted)]">Voor vragen: info@akflow.nl</span>
              </div>
            </div>

            <aside className="rounded-[var(--wn-radius-2xl)] border border-[color:rgba(18,59,58,0.11)] bg-white/80 p-6 shadow-[var(--wn-shadow-lg)] backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--wn-warm)]">Waar we aan bouwen</p>
              <div className="mt-5 space-y-5">
                {principles.map((principle) => (
                  <div key={principle.number} className="grid grid-cols-[2.25rem_1fr] gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xs font-black text-[var(--wn-petrol)]">
                      {principle.number}
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-[var(--wn-ink)]">{principle.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[var(--wn-text-muted)]">{principle.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-[color:rgba(18,59,58,0.09)] pt-5">
                <p className="text-xs leading-5 text-[var(--wn-text-muted)]">
                  Transparantie staat voorop. Sommige links op de toekomstige site kunnen affiliate-links zijn, waarbij Winkelnu mogelijk een vergoeding ontvangt zonder dat dit jouw prijs verhoogt.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div
        className="h-1 bg-[linear-gradient(90deg,var(--wn-petrol)_0%,var(--wn-petrol)_72%,var(--wn-warm)_72%,var(--wn-warm)_100%)]"
        aria-hidden="true"
      />

      <footer className="bg-[var(--wn-petrol-deep)] text-white">
        <div className="wn-container py-8 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <WinkelnuBrand href="" inverse compact />
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/68">
                Winkelnu.nl is in ontwikkeling en wordt geëxploiteerd door Akflow. Winkelnu is geen verkoper of webshop.
              </p>
            </div>
            <nav aria-label="Juridische informatie" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/76">
              <Link href="/affiliate-en-vergelijking" className="transition hover:text-white">Affiliate & vergelijking</Link>
              <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
              <Link href="/cookies" className="transition hover:text-white">Cookies</Link>
              <Link href="/disclaimer" className="transition hover:text-white">Disclaimer</Link>
            </nav>
          </div>
          <div className="mt-7 border-t border-white/12 pt-5 text-xs leading-5 text-white/52">
            © {new Date().getFullYear()} Winkelnu.nl · Exploitant: Akflow · KVK 42111391
          </div>
        </div>
      </footer>
    </main>
  )
}
