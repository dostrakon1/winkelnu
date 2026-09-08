import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { WinkelnuBrand } from './winkelnu-brand'

export function WinkelnuHeader() {
  const catalogEnabled = isPublicCatalogEnabled()
  return (
    <header className="bg-[image:var(--wn-gradient-market)] text-white">
      <a href="#inhoud" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-white focus:p-3 focus:text-[var(--wn-petrol)]">Direct naar inhoud</a>
      <div className="wn-container py-4">
        <div className="flex items-center justify-between gap-5">
          <WinkelnuBrand inverse />
          <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex" aria-label="Hoofdnavigatie">
            <Link href="/koopgidsen" className="flex min-h-12 items-center transition hover:text-white">Koopgidsen</Link>
            <Link href="/#categorieen" className="flex min-h-12 items-center transition hover:text-white">Categorieën</Link>
            {catalogEnabled ? <Link href="/zoeken" className="flex min-h-12 items-center transition hover:text-white">Producten</Link> : null}
            <Link href="/over-winkelnu" className="flex min-h-12 items-center transition hover:text-white">Over Winkelnu</Link>
          </nav>
          {catalogEnabled ? <form action="/zoeken" method="get" className="hidden min-w-0 max-w-xs flex-1 items-center rounded-full border border-white/16 bg-white/10 p-1.5 lg:flex"><label htmlFor="winkelnu-header-search" className="sr-only">Zoek producten</label><input id="winkelnu-header-search" type="search" name="q" placeholder="Zoek producten" className="min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/60"/><button type="submit" className="min-h-10 rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--wn-petrol-deep)] transition hover:bg-[var(--wn-cream)]">Zoeken</button></form> : null}
          <details className="relative md:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center rounded-full border border-white/18 px-4 py-2 text-sm font-semibold text-white marker:content-none">Menu</summary>
            <div className="absolute right-0 z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-cream)] p-3 text-[var(--wn-ink)] shadow-[var(--wn-shadow-lg)]">
              <nav className="flex flex-col" aria-label="Mobiele navigatie">
                <Link href="/koopgidsen" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold hover:bg-white">Koopgidsen</Link>
                <Link href="/#categorieen" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold hover:bg-white">Categorieën</Link>
                {catalogEnabled ? <Link href="/zoeken" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold hover:bg-white">Producten</Link> : null}
                <Link href="/over-winkelnu" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold hover:bg-white">Over Winkelnu</Link>
                <a href="mailto:info@akflow.nl?subject=Winkelnu.nl" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold hover:bg-white">Contact</a>
              </nav>
              {catalogEnabled ? <form action="/zoeken" method="get" className="mt-2 border-t border-[var(--wn-border)] pt-3"><label htmlFor="winkelnu-mobile-search" className="text-xs font-semibold">Zoek producten</label><input id="winkelnu-mobile-search" type="search" name="q" placeholder="Zoek producten" className="wn-input mt-1 text-base"/><button type="submit" className="wn-button wn-button-primary mt-2 w-full">Zoeken</button></form> : null}
            </div>
          </details>
        </div>
        <p className="mt-2 text-xs text-white/70 md:hidden">Ontdek. Vergelijk. Kies je winkel.</p>
      </div>
    </header>
  )
}
