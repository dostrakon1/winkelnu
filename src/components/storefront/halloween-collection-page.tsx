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

function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <circle cx="32" cy="32" r="22" fill="currentColor" />
      <circle cx="42" cy="24" r="20" fill="#07100f" />
    </svg>
  )
}

function BatIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M31.8 16.3C27 8.8 18.5 7 11.3 10.8 7.6 7.2 3.8 7 0 8.5c4.3 2 6.3 5 6.1 9.2 4.9-2 9.2-.9 12.7 3.1 4.4-2.7 8.7-2.3 13 .8 4.3-3.1 8.7-3.5 13-.8 3.5-4 7.8-5.1 12.7-3.1-.2-4.2 1.8-7.2 6.1-9.2-3.8-1.5-7.6-1.3-11.3 2.3C45.1 7 36.6 8.8 31.8 16.3Z" />
    </svg>
  )
}

function PumpkinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6c-4.8 0-8 2.8-8 6.6C4 16.4 7.2 19 12 19s8-2.6 8-6.4C20 8.8 16.8 6 12 6Z" />
      <path d="M12 6c-1.7 2-2.5 4.2-2.5 6.6S10.3 17 12 19c1.7-2 2.5-4.1 2.5-6.4S13.7 8 12 6Zm0 0c0-2 1.2-3.2 3.1-3.5" />
      <path d="m7.5 12 1.4-1.1M16.5 12l-1.4-1.1M9.3 15.1c1.7.9 3.7.9 5.4 0" />
    </svg>
  )
}

function MaskIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7.5c5-2 11-2 16 0v5.2c0 4.5-3.1 7.3-8 8.3-4.9-1-8-3.8-8-8.3V7.5Z" />
      <path d="M7.2 11.3c1.5-.7 2.9-.5 4 .5-1.4 1.4-2.9 1.5-4.4.4m10-0.9c-1.5-.7-2.9-.5-4 .5 1.4 1.4 2.9 1.5 4.4.4M10 16.2c1.3.8 2.7.8 4 0" />
    </svg>
  )
}

function WandIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 19 10-10M14 5l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Zm4 8 .7-1.4.7 1.4 1.4.7-1.4.7-.7 1.4-.7-1.4-1.4-.7 1.4-.7ZM5 7l.7-1.4L6.4 7l1.4.7-1.4.7-.7 1.4L5 8.4l-1.4-.7L5 7Z" />
    </svg>
  )
}

function LanternIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 7h8l1.5 13h-11L8 7Zm1-3h6l1 3H8l1-3Zm1.2 7.2h3.6v5.4h-3.6zM5 20h14" />
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

