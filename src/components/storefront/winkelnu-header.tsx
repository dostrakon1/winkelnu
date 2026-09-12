import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { WinkelnuBrand } from './winkelnu-brand'
import { WinkelnuNavLink } from './winkelnu-nav-link'

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 7.5h14M5 12h14M5 16.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function WinkelnuHeader() {
  const catalogEnabled = isPublicCatalogEnabled()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[image:var(--wn-gradient-market)] text-white shadow-[0_10px_30px_rgba(7,20,20,0.13)]">
      <a
        href="#inhoud"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:rounded-lg focus:bg-white focus:p-3 focus:text-[var(--wn-petrol)]"
      >
        Direct naar inhoud
      </a>

      <div className="wn-container py-3.5">
        <div className="flex items-center justify-between gap-5">
          <WinkelnuBrand inverse size="header" />

          <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="Hoofdnavigatie">
            {catalogEnabled ? (
              <>
                <WinkelnuNavLink href="/zoeken" label="Producten" section="products" />
                <WinkelnuNavLink href="/vergelijken" label="Vergelijken" section="compare" />
              </>
            ) : null}
            <WinkelnuNavLink href="/koopgidsen" label="Koopgidsen" section="guides" />
            <WinkelnuNavLink href="/#categorieen" label="Categorieën" section="categories" />
          </nav>

          {catalogEnabled ? (
            <form
              action="/zoeken"
              method="get"
              className="hidden min-w-[15rem] max-w-sm flex-1 items-center rounded-full border border-white/24 bg-[rgba(255,250,242,0.96)] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)] lg:flex xl:max-w-md"
            >
              <label htmlFor="winkelnu-header-search" className="sr-only">
                Zoek een product, merk of categorie
              </label>
              <SearchIcon className="ml-2.5 h-5 w-5 shrink-0 text-[color:rgba(13,46,45,0.55)]" />
              <input
                id="winkelnu-header-search"
                type="search"
                name="q"
                placeholder="Zoek product, merk of categorie…"
                className="min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-medium text-[var(--wn-petrol-deep)] outline-none placeholder:font-normal placeholder:text-[color:rgba(13,46,45,0.48)]"
              />
              <button
                type="submit"
                className="min-h-10 rounded-full bg-[var(--wn-warm)] px-4 py-2 text-xs font-bold text-white shadow-[0_6px_16px_rgba(159,72,35,0.20)] transition hover:-translate-y-px hover:bg-[#f1844c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-petrol-deep)] motion-reduce:transform-none"
              >
                Zoeken
              </button>
            </form>
          ) : null}

          <div className="flex items-center gap-2 lg:hidden">
            {catalogEnabled ? (
              <Link
                href="/zoeken"
                aria-label="Zoeken"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-warm)]"
              >
                <SearchIcon className="h-5 w-5" />
              </Link>
            ) : null}

            <details className="relative">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/16 marker:content-none">
                <MenuIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Menu</span>
              </summary>

              <div className="absolute right-0 z-50 mt-3 w-[min(21rem,calc(100vw-2rem))] rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-cream)] p-3 text-[var(--wn-ink)] shadow-[var(--wn-shadow-lg)]">
                <nav className="flex flex-col gap-1" aria-label="Mobiele navigatie">
                  {catalogEnabled ? (
                    <>
                      <WinkelnuNavLink href="/zoeken" label="Producten" section="products" mobile />
                      <WinkelnuNavLink href="/vergelijken" label="Vergelijken" section="compare" mobile />
                    </>
                  ) : null}
                  <WinkelnuNavLink href="/koopgidsen" label="Koopgidsen" section="guides" mobile />
                  <WinkelnuNavLink href="/#categorieen" label="Categorieën" section="categories" mobile />
                </nav>

                <div className="mt-2 border-t border-[var(--wn-border)] pt-2">
                  <Link
                    href="/over-winkelnu"
                    className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-[var(--wn-text-muted)] transition hover:bg-white hover:text-[var(--wn-petrol-deep)]"
                  >
                    Over Winkelnu
                  </Link>
                  <a
                    href="mailto:info@akflow.nl?subject=Winkelnu.nl"
                    className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-[var(--wn-text-muted)] transition hover:bg-white hover:text-[var(--wn-petrol-deep)]"
                  >
                    Contact
                  </a>
                </div>

                {catalogEnabled ? (
                  <form action="/zoeken" method="get" className="mt-2 border-t border-[var(--wn-border)] pt-3">
                    <label htmlFor="winkelnu-mobile-search" className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--wn-text-muted)]">
                      Snel zoeken
                    </label>
                    <div className="relative mt-2">
                      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--wn-text-muted)]" />
                      <input
                        id="winkelnu-mobile-search"
                        type="search"
                        name="q"
                        placeholder="Product, merk of categorie…"
                        className="wn-input pl-10 text-base"
                      />
                    </div>
                    <button type="submit" className="wn-button wn-button-primary mt-2 w-full">
                      Zoeken
                    </button>
                  </form>
                ) : null}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}
