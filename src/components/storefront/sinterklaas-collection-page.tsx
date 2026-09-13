import Image from 'next/image'
import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { getCategoryContent } from '@/content/categories'
import { getCategoryImage } from '@/content/category-images'
import type { EditorialCollection } from '@/content/collections/types'
import type { SeasonalCampaign } from '@/content/seasonal-campaigns'
import { getSeasonalPageBlueprint } from '@/content/seasonal-page-blueprints'
import { WinkelnuBrand } from './winkelnu-brand'
import { WinkelnuCategoryMenu } from './winkelnu-category-menu'
import { WinkelnuFooter } from './winkelnu-footer'
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

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M16 1c1.5 8.3 3.7 11 11 15-7.3 4-9.5 6.7-11 15-1.5-8.3-3.7-11-11-15C12.3 12 14.5 9.3 16 1Z" fill="currentColor" />
    </svg>
  )
}

function CrescentMoon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d="M45.5 52.5C28 54.5 14 41 15.6 24.1 16.8 11.9 27.2 4.3 36.8 3.2 28.4 10.6 27 22.8 32.9 32.1c5 7.9 14.4 11.8 23 9.1-2.2 5.5-5.6 9.1-10.4 11.3Z" fill="currentColor" />
    </svg>
  )
}

function Rooftops({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 110" aria-hidden="true" className={className}>
      <path d="M0 92h320v18H0z" fill="currentColor" opacity="0.08" />
      <path d="M8 92V66l35-26 35 26v26h18V57l32-24 32 24v35h20V69l39-29 39 29v23h18V60l27-20 27 20v32" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.28" />
      <path d="M53 44V22h12v30M229 50V26h12v32" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.28" />
      <rect x="28" y="72" width="8" height="11" rx="1" fill="currentColor" opacity="0.38" />
      <rect x="113" y="66" width="8" height="11" rx="1" fill="currentColor" opacity="0.38" />
      <rect x="205" y="73" width="8" height="11" rx="1" fill="currentColor" opacity="0.38" />
      <rect x="285" y="68" width="8" height="11" rx="1" fill="currentColor" opacity="0.38" />
    </svg>
  )
}

function GiftIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
      <path d="M12 7c-3.8 0-5.4-1.1-5.4-2.8C6.6 3 7.5 2 8.8 2c1.8 0 3.2 1.9 3.2 5Zm0 0c3.8 0 5.4-1.1 5.4-2.8C17.4 3 16.5 2 15.2 2 13.4 2 12 3.9 12 7Z" />
    </svg>
  )
}

function ShoeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h6c0 5.2 2.8 7.7 8.4 8.8 1.2.2 2.1 1.3 2.1 2.6V19H4.8A1.8 1.8 0 0 1 3 17.2v-1.7c0-1.1.7-2.1 1.8-2.5L7 12.2" />
      <path d="M9.8 9.5 7 12.2M12.8 12l-2.3 2" />
    </svg>
  )
}

function ToyIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="5.5" /><circle cx="7.2" cy="5.4" r="2.2" /><circle cx="16.8" cy="5.4" r="2.2" />
      <path d="M9.5 11.5h.01M14.5 11.5h.01M10 14.5c1.3.8 2.7.8 4 0M8.4 16.1 6.5 20M15.6 16.1l1.9 3.9" />
    </svg>
  )
}

function HeartIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 5.8c-2.1-2.1-5.4-2.1-7.5 0L12 7.1l-1.3-1.3c-2.1-2.1-5.4-2.1-7.5 0s-2.1 5.4 0 7.5L12 22l8.8-8.7c2.1-2.1 2.1-5.4 0-7.5Z" />
    </svg>
  )
}

function MoonGiftIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 3.2a7 7 0 0 0 3.3 11.7A8 8 0 1 1 15.5 3.2Z" />
      <path d="M13 14h8v6h-8zM12.5 12.2h9v1.8h-9M17 12.2v7.8" />
    </svg>
  )
}

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SinterklaasHeader() {
  const catalogEnabled = isPublicCatalogEnabled()

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-[#e3b861]/20 bg-[linear-gradient(90deg,#09182b_0%,#102945_46%,#59111b_100%)] text-white shadow-[0_10px_30px_rgba(8,20,37,0.28)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <CrescentMoon className="absolute -left-2 -top-9 h-24 w-24 rotate-[-12deg] text-[#f1d58d]/18" />
        <Rooftops className="absolute -bottom-11 right-0 h-24 w-72 text-[#f8e8bf] opacity-55" />
        <span className="absolute left-[17%] top-3 h-1.5 w-1.5 rounded-full bg-[#ffe7a8] shadow-[0_0_18px_6px_rgba(240,190,85,0.52)]" />
        <span className="absolute left-[42%] bottom-3 h-1 w-1 rounded-full bg-[#fff0c5] shadow-[0_0_15px_5px_rgba(240,190,85,0.48)]" />
        <span className="absolute right-[28%] top-4 h-1.5 w-1.5 rounded-full bg-[#ffd77e] shadow-[0_0_18px_6px_rgba(240,190,85,0.48)]" />
      </div>

      <a href="#inhoud" className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:m-3 focus:rounded-lg focus:bg-white focus:p-3 focus:text-[#172a46]">
        Direct naar inhoud
      </a>

      <div className="wn-container relative z-10 py-3.5">
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
            <form action="/zoeken" method="get" className="hidden min-w-[15rem] max-w-sm flex-1 items-center rounded-full border border-white/55 bg-[rgba(255,251,244,0.98)] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] lg:flex xl:max-w-md">
              <label htmlFor="winkelnu-sinterklaas-search" className="sr-only">Zoek een product, merk of categorie</label>
              <SearchIcon className="ml-2.5 h-5 w-5 shrink-0 text-[#687775]" />
              <input id="winkelnu-sinterklaas-search" type="search" name="q" placeholder="Zoek product, merk of categorie…" className="min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-medium text-[var(--wn-petrol-deep)] outline-none placeholder:font-normal placeholder:text-[#84918f]" />
              <button type="submit" className="min-h-10 rounded-full border border-[#efc76d]/45 bg-[#8a1723] px-4 py-2 text-xs font-bold text-white shadow-[0_6px_18px_rgba(78,10,20,0.30)] transition hover:-translate-y-px hover:bg-[#a11d2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efd28b] motion-reduce:transform-none">
                Zoeken
              </button>
            </form>
          ) : null}

          <div className="flex items-center gap-2 lg:hidden">
            {catalogEnabled ? (
              <Link href="/zoeken" aria-label="Zoeken" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efd28b]">
                <SearchIcon className="h-5 w-5" />
              </Link>
            ) : null}
            <details className="relative">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/16 marker:content-none">
                <MenuIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Menu</span>
              </summary>
              <div className="absolute right-0 z-50 mt-3 max-h-[calc(100vh-6rem)] w-[min(21rem,calc(100vw-2rem))] overflow-y-auto rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-cream)] p-3 text-[var(--wn-ink)] shadow-[var(--wn-shadow-lg)]">
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
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}

const plannerIcons = [ShoeIcon, ToyIcon, HeartIcon, MoonGiftIcon] as const

