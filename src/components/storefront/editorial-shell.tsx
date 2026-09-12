import Link from 'next/link'
import type { ReactNode } from 'react'
import { EditorialFeatureCard, type EditorialTone } from './editorial-design'
import { WinkelnuFooter } from './winkelnu-footer'
import { WinkelnuHeader } from './winkelnu-header'
import type { BuyingGuide } from '@/content/koopgidsen'
import { editorialCategories } from '@/content/koopgidsen-public'

export function EditorialShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">{children}</main>
      <WinkelnuFooter />
    </div>
  )
}

export function EditorialIntro({ eyebrow, title, description, children }: {
  eyebrow: string; title: string; description: string; children?: ReactNode
}) {
  return (
    <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
      <div className="wn-container py-12 sm:py-16 lg:py-20">
        <p className="wn-eyebrow">{eyebrow}</p>
        <h1 className="wn-heading mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="wn-body-muted mt-6 max-w-3xl text-lg leading-8">{description}</p>
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  )
}

export function EditorialNotice() {
  return (
    <aside className="wn-editorial-peach relative overflow-hidden rounded-[1.5rem] border border-[rgba(233,120,61,0.24)] p-6 shadow-[var(--wn-shadow-sm)] sm:p-7">
      <span aria-hidden="true" className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[var(--wn-petrol-deep)] opacity-[0.07]" />
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b85427]">✦ Winkelnu keuzehulp</p>
        <h2 className="wn-display mt-5 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[var(--wn-petrol-deep)]">Zo gebruik je onze keuzehulpen</h2>
        <p className="mt-3 text-sm leading-7 text-[rgba(13,46,45,0.72)]">Begin bij jouw wensen, vergelijk de eigenschappen en bepaal welke verschillen voor jou belangrijk zijn. De bronnen en werkwijze vind je bij iedere gids.</p>
        <Link href="/over-winkelnu" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[#9e4723] hover:text-[var(--wn-petrol-deep)]">Meer over Winkelnu →</Link>
      </div>
    </aside>
  )
}

export function GuideCard({ guide, tone }: { guide: BuyingGuide; tone?: EditorialTone }) {
  const category = editorialCategories.find((item) => item.slug === guide.category)
  const href = `/koopgidsen/${guide.slug}`

  if (tone) {
    return (
      <EditorialFeatureCard
        tone={tone}
        eyebrow={category?.title ?? 'Koopgids'}
        title={guide.title}
        description={guide.description}
        href={href}
        cta="Lees de gids →"
        meta={`${guide.readingMinutes} min leestijd`}
      />
    )
  }

  return (
    <article className="wn-surface wn-card-interactive flex h-full flex-col p-6">
      <p className="wn-eyebrow">{category?.title}</p>
      <h3 className="wn-ui-heading mt-3 text-xl"><Link href={href} className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">{guide.title}</Link></h3>
      <p className="wn-body-muted mt-3 flex-1 text-sm leading-7">{guide.description}</p>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--wn-border)] pt-4 text-sm">
        <span className="text-[var(--wn-text-muted)]">{guide.readingMinutes} min leestijd</span>
        <Link href={href} className="flex min-h-11 items-center font-bold text-[var(--wn-petrol)] hover:underline">Lees de gids →</Link>
      </div>
    </article>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Kruimelpad" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--wn-text-muted)]">
      <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          <span aria-hidden="true">/</span>
          {item.href ? <Link href={item.href} className="underline-offset-4 hover:underline">{item.label}</Link> : <span aria-current="page" className="font-medium text-[var(--wn-ink)]">{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
