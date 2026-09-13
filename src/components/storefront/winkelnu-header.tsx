import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { SeasonalCampaignBar } from './seasonal-campaign-layer'
import { WinkelnuBrand } from './winkelnu-brand'
import { WinkelnuCategoryMenu } from './winkelnu-category-menu'
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

export type WinkelnuHeaderTheme = 'default' | 'black-friday'

export function WinkelnuHeader({ theme = 'default' }: { theme?: WinkelnuHeaderTheme } = {}) {
  const catalogEnabled = isPublicCatalogEnabled()
  const isBlackFriday = theme === 'black-friday'

  return (
    <header
      className={`relative sticky top-0 z-50 border-b text-white shadow-[0_10px_30px_rgba(7,20,20,0.13)] ${
        isBlackFriday
          ? 'border-[#f0a168]/18 bg-[linear-gradient(100deg,#050908_0%,#0b1b19_42%,#17302d_72%,#3c1f12_100%)]'
          : 'border-white/10 bg-[image:var(--wn-gradient-market)]'
      }`}
    >
      <SeasonalCampaignBar />

      {isBlackFriday ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -left-10 top-1/2 h-24 w-40 -translate-y-1/2 rounded-full bg-[#ef7338]/8 blur-3xl" />
          <span className="absolute right-[18%] top-3 h-1.5 w-1.5 rounded-full bg-[#ffd2ad] shadow-[0_0_22px_8px_rgba(239,115,56,0.22)]" />
          <span className="absolute right-[43%] bottom-3 h-1 w-1 rounded-full bg-[#f4bd85] shadow-[0_0_18px_7px_rgba(244,189,133,0.18)]" />
          <span className="absolute left-[41%] top-5 h-1 w-1 rounded-full bg-white/70 shadow-[0_0_16px_6px_rgba(255,255,255,0.12)]" />
        </div>
      ) : null}

      <a
        href="#inhoud"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:rounded-lg focus:bg-white focus:p-3 focus:text-[var(--wn-petrol)]"
      >
        Direct naar inhoud
      </a>

      <div className="wn-container relative py-3.5">
        <div className="relative flex items-center justify-between gap-5">
          <WinkelnuBrand inverse size="header" />

          <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="Hoofdnavigatie">
            {catalogEnabled ? (
              <>
                <WinkelnuNavLink href="/zoeken" label="Producten" section="products" />
                <WinkelnuNavLink href="/vergelijken" label="Vergelijken" section="compare" />
              </>
            ) : null}
            <WinkelnuNavLink href="/koopgidsen" label="Koopgidsen" section="guides" />
            <WinkelnuCategoryMenu />
          </nav>

          {catalogEnabled ? (
            <form
              action="/zoeken"
              method="get"
              className={`hidden min-w-[15rem] max-w-sm flex-1 items-center rounded-full p-1.5 lg:flex xl:max-w-md ${
                isBlackFriday
                  ? 'border border-[#f0a168]/28 bg-[#fffaf2] shadow-[0_8px_28px_rgba(0,0,0,0.18)]'
                  : 'border border-white/24 bg-[rgba(255,250,242,0.96)] shadow-[0_8px_24px_rgba(0,0,0,0.10)]'
              }`}
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
                className={`min-h-10 rounded-full px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-petrol-deep)] motion-reduce:transform-none ${
                  isBlackFriday
                    ? 'bg-[#ef7338] shadow-[0_6px_18px_rgba(239,115,56,0.30)] hover:bg-[#f1844c]'
                    : 'bg-[var(--wn-warm)] shadow-[0_6px_16px_rgba(159,72,35,0.20)] hover:bg-[#f1844c]'
                }`}
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
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-warm)] ${
                  isBlackFriday
                    ? 'border-[#f0a168]/28 bg-white/8 hover:bg-[#ef7338]/20'
                    : 'border-white/18 bg-white/10 hover:bg-white/16'
                }`}
              >
                <SearchIcon className="h-5 w-5" />
              </Link>
            ) : null}

            <details className="relative">
              <summary
                className={`flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold text-white transition marker:content-none ${
                  isBlackFriday
                    ? 'border-[#f0a168]/28 bg-white/8 hover:bg-[#ef7338]/20'
                    : 'border-white/18 bg-white/10 hover:bg-white/16'
                }`}
              >
                <MenuIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Menu</span>
              </summary>

              <div className="absolute right-0 z-50 mt-3 max-h-[calc(100vh-6rem)] w-[min(21rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-cream)] p-3 text-[var(--wn-ink)] shadow-[var(--wn-shadow-lg)]">
                <nav className="flex flex-col gap-1" aria-label="Mobiele navigatie">
                  {catalogEnabled ? (
                    <>
                      <WinkelnuNavLink href="/zoeken" label="Producten" section="products" mobile />
                      <WinkelnuNavLink href="/vergelijken" label="Vergelijken" section="compare" mobile />
                    </>
                  ) : null}
                  <WinkelnuNavLink href="/koopgidsen" label="Koopgidsen" section="guides" mobile />
                  <WinkelnuCategoryMenu mobile />
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
