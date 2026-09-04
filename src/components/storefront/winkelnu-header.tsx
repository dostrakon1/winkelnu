import Link from 'next/link'
import { WinkelnuBrand } from './winkelnu-brand'

export function WinkelnuHeader() {
  return (
    <header className="bg-[image:var(--wn-gradient-market)] text-white">
      <div className="wn-container py-4">
        <div className="flex items-center justify-between gap-5">
          <WinkelnuBrand inverse />

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/78 md:flex" aria-label="Hoofdnavigatie">
            <Link href="/zoeken" className="flex min-h-12 items-center transition hover:text-white">Producten</Link>
            <Link href="/#categorieen" className="flex min-h-12 items-center transition hover:text-white">Categorieën</Link>
            <Link href="/zoeken?sort=price_asc" className="flex min-h-12 items-center transition hover:text-white">Aanbiedingen</Link>
          </nav>

          <form action="/zoeken" method="get" className="hidden min-w-0 max-w-sm flex-1 items-center rounded-full border border-white/16 bg-white/10 p-1.5 lg:flex">
            <label htmlFor="winkelnu-header-search" className="sr-only">Zoek producten</label>
            <input
              id="winkelnu-header-search"
              type="search"
              name="q"
              placeholder="Zoek in Winkelnu"
              className="min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/48"
            />
            <button
              type="submit"
              className="min-h-10 rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--wn-petrol-deep)] transition hover:bg-[var(--wn-cream)]"
            >
              Zoeken
            </button>
          </form>

          <details className="relative md:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center rounded-full border border-white/18 px-4 py-2 text-sm font-semibold text-white marker:content-none">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.12)] bg-[var(--wn-cream)] p-3 text-[var(--wn-ink)] shadow-[var(--wn-shadow-lg)]">
              <div className="px-3 pb-3 pt-1"><WinkelnuBrand /></div>
              <nav className="flex flex-col border-t border-[color:rgba(18,59,58,0.10)] pt-2" aria-label="Mobiele navigatie">
                <Link href="/zoeken" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold hover:bg-white">Producten</Link>
                <Link href="/#categorieen" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold hover:bg-white">Categorieën</Link>
                <Link href="/zoeken?sort=price_asc" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold hover:bg-white">Aanbiedingen</Link>
              </nav>
              <form action="/zoeken" method="get" className="mt-2 border-t border-[color:rgba(18,59,58,0.10)] pt-3">
                <label htmlFor="winkelnu-mobile-search" className="sr-only">Zoek producten</label>
                <input
                  id="winkelnu-mobile-search"
                  type="search"
                  name="q"
                  placeholder="Zoek producten"
                  className="wn-input text-base"
                />
                <button type="submit" className="wn-button wn-button-primary mt-2 w-full">Zoeken</button>
              </form>
            </div>
          </details>
        </div>

        <p className="mt-2 pl-[3.25rem] text-xs text-white/56 md:hidden">Ontdek. Vergelijk. Kies je winkel.</p>
      </div>
    </header>
  )
}
