import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs, EditorialIntro, EditorialShell } from '@/components/storefront/editorial-shell'
import { categories, getCategoryContent } from '@/content/categories'
import { getCategoryImage } from '@/content/category-images'
import { editorialCollections, getEditorialCollection } from '@/content/collections'

const festiveThemeVariants = [
  {
    card: 'wn-editorial-petrol border-[rgba(233,120,61,0.28)] text-[var(--wn-cream)]',
    eyebrow: 'text-[#ffb889]',
    title: 'text-[#fff7ec]',
    body: 'text-[#f4e7d8]/75',
    chip: 'border-white/15 bg-white/10 text-[#fff7ec] hover:border-[#ffb889]/70 hover:bg-white/15',
  },
  {
    card: 'wn-editorial-peach border-[rgba(233,120,61,0.24)] text-[var(--wn-petrol-deep)]',
    eyebrow: 'text-[#b85427]',
    title: 'text-[var(--wn-petrol-deep)]',
    body: 'text-[rgba(13,46,45,0.72)]',
    chip: 'border-[rgba(13,46,45,0.14)] bg-white/55 text-[var(--wn-petrol-deep)] hover:border-[var(--wn-warm)] hover:bg-white/75',
  },
  {
    card: 'wn-editorial-cream border-[rgba(18,59,58,0.12)] text-[var(--wn-petrol-deep)]',
    eyebrow: 'text-[var(--wn-warm)]',
    title: 'text-[var(--wn-petrol-deep)]',
    body: 'text-[rgba(30,36,35,0.66)]',
    chip: 'border-[rgba(18,59,58,0.14)] bg-white text-[var(--wn-petrol-deep)] hover:border-[var(--wn-warm)]',
  },
  {
    card: 'wn-editorial-sage border-[rgba(18,59,58,0.12)] text-[var(--wn-petrol-deep)]',
    eyebrow: 'text-[var(--wn-warm)]',
    title: 'text-[var(--wn-petrol-deep)]',
    body: 'text-[rgba(13,46,45,0.7)]',
    chip: 'border-[rgba(18,59,58,0.14)] bg-white/60 text-[var(--wn-petrol-deep)] hover:border-[var(--wn-petrol)] hover:bg-white/80',
  },
] as const

