import type { ReactNode } from 'react'
import { WinkelnuFooter } from './winkelnu-footer'
import { WinkelnuHeader } from './winkelnu-header'

type LegalPageProps = {
  eyebrow: string
  title: string
  intro: string
  children: ReactNode
}

export function LegalPage({ eyebrow, title, intro, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <section className="wn-container py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="wn-eyebrow">{eyebrow}</p>
          <h1 className="wn-heading mt-4 text-4xl sm:text-5xl">{title}</h1>
          <p className="wn-body-muted mt-6 text-lg leading-8">{intro}</p>
          <div className="mt-10 space-y-8 text-sm leading-7 sm:text-base">{children}</div>
        </div>
      </section>
      <WinkelnuFooter />
    </main>
  )
}
