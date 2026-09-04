export function StorefrontLoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="wn-surface overflow-hidden p-5">
          <div className="aspect-[4/3] animate-pulse rounded-[var(--wn-radius-lg)] bg-[color:rgba(18,59,58,0.08)]" />
          <div className="mt-5 h-3 w-24 animate-pulse rounded-full bg-[color:rgba(18,59,58,0.10)]" />
          <div className="mt-3 h-6 w-4/5 animate-pulse rounded-full bg-[color:rgba(18,59,58,0.12)]" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-[color:rgba(18,59,58,0.08)]" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-[color:rgba(18,59,58,0.08)]" />
          <div className="mt-6 border-t border-[color:rgba(18,59,58,0.08)] pt-4">
            <div className="h-3 w-36 animate-pulse rounded-full bg-[color:rgba(18,59,58,0.08)]" />
            <div className="mt-2 h-7 w-28 animate-pulse rounded-full bg-[color:rgba(18,59,58,0.12)]" />
            <div className="mt-4 h-11 w-full animate-pulse rounded-[var(--wn-radius-md)] bg-[color:rgba(18,59,58,0.10)]" />
          </div>
        </article>
      ))}
    </div>
  )
}
