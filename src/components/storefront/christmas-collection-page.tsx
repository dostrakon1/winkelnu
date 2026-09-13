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

function ChristmasSprig({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 110" aria-hidden="true" className={className}>
      <path d="M10 95C45 70 86 47 164 18" stroke="#856438" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[
        [32, 81, -38], [44, 73, 24], [57, 65, -35], [70, 58, 27], [83, 50, -32], [97, 43, 30], [111, 37, -28], [126, 30, 31], [140, 25, -24],
      ].map(([x, y, r], index) => (
        <g key={index} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 0C10-16 22-24 40-25C28-11 17-3 0 0Z" fill={index % 2 === 0 ? '#1f4f3d' : '#2d644d'} />
          <path d="M4 -2C15-12 25-18 36-21" stroke="#6e8669" strokeWidth="1" fill="none" />
        </g>
      ))}
      <circle cx="120" cy="42" r="7" fill="#a20f1d" />
      <circle cx="133" cy="36" r="6" fill="#c0212e" />
      <circle cx="143" cy="48" r="7" fill="#8f0d18" />
      <circle cx="132" cy="53" r="5" fill="#b91f2a" />
      <circle cx="120" cy="42" r="2" fill="#f6d79d" opacity="0.7" />
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

function GiftIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
      <path d="M12 7c-3.8 0-5.4-1.1-5.4-2.8C6.6 3 7.5 2 8.8 2c1.8 0 3.2 1.9 3.2 5Zm0 0c3.8 0 5.4-1.1 5.4-2.8C17.4 3 16.5 2 15.2 2 13.4 2 12 3.9 12 7Z" />
    </svg>
  )
}

function HomeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 9-8 9 8" /><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" />
    </svg>
  )
}

function TableIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7M4 3v4c0 1.7 1 3 2 3s2-1.3 2-3V3M6 10v11M16 3v18M13 3v6c0 2 1.3 3 3 3s3-1 3-3V3" />
    </svg>
  )
}

function BearIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="6" /><circle cx="7" cy="5" r="2.5" /><circle cx="17" cy="5" r="2.5" /><path d="M9.5 11.5h.01M14.5 11.5h.01M10 15c1.2.9 2.8.9 4 0M8 17.5 6.5 21M16 17.5l1.5 3.5" />
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

