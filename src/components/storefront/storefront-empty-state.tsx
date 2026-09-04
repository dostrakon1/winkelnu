import { WinkelnuMark } from './winkelnu-brand'
import { WinkelnuButton } from './winkelnu-button'

type StorefrontEmptyStateProps = {
  eyebrow?: string
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
}

export function StorefrontEmptyState({
  eyebrow = 'Nog niets gevonden',
  title,
  description,
  actionHref,
  actionLabel,
}: StorefrontEmptyStateProps) {
  return (
    <section className="wn-surface relative overflow-hidden p-7 sm:p-9">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color:rgba(233,120,61,0.10)]" aria-hidden="true" />
      <div className="absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-[color:rgba(18,59,58,0.05)]" aria-hidden="true" />
      <div className="relative max-w-xl">
        <WinkelnuMark className="mb-5" />
        <p className="wn-eyebrow">{eyebrow}</p>
        <h2 className="wn-heading mt-3 text-2xl sm:text-3xl">{title}</h2>
        <p className="wn-body-muted mt-3 leading-7">{description}</p>
        {actionHref && actionLabel ? (
          <WinkelnuButton href={actionHref} variant="secondary" className="mt-6">
            {actionLabel}
          </WinkelnuButton>
        ) : null}
      </div>
    </section>
  )
}
