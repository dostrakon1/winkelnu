import Link from 'next/link'
import { WinkelnuBrand } from './winkelnu-brand'

export function WinkelnuFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[image:var(--wn-gradient-evening)] text-white">
      <div className="wn-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.9fr]">
          <div className="max-w-xl">
            <WinkelnuBrand inverse />
            <p className="mt-5 text-xl font-semibold tracking-tight text-white">
              Ontdek. Vergelijk. Kies je winkel.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
              Winkelnu brengt producten en aanbiedingen van verschillende webwinkels samen, zodat je rustig kunt vergelijken voordat je naar de winkel zelf doorgaat.
            </p>
          </div>

          <nav aria-label="Footer ontdekken">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Ontdekken</p>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/78">
              <Link href="/zoeken" className="transition hover:text-white">Alle producten</Link>
              <Link href="/#categorieen" className="transition hover:text-white">Categorieën</Link>
              <Link href="/zoeken?sort=price_asc" className="transition hover:text-white">Laagste bekende prijs</Link>
            </div>
          </nav>

          <nav aria-label="Footer informatie">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Informatie</p>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/78">
              <Link href="/over-winkelnu" className="transition hover:text-white">Over Winkelnu</Link>
              <Link href="/affiliate-en-vergelijking" className="transition hover:text-white">Affiliate & vergelijking</Link>
              <Link href="/disclaimer" className="transition hover:text-white">Disclaimer</Link>
            </div>
          </nav>

          <nav aria-label="Footer privacy en juridisch">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Privacy & juridisch</p>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/78">
              <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
              <Link href="/cookies" className="transition hover:text-white">Cookies</Link>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/66">
              Winkelnu is geen verkoper. Aankoop, betaling, levering, retour en garantie verlopen via de betreffende webwinkel.
            </p>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/12 pt-6 text-xs leading-5 text-white/58 sm:flex-row sm:items-end sm:justify-between">
          <p>© {year} Winkelnu.nl · Exploitant: Akflow · KVK 42111391</p>
          <p className="max-w-2xl sm:text-right">
            Sommige links kunnen affiliate-links zijn. Winkelnu kan een vergoeding ontvangen als je via zo’n link iets koopt, zonder dat dit jouw prijs verhoogt.
          </p>
        </div>
      </div>
    </footer>
  )
}