function HalloweenHeader() {
  const catalogEnabled = isPublicCatalogEnabled()

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-[#ff9a52]/16 bg-[linear-gradient(90deg,#020403_0%,#07110f_52%,#251008_100%)] text-white shadow-[0_10px_34px_rgba(0,0,0,0.34)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <MoonIcon className="absolute -left-3 -top-8 h-24 w-24 rotate-[-10deg] text-[#ffc583]/18" />
        <BatIcon className="absolute right-[13%] top-3 h-5 w-10 text-[#ffbd79]/16" />
        <BatIcon className="absolute right-[28%] bottom-2 h-3 w-7 text-white/10" />
        <span className="absolute left-[19%] top-3 h-1.5 w-1.5 rounded-full bg-[#ffd7ad] shadow-[0_0_18px_6px_rgba(255,154,82,0.42)]" />
        <span className="absolute left-[43%] bottom-3 h-1 w-1 rounded-full bg-[#ffb36f] shadow-[0_0_15px_5px_rgba(255,154,82,0.34)]" />
      </div>

      <a href="#inhoud" className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:m-3 focus:rounded-lg focus:bg-white focus:p-3 focus:text-[#172a24]">
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
            <form action="/zoeken" method="get" className="hidden min-w-[15rem] max-w-sm flex-1 items-center rounded-full border border-[#ffc087]/28 bg-[rgba(255,249,240,0.97)] p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.22)] lg:flex xl:max-w-md">
              <label htmlFor="winkelnu-halloween-search" className="sr-only">Zoek een product, merk of categorie</label>
              <SearchIcon className="ml-2.5 h-5 w-5 shrink-0 text-[#687775]" />
              <input id="winkelnu-halloween-search" type="search" name="q" placeholder="Zoek product, merk of categorie…" className="min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-medium text-[var(--wn-petrol-deep)] outline-none placeholder:font-normal placeholder:text-[#84918f]" />
              <button type="submit" className="min-h-10 rounded-full border border-[#ffbd7b]/35 bg-[#c75822] px-4 py-2 text-xs font-bold text-white shadow-[0_6px_18px_rgba(97,35,8,0.30)] transition hover:-translate-y-px hover:bg-[#dd692c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd2ae] motion-reduce:transform-none">
                Zoeken
              </button>
            </form>
          ) : null}

          <div className="flex items-center gap-2 lg:hidden">
            {catalogEnabled ? (
              <Link href="/zoeken" aria-label="Zoeken" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ffc087]/22 bg-white/[0.07] text-white transition hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb36f]">
                <SearchIcon className="h-5 w-5" />
              </Link>
            ) : null}
            <details className="relative">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-[#ffc087]/22 bg-white/[0.07] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/12 marker:content-none">
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

const plannerIcons = [PumpkinIcon, MaskIcon, WandIcon, LanternIcon] as const
const inspirationTones = [
  'border-[#ff9a52]/18 bg-[linear-gradient(145deg,#0b1714,#10241f)]',
  'border-[#cb6b36]/20 bg-[linear-gradient(145deg,#1b100b,#32170c)]',
  'border-[#b18c68]/16 bg-[linear-gradient(145deg,#101412,#1a211d)]',
  'border-[#ff9a52]/18 bg-[linear-gradient(145deg,#07110f,#151c17)]',
] as const

export function HalloweenCollectionPage({ collection, campaign }: { collection: EditorialCollection; campaign: SeasonalCampaign }) {
  const blueprint = getSeasonalPageBlueprint(collection.slug)
  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)

  if (!blueprint) return null

  return (
    <div className="min-h-screen bg-[#050807] text-white">
      <HalloweenHeader />
      <main id="inhoud">
        <section className="wn-container pt-6 sm:pt-7" aria-labelledby="halloween-title">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#ff9a52]/18 bg-[#07100f] shadow-[0_30px_90px_rgba(0,0,0,0.36)]">
            <div className="grid lg:grid-cols-[1.03fr_0.97fr]">
              <div className="relative flex min-h-[30rem] flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_12%,rgba(255,125,47,0.13),transparent_28%),linear-gradient(135deg,#020403_0%,#07110f_55%,#321207_100%)] px-7 py-12 sm:px-10 lg:min-h-[34rem] lg:px-14">
                <MoonIcon className="pointer-events-none absolute -left-8 -top-11 h-40 w-40 rotate-[-12deg] text-[#ffc583]/12" />
                <BatIcon className="pointer-events-none absolute right-[8%] top-[14%] h-7 w-14 text-[#ffb36f]/24" />
                <BatIcon className="pointer-events-none absolute right-[28%] top-[29%] h-4 w-9 text-white/12" />
                <span aria-hidden="true" className="absolute -bottom-24 right-12 h-64 w-64 rounded-full border border-[#ff9a52]/12" />
                <span className="absolute left-[9%] top-[18%] h-1.5 w-1.5 rounded-full bg-[#ffd6ad] shadow-[0_0_22px_8px_rgba(255,154,82,0.34)]" />
                <span className="absolute bottom-[13%] left-[39%] h-1 w-1 rounded-full bg-[#ffab58] shadow-[0_0_17px_6px_rgba(255,154,82,0.30)]" />

                <div className="relative z-10 max-w-xl">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ffad62]">
                    <PumpkinIcon className="h-4 w-4" /> Halloweenavond
                  </p>
                  <h1 id="halloween-title" className="wn-display mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#fff7ed] sm:text-6xl">
                    Halloween
                  </h1>
                  <p className="mt-7 max-w-xl text-base leading-8 text-white/70">{collection.intro}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {campaign.chips.map((chip) => (
                      <Link key={chip.href} href={chip.href} className="inline-flex min-h-10 items-center rounded-full border border-[#ffb36f]/22 bg-black/25 px-3.5 text-xs font-semibold text-[#fff4e8] transition hover:border-[#ffb36f]/50 hover:bg-[#ff9a52]/10">
                        {chip.label}
                      </Link>
                    ))}
                  </div>
                  <a href="#halloween-plan" className="mt-8 inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-[#ffbf7f]/35 bg-[#d26328] px-5 font-bold text-white shadow-[0_10px_32px_rgba(153,62,20,0.26),0_0_30px_rgba(255,154,82,0.10)] transition hover:-translate-y-0.5 hover:bg-[#e57233] motion-reduce:transform-none">
                    Plan je Halloween <ArrowIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="relative min-h-[25rem] overflow-hidden lg:min-h-[34rem]">
                {image ? (
                  <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover brightness-[0.34] saturate-[0.55] contrast-[1.13]" style={{ objectPosition: image.position }} />
                ) : null}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,3,0.82)_0%,rgba(2,4,3,0.24)_46%,rgba(48,17,6,0.28)_100%)]" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <MoonIcon className="absolute right-[8%] top-[7%] h-24 w-24 text-[#ffd49f]/12" />
                  <span className="absolute right-[16%] top-[20%] h-2 w-2 rounded-full bg-[#ffd5a7] shadow-[0_0_26px_10px_rgba(255,154,82,0.43)]" />
                  <span className="absolute right-[31%] top-[31%] h-1.5 w-1.5 rounded-full bg-[#ffab58] shadow-[0_0_20px_8px_rgba(255,154,82,0.34)]" />
                  <BatIcon className="absolute bottom-[20%] left-[12%] h-6 w-12 text-[#ffc087]/24" />
                </div>
                <span className="absolute bottom-6 right-6 rounded-full border border-[#ffc087]/28 bg-black/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#fff3e4] shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  Tijdelijke selectie
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="halloween-plan" className="relative scroll-mt-28 overflow-hidden bg-[#07100f]" aria-labelledby="halloween-plan-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#ff7d2f]/[0.045] blur-3xl" />
            <BatIcon className="absolute right-[9%] top-20 h-5 w-10 text-[#ffb36f]/18" />
          </div>
          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a52]">{blueprint.planner.eyebrow}</p>
              <h2 id="halloween-plan-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff7ed] sm:text-5xl">{blueprint.planner.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/60">{blueprint.planner.description}</p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blueprint.planner.routes.map((route, index) => {
                const Icon = plannerIcons[index % plannerIcons.length]
                return (
                  <a key={route.href} href={route.href} className="group relative flex min-h-[16rem] flex-col overflow-hidden rounded-[1.4rem] border border-[#ffb36f]/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,125,47,0.025))] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-[#ffb36f]/30 hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,125,47,0.05))] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff9a52] sm:p-6 motion-reduce:transform-none">
                    <span aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#ffb36f]/10" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center justify-between gap-3 text-[#ffad62]">
                        <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]"><Icon className="h-5 w-5" />{route.label}</span>
                        <span className="text-xs font-bold text-white/36">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="wn-display mt-5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#fff5e8]">{route.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-white/58">{route.description}</p>
                      <span className="ml-auto mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c75822] text-white shadow-[0_8px_22px_rgba(137,48,11,0.24)] transition group-hover:translate-x-0.5 group-hover:bg-[#de6a2d]"><ArrowIcon className="h-4 w-4" /></span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <section id="inspiratie" className="relative scroll-mt-28 overflow-hidden border-t border-[#ff9a52]/10 bg-[#0b1210]" aria-labelledby="halloween-inspiration-title">
          <div className="wn-container wn-section">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a52]">✦ Halloween bij Winkelnu</p>
              <h2 id="halloween-inspiration-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff7ed] sm:text-5xl">Kies waar je inspiratie voor zoekt.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/58">Van decoratie tot verkleding en van creatieve activiteiten tot verlichting: de vaste Winkelnu-rubrieken blijven intact, terwijl deze pagina alles tijdelijk in Halloween-sfeer samenbrengt.</p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {collection.sections.map((section, index) => (
                <article key={section.slug} id={section.slug} className={`relative flex min-h-[19rem] flex-col overflow-hidden rounded-[1.5rem] border p-6 shadow-[0_22px_55px_rgba(0,0,0,0.20)] sm:p-7 ${inspirationTones[index % inspirationTones.length]}`}>
                  <span aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-[#ffb36f]/10" />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffad62]">✦ Halloween</p>
                      <span className="text-xs font-bold tracking-[0.16em] text-white/32">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="wn-display mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#fff5e8]">{section.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-white/58">{section.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {section.categorySlugs.map((categorySlug) => {
                        const category = getCategoryContent(categorySlug)
                        if (!category) return null
                        return (
                          <Link key={category.slug} href={`/koopgidsen/categorie/${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[#ffc087]/16 bg-white/[0.06] px-3 text-xs font-semibold text-[#fff2e4] transition hover:border-[#ffc087]/40 hover:bg-[#ff9a52]/10">
                            {category.title}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-[#ff9a52]/10 bg-[radial-gradient(circle_at_82%_12%,rgba(255,125,47,0.08),transparent_25%),linear-gradient(135deg,#040706_0%,#0d1613_56%,#2b130a_100%)]" aria-labelledby="halloween-budget-title">
          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a52]">{blueprint.budget.eyebrow}</p>
              <h2 id="halloween-budget-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff7ed] sm:text-5xl">{blueprint.budget.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/58">{blueprint.budget.description}</p>
            </div>
            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {blueprint.budget.tiers.map((tier) => (
                <article key={tier.label} className="rounded-[1.45rem] border border-[#ffb36f]/14 bg-black/20 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-sm">
                  <span className="inline-flex rounded-full border border-[#ffbd7b]/22 bg-[#c75822] px-3 py-1.5 text-xs font-extrabold text-white">{tier.label}</span>
                  <h3 className="wn-display mt-5 text-2xl font-semibold tracking-[-0.025em] text-[#fff5e8]">{tier.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/56">{tier.description}</p>
                  <ul className="mt-5 space-y-2 text-sm font-semibold text-white/76">
                    {tier.examples.map((example) => (
                      <li key={example} className="flex items-start gap-2"><span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff9a52]" /><span>{example}</span></li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-white/40">{blueprint.budget.disclaimer}</p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#08110f_0%,#111b17_52%,#1f1009_100%)]" aria-labelledby="halloween-checklist-title">
          <MoonIcon className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 text-[#ffc583]/[0.055]" />
          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffad62]">{blueprint.checklist.eyebrow}</p>
              <h2 id="halloween-checklist-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff7ed] sm:text-5xl">{blueprint.checklist.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/58">{blueprint.checklist.description}</p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {blueprint.checklist.items.map((item, index) => (
                <article key={item.title} className="rounded-[1.35rem] border border-[#ffb36f]/12 bg-black/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-sm sm:p-6">
                  <span className="text-xs font-bold tracking-[0.16em] text-[#ffad62]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="wn-display mt-4 text-xl font-semibold leading-tight text-[#fff5e8]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/56">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-[#ff9a52]/10 bg-[linear-gradient(135deg,#020403_0%,#07110f_52%,#301207_100%)]">
          <BatIcon className="pointer-events-none absolute right-[10%] top-10 h-7 w-14 text-[#ffb36f]/16" />
          <div className="wn-container wn-section relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffad62]">Verder ontdekken</p>
              <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff7ed]">Ook buiten Halloween blijft Cadeaus &amp; feest beschikbaar.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">Daar vind je blijvende cadeau- en feestinspiratie, los van één specifieke periode in het jaar.</p>
            </div>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffc087]/22 bg-[#ff9a52]/10 px-5 font-bold text-white transition hover:bg-[#ff9a52]/16" href="/collecties/cadeaus-feest">
              Naar Cadeaus &amp; feest →
            </Link>
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