export function SinterklaasCollectionPage({ collection, campaign }: { collection: EditorialCollection; campaign: SeasonalCampaign }) {
  const blueprint = getSeasonalPageBlueprint(collection.slug)
  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)
  const catalogEnabled = isPublicCatalogEnabled()

  if (!blueprint) return null

  return (
    <div className="min-h-screen bg-[#fbf7ef] text-[var(--wn-ink)]">
      <SinterklaasHeader />
      <main id="inhoud">
        <section className="wn-container pt-6 sm:pt-7" aria-labelledby="sinterklaas-title">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#7d1b28]/20 bg-[#102541] text-white shadow-[0_28px_70px_rgba(11,25,44,0.20)]">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative flex min-h-[30rem] flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_14%,rgba(156,31,45,0.34),transparent_30%),linear-gradient(135deg,#09182b_0%,#102b49_52%,#711522_100%)] px-7 py-12 sm:px-10 lg:min-h-[34rem] lg:px-14">
                <CrescentMoon className="pointer-events-none absolute -left-6 -top-9 h-32 w-32 rotate-[-12deg] text-[#f5d47f]/20" />
                <Rooftops className="pointer-events-none absolute -bottom-5 right-0 h-36 w-80 text-[#f7dfaa] opacity-55" />
                <span aria-hidden="true" className="absolute -bottom-28 right-20 h-60 w-60 rounded-full border border-[#e5b85a]/48" />
                <Sparkle className="absolute left-[36%] top-[13%] h-5 w-5 text-[#f2ce79] drop-shadow-[0_0_8px_rgba(242,206,121,0.62)]" />
                <Sparkle className="absolute right-[8%] top-[30%] h-5 w-5 text-[#e5b85a]" />
                <Sparkle className="absolute bottom-[12%] left-[46%] h-6 w-6 text-[#efc86d]" />
                <span className="absolute bottom-[9%] left-[7%] h-1.5 w-1.5 rounded-full bg-[#ffe8aa] shadow-[0_0_18px_6px_rgba(242,194,95,0.52)]" />
                <span className="absolute left-[18%] top-[16%] h-1 w-1 rounded-full bg-[#fff0c5] shadow-[0_0_16px_5px_rgba(242,194,95,0.46)]" />

                <div className="relative z-10 max-w-xl">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f1cf7f]"><Sparkle className="h-3.5 w-3.5" /> Pakjesavond</p>
                  <h1 id="sinterklaas-title" className="wn-display mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#fffaf2] sm:text-6xl">{collection.title}</h1>
                  <p className="mt-7 max-w-xl text-base leading-8 text-white/78">{collection.intro}</p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {campaign.chips.map((chip) => (
                      <Link key={chip.href} href={chip.href} className="inline-flex min-h-10 items-center rounded-full border border-[#edc669]/30 bg-[#791724]/42 px-3.5 text-xs font-semibold text-[#fff8ef] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-[#efd58f]/65 hover:bg-[#8d1b29]/55">
                        {chip.label}
                      </Link>
                    ))}
                  </div>

                  <a href="#sinterklaas-plan" className="mt-8 inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-[#f0cd73] bg-[#9b1b2a] px-5 font-bold text-white shadow-[0_10px_28px_rgba(50,5,14,0.30),0_0_0_1px_rgba(255,222,145,0.14)] transition hover:-translate-y-0.5 hover:bg-[#b12132] motion-reduce:transform-none">
                    Plan je pakjesavond <ArrowIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="relative min-h-[25rem] overflow-hidden lg:min-h-[34rem]">
                {image ? <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover saturate-[0.88] contrast-[1.03]" style={{ objectPosition: image.position }} /> : null}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,30,53,0.38)_0%,rgba(13,30,53,0.02)_42%,rgba(128,22,34,0.08)_100%)]" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute right-[12%] top-[10%] h-2 w-2 rounded-full bg-[#ffe5a0] shadow-[0_0_25px_10px_rgba(244,199,93,0.56)]" />
                  <span className="absolute right-[22%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#fff0bd] shadow-[0_0_20px_8px_rgba(247,213,132,0.50)]" />
                  <span className="absolute bottom-[18%] left-[18%] h-1.5 w-1.5 rounded-full bg-[#ffd67f] shadow-[0_0_20px_8px_rgba(238,185,78,0.44)]" />
                </div>
                <span className="absolute bottom-6 right-6 rounded-full border border-[#edc568]/40 bg-[#111f36]/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#fff8ee] shadow-[0_8px_20px_rgba(8,20,38,0.28)] backdrop-blur-sm">Tijdelijke selectie</span>
              </div>
            </div>
          </div>
        </section>

        <section id="sinterklaas-plan" className="relative scroll-mt-28 overflow-hidden bg-[#fbf7ef]" aria-labelledby="sinterklaas-plan-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <Rooftops className="absolute -right-8 top-14 h-36 w-72 text-[#132b49] opacity-45" />
            <CrescentMoon className="absolute right-[17%] top-16 h-12 w-12 text-[#d3a84e]/55" />
            <Sparkle className="absolute right-[12%] top-36 h-6 w-6 text-[#c18c35]" />
            <span className="absolute right-[7%] top-44 h-1.5 w-1.5 rounded-full bg-[#ffd47d] shadow-[0_0_20px_8px_rgba(238,185,78,0.30)]" />
          </div>

          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8c1725]"><Sparkle className="h-4 w-4 text-[#b88632]" /> {blueprint.planner.eyebrow}</p>
              <div className="mt-3 flex items-center gap-6">
                <h2 id="sinterklaas-plan-title" className="wn-display text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#10283f] sm:text-5xl">{blueprint.planner.title}</h2>
                <span aria-hidden="true" className="hidden h-px w-10 bg-[#b98530] sm:block" />
              </div>
              <p className="mt-4 max-w-2xl leading-7 text-[#6e7471]">{blueprint.planner.description}</p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blueprint.planner.routes.map((route, index) => {
                const Icon = plannerIcons[index] ?? GiftIcon
                return (
                  <a key={route.href} href={route.href} className="group relative flex min-h-[16rem] flex-col overflow-hidden rounded-[1.35rem] border border-[#861825]/14 bg-[linear-gradient(180deg,#fffaf3_0%,#fff7ed_100%)] p-5 shadow-[0_16px_36px_rgba(51,38,28,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(59,39,30,0.13)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8c1725] sm:p-6">
                    <span aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#132b49]/10" />
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(116,19,31,0.04))]" />
                    {index === 0 ? <span aria-hidden="true" className="absolute -bottom-5 -left-3 h-14 w-24 rotate-[-9deg] rounded-[60%_35%_35%_40%] border-[5px] border-[#9a1c29]/30 bg-[#ead4ba]/40" /> : null}
                    {index === 1 ? <span aria-hidden="true" className="absolute -bottom-4 left-4 h-12 w-12 rounded-full bg-[#132b49]/10 shadow-[20px_-5px_0_#9a1c2914]" /> : null}
                    {index === 2 ? <span aria-hidden="true" className="absolute -bottom-5 left-5 h-12 w-16 rotate-[-8deg] rounded-md bg-[#d2a052]/24" /> : null}
                    {index === 3 ? <Rooftops className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-44 text-[#132b49] opacity-45" /> : null}

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center justify-between gap-3 text-[#8c1725]">
                        <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]"><Icon className="h-5 w-5" /> {route.label}</span>
                        <span className="text-xs font-bold text-[#132b49]">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="wn-display mt-5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#10283f]">{route.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-[#70736f]">{route.description}</p>
                      <span className="ml-auto mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#8c1725] text-white shadow-[0_8px_20px_rgba(77,10,21,0.20)] transition group-hover:translate-x-0.5 group-hover:bg-[#a41e2d]"><ArrowIcon className="h-4 w-4" /></span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <section id="inspiratie" className="border-t border-[#8c1725]/10 bg-[#fffaf3]" aria-labelledby="sinterklaas-inspiration-title">
          <div className="wn-container wn-section">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8c1725]">✦ Sinterklaas bij Winkelnu</p>
              <h2 id="sinterklaas-inspiration-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#10283f] sm:text-5xl">Kies waar je inspiratie voor zoekt.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#70736f]">Deze seizoenspagina brengt tijdelijke Sinterklaasthema&apos;s samen bovenop de vaste Winkelnu-rubrieken. Zo blijft vergelijken logisch, terwijl de sfeer helemaal pakjesavond wordt.</p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {collection.sections.map((section, index) => {
                const navy = index === 0 || index === 3
                const red = index === 1 || index === 4
                return (
                  <article key={section.slug} id={section.slug} className={`relative flex min-h-[18rem] flex-col overflow-hidden rounded-[1.5rem] border p-6 shadow-[0_16px_38px_rgba(52,38,26,0.08)] sm:p-7 ${navy ? 'border-[#e6bd66]/22 bg-[linear-gradient(145deg,#0c1d33,#173a5e)] text-white' : red ? 'border-[#e8bd64]/20 bg-[linear-gradient(145deg,#6d1320,#941d2c)] text-white' : 'border-[#8c1725]/12 bg-[#fff8ee] text-[#10283f]'}`}>
                    <Sparkle className={`absolute right-7 top-6 h-5 w-5 ${navy || red ? 'text-[#f2cf7c]' : 'text-[#b88936]'}`} />
                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${navy || red ? 'text-[#f3d78f]' : 'text-[#8c1725]'}`}>✦ Pakjesavond · {String(index + 1).padStart(2, '0')}</p>
                    <h3 className={`wn-display mt-6 text-3xl font-semibold leading-tight ${navy || red ? 'text-[#fff9ef]' : 'text-[#10283f]'}`}>{section.title}</h3>
                    <p className={`mt-4 flex-1 text-sm leading-7 ${navy || red ? 'text-white/72' : 'text-[#70736f]'}`}>{section.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {section.categorySlugs.map((categorySlug) => {
                        const category = getCategoryContent(categorySlug)
                        if (!category) return null
                        return <Link key={category.slug} href={`/koopgidsen/categorie/${category.slug}`} className={`inline-flex min-h-10 items-center rounded-full border px-3 text-xs font-semibold transition ${navy || red ? 'border-white/18 bg-white/10 text-white hover:bg-white/16' : 'border-[#8c1725]/15 bg-white/70 text-[#10283f] hover:border-[#8c1725]/35'}`}>{category.title}</Link>
                      })}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-[#8c1725]/10 bg-[linear-gradient(135deg,#f4e7d3_0%,#fff9f0_52%,#eadcc8_100%)]" aria-labelledby="sinterklaas-budget-title">
          <Rooftops className="pointer-events-none absolute -right-8 -top-2 h-32 w-64 text-[#132b49] opacity-35" />
          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8c1725]">{blueprint.budget.eyebrow}</p>
              <h2 id="sinterklaas-budget-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#10283f] sm:text-5xl">{blueprint.budget.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#70736f]">{blueprint.budget.description}</p>
            </div>
            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {blueprint.budget.tiers.map((tier) => (
                <article key={tier.label} className="rounded-[1.45rem] border border-[#8c1725]/12 bg-white/80 p-6 shadow-[0_14px_34px_rgba(67,48,29,0.07)] backdrop-blur-sm">
                  <span className="inline-flex rounded-full bg-[#8c1725] px-3 py-1.5 text-xs font-extrabold text-white">{tier.label}</span>
                  <h3 className="wn-display mt-5 text-2xl font-semibold tracking-[-0.025em] text-[#10283f]">{tier.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#70736f]">{tier.description}</p>
                  <ul className="mt-5 space-y-2 text-sm font-semibold text-[#253b4d]">
                    {tier.examples.map((example) => <li key={example} className="flex items-start gap-2"><span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c3943d]" /><span>{example}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-[#777b77]">{blueprint.budget.disclaimer}</p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_84%_8%,rgba(229,184,83,0.15),transparent_24%),linear-gradient(135deg,#09182b_0%,#173758_52%,#741522_100%)] text-white" aria-labelledby="sinterklaas-checklist-title">
          <Rooftops className="pointer-events-none absolute -bottom-8 right-0 h-32 w-72 text-[#f4ddb0] opacity-25" />
          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f1cf7f]">{blueprint.checklist.eyebrow}</p>
              <h2 id="sinterklaas-checklist-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fffaf2] sm:text-5xl">{blueprint.checklist.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/70">{blueprint.checklist.description}</p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {blueprint.checklist.items.map((item, index) => (
                <article key={item.title} className="rounded-[1.35rem] border border-[#f1cb76]/18 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
                  <span className="text-xs font-bold tracking-[0.16em] text-[#f1cf7f]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="wn-display mt-4 text-xl font-semibold leading-tight text-[#fffaf2]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/67">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {catalogEnabled && blueprint.search.enabled ? (
          <section className="bg-[#fffaf3]" aria-labelledby="sinterklaas-search-title">
            <div className="wn-container wn-section">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8c1725]">{blueprint.search.eyebrow}</p>
              <h2 id="sinterklaas-search-title" className="wn-display mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#10283f] sm:text-5xl">{blueprint.search.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#70736f]">{blueprint.search.description}</p>
              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {blueprint.search.routes.map((route) => (
                  <Link key={route.query} href={`/zoeken?q=${encodeURIComponent(route.query)}`} className="group flex min-h-[13rem] flex-col rounded-[1.35rem] border border-[#8c1725]/12 bg-white p-5 shadow-[0_12px_30px_rgba(66,45,27,0.06)]">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8c1725]">{route.label}</span>
                    <p className="mt-4 flex-1 text-sm leading-6 text-[#70736f]">{route.description}</p>
                    <span className="mt-5 text-xs font-bold text-[#132b49] transition group-hover:translate-x-0.5">Zoek producten →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0a192c_0%,#173653_45%,#771622_100%)] text-white">
          <Rooftops className="pointer-events-none absolute -right-6 bottom-0 h-32 w-72 text-[#f0d89f] opacity-24" />
          <CrescentMoon className="pointer-events-none absolute right-[18%] top-6 h-16 w-16 text-[#edc86f]/24" />
          <div className="wn-container wn-section relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f1cf7f]">Verder ontdekken</p>
              <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fffaf2]">Ook buiten pakjesavond blijft Cadeaus & feest beschikbaar.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">Daar vind je blijvende cadeau- en feestinspiratie, los van één specifieke periode in het jaar.</p>
            </div>
            <Link href="/collecties/cadeaus-feest" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#efcf83]/35 bg-white/10 px-5 font-bold text-white transition hover:bg-white/16">Naar Cadeaus & feest →</Link>
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
