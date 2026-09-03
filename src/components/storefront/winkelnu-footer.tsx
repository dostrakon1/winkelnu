import Link from 'next/link'

export function WinkelnuFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[image:var(--wn-gradient-evening)] text-white">
      <div className="wn-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <div className="max-w-xl">
            <Link
              href="/"
              className="inline-flex text-sm font-bold uppercase tracking-[0.24em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]"
            >
              Winkelnu.nl
            </Link>
            <p className="mt-4 text-xl font-semibold tracking-tight text-white">
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
              <Link href="/zoeken?sort=price_asc" className="transition hover:text-white">Laagste totaalprijs</Link>
            </div>
          </nav>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Zo werkt Winkelnu</p>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Winkelnu is geen verkoper. Voor aankoop, betaling, levering, retour en garantie ga je door naar de betreffende webwinkel.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/12 pt-6 text-xs leading-5 text-white/58 sm:flex-row sm:items-end sm:justify-between">
          <p>© {year} Winkelnu.nl</p>
          <p className="max-w-2xl sm:text-right">
            Sommige links kunnen affiliate-links zijn. Winkelnu kan een vergoeding ontvangen als je via zo’n link iets koopt, zonder dat dit jouw prijs verhoogt.
          </p>
        </div>
      </div>
    </footer>
  )
}
