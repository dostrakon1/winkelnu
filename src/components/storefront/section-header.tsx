import Link from 'next/link'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
}

export function SectionHeader({ eyebrow, title, description, actionHref, actionLabel }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        {eyebrow ? <p className="wn-eyebrow">{eyebrow}</p> : null}
        <h2 className="wn-heading mt-2 text-3xl">{title}</h2>
        {description ? <p className="wn-body-muted mt-2 text-sm">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="text-sm font-semibold text-[var(--wn-petrol)] underline decoration-[var(--wn-warm)] decoration-2 underline-offset-4">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
