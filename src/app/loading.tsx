import { StorefrontLoadingGrid } from '@/components/storefront/storefront-loading-grid'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <section className="border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="wn-container py-12 sm:py-16" aria-hidden="true">
          <div className="h-3 w-28 animate-pulse rounded-full bg-[color:rgba(18,59,58,0.12)]" />
          <div className="mt-4 h-10 w-full max-w-xl animate-pulse rounded-full bg-[color:rgba(18,59,58,0.12)]" />
          <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-full bg-[color:rgba(18,59,58,0.08)]" />
        </div>
      </section>
      <section className="wn-container wn-section" aria-label="Producten laden" aria-busy="true">
        <span className="sr-only">Producten worden geladen.</span>
        <StorefrontLoadingGrid />
      </section>
      <WinkelnuFooter />
    </main>
  )
}
