import Link from 'next/link'

type GiftDiscoverySpotlightProps = {
  placement?: 'home' | 'collection'
}

const steps = [
  ['01', 'Maak of deel je lijstje'],
  ['02', 'Trek veilig de lootjes'],
  ['03', 'Vind het passende cadeau'],
] as const

export function GiftDiscoverySpotlight({ placement = 'home' }: GiftDiscoverySpotlightProps) {
  const isCollection = placement === 'collection'
  const headingId = isCollection ? 'lootje-lijstje-cadeaus' : 'lootje-lijstje-home'

  return (
    <section
      id={isCollection ? 'lootje-lijstje' : undefined}
      className={isCollection ? 'wn-container pt-8 sm:pt-10' : 'wn-container py-8 sm:py-11'}
      aria-labelledby={headingId}
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(18,59,58,0.16)] bg-[#f7efe4] shadow-[var(--wn-shadow-md)]">
        <span aria-hidden="true" className="absolute -left-20 -top-24 h-64 w-64 rounded-full border border-[rgba(233,120,61,0.16)]" />
        <span aria-hidden="true" className="absolute -bottom-28 left-[38%] h-64 w-64 rounded-full bg-[rgba(223,233,228,0.62)] blur-2xl" />

        <div className="relative grid lg:grid-cols-[minmax(0,1.05fr)_minmax(21rem,0.75fr)]">
          <div className="flex flex-col justify-center px-6 py-9 sm:px-9 sm:py-11 lg:px-12 lg:py-14">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-8 items-center rounded-full bg-[var(--wn-petrol-deep)] px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
                Lootje &amp; Lijstje
              </span>
              <span className="inline-flex min-h-8 items-center rounded-full border border-[rgba(18,59,58,0.12)] bg-white/70 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--wn-petrol-deep)]">
                Zonder account
              </span>
            </div>

            <h2 id={headingId} className="wn-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--wn-petrol-deep)] sm:text-5xl">
              {isCollection ? 'Van cadeau-inspiratie naar een echt lijstje.' : 'Lootjes, lijstjes en cadeaus op één plek.'}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--wn-text-muted)]">
              {isCollection
                ? 'Heb je het juiste cadeaumoment gevonden? Maak meteen een verlanglijstje of start een groep. Iedereen vult zijn eigen wensen in en na de trekking ziet iedere deelnemer alleen zijn eigen lootje.'
                : 'Maak een verlanglijstje voor jezelf of regel een complete lootjesgroep. Deel via WhatsApp, trek privé de lootjes en ga daarna vanuit de wensen rechtstreeks verder naar Winkelnu.'}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/lootje-lijstje" className="wn-button wn-button-primary">
                Open Lootje &amp; Lijstje →
              </Link>
              <Link href="/lootje-lijstje/groep/nieuw" className="wn-button wn-button-secondary">
                Start een groep
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[var(--wn-text-muted)]" aria-label="Voordelen Lootje & Lijstje">
              <span>✓ Geen account nodig</span>
              <span>✓ Privé trekking</span>
              <span>✓ Wensen direct bij de hand</span>
            </div>
          </div>

          <aside className="relative overflow-hidden bg-[var(--wn-petrol-deep)] px-6 py-8 text-white sm:px-8 lg:flex lg:items-center lg:px-9 lg:py-10" aria-label="Zo werkt Lootje & Lijstje">
            <span aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10 bg-white/[0.025]" />
            <span aria-hidden="true" className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full border border-[#ffb889]/10" />
            <div className="relative z-10 w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffb889]">Van plan naar cadeau</p>
              <div className="mt-5 space-y-3">
                {steps.map(([number, label], index) => (
                  <div key={number} className="flex items-center gap-4 rounded-[1.15rem] border border-white/10 bg-white/[0.065] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-extrabold ${index === 2 ? 'bg-[var(--wn-warm)] text-white' : 'bg-white/10 text-[#fff7ec]'}`}>
                      {number}
                    </span>
                    <span className="text-sm font-bold leading-5 text-[#fff7ec]">{label}</span>
                    {index < steps.length - 1 ? <span aria-hidden="true" className="ml-auto text-[#ffb889]">↓</span> : <span aria-hidden="true" className="ml-auto text-[#ffb889]">✦</span>}
                  </div>
                ))}
              </div>
              <Link href="/collecties/cadeaus-feest" className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-[#ffb889] hover:text-white hover:underline">
                Bekijk ook Cadeaus &amp; feest →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
