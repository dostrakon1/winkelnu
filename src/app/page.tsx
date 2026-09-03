export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Winkelnu.nl</p>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-zinc-950 sm:text-7xl">
          Slimmer ontdekken en vergelijken.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
          De technische fundering van Winkelnu wordt gebouwd als schaalbaar multi-merchant affiliate- en vergelijkingsplatform.
        </p>
        <div className="mt-10 inline-flex w-fit rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 shadow-sm">
          Fundering in ontwikkeling
        </div>
      </section>
    </main>
  )
}
