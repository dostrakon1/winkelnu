import type { ReactNode } from 'react'

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function GiftSurface({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'soft' | 'dark' | 'warm'
}) {
  return <section className={cx('gift-surface', `gift-surface-${tone}`, className)}>{children}</section>
}

export function GiftKicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('gift-kicker', className)}>{children}</p>
}

export function GiftStatusPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warm' | 'dark'
}) {
  return <span className={cx('gift-status-pill', `gift-status-pill-${tone}`)}>{children}</span>
}

export function GiftSectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('gift-section-heading', className)}>
      {eyebrow ? <GiftKicker>{eyebrow}</GiftKicker> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}

export type GiftStep = {
  label: string
  state?: 'done' | 'current' | 'upcoming'
}

export function GiftProgress({ steps, label = 'Voortgang' }: { steps: GiftStep[]; label?: string }) {
  return (
    <nav className="gift-progress" aria-label={label}>
      <ol>
        {steps.map((step, index) => {
          const state = step.state ?? 'upcoming'
          return (
            <li key={`${step.label}-${index}`} data-state={state}>
              <span className="gift-progress-dot" aria-hidden="true">{state === 'done' ? '✓' : index + 1}</span>
              <span>{step.label}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
