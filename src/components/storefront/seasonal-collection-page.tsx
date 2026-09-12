import Image from 'next/image'
import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { getCategoryContent } from '@/content/categories'
import { getCategoryImage } from '@/content/category-images'
import type { EditorialCollection } from '@/content/collections/types'
import type { SeasonalCampaign } from '@/content/seasonal-campaigns'
import { getSeasonalPageBlueprint } from '@/content/seasonal-page-blueprints'
import { EditorialFeatureCard, getEditorialTone } from './editorial-design'
import { Breadcrumbs, EditorialShell } from './editorial-shell'

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

  return (
    <EditorialShell>
      <div className="wn-container pt-8">
        <Breadcrumbs items={[{ label: 'Collecties' }, { label: collection.title }]} />
      </div>

      <section className="wn-container pt-8 sm:pt-10" aria-labelledby="seasonal-collection-title">
        <div
          className="relative overflow-hidden rounded-[2rem] border border-white/20 text-white shadow-[var(--wn-shadow-md)]"
          style={{ background: campaign.heroGradient }}
        >
          <span aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <span aria-hidden="true" className="absolute -bottom-28 left-[32%] h-64 w-64 rounded-full border border-white/[0.06]" />

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
                    className="inline-flex min-h-10 items-center rounded-full border border-white/18 bg-white/10 px-3.5 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>

              <a
                href={blueprint?.heroCtaHref ?? '#inspiratie'}
                className="mt-8 inline-flex min-h-12 items-center self-start rounded-full px-5 font-bold text-[var(--wn-petrol-deep)] shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 motion-reduce:transform-none"
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
                  className="object-cover"
                  style={{ objectPosition: image.position }}
                />
              ) : null}
              <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,46,45,0.38)_0%,rgba(13,46,45,0.03)_72%)]" />
              <span className="absolute bottom-6 right-6 rounded-full border border-white/30 bg-[rgba(13,46,45,0.74)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                Tijdelijke selectie
              </span>
            </div>
          </div>
        </div>
      </section>

      {blueprint ? (
        <section id="halloween-plan" className="wn-container wn-section scroll-mt-28" aria-labelledby="seasonal-plan-title">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
              {blueprint.planner.eyebrow}
            </p>
            <h2 id="seasonal-plan-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
              {blueprint.planner.title}
            </h2>
            <p className="wn-body-muted mt-4 max-w-2xl leading-7">{blueprint.planner.description}</p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {blueprint.planner.routes.map((route, index) => (
              <a
                key={route.href}
                href={route.href}
                className="wn-card-interactive group relative flex min-h-[15rem] flex-col overflow-hidden rounded-[1.4rem] border border-[rgba(18,59,58,0.12)] bg-[image:var(--wn-gradient-brand-cream)] p-5 shadow-[var(--wn-shadow-xs)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)] sm:p-6"
              >
                <span aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[var(--wn-petrol)]/10" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: campaign.accent }}>
                      {route.label}
                    </span>
                    <span className="text-xs font-bold text-[var(--wn-text-muted)]">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="wn-display mt-5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[var(--wn-petrol-deep)]">{route.title}</h3>
                  <p className="wn-body-muted mt-3 flex-1 text-sm leading-6">{route.description}</p>
                  <span className="mt-5 text-xs font-bold text-[var(--wn-petrol)] transition group-hover:translate-x-0.5">
                    Bekijk deze route →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section id="inspiratie" className="wn-container wn-section scroll-mt-28" aria-labelledby="seasonal-inspiration-title">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
            ✦ {campaign.name} bij Winkelnu
          </p>
          <h2 id="seasonal-inspiration-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
            Kies waar je inspiratie voor zoekt.
          </h2>
          <p className="wn-body-muted mt-4 max-w-2xl leading-7">
            Deze seizoenspagina legt een tijdelijke laag over de vaste Winkelnu-rubrieken. Zo kun je vanuit één moment gericht door naar de categorieën die echt bij je plan passen.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {collection.sections.map((section, index) => (
            <EditorialFeatureCard
              key={section.slug}
              tone={getEditorialTone(index)}
              eyebrow={campaign.name}
              number={String(index + 1).padStart(2, '0')}
              title={section.title}
              description={section.description}
              className="min-h-[19rem]"
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
      </section>

      {blueprint ? (
        <>
          <section className="border-y border-[var(--wn-border)] bg-[image:var(--wn-gradient-brand-sage)]" aria-labelledby="seasonal-budget-title">
            <div className="wn-container wn-section">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
                  {blueprint.budget.eyebrow}
                </p>
                <h2 id="seasonal-budget-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
                  {blueprint.budget.title}
                </h2>
                <p className="wn-body-muted mt-4 max-w-2xl leading-7">{blueprint.budget.description}</p>
              </div>

              <div className="mt-9 grid gap-4 lg:grid-cols-3">
                {blueprint.budget.tiers.map((tier) => (
                  <article key={tier.label} className="relative overflow-hidden rounded-[1.45rem] border border-white/70 bg-white/76 p-6 shadow-[var(--wn-shadow-xs)] backdrop-blur-sm">
                    <span className="inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold text-[var(--wn-petrol-deep)]" style={{ backgroundColor: campaign.accentSoft }}>
                      {tier.label}
                    </span>
                    <h3 className="wn-display mt-5 text-2xl font-semibold tracking-[-0.025em] text-[var(--wn-petrol-deep)]">{tier.title}</h3>
                    <p className="wn-body-muted mt-3 text-sm leading-6">{tier.description}</p>
                    <ul className="mt-5 space-y-2 text-sm font-semibold text-[var(--wn-petrol-deep)]">
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

              <p className="mt-5 text-xs leading-5 text-[var(--wn-text-muted)]">{blueprint.budget.disclaimer}</p>
            </div>
          </section>

          <section style={{ background: campaign.heroGradient }} className="text-white" aria-labelledby="seasonal-checklist-title">
            <div className="wn-container wn-section relative overflow-hidden">
              <span aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
              <div className="relative z-10 max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accentSoft }}>
                  {blueprint.checklist.eyebrow}
                </p>
                <h2 id="seasonal-checklist-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fffaf2] sm:text-5xl">
                  {blueprint.checklist.title}
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-white/72">{blueprint.checklist.description}</p>
              </div>

              <div className="relative z-10 mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {blueprint.checklist.items.map((item, index) => (
                  <article key={item.title} className="rounded-[1.35rem] border border-white/14 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
                    <span className="text-xs font-bold tracking-[0.16em]" style={{ color: campaign.accentSoft }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="wn-display mt-4 text-xl font-semibold leading-tight text-[#fffaf2]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/70">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {catalogEnabled ? (
            <section className="wn-container wn-section" aria-labelledby="seasonal-search-title">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
                  {blueprint.search.eyebrow}
                </p>
                <h2 id="seasonal-search-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
                  {blueprint.search.title}
                </h2>
                <p className="wn-body-muted mt-4 max-w-2xl leading-7">{blueprint.search.description}</p>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {blueprint.search.routes.map((route) => (
                  <Link
                    key={route.query}
                    href={`/zoeken?q=${encodeURIComponent(route.query)}`}
                    className="wn-card-interactive group flex min-h-[13rem] flex-col rounded-[1.35rem] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]"
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: campaign.accent }}>
                      {route.label}
                    </span>
                    <p className="wn-body-muted mt-4 flex-1 text-sm leading-6">{route.description}</p>
                    <span className="mt-5 text-xs font-bold text-[var(--wn-petrol)] transition group-hover:translate-x-0.5">Zoek producten →</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      <section style={{ background: campaign.heroGradient }} className="text-white">
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
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/22 bg-white/10 px-5 font-bold text-white transition hover:bg-white/16"
            >
              Naar Cadeaus & feest →
            </Link>
          </div>
        </div>
      </section>
    </EditorialShell>
  )
}
