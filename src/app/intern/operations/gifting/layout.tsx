import Link from 'next/link'

export default function GiftingInsightsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-950/95">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-3 text-xs font-bold sm:px-8 lg:px-10" aria-label="Lootje & Lijstje insights">
          <span className="mr-2 uppercase tracking-[0.14em] text-slate-600">Lootje &amp; Lijstje</span>
          <Link href="/intern/operations/gifting" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-violet-700 hover:text-violet-200">Lifecycle</Link>
          <Link href="/intern/operations/gifting/funnel" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-violet-700 hover:text-violet-200">Funnel &amp; interacties</Link>
          <Link href="/intern/operations/gifting/products" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-violet-700 hover:text-violet-200">Product &amp; commercie</Link>
          <Link href="/intern/operations/gifting/health" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-violet-700 hover:text-violet-200">Health &amp; retention</Link>
        </nav>
      </div>
      {children}
    </div>
  )
}
