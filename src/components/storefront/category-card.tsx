import Image from 'next/image'
import Link from 'next/link'
import { editorialCategories, guidesForCategory } from '@/content/editorial-catalog'
import { getCategoryImage } from '@/content/category-images'
import { WinkelnuSurfaceMotif } from '@/components/storefront/winkelnu-surface-motif'

type EditorialBrowseEntry = (typeof editorialCategories)[number]

export function CategoryCard({ category }: { category: EditorialBrowseEntry }) {
  const isCollection = 'sections' in category
  const image = isCollection ? undefined : getCategoryImage(category.slug, category.title)
  const count = isCollection ? category.sections.length : guidesForCategory(category.slug).length
  const href = isCollection ? `/collecties/${category.slug}` : `/koopgidsen/categorie/${category.slug}`
  const eyebrow = isCollection ? 'Collectie' : 'Keuzehulp'
  const countLabel = isCollection
    ? `${count} inspiratiethema's`
    : count > 0
      ? `${count} ${count === 1 ? 'koopgids' : 'koopgidsen'}`
      : 'Nieuwe rubriek'
  const cta = isCollection ? 'Ontdek deze collectie →' : 'Ontdek deze rubriek →'

  if (isCollection) {
    return (
      <article className="wn-surface wn-card-interactive overflow-hidden border-[rgba(233,120,61,0.3)] bg-[#fffaf5] md:col-span-2 lg:col-span-2">
        <div className="grid h-full lg:grid-cols-[0.92fr_1.08fr]">
          <Link
            href={href}
            className="group relative block min-h-64 overflow-hidden bg-[var(--wn-cream)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)] lg:min-h-full"
          >
            <WinkelnuSurfaceMotif className="h-full min-h-64 w-full transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transform-none" />
            <span className="absolute left-6 top-6 inline-flex rounded-full border border-[rgba(233,120,61,0.28)] bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--wn-warm)] shadow-sm">
              Cadeaus & feest
            </span>
          </Link>

          <div className="flex h-full flex-col justify-center px-7 py-8 sm:px-9 lg:px-10 lg:py-10">
            <p className="wn-eyebrow">{eyebrow}</p>
            <Link href={href} className="group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-[var(--wn-ink)] group-hover:text-[var(--wn-petrol)] sm:text-4xl">
                {category.title}
              </h3>
            </Link>
            <p className="wn-body-muted mt-4 max-w-xl text-sm leading-7">{category.description}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--wn-warm)]">{countLabel}</p>
            <Link
              href={href}
              className="mt-5 inline-flex min-h-12 items-center self-start rounded-full bg-[var(--wn-warm)] px-5 font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)] motion-reduce:transform-none"
            >
              {cta}
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="wn-surface wn-card-interactive flex h-full flex-col overflow-hidden">
      <Link href={href} className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--wn-petrol-soft)]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transform-none"
              style={{ objectPosition: image.position }}
            />
          </div>
        ) : (
          <WinkelnuSurfaceMotif className="aspect-[4/3] transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transform-none" />
        )}
        <div className="px-6 pt-6 sm:px-7">
          <p className="wn-eyebrow">{eyebrow}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight group-hover:text-[var(--wn-petrol)]">{category.title}</h3>
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-6 pb-5 sm:px-7">
        <p className="wn-body-muted mt-3 flex-1 text-sm leading-7">{category.description}</p>
        <p className="mt-5 text-xs font-medium text-[var(--wn-text-muted)]">{countLabel}</p>
        <Link href={href} className="mt-3 inline-flex min-h-12 items-center self-start rounded-sm font-bold text-[var(--wn-petrol)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">{cta}</Link>
      </div>
    </article>
  )
}
