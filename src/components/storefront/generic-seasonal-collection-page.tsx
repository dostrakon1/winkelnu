import Image from 'next/image'
import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { getCategoryContent } from '@/content/categories'
import { getCategoryImage } from '@/content/category-images'
import type { EditorialCollection } from '@/content/collections/types'
import type { SeasonalCampaign } from '@/content/seasonal-campaigns'
import { getSeasonalPageBlueprint } from '@/content/seasonal-page-blueprints'
import { EditorialFeatureCard, getEditorialTone } from './editorial-design'
import { EditorialShell } from './editorial-shell'

export function SeasonalCollectionPage({
  collection,
  campaign,
}: {
  collection: EditorialCollection
  campaign: SeasonalCampaign
}) {
  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)
  const blueprint = getSeasonalPageBlueprint(collection.slug)
  const catalogEnabled = isPublicCatalogEnabled()
  const plannerId = `${collection.slug}-plan`
  const isHalloween = collection.slug === 'halloween'
  const pageHeroGradient = isHalloween
    ? 'linear-gradient(135deg, #040706 0%, #0a1513 48%, #35170c 100%)'
    : campaign.heroGradient

  return (
    <EditorialShell>
      <section className="wn-container pt-5 sm:pt-7" aria-labelledby="seasonal-collection-title">
        <div
          className={`relative overflow-hidden rounded-[2rem] text-white shadow-[var(--wn-shadow-md)] ${
            isHalloween ? 'border border-[#ff9a52]/20 shadow-[0_28px_80px_rgba(5,9,8,0.30)]' : 'border border-white/20'
          }`}
          style={{ background: pageHeroGradient }}
        >
          <span aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <span aria-hidden="true" className="absolute -bottom-28 left-[32%] h-64 w-64 rounded-full border border-white/[0.06]" />

          {isHalloween ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
              <span className="absolute left-[8%] top-[11%] h-1.5 w-1.5 rounded-full bg-[#ffd7ad] shadow-[0_0_18px_6px_rgba(255,154,82,0.34)]" />
              <span className="absolute left-[20%] top-[19%] h-1 w-1 rounded-full bg-[#ffb36f] shadow-[0_0_16px_5px_rgba(255,154,82,0.28)]" />
              <span className="absolute left-[42%] top-[9%] h-1.5 w-1.5 rounded-full bg-[#ffe4c6] shadow-[0_0_20px_7px_rgba(255,190,122,0.25)]" />
              <span className="absolute bottom-[15%] left-[34%] h-1 w-1 rounded-full bg-[#ffb36f] shadow-[0_0_16px_5px_rgba(255,154,82,0.25)]" />
            </div>
          ) : null}

          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
            <div className="relative z-10 flex min-h-[29rem] flex-col justify-center px-7 py-11 sm:px-10 lg:px-14">
              <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: campaign.accentSoft }}>
                {campaign.eyebrow}
              </p>
              <h1
                id="seasonal-collection-title"
                className="wn-display mt-4 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#fffaf2] sm:text-6xl"
              >
                {collection.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/76">{collection.intro}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                {campaign.chips.map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className={`inline-flex min-h-10 items-center rounded-full px-3.5 text-xs font-semibold text-white transition ${
                      isHalloween
                        ? 'border border-[#ffc087]/24 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#ffc087]/50 hover:bg-[#ff9a52]/10'
                        : 'border border-white/18 bg-white/10 hover:border-white/35 hover:bg-white/15'
                    }`}
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>

              <a
                href={blueprint ? `#${plannerId}` : '#inspiratie'}
                className={`mt-8 inline-flex min-h-12 items-center self-start rounded-full px-5 font-bold text-[var(--wn-petrol-deep)] transition hover:-translate-y-0.5 motion-reduce:transform-none ${
                  isHalloween
                    ? 'shadow-[0_0_0_1px_rgba(255,211,174,0.15),0_10px_32px_rgba(255,125,47,0.28)]'
                    : 'shadow-[0_10px_24px_rgba(0,0,0,0.14)]'
                }`}
                style={{ backgroundColor: campaign.accentSoft }}
              >
                {blueprint?.heroCtaLabel ?? 'Bekijk de inspiratie ↓'}
              </a>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden lg:min-h-[32rem]">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 44vw"
                  className={isHalloween ? 'object-cover brightness-[0.48] saturate-[0.72] contrast-[1.10]' : 'object-cover'}
                  style={{ objectPosition: image.position }}
                />
              ) : null}
              <span
                aria-hidden="true"
                className={
                  isHalloween
                    ? 'absolute inset-0 bg-[linear-gradient(90deg,rgba(4,7,6,0.90)_0%,rgba(4,7,6,0.34)_48%,rgba(4,7,6,0.48)_100%)]'
                    : 'absolute inset-0 bg-[linear-gradient(90deg,rgba(13,46,45,0.38)_0%,rgba(13,46,45,0.03)_72%)]'
                }
              />
              {isHalloween ? (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute right-[12%] top-[16%] h-2 w-2 rounded-full bg-[#ffd8ab] shadow-[0_0_24px_9px_rgba(255,154,82,0.42)]" />
                  <span className="absolute right-[28%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#ffb066] shadow-[0_0_18px_7px_rgba(255,154,82,0.38)]" />
                  <span className="absolute bottom-[25%] right-[18%] h-1.5 w-1.5 rounded-full bg-[#ffe1bf] shadow-[0_0_22px_8px_rgba(255,188,115,0.32)]" />
                  <span className="absolute bottom-[34%] left-[28%] h-1 w-1 rounded-full bg-[#ffad5c] shadow-[0_0_17px_6px_rgba(255,154,82,0.32)]" />
                </div>
              ) : null}
              <span
                className={`absolute bottom-6 right-6 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm ${
                  isHalloween
                    ? 'border border-[#ffc087]/30 bg-black/55 shadow-[0_0_24px_rgba(255,154,82,0.12)]'
                    : 'border border-white/30 bg-[rgba(13,46,45,0.74)]'
                }`}
              >
                Tijdelijke selectie
              </span>
            </div>
          </div>
        </div>
      </section>

      {blueprint ? (
        <section
          id={plannerId}
          className={`relative scroll-mt-28 overflow-hidden ${isHalloween ? 'mt-8 bg-[#07100f] text-white sm:mt-10' : ''}`}
          aria-labelledby="seasonal-plan-title"
        >
          {isHalloween ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#ff7d2f]/[0.045] blur-3xl" />
              <span className="absolute right-[8%] top-20 h-1.5 w-1.5 rounded-full bg-[#ffd6ae] shadow-[0_0_22px_8px_rgba(255,154,82,0.28)]" />
              <span className="absolute right-[18%] top-40 h-1 w-1 rounded-full bg-[#ffab58] shadow-[0_0_16px_6px_rgba(255,154,82,0.24)]" />
            </div>
          ) : null}

          <div className="wn-container wn-section relative z-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
                {blueprint.planner.eyebrow}
              </p>
              <h2
                id="seasonal-plan-title"
                className={`wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl ${
                  isHalloween ? 'text-[#fff7ed]' : 'text-[var(--wn-petrol-deep)]'
                }`}
              >
                {blueprint.planner.title}
              </h2>
              <p className={`mt-4 max-w-2xl leading-7 ${isHalloween ? 'text-white/64' : 'wn-body-muted'}`}>
                {blueprint.planner.description}
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blueprint.planner.routes.map((route, index) => {
                const halloweenDarkCard = isHalloween && (index === 0 || index === 3)

                return (
                  <a
                    key={route.href}
                    href={route.href}
                    className={`wn-card-interactive group relative flex min-h-[15rem] flex-col overflow-hidden rounded-[1.4rem] p-5 shadow-[var(--wn-shadow-xs)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)] sm:p-6 ${
                      isHalloween
                        ? halloweenDarkCard
                          ? 'border border-[#ffb36f]/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,125,47,0.035))] text-white shadow-[0_18px_44px_rgba(0,0,0,0.20)]'
                          : 'border border-[#8f7155]/20 bg-[#d8cbb8] text-[#10201d] shadow-[0_18px_42px_rgba(0,0,0,0.14)]'
                        : 'border border-[rgba(18,59,58,0.12)] bg-[image:var(--wn-gradient-brand-cream)]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -right-8 -top-8 h-24 w-24 rounded-full border ${
                        isHalloween && halloweenDarkCard ? 'border-[#ffb36f]/15' : 'border-[var(--wn-petrol)]/10'
                      }`}
                    />
                    {isHalloween && halloweenDarkCard ? (
                      <span aria-hidden="true" className="absolute right-6 top-8 h-1 w-1 rounded-full bg-[#ffd5aa] shadow-[0_0_16px_6px_rgba(255,154,82,0.26)]" />
                    ) : null}
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: campaign.accent }}>
                          {route.label}
                        </span>
                        <span className={`text-xs font-bold ${halloweenDarkCard ? 'text-white/45' : 'text-[var(--wn-text-muted)]'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3
                        className={`wn-display mt-5 text-2xl font-semibold leading-tight tracking-[-0.025em] ${
                          halloweenDarkCard ? 'text-[#fff5e8]' : 'text-[var(--wn-petrol-deep)]'
                        }`}
                      >
                        {route.title}
                      </h3>
                      <p className={`mt-3 flex-1 text-sm leading-6 ${halloweenDarkCard ? 'text-white/62' : 'wn-body-muted'}`}>
                        {route.description}
                      </p>
                      <span
                        className={`mt-5 text-xs font-bold transition group-hover:translate-x-0.5 ${
                          halloweenDarkCard ? 'text-[#ffc18a]' : 'text-[var(--wn-petrol)]'
                        }`}
                      >
                        Bekijk deze route →
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="inspiratie"
        className={`relative scroll-mt-28 overflow-hidden ${isHalloween ? 'bg-[#111b18] text-white' : ''}`}
        aria-labelledby="seasonal-inspiration-title"
      >
        {isHalloween ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#ff9a52]/[0.035] blur-3xl" />
          </div>
        ) : null}
        <div className="wn-container wn-section relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
              ✦ {campaign.name} bij Winkelnu
            </p>
            <h2
              id="seasonal-inspiration-title"
              className={`wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl ${
                isHalloween ? 'text-[#fff7ed]' : 'text-[var(--wn-petrol-deep)]'
              }`}
            >
              Kies waar je inspiratie voor zoekt.
            </h2>
            <p className={`mt-4 max-w-2xl leading-7 ${isHalloween ? 'text-white/62' : 'wn-body-muted'}`}>
              Deze seizoenspagina legt een tijdelijke laag over de vaste Winkelnu-rubrieken. Zo kun je vanuit één moment gericht door naar de categorieën die echt bij je plan passen.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {collection.sections.map((section, index) => (
              <EditorialFeatureCard
                key={section.slug}
                tone={
                  isHalloween
                    ? index === 0 || index === 3
                      ? 'petrol'
                      : index === 1
                        ? 'peach'
                        : 'sage'
                    : getEditorialTone(index)
                }
                eyebrow={campaign.name}
                number={String(index + 1).padStart(2, '0')}
                title={section.title}
                description={section.description}
                className={`min-h-[19rem] ${isHalloween ? 'shadow-[0_22px_50px_rgba(0,0,0,0.18)]' : ''}`}
              >
                <div id={section.slug} className="flex flex-wrap gap-2 scroll-mt-28">
                  {section.categorySlugs.map((categorySlug) => {
                    const category = getCategoryContent(categorySlug)
                    if (!category) return null
                    return (
                      <Link
                        key={category.slug}
                        href={`/koopgidsen/categorie/${category.slug}`}
                        className="inline-flex min-h-10 items-center rounded-full border border-current/15 bg-white/35 px-3 text-xs font-semibold transition hover:bg-white/55"
                      >
                        {category.title}
                      </Link>
                    )
                  })}
                </div>
              </EditorialFeatureCard>
            ))}
          </div>
        </div>
      </section>

      {blueprint ? (
        <>
          <section
            className={`relative overflow-hidden border-y ${
              isHalloween
                ? 'border-[#ff9a52]/10 bg-[linear-gradient(135deg,#050807_0%,#0e1714_58%,#2d160d_100%)] text-white'
                : 'border-[var(--wn-border)] bg-[image:var(--wn-gradient-brand-sage)]'
            }`}
            aria-labelledby="seasonal-budget-title"
          >
            {isHalloween ? (
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <span className="absolute left-[7%] top-[18%] h-1.5 w-1.5 rounded-full bg-[#ffca99] shadow-[0_0_22px_8px_rgba(255,154,82,0.28)]" />
                <span className="absolute right-[9%] top-[28%] h-1 w-1 rounded-full bg-[#ffd9b1] shadow-[0_0_16px_6px_rgba(255,154,82,0.24)]" />
                <span className="absolute bottom-[16%] right-[31%] h-1.5 w-1.5 rounded-full bg-[#ffad5b] shadow-[0_0_18px_7px_rgba(255,154,82,0.20)]" />
              </div>
            ) : null}

            <div className="wn-container wn-section relative z-10">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
                  {blueprint.budget.eyebrow}
                </p>
                <h2
                  id="seasonal-budget-title"
                  className={`wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl ${
                    isHalloween ? 'text-[#fff7ed]' : 'text-[var(--wn-petrol-deep)]'
                  }`}
                >
                  {blueprint.budget.title}
                </h2>
                <p className={`mt-4 max-w-2xl leading-7 ${isHalloween ? 'text-white/62' : 'wn-body-muted'}`}>
                  {blueprint.budget.description}
                </p>
              </div>

              <div className="mt-9 grid gap-4 lg:grid-cols-3">
                {blueprint.budget.tiers.map((tier) => (
                  <article
                    key={tier.label}
                    className={`relative overflow-hidden rounded-[1.45rem] p-6 backdrop-blur-sm ${
                      isHalloween
                        ? 'border border-[#ffb36f]/16 bg-white/[0.055] shadow-[0_18px_48px_rgba(0,0,0,0.22)]'
                        : 'border border-white/70 bg-white/[0.76] shadow-[var(--wn-shadow-xs)]'
                    }`}
                  >
                    <span
                      className="inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold text-[var(--wn-petrol-deep)]"
                      style={{ backgroundColor: campaign.accentSoft }}
                    >
                      {tier.label}
                    </span>
                    <h3
                      className={`wn-display mt-5 text-2xl font-semibold tracking-[-0.025em] ${
                        isHalloween ? 'text-[#fff5e8]' : 'text-[var(--wn-petrol-deep)]'
                      }`}
                    >
                      {tier.title}
                    </h3>
                    <p className={`mt-3 text-sm leading-6 ${isHalloween ? 'text-white/60' : 'wn-body-muted'}`}>{tier.description}</p>
                    <ul className={`mt-5 space-y-2 text-sm font-semibold ${isHalloween ? 'text-white/80' : 'text-[var(--wn-petrol-deep)]'}`}>
                      {tier.examples.map((example) => (
                        <li key={example} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: campaign.accent }} />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <p className={`mt-5 text-xs leading-5 ${isHalloween ? 'text-white/44' : 'text-[var(--wn-text-muted)]'}`}>
                {blueprint.budget.disclaimer}
              </p>
            </div>
          </section>

          <section
            style={{ background: isHalloween ? 'linear-gradient(135deg, #111916 0%, #0a100f 52%, #24140d 100%)' : campaign.heroGradient }}
            className="relative overflow-hidden text-white"
            aria-labelledby="seasonal-checklist-title"
          >
            <div className="wn-container wn-section relative overflow-hidden">
              <span aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
              {isHalloween ? (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute left-[15%] top-[12%] h-1 w-1 rounded-full bg-[#ffd9b2] shadow-[0_0_17px_6px_rgba(255,154,82,0.23)]" />
                  <span className="absolute bottom-[18%] right-[12%] h-1.5 w-1.5 rounded-full bg-[#ffb365] shadow-[0_0_20px_7px_rgba(255,154,82,0.22)]" />
                </div>
              ) : null}
              <div className="relative z-10 max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accentSoft }}>
                  {blueprint.checklist.eyebrow}
                </p>
                <h2 id="seasonal-checklist-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fffaf2] sm:text-5xl">
                  {blueprint.checklist.title}
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-white/68">{blueprint.checklist.description}</p>
              </div>

              <div className="relative z-10 mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {blueprint.checklist.items.map((item, index) => (
                  <article
                    key={item.title}
                    className={`rounded-[1.35rem] p-5 backdrop-blur-sm sm:p-6 ${
                      isHalloween
                        ? 'border border-[#ffb36f]/14 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                        : 'border border-white/14 bg-white/[0.07]'
                    }`}
                  >
                    <span className="text-xs font-bold tracking-[0.16em]" style={{ color: campaign.accentSoft }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="wn-display mt-4 text-xl font-semibold leading-tight text-[#fffaf2]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/66">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {catalogEnabled && blueprint.search.enabled ? (
            <section className={isHalloween ? 'bg-[#111b18] text-white' : ''} aria-labelledby="seasonal-search-title">
              <div className="wn-container wn-section">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
                    {blueprint.search.eyebrow}
                  </p>
                  <h2
                    id="seasonal-search-title"
                    className={`wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl ${
                      isHalloween ? 'text-[#fff7ed]' : 'text-[var(--wn-petrol-deep)]'
                    }`}
                  >
                    {blueprint.search.title}
                  </h2>
                  <p className={`mt-4 max-w-2xl leading-7 ${isHalloween ? 'text-white/62' : 'wn-body-muted'}`}>
                    {blueprint.search.description}
                  </p>
                </div>

                <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {blueprint.search.routes.map((route) => (
                    <Link
                      key={route.query}
                      href={`/zoeken?q=${encodeURIComponent(route.query)}`}
                      className={`wn-card-interactive group flex min-h-[13rem] flex-col rounded-[1.35rem] p-5 shadow-[var(--wn-shadow-xs)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)] ${
                        isHalloween ? 'border border-[#ffb36f]/14 bg-black/20' : 'border border-[var(--wn-border)] bg-white'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: campaign.accent }}>
                        {route.label}
                      </span>
                      <p className={`mt-4 flex-1 text-sm leading-6 ${isHalloween ? 'text-white/62' : 'wn-body-muted'}`}>
                        {route.description}
                      </p>
                      <span className={`mt-5 text-xs font-bold transition group-hover:translate-x-0.5 ${isHalloween ? 'text-[#ffc18a]' : 'text-[var(--wn-petrol)]'}`}>
                        Zoek producten →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      <section style={{ background: pageHeroGradient }} className="relative overflow-hidden text-white">
        {isHalloween ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute left-[9%] top-[28%] h-1.5 w-1.5 rounded-full bg-[#ffd7ad] shadow-[0_0_22px_8px_rgba(255,154,82,0.27)]" />
            <span className="absolute right-[16%] top-[24%] h-1 w-1 rounded-full bg-[#ffad5b] shadow-[0_0_17px_6px_rgba(255,154,82,0.22)]" />
            <span className="absolute bottom-[20%] right-[30%] h-1.5 w-1.5 rounded-full bg-[#ffe3c2] shadow-[0_0_20px_7px_rgba(255,188,115,0.18)]" />
          </div>
        ) : null}
        <div className="wn-container wn-section relative overflow-hidden">
          <span aria-hidden="true" className="absolute -right-20 top-6 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accentSoft }}>Verder ontdekken</p>
              <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fffaf2]">
                Ook buiten het seizoen blijft Cadeaus & feest beschikbaar.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
                Daar vind je blijvende cadeau- en feestinspiratie, los van één specifieke periode in het jaar.
              </p>
            </div>
            <Link
              href="/collecties/cadeaus-feest"
              className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 font-bold text-white transition ${
                isHalloween
                  ? 'border border-[#ffc087]/24 bg-[#ff9a52]/10 shadow-[0_0_30px_rgba(255,154,82,0.12)] hover:bg-[#ff9a52]/16'
                  : 'border border-white/22 bg-white/10 hover:bg-white/16'
              }`}
            >
              Naar Cadeaus & feest →
            </Link>
          </div>
        </div>
      </section>
    </EditorialShell>
  )
}