function ChristmasHeader() {
  const catalogEnabled = isPublicCatalogEnabled()

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-[#f4c777]/20 bg-[linear-gradient(90deg,#180706_0%,#3f0a0d_48%,#250907_100%)] text-white shadow-[0_10px_30px_rgba(55,8,9,0.24)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <ChristmasSprig className="absolute -left-8 -top-8 h-24 w-44 -rotate-6 opacity-80" />
        <ChristmasSprig className="absolute -right-10 -top-7 h-24 w-44 scale-x-[-1] rotate-3 opacity-80" />
        <span className="absolute left-[18%] top-3 h-1.5 w-1.5 rounded-full bg-[#ffd990] shadow-[0_0_18px_6px_rgba(255,200,98,0.56)]" />
        <span className="absolute left-[42%] bottom-3 h-1 w-1 rounded-full bg-[#ffe6ad] shadow-[0_0_15px_5px_rgba(255,200,98,0.50)]" />
        <span className="absolute right-[29%] top-4 h-1.5 w-1.5 rounded-full bg-[#ffd990] shadow-[0_0_18px_6px_rgba(255,200,98,0.52)]" />
      </div>

      <a href="#inhoud" className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:m-3 focus:rounded-lg focus:bg-white focus:p-3 focus:text-[#7d1018]">
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
            <form action="/zoeken" method="get" className="hidden min-w-[15rem] max-w-sm flex-1 items-center rounded-full border border-white/55 bg-[rgba(255,250,242,0.98)] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] lg:flex xl:max-w-md">
              <label htmlFor="winkelnu-christmas-search" className="sr-only">Zoek een product, merk of categorie</label>
              <SearchIcon className="ml-2.5 h-5 w-5 shrink-0 text-[#687775]" />
              <input id="winkelnu-christmas-search" type="search" name="q" placeholder="Zoek product, merk of categorie…" className="min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-medium text-[var(--wn-petrol-deep)] outline-none placeholder:font-normal placeholder:text-[#84918f]" />
              <button type="submit" className="min-h-10 rounded-full border border-[#f0c261]/50 bg-[#a5131e] px-4 py-2 text-xs font-bold text-white shadow-[0_6px_18px_rgba(111,8,16,0.32)] transition hover:-translate-y-px hover:bg-[#bd1b27] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4cf80] motion-reduce:transform-none">
                Zoeken
              </button>
            </form>
          ) : null}

          <div className="flex items-center gap-2 lg:hidden">
            {catalogEnabled ? (
              <Link href="/zoeken" aria-label="Zoeken" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4cf80]">
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

const plannerIcons = [GiftIcon, HomeIcon, TableIcon, BearIcon] as const

export function ChristmasCollectionPage({ collection, campaign }: { collection: EditorialCollection; campaign: SeasonalCampaign }) {
  const blueprint = getSeasonalPageBlueprint(collection.slug)
  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)
  const catalogEnabled = isPublicCatalogEnabled()

  if (!blueprint) return null

  return (
    <div className="min-h-screen bg-[#faf6ef] text-[var(--wn-ink)]">
      <ChristmasHeader />
      <main id="inhoud">
        <section className="wn-container pt-6 sm:pt-7" aria-labelledby="christmas-title">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#8d1a23]/20 bg-[#721018] text-white shadow-[0_28px_70px_rgba(74,15,18,0.18)]">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative flex min-h-[30rem] flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_18%_15%,rgba(184,37,44,0.42),transparent_28%),linear-gradient(135deg,#360708_0%,#681016_48%,#8e1720_100%)] px-7 py-12 sm:px-10 lg:min-h-[34rem] lg:px-14">
                <ChristmasSprig className="pointer-events-none absolute -left-12 -top-12 h-40 w-64 -rotate-6 opacity-90" />
                <ChristmasSprig className="pointer-events-none absolute -bottom-8 right-[-4rem] h-40 w-64 rotate-[166deg] opacity-90" />
                <span aria-hidden="true" className="absolute -bottom-28 right-20 h-60 w-60 rounded-full border border-[#f0bf63]/65" />
                <Sparkle className="absolute left-[36%] top-[13%] h-5 w-5 text-[#f4ca73] drop-shadow-[0_0_8px_rgba(244,202,115,0.65)]" />
                <Sparkle className="absolute right-[8%] top-[30%] h-5 w-5 text-[#eebd63]" />
                <Sparkle className="absolute bottom-[11%] left-[47%] h-6 w-6 text-[#efc26a]" />
                <span className="absolute bottom-[8%] left-[7%] h-1.5 w-1.5 rounded-full bg-[#ffe8aa] shadow-[0_0_18px_6px_rgba(255,209,120,0.55)]" />
                <span className="absolute left-[18%] top-[16%] h-1 w-1 rounded-full bg-[#ffedbb] shadow-[0_0_16px_5px_rgba(255,213,132,0.48)]" />

                <div className="relative z-10 max-w-xl">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f4cf80]"><Sparkle className="h-3.5 w-3.5" /> Kerstselectie</p>
                  <h1 id="christmas-title" className="wn-display mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#fffaf2] sm:text-6xl">{collection.title}</h1>
                  <p className="mt-7 max-w-xl text-base leading-8 text-white/78">{collection.intro}</p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {campaign.chips.map((chip) => (
                      <Link key={chip.href} href={chip.href} className="inline-flex min-h-10 items-center rounded-full border border-[#f1ba64]/30 bg-[#9b1720]/45 px-3.5 text-xs font-semibold text-[#fff7ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-[#f4cf80]/65 hover:bg-[#ad1c27]/55">
                        {chip.label}
                      </Link>
                    ))}
                  </div>

                  <a href="#kerst-plan" className="mt-8 inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-[#f2c96f] bg-[#c6242f] px-5 font-bold text-white shadow-[0_10px_28px_rgba(89,5,10,0.34),0_0_0_1px_rgba(255,220,144,0.15)] transition hover:-translate-y-0.5 hover:bg-[#d62c38] motion-reduce:transform-none">
                    Plan je kerst <ArrowIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="relative min-h-[25rem] overflow-hidden lg:min-h-[34rem]">
                {image ? <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover saturate-[0.9] contrast-[1.03]" style={{ objectPosition: image.position }} /> : null}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75,8,12,0.20)_0%,rgba(75,8,12,0.01)_38%,rgba(255,198,91,0.08)_100%)]" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute right-[12%] top-[10%] h-2 w-2 rounded-full bg-[#ffe6a5] shadow-[0_0_25px_10px_rgba(255,206,99,0.58)]" />
                  <span className="absolute right-[22%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#fff0bd] shadow-[0_0_20px_8px_rgba(255,213,124,0.54)]" />
                  <span className="absolute bottom-[18%] left-[18%] h-1.5 w-1.5 rounded-full bg-[#ffd88c] shadow-[0_0_20px_8px_rgba(255,198,91,0.46)]" />
                </div>
                <span className="absolute bottom-6 right-6 rounded-full border border-[#efc269]/40 bg-[#81131b]/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#fff8ee] shadow-[0_8px_20px_rgba(72,8,11,0.25)] backdrop-blur-sm">Tijdelijke selectie</span>
              </div>
            </div>
          </div>
        </section>

        <section id="kerst-plan" className="relative scroll-mt-28 overflow-hidden bg-[#faf6ef]" aria-labelledby="christmas-plan-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <ChristmasSprig className="absolute -right-12 top-12 h-36 w-56 scale-x-[-1] -rotate-6 opacity-95" />
            <Sparkle className="absolute right-[13%] top-32 h-7 w-7 text-[#c58a37]" />
            <Sparkle className="absolute right-[21%] top-20 h-4 w-4 text-[#c58a37]" />
            <span className="absolute right-[8%] top-40 h-1.5 w-1.5 rounded-full bg-[#ffd689] shadow-[0_0_20px_8px_rgba(255,199,91,0.35)]" />
          </div>

          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#a9131e]"><Sparkle className="h-4 w-4 text-[#c28a39]" /> {blueprint.planner.eyebrow}</p>
              <div className="mt-3 flex items-center gap-6">
                <h2 id="christmas-plan-title" className="wn-display text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102d2b] sm:text-5xl">{blueprint.planner.title}</h2>
                <span aria-hidden="true" className="hidden h-px w-10 bg-[#bd7f2d] sm:block" />
              </div>
              <p className="mt-4 max-w-2xl leading-7 text-[#6e7471]">{blueprint.planner.description}</p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blueprint.planner.routes.map((route, index) => {
                const Icon = plannerIcons[index] ?? GiftIcon
                return (
                  <a key={route.href} href={route.href} className="group relative flex min-h-[16rem] flex-col overflow-hidden rounded-[1.35rem] border border-[#aa1b24]/14 bg-[linear-gradient(180deg,#fffaf4_0%,#fff7ef_100%)] p-5 shadow-[0_16px_36px_rgba(72,44,26,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(86,44,28,0.13)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b51d27] sm:p-6">
                    <span aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#9f1720]/10" />
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(143,20,29,0.035))]" />
                    <ChristmasSprig className={`pointer-events-none absolute -bottom-9 h-24 w-36 opacity-85 ${index % 2 === 0 ? '-left-9 rotate-6' : '-right-9 scale-x-[-1] -rotate-6'}`} />
                    {index === 0 ? <span aria-hidden="true" className="absolute -bottom-6 -left-2 h-16 w-24 rotate-[-12deg] rounded-xl bg-[linear-gradient(135deg,#c18d58,#e5c091)] opacity-45" /> : null}
                    {index === 2 ? <span aria-hidden="true" className="absolute -bottom-4 left-1/2 h-12 w-12 rounded-full border-[8px] border-[#d2a665]/45 bg-[#f7dca8]/30" /> : null}
                    {index === 3 ? <span aria-hidden="true" className="absolute -bottom-4 left-2 h-12 w-16 rotate-[-8deg] rounded-md bg-[#ad1c28]/55" /> : null}

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center justify-between gap-3 text-[#a9131e]">
                        <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em]"><Icon className="h-5 w-5" /> {route.label}</span>
                        <span className="text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="wn-display mt-5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#102d2b]">{route.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-[#70736f]">{route.description}</p>
                      <span className="ml-auto mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#a9131e] text-white shadow-[0_8px_20px_rgba(99,12,18,0.22)] transition group-hover:translate-x-0.5 group-hover:bg-[#bf1c28]"><ArrowIcon className="h-4 w-4" /></span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <section id="inspiratie" className="border-t border-[#9b1720]/10 bg-[#fffaf3]" aria-labelledby="christmas-inspiration-title">
          <div className="wn-container wn-section">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9131e]">✦ Kerst bij Winkelnu</p>
              <h2 id="christmas-inspiration-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102d2b] sm:text-5xl">Kies waar je inspiratie voor zoekt.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#70736f]">Deze seizoenspagina brengt tijdelijke kerstthema&apos;s samen bovenop de vaste Winkelnu-rubrieken. Zo blijft de route naar vergelijken logisch, terwijl de sfeer helemaal Kerst wordt.</p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {collection.sections.map((section, index) => {
                const dark = index === 0 || index === 4
                const green = index === 1
                return (
                  <article key={section.slug} id={section.slug} className={`relative flex min-h-[18rem] flex-col overflow-hidden rounded-[1.5rem] border p-6 shadow-[0_16px_38px_rgba(68,38,20,0.08)] sm:p-7 ${dark ? 'border-[#efbd67]/25 bg-[linear-gradient(145deg,#661017,#8d1821)] text-white' : green ? 'border-[#244e40]/20 bg-[linear-gradient(145deg,#173d32,#285b49)] text-white' : 'border-[#a9131e]/12 bg-[#fff8ef] text-[#102d2b]'}`}>
                    <Sparkle className={`absolute right-7 top-6 h-5 w-5 ${dark || green ? 'text-[#f2c972]' : 'text-[#b98334]'}`} />
                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${dark || green ? 'text-[#f3cf83]' : 'text-[#a9131e]'}`}>✦ Kerst · {String(index + 1).padStart(2, '0')}</p>
                    <h3 className={`wn-display mt-6 text-3xl font-semibold leading-tight ${dark || green ? 'text-[#fff9ef]' : 'text-[#102d2b]'}`}>{section.title}</h3>
                    <p className={`mt-4 flex-1 text-sm leading-7 ${dark || green ? 'text-white/72' : 'text-[#70736f]'}`}>{section.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {section.categorySlugs.map((categorySlug) => {
                        const category = getCategoryContent(categorySlug)
                        if (!category) return null
                        return <Link key={category.slug} href={`/koopgidsen/categorie/${category.slug}`} className={`inline-flex min-h-10 items-center rounded-full border px-3 text-xs font-semibold transition ${dark || green ? 'border-white/18 bg-white/10 text-white hover:bg-white/16' : 'border-[#a9131e]/15 bg-white/70 text-[#102d2b] hover:border-[#a9131e]/35'}`}>{category.title}</Link>
                      })}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-[#a9131e]/10 bg-[linear-gradient(135deg,#f8ead7_0%,#fff8ee_52%,#f2dfc7_100%)]" aria-labelledby="christmas-budget-title">
          <ChristmasSprig className="pointer-events-none absolute -right-14 -top-6 h-36 w-56 scale-x-[-1] opacity-75" />
          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9131e]">{blueprint.budget.eyebrow}</p>
              <h2 id="christmas-budget-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102d2b] sm:text-5xl">{blueprint.budget.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#70736f]">{blueprint.budget.description}</p>
            </div>
            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {blueprint.budget.tiers.map((tier) => (
                <article key={tier.label} className="rounded-[1.45rem] border border-[#a9131e]/12 bg-white/80 p-6 shadow-[0_14px_34px_rgba(76,44,26,0.07)] backdrop-blur-sm">
                  <span className="inline-flex rounded-full bg-[#a9131e] px-3 py-1.5 text-xs font-extrabold text-white">{tier.label}</span>
                  <h3 className="wn-display mt-5 text-2xl font-semibold tracking-[-0.025em] text-[#102d2b]">{tier.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#70736f]">{tier.description}</p>
                  <ul className="mt-5 space-y-2 text-sm font-semibold text-[#263b38]">
                    {tier.examples.map((example) => <li key={example} className="flex items-start gap-2"><span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b51d27]" /><span>{example}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-[#777b77]">{blueprint.budget.disclaimer}</p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_10%,rgba(225,173,86,0.16),transparent_24%),linear-gradient(135deg,#3a080b_0%,#75131b_55%,#173d33_100%)] text-white" aria-labelledby="christmas-checklist-title">
          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4cf80]">{blueprint.checklist.eyebrow}</p>
              <h2 id="christmas-checklist-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fffaf2] sm:text-5xl">{blueprint.checklist.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/70">{blueprint.checklist.description}</p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {blueprint.checklist.items.map((item, index) => (
                <article key={item.title} className="rounded-[1.35rem] border border-[#f2c56d]/18 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
                  <span className="text-xs font-bold tracking-[0.16em] text-[#f4cf80]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="wn-display mt-4 text-xl font-semibold leading-tight text-[#fffaf2]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/67">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {catalogEnabled && blueprint.search.enabled ? (
          <section className="bg-[#fffaf3]" aria-labelledby="christmas-search-title">
            <div className="wn-container wn-section">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9131e]">{blueprint.search.eyebrow}</p>
              <h2 id="christmas-search-title" className="wn-display mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102d2b] sm:text-5xl">{blueprint.search.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#70736f]">{blueprint.search.description}</p>
              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {blueprint.search.routes.map((route) => (
                  <Link key={route.query} href={`/zoeken?q=${encodeURIComponent(route.query)}`} className="group flex min-h-[13rem] flex-col rounded-[1.35rem] border border-[#a9131e]/12 bg-white p-5 shadow-[0_12px_30px_rgba(75,42,25,0.06)]">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#a9131e]">{route.label}</span>
                    <p className="mt-4 flex-1 text-sm leading-6 text-[#70736f]">{route.description}</p>
                    <span className="mt-5 text-xs font-bold text-[#8d151e] transition group-hover:translate-x-0.5">Zoek producten →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#46090d_0%,#8a1721_62%,#173d33_100%)] text-white">
          <ChristmasSprig className="pointer-events-none absolute -right-10 top-2 h-40 w-64 scale-x-[-1] opacity-70" />
          <div className="wn-container wn-section relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4cf80]">Verder ontdekken</p>
              <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fffaf2]">Ook buiten het seizoen blijft Cadeaus & feest beschikbaar.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">Daar vind je blijvende cadeau- en feestinspiratie, los van één specifieke periode in het jaar.</p>
            </div>
            <Link href="/collecties/cadeaus-feest" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#f3cc7c]/35 bg-white/10 px-5 font-bold text-white transition hover:bg-white/16">Naar Cadeaus & feest →</Link>
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
