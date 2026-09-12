import Link from 'next/link'
import type { ReactNode } from 'react'

export type EditorialTone = 'petrol' | 'peach' | 'cream' | 'sage'

const toneStyles = {
  petrol: {
    card: 'border-[rgba(233,120,61,0.28)] bg-[var(--wn-petrol-deep)] text-[var(--wn-cream)]',
    eyebrow: 'text-[#ffb889]',
    title: 'text-[#fff7ec]',
    body: 'text-[#f4e7d8]/75',
    meta: 'text-[#ffb889]',
    cta: 'text-[#ffd7bd] hover:text-white',
    divider: 'border-white/12',
  },
  peach: {
    card: 'border-[rgba(233,120,61,0.24)] bg-[#f1d6c5] text-[var(--wn-petrol-deep)]',
    eyebrow: 'text-[#b85427]',
    title: 'text-[var(--wn-petrol-deep)]',
    body: 'text-[rgba(13,46,45,0.72)]',
    meta: 'text-[#b85427]',
    cta: 'text-[#9e4723] hover:text-[var(--wn-petrol-deep)]',
    divider: 'border-[rgba(13,46,45,0.12)]',
  },
  cream: {
    card: 'border-[rgba(18,59,58,0.12)] bg-[#fff8ef] text-[var(--wn-petrol-deep)]',
    eyebrow: 'text-[var(--wn-warm)]',
    title: 'text-[var(--wn-petrol-deep)]',
    body: 'text-[rgba(30,36,35,0.66)]',
    meta: 'text-[var(--wn-warm)]',
    cta: 'text-[var(--wn-petrol)] hover:text-[var(--wn-petrol-deep)]',
    divider: 'border-[rgba(18,59,58,0.10)]',
  },
  sage: {
    card: 'border-[rgba(18,59,58,0.12)] bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol-deep)]',
    eyebrow: 'text-[var(--wn-warm)]',
    title: 'text-[var(--wn-petrol-deep)]',
    body: 'text-[rgba(13,46,45,0.7)]',
    meta: 'text-[var(--wn-warm)]',
    cta: 'text-[var(--wn-petrol)] hover:text-[var(--wn-petrol-deep)]',
    divider: 'border-[rgba(18,59,58,0.10)]',
  },
} as const

const toneCycle: EditorialTone[] = ['petrol', 'peach', 'cream', 'sage']

export function getEditorialTone(index: number): EditorialTone {
  return toneCycle[index % toneCycle.length]
}

export function EditorialFeatureCard({
  tone = 'cream',
  eyebrow,
  number,
  title,
  description,
  href,
  cta,
  meta,
  children,
  className = '',
}: {
  tone?: EditorialTone
  eyebrow: string
  number?: string
  title: string
  description?: string
  href?: string
  cta?: string
  meta?: ReactNode
  children?: ReactNode
  className?: string
}) {
  const styles = toneStyles[tone]

  return (
    <article
      className={`wn-card-interactive relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border p-6 shadow-[var(--wn-shadow-sm)] sm:p-7 ${styles.card} ${className}`}
    >
      <span aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-current opacity-[0.08]" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <p className={`text-xs font-bold uppercase tracking-[0.18em] ${styles.eyebrow}`}>✦ {eyebrow}</p>
          {number ? <span className={`text-xs font-bold tracking-[0.16em] ${styles.meta}`}>{number}</span> : null}
        </div>

        <h3
          className={`mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl ${styles.title}`}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {href ? (
            <Link href={href} className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">
              {title}
            </Link>
          ) : title}
        </h3>

        {description ? <p className={`mt-4 flex-1 text-sm leading-7 ${styles.body}`}>{description}</p> : <div className="flex-1" />}

        {children ? <div className="mt-5">{children}</div> : null}

        {(meta || (href && cta)) ? (
          <div className={`mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm ${styles.divider}`}>
            {meta ? <span className={styles.body}>{meta}</span> : <span />}
            {href && cta ? (
              <Link href={href} className={`flex min-h-11 items-center font-bold transition-colors ${styles.cta}`}>
                {cta}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
