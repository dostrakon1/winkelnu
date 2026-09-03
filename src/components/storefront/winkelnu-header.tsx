import Link from 'next/link'

export function WinkelnuHeader() {
  return (
    <header className="bg-[image:var(--wn-gradient-market)] text-white">
      <div className="wn-container py-4">
        <div className="flex items-center justify-between gap-5">
          <Link
            href="/"
            className="shrink-0 text-sm font-bold uppercase tracking-[0.24em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]"
          >
            Winkelnu.nl
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/78 md:flex" aria-label="Hoofdnavigatie">
            <Link href="/zoeken" className="transition hover:text-white">Producten</Link>
            <Link href="/#categorieen" className="transition hover:text-white">Categorieën</Link>
            <Link href="/zoeken?sort=price_asc" className="transition hover:text-white">Aanbiedingen</Link>
          </nav>

          <form action="/zoeken" method="get" className="hidden min-w-0 max-w-sm flex-1 items-center rounded-full border border-white/16 bg-white/10 p-1.5 lg:flex">
            <label htmlFor="winkelnu-header-search" className="sr-only">Zoek producten</label>
            <input
              id="winkelnu-header-search"
              type="search"
              name="q"
              placeholder="Zoek in Winkelnu"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/48"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--wn-petrol-deep)] transition hover:bg-[var(--wn-cream)]"
            >
              Zoeken
            </button>
          </form>

          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-white/18 px-4 py-2 text-sm font-semibold text-white marker:content-none">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-3 w-64 rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.12)] bg-[var(--wn-cream)] p-3 text-[var(--wn-ink)] shadow-[var(--wn-shadow-lg)]">
              <nav className="flex flex-col" aria-label="Mobiele navigatie">
                <Link href="/zoeken" className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-white">Producten</Link>
                <Link href="/#categorieen" className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-white">Categorieën</Link>
                <Link href="/zoeken?sort=price_asc" className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-white">Aanbiedingen</Link>
              </nav>
              <form action="/zoeken" method="get" className="mt-2 border-t border-[color:rgba(18,59,58,0.10)] pt-3">
                <label htmlFor="winkelnu-mobile-search" className="sr-only">Zoek producten</label>
                <input
                  id="winkelnu-mobile-search"
                  type="search"
                  name="q"
                  placeholder="Zoek producten"
                  className="wn-input"
                />
                <button type="submit" className="wn-button wn-button-primary mt-2 w-full">Zoeken</button>
              </form>
            </div>
          </details>
        </div>

        <p className="mt-3 text-xs text-white/56 md:hidden">Ontdek. Vergelijk. Kies je winkel.</p>
      </div>
    </header>
  )
}
