import Link from 'next/link'
import type { EditorialCollection } from '@/content/collections/types'
import { WinkelnuSurfaceMotif } from '@/components/storefront/winkelnu-surface-motif'

export function CollectionCard({ collection }: { collection: EditorialCollection }) {
  const href = `/collecties/${collection.slug}`

  return (
    <article className="wn-surface wn-card-interactive flex h-full flex-col overflow-hidden">
      <Link href={href} className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">
        <WinkelnuSurfaceMotif className="aspect-[4/3] transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transform-none" />
        <div className="px-6 pt-6 sm:px-7">
          <p className="wn-eyebrow">Collectie</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight group-hover:text-[var(--wn-petrol)]">{collection.title}</h3>
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-6 pb-5 sm:px-7">
        <p className="wn-body-muted mt-3 flex-1 text-sm leading-7">{collection.description}</p>
        <p className="mt-5 text-xs font-medium text-[var(--wn-text-muted)]">{collection.sections.length} inspiratiethema's</p>
        <Link href={href} className="mt-3 inline-flex min-h-12 items-center self-start rounded-sm font-bold text-[var(--wn-petrol)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">Ontdek deze collectie →</Link>
      </div>
    </article>
  )
}
