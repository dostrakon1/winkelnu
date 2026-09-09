import Image from 'next/image'
import Link from 'next/link'
import { editorialCategories, guidesForCategory } from '@/content/koopgidsen'
import { getCategoryImage } from '@/content/category-images'

type EditorialCategory = (typeof editorialCategories)[number]

export function CategoryCard({ category }: { category: EditorialCategory }) {
  const image = getCategoryImage(category.slug)
  const count = guidesForCategory(category.slug).length
  const href = `/koopgidsen/categorie/${category.slug}`

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
        ) : null}
        <div className="px-6 pt-6 sm:px-7">
          <p className="wn-eyebrow">Keuzehulp</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight group-hover:text-[var(--wn-petrol)]">{category.title}</h3>
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-6 pb-5 sm:px-7">
        <p className="wn-body-muted mt-3 flex-1 text-sm leading-7">{category.description}</p>
        <p className="mt-5 text-xs font-medium text-[var(--wn-text-muted)]">{count} {count === 1 ? 'koopgids' : 'koopgidsen'}</p>
        <Link href={href} className="mt-3 inline-flex min-h-12 items-center self-start rounded-sm font-bold text-[var(--wn-petrol)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">Ontdek deze rubriek →</Link>
      </div>
    </article>
  )
}
