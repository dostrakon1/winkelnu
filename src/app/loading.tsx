import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="relative overflow-hidden border-b border-[rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full border border-[rgba(18,59,58,0.06)]" />
        <div className="wn-container relative py-14 sm:py-18" aria-hidden="true">
          <div className="h-3 w-28 animate-pulse rounded-full bg-[rgba(233,120,61,0.18)]" />
          <div className="mt-5 h-12 w-full max-w-2xl animate-pulse rounded-2xl bg-[rgba(18,59,58,0.10)] sm:h-16" />
          <div className="mt-5 h-5 w-full max-w-3xl animate-pulse rounded-full bg-[rgba(18,59,58,0.07)]" />
          <div className="mt-3 h-5 w-4/5 max-w-2xl animate-pulse rounded-full bg-[rgba(18,59,58,0.06)]" />
          <div className="mt-8 flex gap-3">
            <div className="h-12 w-36 animate-pulse rounded-full bg-[rgba(18,59,58,0.11)]" />
            <div className="h-12 w-32 animate-pulse rounded-full border border-[rgba(18,59,58,0.10)] bg-white/65" />
          </div>
        </div>
      </section>

      <section className="wn-container wn-section" aria-label="Pagina laden" aria-busy="true">
        <span className="sr-only">Pagina wordt geladen.</span>
        <div className="grid gap-5 md:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-[rgba(18,59,58,0.10)] bg-white p-6 shadow-[var(--wn-shadow-xs)]">
              <div className="h-3 w-20 animate-pulse rounded-full bg-[rgba(233,120,61,0.16)]" />
              <div className="mt-5 h-8 w-4/5 animate-pulse rounded-xl bg-[rgba(18,59,58,0.09)]" />
              <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-[rgba(18,59,58,0.06)]" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-[rgba(18,59,58,0.06)]" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-[rgba(18,59,58,0.05)]" />
            </div>
          ))}
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}