export function generateStaticParams() {
  return editorialCollections.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const collection = getEditorialCollection(slug)
  if (!collection) return {}

  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collecties/${collection.slug}` },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = getEditorialCollection(slug)
  if (!collection) notFound()

  if (collection.slug === 'cadeaus-feest') {
    const image = getCategoryImage(collection.slug, collection.title)

    return (
      <EditorialShell>
        <div className="wn-container pt-8">
          <Breadcrumbs items={[{ label: 'Collecties' }, { label: collection.title }]} />
        </div>

        <section className="wn-container pt-8 sm:pt-10" aria-labelledby="collection-title">
          <div className="wn-bg-brand-dark overflow-hidden rounded-[2rem] border border-[rgba(233,120,61,0.28)] shadow-[var(--wn-shadow-md)]">
            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[22rem] overflow-hidden bg-[var(--wn-cream)] sm:min-h-[28rem] lg:min-h-[34rem]">
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 46vw"
                    className="object-cover"
                    style={{ objectPosition: image.position }}
                  />
                ) : null}
                <span className="absolute left-6 top-6 inline-flex rounded-full border border-white/40 bg-[rgba(13,46,45,0.9)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd7bd] shadow-sm backdrop-blur-sm sm:left-8 sm:top-8">
                  Cadeaus & feest
                </span>
              </div>

              <div className="relative flex min-h-[28rem] flex-col justify-center overflow-hidden px-7 py-10 text-[var(--wn-cream)] sm:px-10 lg:min-h-[34rem] lg:px-14">
                <span aria-hidden="true" className="absolute -right-14 -top-14 h-48 w-48 rounded-full border border-white/10 bg-[rgba(233,120,61,0.08)]" />
                <span aria-hidden="true" className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border border-[#ffd7bd]/10" />
                <div className="relative z-10 max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ffb889]">✦ Winkelnu collectie</p>
                  <h1 id="collection-title" className="wn-display mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#fff7ec] sm:text-6xl">
                    {collection.title}
                  </h1>
                  <p className="mt-6 max-w-xl text-base leading-8 text-[#f4e7d8]/78">{collection.intro}</p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#themas"
                      className="inline-flex min-h-12 items-center rounded-full bg-[var(--wn-warm)] px-5 font-bold text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f1844c] hover:shadow-[0_14px_28px_rgba(0,0,0,0.22)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb889] motion-reduce:transform-none"
                    >
                      Ontdek de thema&apos;s ↓
                    </a>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#ffb889]">{collection.sections.length} inspiratiethema&apos;s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wn-container wn-section" aria-labelledby="themas">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--wn-warm)]">✦ Voor ieder moment iets passends</p>
            <h2 id="themas" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
              Kies een feestelijk thema
            </h2>
            <p className="wn-body-muted mt-4 max-w-2xl leading-7">
              Van verjaardag tot kerst en van een klein gebaar tot een bijzonder cadeau. Kies eerst het moment; daarna helpen de vaste Winkelnu-rubrieken je verder vergelijken.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {collection.sections.map((section, index) => {
              const variant = festiveThemeVariants[index % festiveThemeVariants.length]

              return (
                <article
                  key={section.slug}
                  id={section.slug}
                  className={`wn-card-interactive relative flex min-h-[19rem] flex-col overflow-hidden rounded-[1.5rem] border p-6 shadow-[var(--wn-shadow-sm)] sm:p-8 ${variant.card}`}
                >
                  <span aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-current opacity-[0.08]" />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between gap-4">
                      <p className={`text-xs font-bold uppercase tracking-[0.18em] ${variant.eyebrow}`}>✦ Inspiratie</p>
                      <span className={`text-xs font-bold tracking-[0.16em] ${variant.eyebrow}`}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className={`wn-display mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] ${variant.title}`}>
                      {section.title}
                    </h3>
                    <p className={`mt-4 flex-1 text-sm leading-7 ${variant.body}`}>{section.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {section.categorySlugs.map((categorySlug) => {
                        const category = getCategoryContent(categorySlug)
                        if (!category) return null
                        return (
                          <Link
                            key={category.slug}
                            href={`/koopgidsen/categorie/${category.slug}`}
                            className={`inline-flex min-h-10 items-center rounded-full border px-3 text-xs font-semibold transition-colors ${variant.chip}`}
                          >
                            {category.title}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="wn-bg-brand-dark text-[var(--wn-cream)]">
          <div className="wn-container wn-section relative overflow-hidden">
            <span aria-hidden="true" className="absolute -right-20 top-8 h-56 w-56 rounded-full border border-white/10" />
            <div className="relative z-10 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb889]">Gericht verder zoeken</p>
              <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff7ec]">
                Alle productrubrieken
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f4e7d8]/75">
                Weet je al welk soort product je zoekt? Ga dan rechtstreeks naar de vaste Winkelnu-rubriek en vergelijk daar verder.
              </p>
            </div>
            <div className="relative z-10 mt-7 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/koopgidsen/categorie/${category.slug}`}
                  className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold text-[#fff7ec] transition-colors hover:border-[#ffb889]/70 hover:bg-white/15"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </EditorialShell>
    )
  }

  return (
    <EditorialShell>
      <div className="wn-container pt-8">
        <Breadcrumbs items={[{ label: 'Collecties' }, { label: collection.title }]} />
      </div>
      <EditorialIntro eyebrow="Winkelnu collectie" title={collection.title} description={collection.intro} />

      <section className="wn-container wn-section" aria-labelledby="themas">
        <p className="wn-eyebrow">Inspiratie over categorieën heen</p>
        <h2 id="themas" className="wn-heading mt-3 text-3xl sm:text-4xl">Kies een thema</h2>
        <p className="wn-body-muted mt-4 max-w-3xl">Deze thema&apos;s zijn redactionele verzamelingen. Producten houden altijd hun eigen vaste Winkelnu-categorie en kunnen daarnaast in één of meer collecties verschijnen.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {collection.sections.map((section) => (
            <article key={section.slug} id={section.slug} className="wn-surface flex h-full flex-col p-6 sm:p-7">
              <p className="wn-eyebrow">{section.title}</p>
              <p className="wn-body-muted mt-3 flex-1 text-sm leading-7">{section.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {section.categorySlugs.map((categorySlug) => {
                  const category = getCategoryContent(categorySlug)
                  if (!category) return null
                  return (
                    <Link key={category.slug} href={`/koopgidsen/categorie/${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[var(--wn-border)] bg-white px-3 text-xs font-semibold text-[var(--wn-petrol-deep)] hover:border-[var(--wn-petrol)]">
                      {category.title}
                    </Link>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wn-bg-brand-sage border-t border-[var(--wn-border)]">
        <div className="wn-container wn-section">
          <h2 className="wn-heading text-3xl">Alle productrubrieken</h2>
          <p className="wn-body-muted mt-3 max-w-2xl">Wil je gericht vergelijken? Ga dan naar de vaste productcategorie waar het product thuishoort.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.slug} href={`/koopgidsen/categorie/${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[var(--wn-border)] bg-white px-4 text-sm font-semibold text-[var(--wn-petrol-deep)] hover:border-[var(--wn-petrol)]">
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </EditorialShell>
  )
}
