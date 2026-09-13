import Link from 'next/link'
import type { GiftListItem } from '@/domain/gifting/types'

type GiftListItemCardProps = {
  item: GiftListItem
  editable?: boolean
  deleteAction?: (formData: FormData) => void | Promise<void>
  shareCode?: string
}

export function GiftListItemCard({ item, editable = false, deleteAction, shareCode }: GiftListItemCardProps) {
  return (
    <article className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--wn-text-muted)]">
            {item.itemType === 'external_link' ? 'Productlink' : 'Wens'}
          </p>
          <h3 className="wn-ui-heading mt-2 text-lg leading-7">{item.title}</h3>
          {item.note ? <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">{item.note}</p> : null}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-lg text-[var(--wn-petrol)]" aria-hidden="true">
          {item.itemType === 'external_link' ? '↗' : '✦'}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {item.externalUrl ? (
          <Link
            href={item.externalUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex min-h-10 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline"
          >
            Bekijk productlink ↗
          </Link>
        ) : null}

        {editable && deleteAction && shareCode ? (
          <form action={deleteAction} className="ml-auto">
            <input type="hidden" name="shareCode" value={shareCode} />
            <input type="hidden" name="itemId" value={item.id} />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-[var(--wn-text-muted)] transition hover:bg-[var(--wn-cream)] hover:text-[var(--wn-petrol-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-warm)]"
            >
              Verwijderen
            </button>
          </form>
        ) : null}
      </div>
    </article>
  )
}
